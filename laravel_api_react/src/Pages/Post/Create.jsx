import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from '../../Context/AppContext.jsx';

export default function Create() {
    const navigate = useNavigate();
    const { token } = useContext(AppContext);

    const [formData, setFormData] = useState({ title: '', body: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    async function handleCreate(e) {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.errors) setErrors(data.errors);
                else alert(data.message || "Something went wrong");
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Gagal terhubung ke server.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm font-medium mb-6 transition-colors group"
            >
                <span className="group-hover:-translate-x-0.5 transition-transform inline-block">←</span> Back
            </button>

            <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
                {/* Header accent */}
                <div className="h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />

                <div className="p-8">
                    <h1 className="text-xl font-bold text-white mb-1">New Post</h1>
                    <p className="text-zinc-500 text-sm mb-8">Share something with the community</p>

                    <form onSubmit={handleCreate} className="space-y-5">
                        {/* Title */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Title</label>
                            <input
                                type="text"
                                placeholder="What's the headline?"
                                className={`w-full px-4 py-3 bg-zinc-800 border rounded-xl text-white text-sm placeholder:text-zinc-600 outline-none transition-all focus:ring-2 focus:ring-violet-500/40 ${
                                    errors.title ? 'border-rose-500/60' : 'border-white/5 focus:border-violet-500/50'
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
                                rows="9"
                                placeholder="Write your story here..."
                                className={`w-full px-4 py-3 bg-zinc-800 border rounded-xl text-white text-sm placeholder:text-zinc-600 outline-none transition-all focus:ring-2 focus:ring-violet-500/40 resize-none ${
                                    errors.body ? 'border-rose-500/60' : 'border-white/5 focus:border-violet-500/50'
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
                            <button
                                disabled={loading}
                                className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-lg shadow-violet-900/20 text-sm"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Publishing...
                                    </span>
                                ) : "Publish Post"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
