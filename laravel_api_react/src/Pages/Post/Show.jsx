import { useParams, useNavigate, Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AppContext } from '../../Context/AppContext.jsx';

export default function Show() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useContext(AppContext);

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    async function getPost() {
        try {
            const res = await fetch(`/api/posts/${id}`);
            const data = await res.json();

            if (res.ok) {
                setPost(data.post);
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(e) {
        e.preventDefault();
        if (!confirm("Hapus postingan ini?")) return;

        const res = await fetch(`/api/posts/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (res.ok) navigate('/');
        else alert("Gagal menghapus postingan.");
    }

    useEffect(() => {
        getPost();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!post) return <p className="text-center mt-10 text-zinc-500">Post not found.</p>;

    return (
        <div className="max-w-3xl mx-auto">
            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm font-medium mb-8 transition-colors group"
            >
                <span className="group-hover:-translate-x-0.5 transition-transform inline-block">←</span> Back
            </button>

            <article className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl shadow-black/30">
                {/* Top accent bar */}
                <div className="h-1 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-blue-500" />

                <div className="p-8 md:p-12">
                    {/* Author */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-violet-900/30 flex-shrink-0">
                            {post.user.name[0].toUpperCase()}
                        </div>
                        <div>
                            <p className="text-white font-semibold text-sm leading-none">{post.user.name}</p>
                            <p className="text-zinc-500 text-xs mt-1">
                                {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-8">
                        {post.title}
                    </h1>

                    {/* Body */}
                    <div className="text-zinc-400 leading-relaxed text-base whitespace-pre-line border-l-2 border-violet-500/30 pl-5">
                        {post.body}
                    </div>

                    {/* Owner actions */}
                    {user && user.id === post.user_id && (
                        <div className="flex items-center gap-3 mt-10 pt-6 border-t border-white/5">
                            <Link
                                to={`/posts/update/${post.id}`}
                                className="px-5 py-2 text-sm font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all border border-white/5"
                            >
                                Edit Post
                            </Link>

                            <form onSubmit={handleDelete}>
                                <button className="px-5 py-2 text-sm font-semibold text-rose-400 hover:text-white hover:bg-rose-600 bg-rose-500/10 rounded-xl transition-all border border-rose-500/20">
                                    Delete
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
}
