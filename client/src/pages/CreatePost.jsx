import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
    ],
}
const format = [
    'bold', 'italic', 'underline', 'strike',
    'align', 'list', 'indent',
    'size', 'header',
    'link', 'image', 'video',
    'color', 'background',
    'clean',
]

const CreatePost = () => {
    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    const [files, setFiles] = useState('')

    const navigate = useNavigate();
    async function createNewPost(e) {
        const data = new FormData();
        data.set("title", title);
        data.set("summary", summary);
        data.set("content", content);
        data.set("file", files[0]);
        e.preventDefault();
        const response = await fetch(`http://localhost:4000/post`, {
            method: 'POST',
            body: data,
            credentials: 'include'
        })
        if (response.ok) {
            navigate('/');
        }
    }

    return (
        <form onSubmit={createNewPost}>
            <input type="title" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />
            <input type="summary" placeholder='Summary' value={summary} onChange={e => setSummary(e.target.value)} />
            <input type="file" onChange={e => setFiles(e.target.files)} />
            <ReactQuill value={content} onChange={newValue => setContent(newValue)} modules={modules} formats={format} />
            <button style={{ marginTop: '5px' }}>Create Post</button>
        </form>
    )
}

export default CreatePost
