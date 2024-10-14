import React, { useEffect, useState } from 'react';
import Post from '../components/Post';

const IndexPage = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch(`https://blog-nest-server-gamma.vercel.app//post`).then(response => {
            response.json().then(posts => {
                setPosts(posts);
            });
        });
    }, []);

    return (
        <main>
            <div className="quote">
                “Ideas are easy. Implementation is hard.”
            </div>
            <div className="posts-grid">
                {posts.length > 0 && posts.map((post, index) => (
                    <Post key={index} {...post} />
                ))}
            </div>
        </main>
    );
};

export default IndexPage;
