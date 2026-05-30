import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from '../../Context/AppContext.jsx';

export default function Update() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, user } = useContext(AppContext);

    const [formData, setFormData] = useState({ title: '', body: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    async function getPost() {
        const res = await fetch(`/api/posts/${id}`);
        const data = await res.json();

        if (res.ok) {
            if (data.post.user_id !== user?.id) {
                navigate('/');
            } else {
                setFormData({ title: data.post.title, body: data.post.body });
            }
        }
        setLoading(false);
    }

    async function handleUpdate(e) {
        e.preventDefault();
        const res = await fetch(`/api/posts/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await res.json();
        if (res.ok) {
            navigate(`/posts/${id}`);
        } else {
            setErrors(data.errors || {});
        }
    }

    useEffect(() => {
        if (user) getPost();
    }, [user]);

    if (loading) return (
        <div className="flex justify-center items-center h-40">
            <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto">
            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm font-medium mb-6 transition-colors group"
            >
                <span className="group-hover:-translate-x-0.5 transition-transform inline-block">←</span> Back
            </button>

            <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
                {/* Accent top stripe */}
                <div className="h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500" />

                <div className="p-8">
                    <h1 className="text-xl font-bold text-white mb-1">Edit Post</h1>
                    <p className="text-zinc-500 text-sm mb-8">Update your story</p>

                    <form onSubmit={handleUpdate} className="space-y-5">
                        {/* Title */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Title</label>
                            <input
                                className={`w-full px-4 py-3 bg-zinc-800 border rounded-xl text-white text-sm placeholder:text-zinc-600 outline-none transition-all focus:ring-2 focus:ring-emerald-500/40 ${
                                    errors.title ? 'border-rose-500/60' : 'border-white/5 focus:border-emerald-500/50'
                                }`}
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                            {errors.title && <p className="text-rose-400 text-xs mt-1.5 font-medium">*{errors.title[0]}</p>}
                        </div>

                        {/* Body */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Content</label>
                            <textarea
                                rows="10"
                                className={`w-full px-4 py-3 bg-zinc-800 border rounded-xl text-white text-sm placeholder:text-zinc-600 outline-none transition-all focus:ring-2 focus:ring-emerald-500/40 resize-none ${
                                    errors.body ? 'border-rose-500/60' : 'border-white/5 focus:border-emerald-500/50'
                                }`}
                                value={formData.body}
                                onChange={e => setFormData({ ...formData, body: e.target.value })}
                            />
                            {errors.body && <p className="text-rose-400 text-xs mt-1.5 font-medium">*{errors.body[0]}</p>}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex-none px-5 py-2.5 text-sm font-semibold text-zinc-400 hover:text-white border border-white/5 hover:border-white/10 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-lg shadow-emerald-900/20 text-sm">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
