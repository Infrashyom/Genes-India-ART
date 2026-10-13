import api from './api';

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.secure_url;
  } catch (error) {
    console.error('Failed to upload image', error);
    throw new Error('Image upload failed');
  }
};
