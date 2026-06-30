import React, { useState, useEffect, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import Modal from '../components/Modal';
import CreatePostModal from "../components/CreatePostModal";
import CreateCommunityModal from "../components/CreateCommunityModal";
import PostDetailsModal from "../components/PostDetailsModal";

// Default mock posts loaded with generated high-quality images
const DEFAULT_POSTS = [
  {
    _id: 'mock-1',
    title: 'Rate my new dual-monitor futuristic coding workspace setup! 💻',
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
    title: 'Woke up at 4 AM to capture this sunrise at Lake Moraine, Alberta. Completely breathtaking.',
    body: 'The mist hovering over the turquoise water with the snow-dusted peaks in the background was a spiritual experience. Highly recommend visiting early to beat the crowds!',
    imageUrl: '/images/mountain_lake.jpg',
    upvotes: 2154,
    downvotes: 18,
    score: 2136,
    commentsCount: 142,
    createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    author: {
      username: 'nature_explorer',
      avatar: ''
    },
    community: {
      name: 'nature'
    }
  }
];

const getCommunityColor = (name = "") => {
  const safeName = name || "";
  const colors = ["#ff4500", "#8a2be2", "#00d2c4", "#1da1f2", "#ffb000", "#00dd66", "#e22b8a"];
  let hash = 0;
  for (let i = 0; i < safeName.length; i++) {
    hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

function Home() {
  const { getToken } = useAuth();
  const getSafeToken = useCallback(async () => {
    try {
      const t = await getToken();
      return t || 'dummy-token';
    } catch (e) {
      console.warn('Clerk getToken failed, using dummy token in development:', e);
      return 'dummy-token';
    }
  }, [getToken]);
  const { user: clerkUser } = useUser();
  const [currentUser, setCurrentUser] = useState(null);

  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('new');
  const [searchQuery, setSearchQuery] = useState('');

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [activeCommunity, setActiveCommunity] = useState(null);
  
  // Custom theme and modal support
  const [theme, setTheme] = useState(localStorage.getItem('nexus-theme') || 'dark');
  const [activeModal, setActiveModal] = useState(null); // 'help' | 'about' | null

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nexus-theme', theme);
  }, [theme]);
  
  // Track votes locally for responsive UI
  const [votedStates, setVotedStates] = useState({}); // { postId: 'up' | 'down' | null }
  const [selectedPost, setSelectedPost] = useState(null);

  // Fetch user votes on login
  useEffect(() => {
    if (!currentUser) {
      setVotedStates({});
      return;
    }
    const fetchUserVotes = async () => {
      try {
        const token = await getSafeToken();
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/votes/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVotedStates(res.data || {});
      } catch (err) {
        console.error('Failed to fetch user votes:', err);
      }
    };
    fetchUserVotes();
  }, [currentUser, getSafeToken]);

  // Sync Clerk User with MongoDB
  useEffect(() => {
    if (!clerkUser) return;
    const syncUserToDB = async () => {
      try {
        const token = await getSafeToken();
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/users/sync`,
          {
            clerkUserId: clerkUser.id,
            username: clerkUser.username || clerkUser.firstName || 'user_' + clerkUser.id.substring(0, 5),
            avatar: clerkUser.imageUrl || ''
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setCurrentUser(res.data);
      } catch (err) {
        console.error('Failed to sync user:', err);
      }
    };
    syncUserToDB();
  }, [clerkUser, getSafeToken]);

  // Load communities
  const fetchCommunities = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/communities`);
      setCommunities(response.data);
    } catch (err) {
      console.error('Failed to fetch communities:', err);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  // Load and merge posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const token = await getSafeToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        let url = `${import.meta.env.VITE_API_URL}/api/posts`;
        if (activeCommunity) {
          url = `${import.meta.env.VITE_API_URL}/api/posts/community/${activeCommunity._id}`;
        }
        
        const response = await axios.get(url, { headers });
        
        if (response.data && response.data.length > 0) {
          const dbPosts = response.data.map(p => ({
            ...p,
            score: (p.upvotes || 0) - (p.downvotes || 0),
            commentsCount: p.commentsCount || 0
          }));
          setPosts(dbPosts);
        } else {
          if (activeCommunity) {
            setPosts([]);
          } else {
            setPosts(DEFAULT_POSTS);
          }
        }
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        if (activeCommunity) {
          setPosts([]);
        } else {
          setPosts(DEFAULT_POSTS);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [getSafeToken, activeCommunity]);

  // Handle Join/Leave Community
  const handleJoinLeaveCommunity = async () => {
    if (!activeCommunity || !currentUser || !currentUser._id) return;
    const isJoined = activeCommunity.members && activeCommunity.members.some(m => {
      const memberId = m && (m._id || m);
      return memberId && memberId.toString() === currentUser._id.toString();
    });
    const url = `${import.meta.env.VITE_API_URL}/api/communities/${activeCommunity._id}/${isJoined ? 'leave' : 'join'}`;
    
    try {
      const token = await getSafeToken();
      await axios.put(url, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updatedMembers = isJoined 
        ? activeCommunity.members.filter(m => {
            const memberId = m && (m._id || m);
            return memberId && memberId.toString() !== currentUser._id.toString();
          })
        : [...(activeCommunity.members || []), currentUser._id];
        
      const updatedCommunity = {
        ...activeCommunity,
        members: updatedMembers
      };
      
      setActiveCommunity(updatedCommunity);
      setCommunities(prev => prev.map(c => c._id === activeCommunity._id ? updatedCommunity : c));
    } catch (err) {
      console.error('Failed to join/leave community:', err);
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  // Handle Delete Post
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = await getSafeToken();
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(prev => prev.filter(p => p._id !== postId));
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert(err.response?.data?.message || 'Failed to delete post');
    }
  };

  // Handle voting toggle
  const handleVote = async (postId, type) => {
    try {
      const token = await getSafeToken();
      if (!token) {
        alert("Please sign in to vote!");
        return;
      }
      
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/votes`,
        { postId, type },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const { upvotes, downvotes } = res.data;

      // Update posts locally with real score
      setPosts(currentPosts => 
        currentPosts.map(post => {
          if (post._id !== postId) return post;
          return {
            ...post,
            upvotes,
            downvotes,
            score: upvotes - downvotes
          };
        })
      );

      // Update vote states map
      setVotedStates(prev => {
        const currentVote = prev[postId];
        const newVote = currentVote === type ? null : type;
        return {
          ...prev,
          [postId]: newVote
        };
      });
    } catch (err) {
      console.error('Failed to vote:', err);
      alert(err.response?.data?.message || 'Failed to submit vote');
    }
  };

  // Sort and Filter Posts
  const filteredPosts = posts
    .filter(post => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      const communityName = post.community && (post.community.name || post.community);
      const communityMatch = typeof communityName === 'string' && communityName.toLowerCase().includes(query);
      return (
        post.title.toLowerCase().includes(query) ||
        post.body.toLowerCase().includes(query) ||
        communityMatch
      );
    })
    .sort((a, b) => {
      if (filter === 'new') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return b.score - a.score;
    });

  return (
    <div className="app-container">
      {/* Navbar Header */}
      <Navbar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        theme={theme} 
        setTheme={setTheme} 
      />

      {/* Main Container Grid */}
      <main className="main-content">
        {/* Sidebar */}
        <Sidebar 
          communities={communities}
          currentUserId={currentUser?._id}
          activeCommunity={activeCommunity}
          onCommunityClick={(community) => setActiveCommunity(community)}
          onHomeFeedClick={() => setActiveCommunity(null)}
          onStartCommunityClick={() => setShowCreateCommunity(true)}
          onAboutClick={() => setActiveModal('about')} 
          onHelpClick={() => setActiveModal('help')} 
        />

        {/* Feed Column */}
        <section className="feed-container">
          {activeCommunity ? (
            <div className="community-profile-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
              {/* Banner */}
              <div style={{ 
                height: '140px', 
                width: '100%', 
                backgroundImage: activeCommunity.bannerUrl ? `url(${activeCommunity.bannerUrl})` : 'linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <button 
                  className="btn-outline" 
                  onClick={() => setActiveCommunity(null)} 
                  style={{ position: 'absolute', top: '16px', left: '16px', padding: '6px 12px', fontSize: '12.5px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(9, 10, 15, 0.65)', backdropFilter: 'blur(4px)', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '4px', borderRadius: '20px' }}
                >
                  ← Back to Feed
                </button>
              </div>

              {/* Detail Content */}
              <div style={{ padding: '16px 24px 24px', display: 'flex', position: 'relative', flexDirection: 'column', gap: '12px' }}>
                
                {/* Overlapping Icon */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', marginTop: '-56px', position: 'relative', zIndex: '10' }}>
                  {activeCommunity.iconUrl ? (
                    <img 
                      src={activeCommunity.iconUrl} 
                      alt="" 
                      style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid var(--bg-main)', background: 'var(--bg-main)', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '50%', 
                      border: '4px solid var(--bg-main)', 
                      background: `linear-gradient(135deg, ${getCommunityColor(activeCommunity.name)} 0%, #1c1d26 100%)`, 
                      color: 'white', 
                      fontSize: '32px', 
                      fontWeight: '800', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontFamily: 'var(--font-heading)'
                    }}>
                      {activeCommunity.name ? activeCommunity.name[0].toUpperCase() : '?'}
                    </div>
                  )}
                  
                  <div style={{ paddingBottom: '4px' }}>
                    <h2 className="welcome-title" style={{ fontSize: '26px', margin: 0, fontFamily: 'var(--font-heading)' }}>
                      r/{activeCommunity.name}
                    </h2>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                      {(activeCommunity.members || []).length} member{activeCommunity.members?.length === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>

                {/* Description and Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginTop: '8px' }}>
                  <p className="welcome-text" style={{ flex: '1 1 350px', fontSize: '14.5px', color: 'var(--text-main)', margin: 0, lineHeight: '1.6' }}>
                    {activeCommunity.description}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-end' }}>
                    <button 
                      className="btn-outline" 
                      onClick={handleJoinLeaveCommunity}
                      style={{ minWidth: '100px', justifyContent: 'center', borderRadius: '20px', padding: '8px 20px' }}
                    >
                      {activeCommunity.members && activeCommunity.members.some(m => {
                        const memberId = m && (m._id || m);
                        return memberId && currentUser && currentUser._id && memberId.toString() === currentUser._id.toString();
                      }) ? 'Leave' : 'Join'}
                    </button>
                    <button 
                      className="btn-primary" 
                      onClick={() => setShowCreatePost(true)}
                      style={{ borderRadius: '20px', padding: '8px 24px', background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)' }}
                    >
                      Create Post
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="welcome-panel">
              <h2 className="welcome-title">Welcome to your Nexus dashboard!</h2>
              <p className="welcome-text">
                This is a modern community forum built on the MERN stack. We have pre-populated your home feed with some high-quality community posts to demonstrate the visual capabilities. You can vote, search, filter, and view posts!
              </p>
            </div>
          )}

          <div className="feed-header">
            <h2 className="feed-title">
              {searchQuery 
                ? `Search Results for "${searchQuery}"` 
                : activeCommunity 
                  ? `r/${activeCommunity.name} Feed` 
                  : 'Home Feed'}
            </h2>
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

              <button
                className="filter-btn"
                onClick={() => setShowCreatePost(true)}
              >
                + Create Post
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Loading posts...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No posts found in this feed.
            </div>
          ) : (
            filteredPosts.map(post => (
              <PostCard 
                key={post._id} 
                post={post} 
                communities={communities}
                currentUser={currentUser}
                userVote={votedStates[post._id]} 
                onVote={handleVote} 
                onDelete={handleDeletePost}
                onPostClick={(p) => setSelectedPost(p)}
                onCommunityClick={(communityRef) => {
                  if (!communityRef) return;
                  const targetId = communityRef._id || communityRef;
                  const targetName = communityRef.name;
                  const fullCommunity = communities.find(
                    (c) => (targetId && c._id.toString() === targetId.toString()) || (targetName && c.name === targetName)
                  );
                  if (fullCommunity) {
                    setActiveCommunity(fullCommunity);
                  }
                }}
              />
            ))
          )}
        </section>
      </main>

      {/* About Modal overlay */}
      <Modal 
        isOpen={activeModal === 'about'} 
        onClose={() => setActiveModal(null)} 
        title="About Nexus"
      >
        <p><strong>Nexus</strong> is a premium, community-driven forum board built on the MERN stack (MongoDB, Express, React, Node.js).</p>
        <p>It provides a modern alternative to platforms like Reddit, incorporating Clerk for authentication, upvote/downvote interactions, and high-fidelity media rendering.</p>
        <p>Developed with ❤️ as a pair programming project.</p>
      </Modal>

      {/* Help Modal overlay */}
      <Modal 
        isOpen={activeModal === 'help'} 
        onClose={() => setActiveModal(null)} 
        title="Help & Guide"
      >
        <p>Welcome to the Nexus Help Center! Here are some tips to get you started:</p>
        <ul>
          <li><strong>Voting</strong>: Use the up and down arrows on the left of each post to upvote or downvote.</li>
          <li><strong>Search</strong>: Use the search bar in the header to filter posts dynamically by title, description, or community tags.</li>
          <li><strong>Theme</strong>: Toggle light and dark mode using the ☀️/🌙 icon next to your profile picture in the header.</li>
          <li><strong>Profile</strong>: Click on your avatar to access your Clerk profile settings or sign out.</li>
        </ul>
        <p>For additional support or bug reporting, contact the system administrator.</p>
      </Modal>

      <CreatePostModal
         isOpen={showCreatePost}
         defaultCommunityId={activeCommunity?._id}
         communities={communities}
         onClose={() => setShowCreatePost(false)}
         onPostCreated={(newPost) => {
           const formattedPost = {
             ...newPost,
             score: (newPost.upvotes || 0) - (newPost.downvotes || 0),
             commentsCount: newPost.commentsCount || 0
           };
           const postCommunityId = newPost.community && (newPost.community._id || newPost.community);
           const activeCommunityId = activeCommunity && activeCommunity._id;
           if (!activeCommunityId || (postCommunityId && postCommunityId.toString() === activeCommunityId.toString())) {
             setPosts(prev => [formattedPost, ...prev]);
           }
         }}
      />

      <CreateCommunityModal
         isOpen={showCreateCommunity}
         onClose={() => setShowCreateCommunity(false)}
         onCommunityCreated={(newCommunity) => {
           setCommunities(prev => [...prev, newCommunity]);
           setActiveCommunity(newCommunity); // auto navigate to new community
         }}
      />

      <PostDetailsModal
         isOpen={!!selectedPost}
         post={selectedPost}
         communities={communities}
         onClose={() => setSelectedPost(null)}
         onCommentAdded={(postId) => {
           setPosts(currentPosts => 
             currentPosts.map(post => {
               if (post._id !== postId) return post;
               return {
                 ...post,
                 commentsCount: (post.commentsCount || 0) + 1
               };
             })
           );
         }}
      />
    </div>
  );
}

export default Home;
