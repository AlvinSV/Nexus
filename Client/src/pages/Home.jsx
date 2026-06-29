import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import Modal from '../components/Modal';
import CreatePostModal from "../components/CreatePostModal";

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
      username: 'wanderlust_explorer',
      avatar: ''
    },
    community: {
      name: 'nature'
    }
  }
];

function Home() {
  const { getToken } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');

  const [showCreatePost, setShowCreatePost] = useState(false);
  
  // Custom theme and modal support
  const [theme, setTheme] = useState(localStorage.getItem('nexus-theme') || 'dark');
  const [activeModal, setActiveModal] = useState(null); // 'help' | 'about' | null

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nexus-theme', theme);
  }, [theme]);
  
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
          onAboutClick={() => setActiveModal('about')} 
          onHelpClick={() => setActiveModal('help')} 
        />

        {/* Feed Column */}
        <section className="feed-container">
          <div className="welcome-panel">
            <h2 className="welcome-title">Welcome to your Nexus dashboard!</h2>
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
              No posts match your search query.
            </div>
          ) : (
            filteredPosts.map(post => (
              <PostCard 
                key={post._id} 
                post={post} 
                userVote={votedStates[post._id]} 
                onVote={handleVote} 
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
         onClose={() => setShowCreatePost(false)}
         onPostCreated={(newPost) => {
          setPosts(prev => [newPost, ...prev]);
         }}
      />
    </div>
  );
}

export default Home;
