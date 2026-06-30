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

function PostCard({ post, userVote, onVote, onCommunityClick, communities = [], currentUser, onDelete, onPostClick }) {
  if (!post || !post.title || !post.body) {
    return null; // Skip rendering corrupted or empty posts
  }

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

  const score = post.score !== undefined ? post.score : ((post.upvotes || 0) - (post.downvotes || 0));

  const postAuthorId = post.author && (post.author._id || post.author.clerkUserId || post.author);
  const currentUserId = currentUser && (currentUser._id || currentUser.clerkUserId || currentUser);
  const isAuthor = postAuthorId && currentUserId && (postAuthorId.toString() === currentUserId.toString());

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
          {score}
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
          <span 
            className="post-community"
            onClick={() => onCommunityClick && onCommunityClick(post.community)}
          >
            r/{getCommunityName()}
          </span>
          <span className="post-dot"></span>
          <span className="post-author">
            {post.author && post.author.avatar && (
              <img src={post.author.avatar} alt="" className="author-avatar" />
            )}
            Posted by u/{post.author ? post.author.username : 'anonymous'}
          </span>
          <span className="post-dot"></span>
          <span>{formatTimeAgo(post.createdAt)}</span>
        </div>

        {/* Title */}
        <h3 className="post-title" onClick={() => onPostClick && onPostClick(post)} style={{ cursor: 'pointer' }}>{post.title}</h3>

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
        <div className="post-actions" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="action-btn" onClick={() => onPostClick && onPostClick(post)}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {post.commentsCount || 0} Comments
            </button>
            <button className="action-btn">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.022-2.012m0 0a3 3 0 111.012-4.022M12.706 8.73a3 3 0 10-1.012 4.023m0 0l-4.022 2.012m0 0a3 3 0 11-1.012-4.022m1.012 4.022L12.7 10.73" />
              </svg>
              Share
            </button>
          </div>
          {isAuthor && (
            <button 
              className="action-btn delete-btn"
              onClick={() => onDelete && onDelete(post._id)}
              style={{ 
                color: 'var(--accent)', 
                opacity: 0.8,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500
              }}
              onMouseOver={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = '#ff4444'; }}
              onMouseOut={e => { e.currentTarget.style.opacity = 0.8; e.currentTarget.style.color = 'var(--accent)'; }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default PostCard;
