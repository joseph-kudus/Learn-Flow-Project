import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./course.css";
import { MdClose } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

import { uploadImage } from "../../services/upload/uploadService";
import { createCourse } from "../../services/course/courseService";

function CreateCourse() {
  const { userData, currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    price: "",
  });

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
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

    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
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

      setImageUrl(image);
    } catch (err) {
      console.error(err);

      setError("Image upload failed.");

      setPreview(null);

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
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create course.");
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
            aria-label="Close"
          >
            <MdClose />
          </button>
        </div>

        <label htmlFor="title">Course Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Add course title"
        />

        <label htmlFor="description">Course Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Add course description"
        />

        <label htmlFor="image">Course Image</label>
        <input
          type="file"
          id="image"
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
                  style={{ width: `${uploadProgress}%` }}
                />
                <span className="progress-text">
                  {uploadProgress < 100
                    ? `Uploading ${uploadProgress}%`
                    : "Processing..."}
                </span>
              </div>
            )}
            {!uploadingImage && imageUrl && (
              <div className="upload-success">✓ Image uploaded</div>
            )}
          </div>
        )}

        <label htmlFor="price">Price</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          placeholder="0.00"
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
