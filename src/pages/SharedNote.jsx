import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { databases } from '../appwrite/config';
import { Query } from 'appwrite';
import toast from 'react-hot-toast';

const SharedNote = () => {
  const { shareId } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSharedNote();
  }, [shareId]);

  const fetchSharedNote = async () => {
    try {
      const response = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_COLLECTION_ID,
        [Query.equal('shareId', shareId)]
      );

      if (response.documents.length === 0) {
        setError('Note not found or sharing has been disabled');
      } else {
        setNote(response.documents[0]);
      }
    } catch (error) {
      console.error('Error fetching shared note:', error);
      setError('Failed to load the shared note');
      toast.error('Failed to load shared note');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-500 flex items-center justify-center"
          >
            <FiArrowLeft className="mr-2" />
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft className="mr-2" />
            Go to Homepage
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">{note.title}</h1>
          <div className="note-content">
            {note.content}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SharedNote; 