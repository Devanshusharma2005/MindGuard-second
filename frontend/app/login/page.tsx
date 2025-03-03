'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      console.log('Login response:', data);

      if (!res.ok) {
        throw new Error(data.msg || 'Login failed');
      }

      localStorage.setItem('userData', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      // Redirect based on role
      if (data.user.role === 'doctor') {
        router.push('/doctor');
      } else if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/patient'); // Default page
      }

    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(217,32%,17%)] to-[hsl(222,47%,11%)] py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-[hsl(210,40%,96%)] bg-opacity-90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-[hsl(214,32%,91%)]"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[hsl(222,47%,11%)]">Welcome Back!</h2>
          <p className="text-[hsl(221,83%,53%)] text-sm mt-2">Sign in to continue</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 bg-[hsl(0,84.2%,60.2%)] text-white p-3 rounded-md"
          >
            {error}
          </motion.div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[hsl(222,47%,11%)] font-medium">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 mt-1 border border-[hsl(214,32%,91%)] rounded-lg bg-white focus:ring-[hsl(221,83%,53%)] focus:border-[hsl(221,83%,53%)] text-[hsl(222,47%,11%)]"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[hsl(222,47%,11%)] font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full px-4 py-2 mt-1 border border-[hsl(214,32%,91%)] rounded-lg bg-white focus:ring-[hsl(221,83%,53%)] focus:border-[hsl(221,83%,53%)] text-[hsl(222,47%,11%)]"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[hsl(221,83%,53%)] hover:bg-[hsl(217,91%,60%)] text-white font-bold py-2 rounded-lg transition-all duration-300 shadow-md"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/signup" className="text-[hsl(262,83%,58%)] hover:text-[hsl(224,76%,48%)] font-medium">
            Don't have an account? Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
