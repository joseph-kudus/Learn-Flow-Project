import imageCompression from "browser-image-compression";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
  throw new Error("Cloudinary environment variables are missing.");
}

/* ==========================================
   Compress Image
========================================== */

const compressImage = async (file) => {
  return imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  });
};

/* ==========================================
   Upload Image
========================================== */

export const uploadImage = (
  file,
  folder = "uploads",
  onProgress = () => {},
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const compressedFile = await compressImage(file);

      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", folder);

      const xhr = new XMLHttpRequest();

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      );

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);

          resolve({
            url: response.secure_url,
            publicId: response.public_id,
          });
        } else {
          reject(new Error("Image upload failed."));
        }
      };

      xhr.onerror = () => reject(new Error("Network error"));

      xhr.send(formData);
    } catch (error) {
      reject(error);
    }
  });
};
