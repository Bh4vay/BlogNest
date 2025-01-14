import React from 'react';
import { Link } from 'react-router-dom';

const Post = ({ _id, title, summary, cover, createdAt, author }) => {
    return (
        <div className="post">
            <div className="image">
                <Link to={`/post/${_id}`}>
                    <img src={`http://localhost:4000/` + cover} alt={title} />
                </Link>
            </div>
            <div className="texts">
                <Link to={`/post/${_id}`}>
                    <h2>{title}</h2>
                </Link>
                <div className="info">
                    <span className="author">{author.username}</span>
                    <time>{new Date(createdAt).toLocaleDateString()}</time>
                </div>
                <p className='summary'>{summary}</p>
            </div>
        </div>
    );
};

export default Post;
