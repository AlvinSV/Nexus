import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import { useAuth } from '@clerk/clerk-react';

const formatTimeAgo = (isoString) => {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

function PostDetailsModal({ isOpen, post, onClose, communities = [], onCommentAdded }) {
  const { getToken } = useAuth();
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newCommentBody, setNewCommentBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch comments
  useEffect(() => {
    if (!isOpen || !post?._id) return;
    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/comments/${post._id}`);
        setComments(response.data);
      } catch (err) {
        console.error('Failed to fetch comments:', err);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [post?._id, isOpen]);

  if (!isOpen || !post) return null;

  // Submit comment
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newCommentBody.trim() || submitting) return;

    try {
      setSubmitting(true);
      let token = "";
      try {
        token = await getToken();
      } catch (tokenErr) {
        console.warn("Clerk token failed, fallback to dummy token:", tokenErr);
        token = "dummy-token";
      }
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/comments`,
        {
          body: newCommentBody,
          postId: post._id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setComments(prev => [...prev, response.data]);
      setNewCommentBody('');
      if (onCommentAdded) {
        onCommentAdded(post._id);
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
      alert(err.response?.data?.message || 'Failed to submit comment. Please sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  const getCommunityName = () => {
    if (typeof post.community === 'object' && post.community?.name) {
      return post.community.name;
    }
    const communityId = post.community;
    if (communityId && communities.length > 0) {
      const matched = communities.find(c => c._id.toString() === communityId.toString());
      if (matched && matched.name) {
        return matched.name;
      }
    }
    return 'general';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`r/${getCommunityName()}`}>
      <div className="post-details-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '75vh', overflowY: 'auto', paddingRight: '6px' }}>
        
        {/* Post Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
          <span style={{ fontWeight: '600', color: 'var(--accent)' }}>r/{getCommunityName()}</span>
          <span>•</span>
          <span>Posted by u/{post.author ? post.author.username : 'anonymous'}</span>
          <span>•</span>
          <span>{formatTimeAgo(post.createdAt)}</span>
        </div>

        {/* Post Title */}
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-main)', margin: '0' }}>{post.title}</h2>

        {/* Post Body */}
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6', margin: '0', whiteSpace: 'pre-wrap' }}>{post.body}</p>

        {/* Post Image */}
        {post.imageUrl && (
          <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', background: '#0b0b0d' }}>
            <img src={post.imageUrl} alt={post.title} style={{ width: '100%', display: 'block', maxHeight: '400px', objectFit: 'contain' }} />
          </div>
        )}

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '10px 0' }} />

        {/* Write Comment Form */}
        <form onSubmit={handleSubmitComment} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <textarea
            value={newCommentBody}
            onChange={(e) => setNewCommentBody(e.target.value)}
            placeholder="What are your thoughts?"
            rows="3"
            style={{
              width: '100%',
              borderRadius: '8px',
              padding: '12px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-main)',
              fontFamily: 'inherit',
              fontSize: '14px',
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            disabled={submitting}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ alignSelf: 'flex-end', borderRadius: '18px', padding: '6px 20px', fontSize: '13px' }}
            disabled={submitting || !newCommentBody.trim()}
          >
            {submitting ? 'Commenting...' : 'Comment'}
          </button>
        </form>

        {/* Comments Section Title */}
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)', margin: '10px 0 0 0' }}>
          Comments ({comments.length})
        </h3>

        {/* Comments List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '10px' }}>
          {loadingComments ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '14px' }}>
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '14px', border: '1px dashed var(--border)', borderRadius: '8px' }}>
              No comments yet. Be the first to share your thoughts!
            </div>
          ) : (
            comments.map((comment) => (
              <div 
                key={comment._id} 
                style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  padding: '12px', 
                  backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '8px' 
                }}
              >
                {/* Commenter Avatar */}
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '13px', overflow: 'hidden', flexShrink: 0 }}>
                  {comment.author?.avatar ? (
                    <img src={comment.author.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    comment.author?.username ? comment.author.username[0].toUpperCase() : 'A'
                  )}
                </div>

                {/* Comment Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                      u/{comment.author ? comment.author.username : 'anonymous'}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '2px 0 0 0', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                    {comment.body}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </Modal>
  );
}

export default PostDetailsModal;
