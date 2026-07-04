const fs = require('fs').promises;
const path = require('path');

const dbDir = path.join(__dirname, '../data');
const filePath = path.join(dbDir, 'users.json');

let writeQueue = Promise.resolve();

async function initDb() {
  try {
    await fs.mkdir(dbDir, { recursive: true });
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

async function readData() {
  await initDb();
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return [];
  }
}

async function writeData(data) {
  return new Promise((resolve, reject) => {
    writeQueue = writeQueue.then(async () => {
      try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
}

const User = {
  async findAll() {
    return await readData();
  },

  async findById(id) {
    const users = await readData();
    return users.find(u => u.id === id);
  },

  async findByUsername(username) {
    const users = await readData();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase());
  },

  async findByEmail(email) {
    const users = await readData();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  async create(userData) {
    const users = await readData();
    const newUser = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      refreshToken: null
    };
    users.push(newUser);
    await writeData(users);
    return newUser;
  },

  async update(id, updates) {
    const users = await readData();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    users[index] = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await writeData(users);
    return users[index];
  },

  async delete(id) {
    const users = await readData();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;

    users.splice(index, 1);
    await writeData(users);
    return true;
  }
};

module.exports = { User };
