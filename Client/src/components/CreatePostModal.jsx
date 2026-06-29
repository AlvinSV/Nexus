import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const { getToken } = useAuth();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [communityId, setCommunityId] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchCommunities = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/communities`
        );
        setCommunities(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCommunities();
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await getToken();

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
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        <h2>Create Post</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <br /><br />

          <textarea
            placeholder="Write something..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />

          <br /><br />

          <select
            value={communityId}
            onChange={(e) => setCommunityId(e.target.value)}
            required
          >
            <option value="">Select Community</option>

            {communities.map((community) => (
              <option key={community._id} value={community._id}>
                {community.name}
              </option>
            ))}

          </select>

          <br /><br />

          <input
            type="text"
            placeholder="Image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <br /><br />

          <button type="submit">
            Create Post
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>

        </form>

      </div>
    </div>
  );
}

export default CreatePostModal;