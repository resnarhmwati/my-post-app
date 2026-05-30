import { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom";
import { AppContext } from '../Context/AppContext.jsx';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const { user, token } = useContext(AppContext);

    async function getPosts() {
        const res = await fetch('/api/posts');
        const data = await res.json();
        if (res.ok) setPosts(data);
    }

    async function handleDelete(id) {
        const res = await fetch(`/api/posts/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (res.ok) {
            setPosts(posts.filter(post => post.id !== id));
        }
    }

    useEffect(() => {
        getPosts();
    }, []);

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Feed</h1>
                <p className="text-zinc-500 text-sm mt-1">Latest posts from the community</p>
            </div>

            {posts.length === 0 && (
                <div className="text-center py-24 text-zinc-600">
                    <div className="text-5xl mb-4">📭</div>
                    <p className="font-medium">No posts yet. Be the first to share!</p>
                </div>
            )}

            <div className="flex flex-col gap-4">
                {posts.map(post => (
                    <div
                        key={post.id}
                        className="bg-zinc-900 border border-white/5 rounded-2xl p-6 hover:border-violet-500/30 transition-all duration-200 group"
                    >
                        {/* Author row */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-violet-900/30 flex-shrink-0">
                                    {post.user.name[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-white text-sm font-semibold leading-none">{post.user.name}</p>
                                    <p className="text-zinc-500 text-xs mt-0.5">Author</p>
                                </div>
                            </div>

                            <Link
                                to={`/posts/${post.id}`}
                                className="text-zinc-600 group-hover:text-violet-400 text-xs font-semibold transition-colors flex items-center gap-1"
                            >
                                Read <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
                            </Link>
                        </div>

                        {/* Content */}
                        <Link to={`/posts/${post.id}`} className="block">
                            <h2 className="text-white font-bold text-lg mb-2 group-hover:text-violet-300 transition-colors leading-snug">
                                {post.title}
                            </h2>
                            <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">
                                {post.body}
                            </p>
                        </Link>

                        {/* Actions (owner only) */}
                        {user && user.id === post.user.id && (
                            <div className="flex gap-2 mt-5 pt-4 border-t border-white/5">
                                <Link
                                    to={`/posts/update/${post.id}`}
                                    className="px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-md transition-all border border-white/5 hover:border-violet-500/20"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className="px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-all border border-white/5 hover:border-rose-500/20"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
