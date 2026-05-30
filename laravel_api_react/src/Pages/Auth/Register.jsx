import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../../Context/AppContext.jsx";

export default function Register() {
    const { setToken } = useContext(AppContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    const [errors, setErrors] = useState({});

    async function handleRegister(e) {
        e.preventDefault();
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (data.errors) {
            setErrors(data.errors);
        } else {
            localStorage.setItem('token', data.token);
            setToken(data.token);
            navigate('/');
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                {/* Heading */}
                <div className="text-center mb-8">
                    <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-violet-600 items-center justify-center shadow-lg shadow-violet-900/40 mb-4">
                        <span className="text-white font-black text-lg">M</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Create an account</h1>
                    <p className="text-zinc-500 text-sm mt-1">Join MyPostApp today</p>
                </div>

                {/* Card */}
                <div className="bg-zinc-900 border border-white/5 rounded-2xl p-7 shadow-2xl shadow-black/40">
                    <form onSubmit={handleRegister} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Name</label>
                            <input
                                type="text"
                                className={`w-full px-4 py-3 bg-zinc-800 border rounded-xl text-white text-sm placeholder:text-zinc-600 outline-none transition-all focus:ring-2 focus:ring-violet-500/40 ${errors.name ? 'border-rose-500/60' : 'border-white/5 focus:border-violet-500/50'}`}
                                placeholder="Your name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                            {errors.name && <p className="text-rose-400 text-xs mt-1.5 font-medium">*{errors.name[0]}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Email</label>
                            <input
                                type="email"
                                className={`w-full px-4 py-3 bg-zinc-800 border rounded-xl text-white text-sm placeholder:text-zinc-600 outline-none transition-all focus:ring-2 focus:ring-violet-500/40 ${errors.email ? 'border-rose-500/60' : 'border-white/5 focus:border-violet-500/50'}`}
                                placeholder="you@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                            {errors.email && <p className="text-rose-400 text-xs mt-1.5 font-medium">*{errors.email[0]}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Password</label>
                            <input
                                type="password"
                                className={`w-full px-4 py-3 bg-zinc-800 border rounded-xl text-white text-sm placeholder:text-zinc-600 outline-none transition-all focus:ring-2 focus:ring-violet-500/40 ${errors.password ? 'border-rose-500/60' : 'border-white/5 focus:border-violet-500/50'}`}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                            {errors.password && <p className="text-rose-400 text-xs mt-1.5 font-medium">*{errors.password[0]}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Confirm Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 bg-zinc-800 border border-white/5 rounded-xl text-white text-sm placeholder:text-zinc-600 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/40"
                                placeholder="••••••••"
                                value={formData.password_confirmation}
                                onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                            />
                        </div>

                        <button className="w-full bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-violet-900/30 mt-2">
                            Create Account
                        </button>
                    </form>

                    <p className="text-center mt-5 text-zinc-600 text-xs">
                        Already have an account?{' '}
                        <Link to="/login" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
