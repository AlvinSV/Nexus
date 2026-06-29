import React from 'react';

const formatTimeAgo = (isoString) => {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

function PostCard({ post, userVote, onVote }) {
  return (
    <article className="post-card">
      {/* Voting Area */}
      <div className="vote-section">
        <button 
          className={`vote-btn up ${userVote === 'up' ? 'active' : ''}`}
          onClick={() => onVote(post._id, 'up')}
          aria-label="Upvote"
        >
          ▲
        </button>
        <span className={`vote-score ${userVote || ''}`}>
          {post.score}
        </span>
        <button 
          className={`vote-btn down ${userVote === 'down' ? 'active' : ''}`}
          onClick={() => onVote(post._id, 'down')}
          aria-label="Downvote"
        >
          ▼
        </button>
      </div>

      {/* Main Content Area */}
      <div className="post-main">
        {/* Meta Info */}
        <div className="post-meta">
          <span className="post-community">r/{post.community.name}</span>
          <span className="post-dot"></span>
          <span className="post-author">
            {post.author.avatar && (
              <img src={post.author.avatar} alt="" className="author-avatar" />
            )}
            Posted by u/{post.author.username}
          </span>
          <span className="post-dot"></span>
          <span>{formatTimeAgo(post.createdAt)}</span>
        </div>

        {/* Title */}
        <h3 className="post-title">{post.title}</h3>

        {/* Body Text */}
        {post.body && <p className="post-body">{post.body}</p>}

        {/* Image if available */}
        {post.imageUrl && (
          <div className="post-image-container">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="post-image" 
              loading="lazy"
            />
          </div>
        )}

        {/* Actions */}
        <div className="post-actions">
          <button className="action-btn">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {post.commentsCount} Comments
          </button>
          <button className="action-btn">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.022-2.012m0 0a3 3 0 111.012-4.022M12.706 8.73a3 3 0 10-1.012 4.023m0 0l-4.022 2.012m0 0a3 3 0 11-1.012-4.022m1.012 4.022L12.7 10.73" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
