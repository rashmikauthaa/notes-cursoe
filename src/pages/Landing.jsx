import { Link, Navigate } from 'react-router-dom';
import { FiEdit3, FiShare2, FiLock } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { account } from '../appwrite/config';

const Landing = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const session = await account.getSession('current');
      if (session) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="nav-container">
            <div className="text-2xl font-bold text-gray-800">NoteFlow</div>
            <div className="nav-buttons">
              <Link to="/login" className="text-gray-600 hover:text-gray-900 text-center">
                Login
              </Link>
              <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center">
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero-section">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="responsive-title text-gray-900 mb-6">
              Your thoughts, organized and secure
            </h1>
            <p className="responsive-subtitle mb-8 max-w-2xl mx-auto">
              Create, edit, and share your notes with ease. A modern note-taking experience designed for your productivity.
            </p>
            <Link
              to="/signup"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started - It's Free
            </Link>
          </div>

          <div className="features-grid max-w-7xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <FiEdit3 className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Rich Text Editor</h3>
              <p className="text-gray-600">Create beautiful notes with our intuitive text editor.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <FiShare2 className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Sharing</h3>
              <p className="text-gray-600">Share your notes with anyone using a simple link.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <FiLock className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
              <p className="text-gray-600">Your notes are encrypted and stored securely.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing; 