import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiLogOut, FiTrash2, FiShare2 } from 'react-icons/fi';
import { getNotes, deleteNote, shareNote } from '../appwrite/api';
import { account } from '../appwrite/config';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchNotes();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await account.get();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      const notesData = await getNotes();
      setNotes(notesData);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter(note => note.$id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleShare = async (id) => {
    try {
      const response = await shareNote(id);
      // Copy share link to clipboard
      const shareLink = `${window.location.origin}/shared/${response.shareId}`;
      await navigator.clipboard.writeText(shareLink);
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing note:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center flex-wrap gap-4 nav-content">
            <div className="flex items-center flex-wrap gap-4">
              <div className="text-2xl font-bold text-gray-800">NoteFlow</div>
              {user && (
                <span className="text-gray-600 text-sm md:text-base">
                  Welcome, {user.name}
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="section-padding">
        <div className="dashboard-header">
          <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
          <Link
            to="/note/new"
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap"
          >
            <FiPlus className="mr-2" />
            New Note
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600">No notes yet. Create your first note!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 note-grid">
            {notes.map((note) => (
              <div key={note.$id} className="note-card">
                <Link to={`/note/${note.$id}`} className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {note.title || 'Untitled'}
                  </h3>
                  <p className="note-card-content">
                    {note.content}
                  </p>
                </Link>
                <div className="flex justify-between items-center pt-4 border-t mt-auto">
                  <div className="text-xs text-gray-500">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleShare(note.$id)}
                      className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50"
                      title="Share note"
                    >
                      <FiShare2 />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this note?')) {
                          handleDelete(note.$id);
                        }
                      }}
                      className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-red-50"
                      title="Delete note"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard; 