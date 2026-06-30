import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFilePath = path.join(__dirname, '../local_db.json');

const initialDB = {
  users: [
    { _id: 'user-mock-1', clerkUserId: 'user_clerk_1', username: 'code_wizard', avatar: '' },
    { _id: 'user-mock-2', clerkUserId: 'user_clerk_2', username: 'ramen_sensei', avatar: '' },
    { _id: 'user-mock-3', clerkUserId: 'user_clerk_3', username: 'nature_explorer', avatar: '' }
  ],
  communities: [
    { _id: 'comm-mock-1', name: 'battlestations', description: 'Futuristic coding workspace setups', bannerUrl: '/images/tech_setup.jpg', iconUrl: '', creator: 'user-mock-1', members: ['user-mock-1'] },
    { _id: 'comm-mock-2', name: 'cooking', description: 'Homemade food recipes and culinary arts', bannerUrl: '/images/gourmet_ramen.jpg', iconUrl: '', creator: 'user-mock-2', members: ['user-mock-2'] },
    { _id: 'comm-mock-3', name: 'nature', description: 'Breathtaking views of the natural world', bannerUrl: '/images/mountain_lake.jpg', iconUrl: '', creator: 'user-mock-3', members: ['user-mock-3'] },
    { _id: 'comm-mock-4', name: 'technology', description: 'Latest news and discussions in tech', bannerUrl: '/images/tech_setup.jpg', iconUrl: '', creator: 'user-mock-1', members: ['user-mock-1'] }
  ],
  posts: [
    // battlestations (comm-mock-1)
    {
      _id: 'post-mock-1',
      title: 'Rate my new dual-monitor futuristic coding workspace setup! 💻',
      body: 'Finally completed my clean build. Got vertical side screens for code and logs, custom ambient LED backlighting, and a sweet mechanical keyboard. What do you think?',
      imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80',
      upvotes: 1420,
      downvotes: 12,
      votes: [],
      author: 'user-mock-1',
      community: 'comm-mock-1',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'post-mock-4',
      title: 'Minimalist Walnut Wood Desk Build 🪵',
      body: 'Decided to go for a natural wood look. Desktop is custom-cut walnut oiled with Osmo polyx, mounted on dual motor standing legs. Keeping cables 100% hidden was a pain but so worth it!',
      imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      upvotes: 450,
      downvotes: 3,
      votes: [],
      author: 'user-mock-1',
      community: 'comm-mock-1',
      createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'post-mock-5',
      title: 'First time trying custom hardline watercooling loop! 💧',
      body: 'Bent the PETG tubes myself. Had to redo three of them due to kinks, but the final leak test passed. Temperatures dropped by 15C under load compared to the old AIO!',
      imageUrl: '',
      upvotes: 280,
      downvotes: 5,
      votes: [],
      author: 'user-mock-1',
      community: 'comm-mock-1',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'post-mock-6',
      title: 'Cozy late-night coding vibe 🌙',
      body: 'Dim ambient orange backlight, rain pattering on the window, and a fresh cup of coffee. The ultimate productive headspace.',
      imageUrl: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80',
      upvotes: 610,
      downvotes: 2,
      votes: [],
      author: 'user-mock-1',
      community: 'comm-mock-1',
      createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
    },

    // cooking (comm-mock-2)
    {
      _id: 'post-mock-2',
      title: 'Spent 8 hours perfecting this homemade tonkotsu ramen. Absolutely worth it! 🍜',
      body: 'The broth was simmered overnight. Chashu pork belly was melt-in-your-mouth tender, and the soft-boiled ajitama eggs were perfectly jammy. Recipe in comments if anyone wants it!',
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
      upvotes: 894,
      downvotes: 4,
      votes: [],
      author: 'user-mock-2',
      community: 'comm-mock-2',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'post-mock-7',
      title: 'Jiggly Japanese Souffle Pancakes! 🥞',
      body: 'Finally got them to rise properly without collapsing! The trick is whipping the egg whites to extremely stiff peaks and cooking them on low heat with a lid + a splash of water for steam.',
      imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
      upvotes: 340,
      downvotes: 1,
      votes: [],
      author: 'user-mock-2',
      community: 'comm-mock-2',
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'post-mock-8',
      title: 'Woodfired Neapolitan Pizza in a portable oven 🍕',
      body: '72-hour cold fermented dough, San Marzano tomatoes, fresh mozzarella, fresh basil, and a drizzle of extra virgin olive oil. Baked at 450C in just 60 seconds!',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      upvotes: 750,
      downvotes: 6,
      votes: [],
      author: 'user-mock-2',
      community: 'comm-mock-2',
      createdAt: new Date(Date.now() - 29 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'post-mock-9',
      title: 'Fluffy Rosemary & Sea Salt Focaccia 🍞',
      body: 'Drenched in high-quality olive oil. The dimples are so satisfying to press down! Super crunchy crust with an incredibly soft, airy interior.',
      imageUrl: '',
      upvotes: 520,
      downvotes: 2,
      votes: [],
      author: 'user-mock-2',
      community: 'comm-mock-2',
      createdAt: new Date(Date.now() - 42 * 60 * 60 * 1000).toISOString()
    },

    // nature (comm-mock-3)
    {
      _id: 'post-mock-3',
      title: 'Woke up at 4 AM to capture this sunrise at Lake Moraine, Alberta. Completely breathtaking.',
      body: 'The mist hovering over the turquoise water with the snow-dusted peaks in the background was a spiritual experience. Highly recommend visiting early to beat the crowds!',
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
      upvotes: 2154,
      downvotes: 18,
      votes: [],
      author: 'user-mock-3',
      community: 'comm-mock-3',
      createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'post-mock-10',
      title: 'Lush green waterfalls of Oregon forest 🌲',
      body: 'Hiked through the mist to find this hidden gem deep in the Columbia River Gorge. The surrounding moss and ferns make it look like a primeval jungle!',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
      upvotes: 890,
      downvotes: 10,
      votes: [],
      author: 'user-mock-3',
      community: 'comm-mock-3',
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'post-mock-11',
      title: 'Joshua Tree under the Milky Way galaxy 🌌',
      body: 'A single 25-second exposure shot during the new moon. The desert sky is incredibly dark once you get far enough away from Palm Springs lights.',
      imageUrl: '',
      upvotes: 1250,
      downvotes: 15,
      votes: [],
      author: 'user-mock-3',
      community: 'comm-mock-3',
      createdAt: new Date(Date.now() - 32 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'post-mock-12',
      title: 'Lavender lines stretching into the Provence sunset 💜',
      body: 'Walking through these fields in southern France smells absolutely heavenly. Captured this during peak bloom in late June.',
      imageUrl: 'https://images.unsplash.com/photo-1500627869374-13cd993b1115?auto=format&fit=crop&w=800&q=80',
      upvotes: 1420,
      downvotes: 11,
      votes: [],
      author: 'user-mock-3',
      community: 'comm-mock-3',
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    },

    // technology (comm-mock-4)
    {
      _id: 'post-mock-13',
      title: 'Is AI replacing junior developer roles or shifting expectations? 🤖',
      body: 'I have noticed a lot of discussion about entry-level devs struggling. In my team, we are not hiring less, but we do expect juniors to be comfortable using AI assistants to write boilerplate, focus more on reading/reviewing code, understanding system architecture, and writing solid test suites. What are your thoughts?',
      imageUrl: '',
      upvotes: 980,
      downvotes: 22,
      votes: [],
      author: 'user-mock-1',
      community: 'comm-mock-4',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'post-mock-14',
      title: 'My review of the new mechanical switch: Holy Panda X ⌨️',
      body: 'Compared to the original Run3 Holy Pandas, these have a slightly rounder tactile bump and less housing wobble. Sound profile is deeper and less clacky. Highly recommend lubing with Krytox 205g0.',
      imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
      upvotes: 310,
      downvotes: 4,
      votes: [],
      author: 'user-mock-1',
      community: 'comm-mock-4',
      createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'post-mock-15',
      title: 'Why Rust is gaining massive adoption in systems programming 🦀',
      body: 'The borrow checker is compile-time magic. You get C/C++ level bare-metal execution speeds without the risk of segmentation faults, use-after-free, or data races in concurrent code. Its no wonder Microsoft, AWS, and Linux are embedding it in their core kernels.',
      imageUrl: '',
      upvotes: 840,
      downvotes: 12,
      votes: [],
      author: 'user-mock-1',
      community: 'comm-mock-4',
      createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'post-mock-16',
      title: 'Hands-on review of the latest lightweight VR headset 🕶️',
      body: 'At just 250g, the comfort level is miles ahead of the Quest or Index. The pancake lenses provide edge-to-edge clarity, although the black levels are not quite as deep as OLED panels. Pass-through distortion is minimal, making AR workspace productivity very viable.',
      imageUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80',
      upvotes: 550,
      downvotes: 8,
      votes: [],
      author: 'user-mock-1',
      community: 'comm-mock-4',
      createdAt: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString()
    }
  ],
  comments: [],
  votes: []
};

function readLocalDB() {
  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, JSON.stringify(initialDB, null, 2));
    return initialDB;
  }
  try {
    return JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
  } catch (err) {
    console.error('Error reading local_db.json, recreating it:', err);
    fs.writeFileSync(dbFilePath, JSON.stringify(initialDB, null, 2));
    return initialDB;
  }
}

function writeLocalDB(data) {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
}

function getCollectionName(modelName) {
  if (modelName === 'User') return 'users';
  if (modelName === 'Community') return 'communities';
  if (modelName === 'Post') return 'posts';
  if (modelName === 'Comment') return 'comments';
  if (modelName === 'Vote') return 'votes';
  return modelName.toLowerCase() + 's';
}

function matchFilter(item, filter) {
  if (!filter || Object.keys(filter).length === 0) return true;
  for (const key in filter) {
    if (key === '$text') {
      const search = filter['$text']['$search'];
      if (!search) continue;
      const q = search.toLowerCase();
      const titleMatch = item.title && item.title.toLowerCase().includes(q);
      const bodyMatch = item.body && item.body.toLowerCase().includes(q);
      if (!titleMatch && !bodyMatch) return false;
      continue;
    }
    const val = filter[key];
    if (val && typeof val === 'object' && val.toString) {
      if (item[key] && item[key].toString() !== val.toString()) return false;
    } else {
      if (item[key] !== val) return false;
    }
  }
  return true;
}

function makeDocument(item, modelName) {
  if (!item) return null;
  const doc = { ...item };
  doc.save = async function() {
    const db = readLocalDB();
    const collectionName = getCollectionName(modelName);
    const index = db[collectionName].findIndex(x => x._id.toString() === doc._id.toString());
    if (index !== -1) {
      const serialized = { ...doc };
      delete serialized.save;
      delete serialized.deleteOne;
      db[collectionName][index] = serialized;
      writeLocalDB(db);
    }
    return doc;
  };
  doc.deleteOne = async function() {
    const db = readLocalDB();
    const collectionName = getCollectionName(modelName);
    db[collectionName] = db[collectionName].filter(x => x._id.toString() !== doc._id.toString());
    writeLocalDB(db);
    return { deletedCount: 1 };
  };
  return doc;
}

class LocalQuery {
  constructor(modelName, data, filter = {}) {
    this.modelName = modelName;
    this.data = data;
    this.filter = filter;
  }

  populate(path, select) {
    if (!this.data) return this;
    const isArray = Array.isArray(this.data);
    const items = isArray ? this.data : [this.data];

    const populatedItems = items.map(item => {
      const cloned = { ...item };
      const refId = cloned[path];
      if (refId) {
        let refModel = '';
        if (path === 'author' || path === 'creator') refModel = 'User';
        else if (path === 'community') refModel = 'Community';

        if (refModel) {
          const db = readLocalDB();
          const collection = db[getCollectionName(refModel)];
          let refObj = collection.find(c => c._id.toString() === refId.toString());
          if (refObj) {
            if (select) {
              const fields = select.split(' ');
              const selected = { _id: refObj._id };
              fields.forEach(f => {
                if (f && f !== '_id') selected[f] = refObj[f];
              });
              cloned[path] = selected;
            } else {
              cloned[path] = refObj;
            }
          }
        }
      }
      return cloned;
    });

    this.data = isArray ? populatedItems : populatedItems[0];
    return this;
  }

  sort(sortObj) {
    if (!this.data || !Array.isArray(this.data)) return this;
    const key = Object.keys(sortObj)[0];
    const order = sortObj[key];
    this.data = [...this.data].sort((a, b) => {
      let valA = a[key];
      let valB = b[key];
      if (key === 'createdAt') {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      if (valA < valB) return order === 1 ? -1 : 1;
      if (valA > valB) return order === 1 ? 1 : -1;
      return 0;
    });
    return this;
  }

  then(onResolve, onReject) {
    return Promise.resolve(this.data).then(onResolve, onReject);
  }

  catch(onReject) {
    return Promise.resolve(this.data).catch(onReject);
  }
}

// Intercept Model static methods to support local database fallback
const originalFind = mongoose.Model.find;
mongoose.Model.find = function(filter) {
  if (global.useLocalDB) {
    const db = readLocalDB();
    const collectionName = getCollectionName(this.modelName);
    const items = (db[collectionName] || []).filter(item => matchFilter(item, filter));
    const docs = items.map(item => makeDocument(item, this.modelName));
    return new LocalQuery(this.modelName, docs, filter);
  }
  return originalFind.call(this, filter);
};

const originalFindOne = mongoose.Model.findOne;
mongoose.Model.findOne = function(filter) {
  if (global.useLocalDB) {
    const db = readLocalDB();
    const collectionName = getCollectionName(this.modelName);
    const item = (db[collectionName] || []).find(item => matchFilter(item, filter));
    const doc = makeDocument(item, this.modelName);
    return new LocalQuery(this.modelName, doc, filter);
  }
  return originalFindOne.call(this, filter);
};

const originalFindById = mongoose.Model.findById;
mongoose.Model.findById = function(id) {
  if (global.useLocalDB) {
    const db = readLocalDB();
    const collectionName = getCollectionName(this.modelName);
    const item = (db[collectionName] || []).find(item => item._id.toString() === (id && id.toString()));
    const doc = makeDocument(item, this.modelName);
    return new LocalQuery(this.modelName, doc);
  }
  return originalFindById.call(this, id);
};

const originalCreate = mongoose.Model.create;
mongoose.Model.create = function(obj) {
  if (global.useLocalDB) {
    const db = readLocalDB();
    const collectionName = getCollectionName(this.modelName);
    const newId = this.modelName.toLowerCase() + '-mock-' + Date.now();
    const newDoc = {
      _id: newId,
      ...obj,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db[collectionName].push(newDoc);
    writeLocalDB(db);
    return Promise.resolve(makeDocument(newDoc, this.modelName));
  }
  return originalCreate.call(this, obj);
};

const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false);
    // Attempt Mongoose connection with a 5s selection timeout so we fail fast and fallback
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected successfully.');

    // Seed communities if none exist
    const communityCount = await mongoose.connection.db.collection('communities').countDocuments();
    if (communityCount === 0) {
      console.log('No communities found in database. Seeding defaults...');
      let userObj = await mongoose.connection.db.collection('users').findOne({});
      let creatorId;
      if (!userObj) {
        const adminUser = {
          username: 'system_admin',
          clerkUserId: 'system_admin_clerk_id',
          avatar: '',
          bio: 'System Admin Account',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        const result = await mongoose.connection.db.collection('users').insertOne(adminUser);
        creatorId = result.insertedId;
      } else {
        creatorId = userObj._id;
      }

      const defaultCommunities = [
        { name: 'battlestations', description: 'Futuristic coding workspace setups', bannerUrl: '/images/tech_setup.jpg', iconUrl: '', creator: creatorId, members: [creatorId], createdAt: new Date(), updatedAt: new Date() },
        { name: 'cooking', description: 'Homemade food recipes and culinary arts', bannerUrl: '/images/gourmet_ramen.jpg', iconUrl: '', creator: creatorId, members: [creatorId], createdAt: new Date(), updatedAt: new Date() },
        { name: 'nature', description: 'Breathtaking views of the natural world', bannerUrl: '/images/mountain_lake.jpg', iconUrl: '', creator: creatorId, members: [creatorId], createdAt: new Date(), updatedAt: new Date() },
        { name: 'technology', description: 'Latest news and discussions in tech', bannerUrl: '/images/tech_setup.jpg', iconUrl: '', creator: creatorId, members: [creatorId], createdAt: new Date(), updatedAt: new Date() }
      ];
      await mongoose.connection.db.collection('communities').insertMany(defaultCommunities);
      console.log('Default communities seeded successfully.');
    }
  } catch (err) {
    console.warn('⚠️ MongoDB connection failed. Falling back to local JSON database.');
    console.error(err.message);
    global.useLocalDB = true;
    readLocalDB(); // ensure file is initialized
  }
};

export default connectDB;