import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { AppContext } from '../Context/AppContext.jsx';

export default function Layout() {
    const { user, token, setUser, setToken } = useContext(AppContext);
    const navigate = useNavigate();

    async function handleLogout(e) {
        e.preventDefault();

        const res = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            navigate('/login');
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Navbar */}
            <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-900/80 backdrop-blur-md">
                <nav className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-900/30">
                            <span className="text-white font-black text-sm">M</span>
                        </div>
                        <span className="text-white font-bold text-lg tracking-tight">MyPost<span className="text-violet-400">App</span></span>
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-black shadow-md shadow-violet-900/30">
                                    {user.name[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-white text-sm font-semibold leading-none">{user.name}</p>
                                    <p className="text-zinc-500 text-xs mt-0.5">Member</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                                <Link
                                    to="/create"
                                    className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5"
                                >
                                    <span className="text-base leading-none">+</span> New Post
                                </Link>

                                <form onSubmit={handleLogout}>
                                    <button className="text-zinc-400 hover:text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-white/5">
                                        Logout
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="text-zinc-400 hover:text-white px-4 py-2 text-sm font-semibold transition-colors">Login</Link>
                            <Link to="/register" className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Get Started</Link>
                        </div>
                    )}
                </nav>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
}
