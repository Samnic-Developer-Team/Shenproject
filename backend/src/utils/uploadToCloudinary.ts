import cloudinary from '../config/cloudinary';

export const uploadToCloudinary = async (filePath: string, folder = 'shena-salon-hub') => {
  const result = await cloudinary.uploader.upload(filePath, { folder });
  return result;
};
