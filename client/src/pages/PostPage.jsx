import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const PostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [postInfo, setPostInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userInfo } = useContext(UserContext);

    async function handleDelete() {
        try {
            const response = await fetch(`https://blog-nest-server-gamma.vercel.app//post/${id}/delete`, {
                method: "DELETE",
            });
            if (response.ok) {
                navigate("/");
            } else {
                setError("Failed to delete the post");
            }
        } catch (err) {
            setError("An error occurred while deleting the post");
        }
    }

    useEffect(() => {
        setLoading(true);
        fetch(`https://blog-nest-server-gamma.vercel.app//post/${id}`)
            .then((response) => response.json())
            .then((postInfo) => {
                setPostInfo(postInfo);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to fetch post information");
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!postInfo) {
        return <div>Post not found</div>;
    }

    return (
        <div className="post-page">
            <h1>{postInfo.title}</h1>
            <time dateTime={postInfo.createdAt}>{postInfo.createdAt}</time>
            <div className="author">by @{postInfo.author.username}</div>
            <div className="image">
                <img
                    src={`https://blog-nest-server-gamma.vercel.app//${postInfo.cover}`}
                    alt={postInfo.title}
                />
            </div>
            <div
                className="content"
                dangerouslySetInnerHTML={{ __html: postInfo.content }}
            ></div>
            {postInfo.author.username === userInfo.username ? (
                <button className="deleteBtn" onClick={handleDelete}>
                    Delete
                </button>
            ) : (
                <div className="dlt-para">Only the author of this blog can delete!</div>
            )}
        </div>
    );
};

export default PostPage;
