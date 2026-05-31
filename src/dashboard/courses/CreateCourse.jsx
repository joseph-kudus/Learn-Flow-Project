import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./course.css";
import { MdClose } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../../firebaseconfig"; 
import { addDoc, collection, serverTimestamp } from "firebase/firestore";


const CLOUDINARY_CLOUD_NAME = "ddrxjwifb"; 
const CLOUDINARY_UPLOAD_PRESET = "195881453964535"; 

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

  const uploadImageToCloudinary = (file) => {
    return new Promise(async (resolve, reject) => {
      try {
        // 1. Compress first
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        console.log(
          `Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`,
        );

        
        const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
        const xhr = new XMLHttpRequest();
        const fd = new FormData();

        fd.append("file", compressedFile);
        fd.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        fd.append("folder", `courses/${currentUser.uid}`);

        xhr.open("POST", url, true);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(progress);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const res = JSON.parse(xhr.responseText);
            resolve(res.secure_url); // https://res.cloudinary.com/...
          } else {
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.send(fd);
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      if (file.size > 10 * 1024 * 1024) {
        return setError("Image must be under 10MB before compressiaon");
      }

      setError("");
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreview((old) => {
        if (old) URL.revokeObjectURL(old);
        return URL.createObjectURL(file);
      });

      if (!currentUser) return setError("You must be logged in to upload");

      // Start upload immediately in background
      setUploadingImage(true);
      setUploadProgress(0);
      try {
        const url = await uploadImageToCloudinary(file);
        setImageUrl(url);
      } catch (err) {
        console.error(err);
        setError("Image upload failed. Try again.");
        setPreview((old) => {
          if (old) URL.revokeObjectURL(old);
          return null;
        });
        setFormData((prev) => ({ ...prev, image: null }));
      } finally {
        setUploadingImage(false);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return setError("You must be logged in");
    if (!formData.title.trim()) return setError("Title is required");
    if (uploadingImage)
      return setError("Please wait for image to finish uploading");
    if (formData.image && !imageUrl)
      return setError("Image upload failed. Please re-select image");

    setLoading(true);
    setError("");

    try {
      await addDoc(collection(db, "courses"), {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price) || 0,
        imageUrl: imageUrl || "",
        author: userData?.username || userData?.email,
        authorId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        students: [],
        published: false,
      });

      navigate("/dashboard/coursebuilder");
    } catch (err) {
      console.error("Create course error:", err);
      setError(err.message || "Failed to create course");
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
