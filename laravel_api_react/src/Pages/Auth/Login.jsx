import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../../Context/AppContext.jsx";

export default function Login() {
    const { setToken } = useContext(AppContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    async function handleLogin(e) {
        e.preventDefault();
        const res = await fetch('/api/login', {
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
                    <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 items-center justify-center shadow-lg shadow-violet-900/40 mb-4">
                        <span className="text-white font-black text-lg">M</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Welcome back</h1>
                    <p className="text-zinc-500 text-sm mt-1">Sign in to your account</p>
                </div>

                {/* Card */}
                <div className="bg-zinc-900 border border-white/5 rounded-2xl p-7 shadow-2xl shadow-black/40">
                    <form onSubmit={handleLogin} className="space-y-4">
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
                                className="w-full px-4 py-3 bg-zinc-800 border border-white/5 rounded-xl text-white text-sm placeholder:text-zinc-600 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/40"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                            {errors.password && <p className="text-rose-400 text-xs mt-1.5 font-medium">*{errors.password[0]}</p>}
                        </div>

                        <button className="w-full bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-violet-900/30 mt-2">
                            Sign In
                        </button>
                    </form>

                    <p className="text-center mt-5 text-zinc-600 text-xs">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
