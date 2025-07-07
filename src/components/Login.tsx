import React, { useState } from 'react';

interface LoginProps {
  onLogin: (userId: string) => void;
}

const userCredentials = [
  { id: 'user1', username: 'alex', password: 'alex123' },
  { id: 'user2', username: 'sarah', password: 'sarah123' },
];

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = userCredentials.find(
      u => u.username === username && u.password === password
    );
    if (user) {
      setError('');
      onLogin(user.id);
    } else {
      setError('Username atau password salah!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-6 border border-gray-200 min-w-[320px]">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Login ke RoiYan Chat</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent text-base"
          autoFocus
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent text-base"
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
