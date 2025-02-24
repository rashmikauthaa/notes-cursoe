import { ID, Query } from 'appwrite';
import { databases, account } from './config';

export const createNote = async (title, content) => {
  try {
    const user = await account.get();
    const response = await databases.createDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_COLLECTION_ID,
      ID.unique(),
      {
        title,
        content,
        userId: user.$id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isShared: false,
        shareId: ''
      }
    );
    return response;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

export const getNotes = async () => {
  try {
    const user = await account.get();
    const response = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_COLLECTION_ID,
      [
        Query.equal('userId', user.$id),
        Query.orderDesc('$updatedAt')
      ]
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

export const getNote = async (id) => {
  try {
    const response = await databases.getDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_COLLECTION_ID,
      id
    );
    return response;
  } catch (error) {
    console.error('Error fetching note:', error);
    throw error;
  }
};

export const updateNote = async (id, title, content) => {
  try {
    const response = await databases.updateDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_COLLECTION_ID,
      id,
      {
        title,
        content,
        updatedAt: new Date().toISOString()
      }
    );
    return response;
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

export const deleteNote = async (id) => {
  try {
    await databases.deleteDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_COLLECTION_ID,
      id
    );
    return true;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

export const shareNote = async (id) => {
  try {
    const shareId = ID.unique();
    const response = await databases.updateDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_COLLECTION_ID,
      id,
      {
        isShared: true,
        shareId: shareId
      }
    );
    
    if (!response) {
      throw new Error('Failed to update note');
    }
    
    return { shareId: shareId };
  } catch (error) {
    console.error('Error sharing note:', error);
    throw error;
  }
}; 