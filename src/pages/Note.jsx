import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShare2, FiSave, FiEdit2 } from 'react-icons/fi';
import RichTextEditor from '../components/RichTextEditor';
import { getNote, createNote, updateNote, shareNote } from '../appwrite/api';
import toast from 'react-hot-toast';

const Note = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(isNew);
  const [note, setNote] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    if (!isNew) {
      fetchNote();
    }
  }, [id]);

  const fetchNote = async () => {
    try {
      const noteData = await getNote(id);
      setNote(noteData);
    } catch (error) {
      console.error('Error fetching note:', error);
      toast.error('Failed to load note');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!note.title.trim()) {
      toast.error('Please enter a title for your note');
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        await createNote(note.title, note.content);
        toast.success('Note created successfully');
        navigate('/dashboard');
      } else {
        await updateNote(id, note.title, note.content);
        toast.success('Note updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    if (isNew) {
      toast.error('Please save the note first before sharing');
      return;
    }

    try {
      const response = await shareNote(id);
      const shareLink = `${window.location.origin}/shared/${response.shareId}`;
      await navigator.clipboard.writeText(shareLink);
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing note:', error);
      toast.error('Failed to share note');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft className="mr-2" />
              Back
            </button>
            <div className="flex flex-wrap gap-2">
              {!isNew && !isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-1"
                  >
                    <FiEdit2 className="mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-1"
                  >
                    <FiShare2 className="mr-2" />
                    Share
                  </button>
                </>
              )}
              {(isNew || isEditing) && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <FiSave className="mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="editor-container">
        {isEditing ? (
          <>
            <input
              type="text"
              placeholder="Note Title"
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
              className="w-full text-2xl md:text-3xl font-bold mb-8 bg-transparent border-none focus:outline-none focus:ring-0"
            />
            <RichTextEditor
              value={note.content}
              onChange={(content) => setNote({ ...note, content })}
            />
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">{note.title}</h1>
            <div className="note-content">
              {note.content}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Note; 