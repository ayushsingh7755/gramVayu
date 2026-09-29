import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { env } from './env.js';

const isCloudinaryConfigured = Boolean(
  env.cloudinary.cloudName &&
    env.cloudinary.apiKey &&
    env.cloudinary.apiSecret &&
    env.cloudinary.cloudName !== 'your_cloudinary_cloud_name'
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  });
}

/**
 * Uploads a file to Cloudinary if credentials are configured.
 * If Cloudinary credentials are not set in local dev, safely stores metadata
 * or returns a local static file URL so advisory/weather uploads remain functional.
 */
export const uploadToCloudinary = async (filePath, folder = 'agro_advisories') => {
  if (!filePath) return null;

  if (isCloudinaryConfigured) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: `weather_downscaling/${folder}`,
        resource_type: 'auto',
      });
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        resourceType: result.resource_type,
        provider: 'cloudinary',
      };
    } catch (error) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw error;
    }
  }

  // Fallback for local prototype testing when Cloudinary env vars are empty
  const fileName = path.basename(filePath);
  return {
    url: `/uploads/${fileName}`,
    publicId: `local_${fileName}`,
    format: path.extname(fileName).replace('.', ''),
    resourceType: 'raw',
    provider: 'local_fallback',
  };
};

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  if (isCloudinaryConfigured && !publicId.startsWith('local_')) {
    await cloudinary.uploader.destroy(publicId);
  }
};

export default cloudinary;
