import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  resource_type: string;
  format?: string;
  duration?: number;
}

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  options: {
    folder?: string;
    resource_type?: 'auto' | 'image' | 'video';
    filename?: string;
  } = {}
): Promise<CloudinaryUploadResult> {
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // Fallback if Cloudinary credentials are not configured
  if (!apiKey || !apiSecret || !cloudName || apiKey.includes('mock') || cloudName.includes('demo')) {
    console.warn('⚠️ Cloudinary API keys not configured. Simulating media upload with persistent data URL.');
    const mime = options.resource_type === 'video' ? 'video/mp4' : 'image/jpeg';
    const base64 = `data:${mime};base64,${fileBuffer.toString('base64')}`;
    return {
      url: base64,
      secure_url: base64,
      public_id: `mock_${Date.now()}`,
      resource_type: options.resource_type || 'image',
    };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'iphonehub/inventory',
        resource_type: options.resource_type || 'auto',
        use_filename: true,
        unique_filename: true,
      },
      (error, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          console.error('Cloudinary upload stream error:', error);
          return reject(error || new Error('Cloudinary upload failed'));
        }
        resolve({
          url: result.url,
          secure_url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type,
          format: result.format,
          duration: result.duration,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}

export default cloudinary;

