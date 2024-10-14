const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const saltRounds = 10; 

require('dotenv').config();

const fs = require('fs');

const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' })

const jwt = require('jsonwebtoken');

const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/userModel');

app.use(cors({
    origin: "https://blog-nest-client.vercel.app/",
    credentials: true
}));

const port = process.env.PORT || 4000;
const cookieParser = require('cookie-parser');
const Post = require('./models/Post');
app.use(cookieParser());
app.use(express.json());
app.use('/uploads',express.static(__dirname + '/uploads'))

async function dbConnect(){
    mongoose.connect(process.env.MongoDB_url, {})
    .then(()=> console.log("Database connected!"))
    .catch((err)=> console.error(err));
}
dbConnect();


app.post("/register", async (req, res) => {
    const {username, password} = req.body;
    try {
        const userDoc = await User.create(
            {
                username, 
                password: await bcrypt.hash(password, saltRounds)
            }
        );
        res.status(200).json(userDoc);
    } catch (err) {
        res.status(400).json({message: "User not registered!"})
    }
})

app.post("/login", async (req, res) => {
    const {username, password} = req.body;
    try {
        const userDoc = await User.findOne({username});
        const passOk = await bcrypt.compare(password, userDoc.password);
        if(passOk){
            // res.status(200).json(userDoc);
            jwt.sign({username, id: userDoc._id}, process.env.jwtSecret , {} , (err, token)=>{
                if(err){
                    alert("Wrong credentials!");
                    throw err;
                };
                res.cookie("token", token).json({
                    id: userDoc._id,
                    username
                });
            })
        }
        
    } catch (err) {
        res.status(400).json({message: "Wrong credentials!"})
    }
})

app.get('/profile', (req, res)=>{
    const {token} = req.cookies;
    jwt.verify(token, process.env.jwtSecret, {}, (err, info )=>{
        if(err) throw err;
        res.json(info);
    })
})

app.post('/logout', (req, res)=>{
    
    res.cookie("token", "").json('ok');

    // res.clearCookie("token");
})

app.post('/post',uploadMiddleware.single('file') ,async(req, res)=>{
    const {token} = req.cookies;
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+"."+ext;
    fs.renameSync(path,  newPath);

    jwt.verify(token, process.env.jwtSecret, {}, async (err, info )=>{
        if(err) throw err;
        const {title, summary, content} = req.body;
    const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id
    })
    res.json(postDoc)
    })
    

    
})

app.get('/post', async(req, res)=>{
    const posts = await Post.find().
    populate('author', ['username']).sort({createdAt: -1})
    .limit(20)
    res.json(posts)
})

app.get('/post/:id', async (req, res)=>{
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc)
})

app.delete('/post/:id/delete', async (req, res)=>{
    const {id} = req.params;
    try {
        const postDoc = await Post.findById(id);
        
        if (!postDoc) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await Post.findByIdAndDelete(id);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
})



app.listen(port, ()=>{
    console.log("Server is running!");
});