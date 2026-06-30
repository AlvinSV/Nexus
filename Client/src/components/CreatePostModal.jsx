import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

function CreatePostModal({ isOpen, onClose, onPostCreated, defaultCommunityId, communities = [] }) {
  const { getToken } = useAuth();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [communityId, setCommunityId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCommunityId(defaultCommunityId || "");
    }
  }, [isOpen, defaultCommunityId]);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageUrl(reader.result); // Base64 data URL
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setImageUrl("");
  };

  const handleClose = () => {
    setTitle("");
    setBody("");
    setImageUrl("");
    setImagePreview("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let token = "";
      try {
        token = await getToken();
      } catch (tokenErr) {
        console.warn("Clerk token failed, fallback to dummy token:", tokenErr);
        token = "dummy-token";
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts`,
        { title, body, communityId, imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onPostCreated(res.data);
      handleClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "550px" }}>
        
        <div className="modal-header">
          <h3 className="modal-title">Create a Post</h3>
          <button className="modal-close-btn" onClick={handleClose} type="button" disabled={submitting}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body" style={{ marginTop: '16px', maxHeight: '75vh', overflowY: 'auto', paddingRight: '4px' }}>

          <div className="form-group">
            <label className="form-label">Community</label>
            <select
              className="form-select"
              value={communityId}
              onChange={(e) => setCommunityId(e.target.value)}
              required
              disabled={submitting}
            >
              <option value="">Select a community...</option>
              {communities.map((community) => (
                <option key={community._id} value={community._id}>
                  r/{community.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              placeholder="An interesting title for your post..."
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Body Content</label>
            <textarea
              placeholder="What would you like to say? Share details or a story..."
              className="form-textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Upload Image (Optional)</label>
            {!imagePreview ? (
              <div 
                style={{
                  border: "2px dashed var(--border-color)",
                  borderRadius: "8px",
                  padding: "24px 20px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: "rgba(255, 255, 255, 0.01)",
                  transition: "all 0.2s ease"
                }}
                onClick={() => !submitting && document.getElementById("post-image-file").click()}
                onMouseOver={(e) => { if (!submitting) e.currentTarget.style.borderColor = "var(--border-focus)"; }}
                onMouseOut={(e) => { if (!submitting) e.currentTarget.style.borderColor = "var(--border-color)"; }}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: "var(--text-muted)", marginBottom: "8px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div style={{ fontSize: "13px", color: "var(--text-main)", fontWeight: "500" }}>Click to select an image file</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>PNG, JPG, JPEG, GIF up to 5MB</div>
                <input 
                  type="file" 
                  id="post-image-file" 
                  accept="image/*" 
                  style={{ display: "none" }} 
                  onChange={handleImageChange}
                  disabled={submitting}
                />
              </div>
            ) : (
              <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-color)", background: "#0f111a", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", minHeight: "150px" }}>
                <img 
                  src={imagePreview} 
                  alt="Upload preview" 
                  style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "contain", borderRadius: "6px" }} 
                />
                {!submitting && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: "rgba(255, 69, 0, 0.95)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "14px",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
                    }}
                    title="Remove Image"
                  >
                    ×
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-outline"
              onClick={handleClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Creating..." : "Create Post"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default CreatePostModal;