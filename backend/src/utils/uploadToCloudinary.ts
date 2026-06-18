import cloudinary from '../config/cloudinary';
import { env } from '../config/env';

export const uploadToCloudinary = async (filePath: string, folder = 'shena-salon-hub'): Promise<string> => {
  if (!filePath) {
    return '';
  }

  // If already a remote URL, no need to upload
  if (filePath.startsWith('http') && !filePath.includes('data:image')) {
    return filePath;
  }

  // Check if credentials are set
  if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
    console.warn('Cloudinary credentials not set. Returning high-quality unsplash placeholder.');
    if (filePath.startsWith('http')) return filePath;
    return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600';
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    if (filePath.startsWith('http')) return filePath;
    return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600';
  }
};
