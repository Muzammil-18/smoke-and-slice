import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Flame, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

function Login({ user, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/menu');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      onLogin(data);
      toast.success(`Welcome back, ${data.name.split(' ')[0]}!`);
      
      if (data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/menu');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-850 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <Flame className="w-10 h-10 text-primary animate-pulse mb-3" />
          <h1 className="text-2xl font-extrabold text-white tracking-wide">Welcome Back</h1>
          <p className="text-xs text-neutral-450 mt-1">Sign in to your Smoke & Slice account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white text-sm"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex justify-between items-center">
              <span>Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-3.5 rounded-xl transition-all duration-205 text-sm shadow-lg shadow-primary/20 flex justify-center items-center"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-850 text-center text-sm text-neutral-400">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-primary hover:underline font-semibold">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;