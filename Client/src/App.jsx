import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, UserButton, useAuth } from '@clerk/clerk-react';
import axios from 'axios';

// Default mock posts loaded with generated high-quality images
const DEFAULT_POSTS = [
  {
    _id: 'mock-1',
    title: 'Rate my new dual-monitor futuristic coding workspace setup! 💻🚀',
    body: 'Finally completed my clean build. Got vertical side screens for code and logs, custom ambient LED backlighting, and a sweet mechanical keyboard. What do you think?',
    imageUrl: '/images/tech_setup.jpg',
    upvotes: 1420,
    downvotes: 12,
    score: 1408,
    commentsCount: 184,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    author: {
      username: 'code_wizard',
      avatar: ''
    },
    community: {
      name: 'battlestations'
    }
  },
  {
    _id: 'mock-2',
    title: 'Spent 8 hours perfecting this homemade tonkotsu ramen. Absolutely worth it! 🍜',
    body: 'The broth was simmered overnight. Chashu pork belly was melt-in-your-mouth tender, and the soft-boiled ajitama eggs were perfectly jammy. Recipe in comments if anyone wants it!',
    imageUrl: '/images/gourmet_ramen.jpg',
    upvotes: 894,
    downvotes: 4,
    score: 890,
    commentsCount: 67,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    author: {
      username: 'ramen_sensei',
      avatar: ''
    },
    community: {
      name: 'cooking'
    }
  },
  {
    _id: 'mock-3',
    title: 'Woke up at 4 AM to capture this sunrise at Lake Moraine, Alberta. Completely breathtaking. 🏔️✨',
    body: 'The mist hovering over the turquoise water with the snow-dusted peaks in the background was a spiritual experience. Highly recommend visiting early to beat the crowds!',
    imageUrl: '/images/mountain_lake.jpg',
    upvotes: 2154,
    downvotes: 18,
    score: 2136,
    commentsCount: 142,
    createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    author: {
      username: 'wanderlust_explorer',
      avatar: ''
    },
    community: {
      name: 'nature'
    }
  }
];

// Helper to format timestamps relative to current time
const formatTimeAgo = (isoString) => {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

function Home() {
  const { getToken } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Track votes locally for responsive UI
  const [votedStates, setVotedStates] = useState({}); // { postId: 'up' | 'down' | null }

  // Load and merge posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts`, { headers });
        
        if (response.data && response.data.length > 0) {
          // Calculate score for each db post
          const dbPosts = response.data.map(p => ({
            ...p,
            score: (p.upvotes || 0) - (p.downvotes || 0),
            commentsCount: p.commentsCount || 0
          }));
          setPosts(dbPosts);
        } else {
          // If no posts returned from DB, load default posts
          setPosts(DEFAULT_POSTS);
        }
      } catch (err) {
        console.error('Failed to fetch posts, falling back to default posts:', err);
        setPosts(DEFAULT_POSTS);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [getToken]);

  // Handle voting toggle
  const handleVote = (postId, type) => {
    setVotedStates(prev => {
      const currentVote = prev[postId];
      let newVote = null;

      if (currentVote !== type) {
        newVote = type;
      }

      // Update local post score immediately
      setPosts(currentPosts => 
        currentPosts.map(post => {
          if (post._id !== postId) return post;
          
          let scoreDiff = 0;
          if (currentVote === 'up') scoreDiff -= 1;
          if (currentVote === 'down') scoreDiff += 1;
          if (newVote === 'up') scoreDiff += 1;
          if (newVote === 'down') scoreDiff -= 1;

          return {
            ...post,
            score: (post.score || 0) + scoreDiff
          };
        })
      );

      return {
        ...prev,
        [postId]: newVote
      };
    });
  };

  // Sort and Filter Posts
  const filteredPosts = posts
    .filter(post => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
        post.body.toLowerCase().includes(query) ||
        post.community.name.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (filter === 'new') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      // default: sort by score
      return b.score - a.score;
    });

  return (
    <div className="app-container">
      {/* Navbar Header */}
      <header className="app-header">
        <div className="logo-section" onClick={() => window.location.reload()}>
          <div className="logo-icon">N</div>
          <div className="logo-text">nexus<span>.</span></div>
        </div>

        <div className="search-container">
          <svg className="search-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search communities, posts or topics..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="auth-section">
          <UserButton showName={true} />
        </div>
      </header>

      {/* Main Container Grid */}
      <main className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-panel">
            <h3 className="sidebar-title">Navigation</h3>
            <ul className="sidebar-menu">
              <li className="sidebar-item active">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home Feed
              </li>
              <li className="sidebar-item">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Popular
              </li>
              <li className="sidebar-item">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Topics
              </li>
            </ul>
          </div>

          <div className="sidebar-panel">
            <h3 className="sidebar-title">Trending Communities</h3>
            <ul className="sidebar-menu">
              <li className="sidebar-item">
                <span className="community-icon" style={{ background: '#ff4500', color: 'white' }}>b</span>
                r/battlestations
              </li>
              <li className="sidebar-item">
                <span className="community-icon" style={{ background: '#8a2be2', color: 'white' }}>c</span>
                r/cooking
              </li>
              <li className="sidebar-item">
                <span className="community-icon" style={{ background: '#00d2c4', color: 'white' }}>n</span>
                r/nature
              </li>
              <li className="sidebar-item">
                <span className="community-icon" style={{ background: '#1da1f2', color: 'white' }}>t</span>
                r/technology
              </li>
            </ul>
          </div>
        </aside>

        {/* Feed Column */}
        <section className="feed-container">
          <div className="welcome-panel">
            <h2 className="welcome-title">Welcome to your Nexus dashboard! 🌌</h2>
            <p className="welcome-text">
              This is a modern community forum built on the MERN stack. We have pre-populated your home feed with some high-quality community posts to demonstrate the visual capabilities. You can vote, search, filter, and view posts!
            </p>
          </div>

          <div className="feed-header">
            <h2 className="feed-title">{searchQuery ? `Search Results for "${searchQuery}"` : 'Home Feed'}</h2>
            <div className="feed-filters">
              <button 
                className={`filter-btn ${filter === 'popular' ? 'active' : ''}`}
                onClick={() => setFilter('popular')}
              >
                Popular
              </button>
              <button 
                className={`filter-btn ${filter === 'new' ? 'active' : ''}`}
                onClick={() => setFilter('new')}
              >
                New
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Loading posts...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No posts match your search query.
            </div>
          ) : (
            filteredPosts.map(post => {
              const userVote = votedStates[post._id];
              return (
                <article key={post._id} className="post-card">
                  {/* Voting Area */}
                  <div className="vote-section">
                    <button 
                      className={`vote-btn up ${userVote === 'up' ? 'active' : ''}`}
                      onClick={() => handleVote(post._id, 'up')}
                      aria-label="Upvote"
                    >
                      ▲
                    </button>
                    <span className={`vote-score ${userVote || ''}`}>
                      {post.score}
                    </span>
                    <button 
                      className={`vote-btn down ${userVote === 'down' ? 'active' : ''}`}
                      onClick={() => handleVote(post._id, 'down')}
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
            })
          )}
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <>
          <SignedIn><Home /></SignedIn>
          <SignedOut><RedirectToSignIn /></SignedOut>
        </>
      }/>
    </Routes>
  );
}

export default App;
