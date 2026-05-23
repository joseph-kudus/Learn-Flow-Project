import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./course.css";
import { MdClose } from "react-icons/md";

function CreateCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    price: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      if (file) setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      if (formData.image) data.append("image", formData.image);

      const res = await fetch("/api/courses", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Failed to create course");

      await res.json();
      navigate("/course-builder");
    } catch (err) {
      setError(err.message);
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
        <input
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
        />
        {preview && (
          <img src={preview} alt="Preview" className="image-preview" />
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

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
}

export default CreateCourse;
