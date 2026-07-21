const CLOUD_NAME = "ddrxjwifb";
const UPLOAD_PRESET = "learnflow_avatar";

export const uploadAvatar = async (file) => {
  if (!file) {
    throw new Error("No file selected");
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Cloudinary error:", data);
      throw new Error(data.error?.message || "Cloudinary upload failed");
    }

    return data.secure_url;
  } catch (error) {
    console.error("Avatar upload error:", error);

    throw error;
  }
};
