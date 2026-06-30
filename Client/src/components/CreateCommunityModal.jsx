import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

function CreateCommunityModal({ isOpen, onClose, onCommunityCreated }) {
  const { getToken } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [iconPreview, setIconPreview] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerPreview(reader.result);
      setBannerUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setIconPreview(reader.result);
      setIconUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBanner = () => {
    setBannerPreview("");
    setBannerUrl("");
  };

  const handleRemoveIcon = () => {
    setIconPreview("");
    setIconUrl("");
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setBannerUrl("");
    setIconUrl("");
    setBannerPreview("");
    setIconPreview("");
    setError("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    // Clean name to be lowercase and without spaces/special chars (like subreddits)
    const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

    if (!cleanName) {
      setError("Please enter a valid community name (alphanumeric only)");
      setSubmitting(false);
      return;
    }

    try {
      let token = "";
      try {
        token = await getToken();
      } catch (tokenErr) {
        console.warn("Clerk token failed, fallback to dummy token:", tokenErr);
        token = "dummy-token";
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/communities`,
        { 
          name: cleanName, 
          description,
          bannerUrl: bannerUrl.trim(),
          iconUrl: iconUrl.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Community created successfully:", res.data);
      onCommunityCreated(res.data);
      handleClose();
    } catch (err) {
      console.error("Create community failed:", err);
      console.error("Response data:", err.response?.data);
      console.error("Status:", err.response?.status);
      setError(err.response?.data?.message || err.message || "Failed to create community");
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "550px" }}>
        
        <div className="modal-header">
          <h3 className="modal-title">Create a Community</h3>
          <button className="modal-close-btn" onClick={handleClose} type="button">×</button>
        </div>

        {error && (
          <div style={{ color: "#ff6b6b", fontSize: "13px", marginTop: "12px", background: "rgba(255, 107, 107, 0.1)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(255, 107, 107, 0.2)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-body" style={{ marginTop: '16px', maxHeight: '75vh', overflowY: 'auto', paddingRight: '4px' }}>

          <div className="form-group">
            <label className="form-label">Community Name</label>
            <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
              <span style={{ position: "absolute", left: "14px", color: "var(--text-muted)", fontSize: "14px", fontWeight: "600" }}>r/</span>
              <input
                type="text"
                placeholder="gaming, battlestations, coding..."
                className="form-input"
                style={{ paddingLeft: "28px" }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
              Lower case, no spaces or special characters.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              placeholder="Tell people what your community is all about..."
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Banner Image (Optional)</label>
            {!bannerPreview ? (
              <div 
                style={{
                  border: "2px dashed var(--border-color)",
                  borderRadius: "8px",
                  padding: "16px 20px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: "rgba(255, 255, 255, 0.01)",
                  transition: "all 0.2s ease"
                }}
                onClick={() => !submitting && document.getElementById("community-banner-file").click()}
                onMouseOver={(e) => { if (!submitting) e.currentTarget.style.borderColor = "var(--border-focus)"; }}
                onMouseOut={(e) => { if (!submitting) e.currentTarget.style.borderColor = "var(--border-color)"; }}
              >
                <div style={{ fontSize: "13px", color: "var(--text-main)", fontWeight: "500" }}>Click to select a banner image</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>PNG, JPG, JPEG up to 5MB</div>
                <input 
                  type="file" 
                  id="community-banner-file" 
                  accept="image/*" 
                  style={{ display: "none" }} 
                  onChange={handleBannerChange}
                  disabled={submitting}
                />
              </div>
            ) : (
              <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-color)", background: "#0f111a", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", height: "100px" }}>
                <img 
                  src={bannerPreview} 
                  alt="Banner preview" 
                  style={{ maxWidth: "100%", maxHeight: "80px", objectFit: "contain", borderRadius: "4px" }} 
                />
                {!submitting && (
                  <button
                    type="button"
                    onClick={handleRemoveBanner}
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
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer"
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Icon Image (Optional)</label>
            {!iconPreview ? (
              <div 
                style={{
                  border: "2px dashed var(--border-color)",
                  borderRadius: "8px",
                  padding: "16px 20px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: "rgba(255, 255, 255, 0.01)",
                  transition: "all 0.2s ease"
                }}
                onClick={() => !submitting && document.getElementById("community-icon-file").click()}
                onMouseOver={(e) => { if (!submitting) e.currentTarget.style.borderColor = "var(--border-focus)"; }}
                onMouseOut={(e) => { if (!submitting) e.currentTarget.style.borderColor = "var(--border-color)"; }}
              >
                <div style={{ fontSize: "13px", color: "var(--text-main)", fontWeight: "500" }}>Click to select an icon image</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>PNG, JPG, JPEG up to 2MB</div>
                <input 
                  type="file" 
                  id="community-icon-file" 
                  accept="image/*" 
                  style={{ display: "none" }} 
                  onChange={handleIconChange}
                  disabled={submitting}
                />
              </div>
            ) : (
              <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-color)", background: "#0f111a", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", height: "100px" }}>
                <img 
                  src={iconPreview} 
                  alt="Icon preview" 
                  style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }} 
                />
                {!submitting && (
                  <button
                    type="button"
                    onClick={handleRemoveIcon}
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
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer"
                    }}
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
              {submitting ? "Creating..." : "Create Community"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default CreateCommunityModal;
