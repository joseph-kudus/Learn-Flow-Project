import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";

import "./course.css";

import { useAuth } from "../../context/AuthContext";
import { uploadImage } from "../../services/upload/uploadService";
import { createCourse } from "../../services/course/courseService";

function CreateCourse() {
  const { userData, currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [preview, setPreview] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    price: "",
  });

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (!files) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      return;
    }

    const file = files[0];

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB.");

      return;
    }

    setError("");

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview((oldPreview) => {
      if (oldPreview) {
        URL.revokeObjectURL(oldPreview);
      }

      return URL.createObjectURL(file);
    });

    if (!currentUser) {
      setError("You must be logged in.");

      return;
    }

    try {
      setUploadingImage(true);
      setUploadProgress(0);

      const image = await uploadImage(
        file,
        `courses/${currentUser.uid}`,
        setUploadProgress,
      );

      // Cloudinary returns object
      setImageUrl(image.url);
    } catch (error) {
      console.error(error);

      setError("Image upload failed.");

      setPreview(null);
      setImageUrl("");

      setFormData((prev) => ({
        ...prev,
        image: null,
      }));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setError("You must be logged in.");

      return;
    }

    if (!formData.title.trim()) {
      setError("Course title is required.");

      return;
    }

    if (uploadingImage) {
      setError("Please wait for the image upload.");

      return;
    }

    if (formData.image && !imageUrl) {
      setError("Image upload failed.");

      return;
    }

    try {
      setLoading(true);
      setError("");

      await createCourse({
        title: formData.title.trim(),

        description: formData.description.trim(),

        price: Number(formData.price) || 0,

        imageUrl,

        author: userData?.username || userData?.email,

        authorId: currentUser.uid,
      });

      navigate("/dashboard/coursebuilder");
    } catch (error) {
      console.error(error);

      setError(error.message || "Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="CreateCourse">
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-header">
          <h1>Create New Course</h1>

          <button
            type="button"
            className="close-btn"
            onClick={() => navigate(-1)}
          >
            <MdClose />
          </button>
        </div>

        <label>Course Title</label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Add course title"
          required
        />

        <label>Course Description</label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          placeholder="Add course description"
          required
        />

        <label>Course Image</label>

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          disabled={uploadingImage}
        />

        {preview && (
          <div className="preview-wrap">
            <img src={preview} alt="Preview" className="image-preview" />

            {uploadingImage && (
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${uploadProgress}%`,
                  }}
                />

                <span className="progress-text">
                  Uploading {uploadProgress}%
                </span>
              </div>
            )}

            {!uploadingImage && imageUrl && (
              <div className="upload-success">✓ Image uploaded</div>
            )}
          </div>
        )}

        <label>Price</label>

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          placeholder="0.00"
          required
        />

        <button type="submit" disabled={loading || uploadingImage}>
          {loading
            ? "Creating..."
            : uploadingImage
              ? `Uploading... ${uploadProgress}%`
              : "Create Course"}
        </button>
      </form>
    </div>
  );
}

export default CreateCourse;
