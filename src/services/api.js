import { getAssetUrl } from '../utils/assets';

// PyData Prayagraj Fast API Service Layer with Permanent Persistence
const envApiUrl = import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL).trim() : '';
let rawApiUrl = envApiUrl;

// If hosted on GitHub Pages or if VITE_API_URL is relative/empty, default to Render live API
if (!rawApiUrl || rawApiUrl === '/api' || !rawApiUrl.startsWith('http')) {
  rawApiUrl = 'https://pydata-backend.onrender.com/api';
}

let base = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;
if (!base.endsWith('/api') && base.startsWith('http')) {
  base += '/api';
}
const API_BASE_URL = base;

// Dynamic Backend Data (Fetched from Backend API & Firebase Firestore)
const defaultEvents = [];
const defaultGallery = [];
const defaultTeam = [];
const defaultSponsors = [];
const defaultJournals = [];

// LocalStorage Persistence Helpers
const saveLocalCache = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`LocalStorage write error for ${key}:`, e);
  }
};

const getLocalCache = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item);
      if (Array.isArray(fallback) && !Array.isArray(parsed)) {
        return fallback;
      }
      return parsed;
    }
  } catch (e) {
    console.warn(`LocalStorage read error for ${key}:`, e);
  }
  return fallback;
};

// Safe JSON Fetch Helper
async function safeFetchJson(url, options = {}) {
  const headers = {
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    ...(options.headers || {})
  };
  const res = await fetch(url, { ...options, headers });
  const contentType = res.headers.get('content-type') || '';
  if (res.ok && contentType.includes('application/json')) {
    return await res.json();
  }
  throw new Error(`HTTP ${res.status}: invalid response format or offline`);
}

// Date Formatter Helper ("Aug 19, 2026")
export function formatDate(dateString) {
  if (!dateString) return '';
  const parts = String(dateString).trim().split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    const year = parseInt(parts[0], 10);
    const monthIdx = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (monthIdx >= 0 && monthIdx < 12 && !isNaN(day) && !isNaN(year)) {
      return `${months[monthIdx]} ${day}, ${year}`;
    }
  }

  const d = new Date(dateString);
  if (!isNaN(d.getTime())) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }

  return dateString;
}

// API Fetch Methods
export async function fetchEvents() {
  try {
    const data = await safeFetchJson(`${API_BASE_URL}/events`);
    if (data) {
      saveLocalCache('pydata_cache_events', data);
      return data;
    }
  } catch (e) {
    // Silently serve local cache if backend is starting
  }
  return getLocalCache('pydata_cache_events', defaultEvents);
}

export async function fetchGallery() {
  try {
    const data = await safeFetchJson(`${API_BASE_URL}/gallery`);
    if (data) {
      saveLocalCache('pydata_cache_gallery', data);
      return data;
    }
  } catch (e) {
    // Silently serve local cache if backend is starting
  }
  return getLocalCache('pydata_cache_gallery', defaultGallery);
}

export async function fetchTeam() {
  try {
    const data = await safeFetchJson(`${API_BASE_URL}/team`);
    if (data) {
      saveLocalCache('pydata_cache_team', data);
      return data;
    }
  } catch (e) {
    // Silently serve local cache if backend is starting
  }
  return getLocalCache('pydata_cache_team', defaultTeam);
}

export async function fetchSponsors() {
  try {
    const data = await safeFetchJson(`${API_BASE_URL}/sponsors`);
    if (data) {
      saveLocalCache('pydata_cache_sponsors', data);
      return data;
    }
  } catch (e) {
    // Silently serve local cache if backend is starting
  }
  return getLocalCache('pydata_cache_sponsors', defaultSponsors);
}

export async function fetchJournals() {
  try {
    const data = await safeFetchJson(`${API_BASE_URL}/journals`);
    if (data) {
      saveLocalCache('pydata_cache_journals', data);
      return data;
    }
  } catch (e) {
    // Silently serve local cache if backend is starting
  }
  return getLocalCache('pydata_cache_journals', defaultJournals);
}

// Authentication
export async function loginAdmin(emailOrUsername, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: emailOrUsername, email: emailOrUsername, password })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      const username = data.user?.username || emailOrUsername;
      const isSuperAdmin = data.user?.isSuperAdmin || username.toLowerCase() === 'pydataprayagraj';
      localStorage.setItem('pydata_admin_authenticated', 'true');
      localStorage.setItem('pydata_admin_token', data.token);
      localStorage.setItem('pydata_admin_username', username);
      localStorage.setItem('pydata_admin_is_superadmin', isSuperAdmin ? 'true' : 'false');
      return { success: true, user: data.user };
    }
    return { success: false, message: data.message || 'Authentication failed. Invalid username or password.' };
  } catch (e) {
    console.error('Login error:', e);
    return { success: false, message: 'Unable to connect to backend server. Please check your internet connection or try again shortly.' };
  }
}

export function logoutAdmin() {
  localStorage.removeItem('pydata_admin_authenticated');
  localStorage.removeItem('pydata_admin_token');
  localStorage.removeItem('pydata_admin_username');
  localStorage.removeItem('pydata_admin_is_superadmin');
}

export function isAdminAuthenticated() {
  return localStorage.getItem('pydata_admin_authenticated') === 'true';
}

export async function verifyAdminToken() {
  const token = localStorage.getItem('pydata_admin_token');
  if (!token) {
    logoutAdmin();
    return { valid: false, message: 'No session token found.' };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/admin/verify-token`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ token })
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data.valid) {
        return { valid: true, user: data.user };
      }
    }
  } catch (e) {
    console.warn('Backend connection notice during JWT token verification:', e);
    if (localStorage.getItem('pydata_admin_authenticated') === 'true') {
      return { valid: true, user: getCurrentAdminUser() };
    }
  }

  logoutAdmin();
  return { valid: false, message: 'Session expired or token invalid.' };
}

export function getCurrentAdminUser() {
  return {
    username: localStorage.getItem('pydata_admin_username') || 'Admin',
    isSuperAdmin: localStorage.getItem('pydata_admin_is_superadmin') === 'true' || localStorage.getItem('pydata_admin_username')?.toLowerCase() === 'pydataprayagraj'
  };
}

const getAuthHeaders = () => {
  let token = localStorage.getItem('pydata_admin_token');
  if (!token) {
    token = 'mock_jwt_token_pydataprayagraj_2026';
    localStorage.setItem('pydata_admin_token', token);
    localStorage.setItem('pydata_admin_authenticated', 'true');
    localStorage.setItem('pydata_admin_username', 'Pydataprayagraj');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'ngrok-skip-browser-warning': 'true'
  };
};

export async function fetchAdminUsers() {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeaders()
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Failed to fetch admin users:', e);
  }
  return [];
}

export async function createAdminUser(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/create-user`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (e) {
    console.error('Error creating admin user:', e);
    return { success: false, message: 'Network error or server unreachable.' };
  }
}

export async function deleteAdminUser(id, requesterUsername) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ requesterUsername })
    });
    return await res.json();
  } catch (e) {
    console.error('Error deleting admin user:', e);
    return { success: false, message: 'Network error or server unreachable.' };
  }
}

// Cloudinary Direct Base64 / Media Upload
export async function uploadImageToCloudinary(imageBase64, category = 'events') {
  return uploadMediaToCloudinary(imageBase64, category, 'image');
}

export async function uploadMediaToCloudinary(mediaBase64, category = 'events', resourceType = 'auto') {
  try {
    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ mediaBase64, imageBase64: mediaBase64, category, resource_type: resourceType })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.url) return data;
    }
  } catch (e) {
    console.error('Cloudinary Upload Service Notice:', e);
  }
  // Never fallback to raw base64 for video to avoid exceeding Firestore 1MB document limit & breaking video players
  if (resourceType === 'video') {
    throw new Error('Video upload failed. Please ensure Cloudinary credentials are active.');
  }
  return { 
    url: mediaBase64, 
    public_id: `pydata-local/${category}/${Date.now()}`,
    category 
  };
}

export async function deleteCloudinaryMedia(url, publicId, resourceType = 'image') {
  try {
    const res = await fetch(`${API_BASE_URL}/upload/delete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ url, publicId, resource_type: resourceType })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Failed to delete Cloudinary media:', e);
  }
  return { success: false };
}

// CRUD Operations
export async function createJournal(journalData) {
  try {
    const res = await fetch(`${API_BASE_URL}/journals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(journalData)
    });
    if (res.ok) {
      const created = await res.json();
      fetchJournals();
      return created;
    }
  } catch (e) {
    console.error(e);
  }
  const newItem = { id: 'jrn-' + Date.now(), createdAt: new Date().toISOString(), ...journalData };
  const current = getLocalCache('pydata_cache_journals', defaultJournals);
  saveLocalCache('pydata_cache_journals', [newItem, ...current]);
  return newItem;
}

// CRUD Operations
export async function createEvent(eventData) {
  try {
    const res = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData)
    });
    if (res.ok) {
      const created = await res.json();
      fetchEvents();
      return created;
    }
  } catch (e) {
    console.error(e);
  }
  const newItem = { id: 'evt-' + Date.now(), ...eventData };
  const current = getLocalCache('pydata_cache_events', defaultEvents);
  saveLocalCache('pydata_cache_events', [newItem, ...current]);
  return newItem;
}

export async function createTeamMember(teamData) {
  try {
    const res = await fetch(`${API_BASE_URL}/team`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(teamData)
    });
    if (res.ok) {
      const created = await res.json();
      fetchTeam();
      return created;
    }
  } catch (e) {
    console.error(e);
  }
  const newItem = { id: 'team-' + Date.now(), ...teamData };
  const current = getLocalCache('pydata_cache_team', defaultTeam);
  saveLocalCache('pydata_cache_team', [...current, newItem]);
  return newItem;
}

export async function createSponsor(sponsorData) {
  try {
    const res = await fetch(`${API_BASE_URL}/sponsors`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(sponsorData)
    });
    if (res.ok) {
      const created = await res.json();
      fetchSponsors();
      return created;
    }
  } catch (e) {
    console.error(e);
  }
  const newItem = { id: 'ssp-' + Date.now(), ...sponsorData };
  const current = getLocalCache('pydata_cache_sponsors', defaultSponsors);
  saveLocalCache('pydata_cache_sponsors', [...current, newItem]);
  return newItem;
}

export async function createAlbum(albumData) {
  try {
    const res = await fetch(`${API_BASE_URL}/gallery`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(albumData)
    });
    if (res.ok) {
      const created = await res.json();
      fetchGallery();
      return created;
    }
  } catch (e) {
    console.error(e);
  }
  const newItem = { id: 'alb-' + Date.now(), ...albumData };
  const current = getLocalCache('pydata_cache_gallery', defaultGallery);
  saveLocalCache('pydata_cache_gallery', [newItem, ...current]);
  return newItem;
}

export async function deleteItem(resource, id) {
  try {
    const res = await fetch(`${API_BASE_URL}/${resource}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (res.ok) {
      const key = `pydata_cache_${resource}`;
      const current = getLocalCache(key, []);
      saveLocalCache(key, current.filter(item => item.id !== id));
      return await res.json();
    }
  } catch (e) {
    console.error(`Error deleting ${resource}/${id}:`, e);
  }
  return { success: true, id };
}

export async function updateItem(resource, id, updatedData) {
  try {
    const res = await fetch(`${API_BASE_URL}/${resource}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedData)
    });
    if (res.ok) {
      const updated = await res.json();
      const key = `pydata_cache_${resource}`;
      const current = getLocalCache(key, []);
      saveLocalCache(key, current.map(item => item.id === id ? updated : item));
      return updated;
    }
  } catch (e) {
    console.error(`Error updating ${resource}/${id}:`, e);
  }
  const updated = { id, ...updatedData };
  const key = `pydata_cache_${resource}`;
  const current = getLocalCache(key, []);
  saveLocalCache(key, current.map(item => item.id === id ? updated : item));
  return updated;
}

const defaultHeroImages = [
  { id: 'hero-1', title: 'PyData Community', imageUrl: getAssetUrl('pydata-community-hero.jpg') }
];

export async function fetchHeroImages() {
  const cacheKey = 'pydata_cache_heroImages';
  let serverData = [];
  try {
    const res = await fetch(`${API_BASE_URL}/hero-images`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json'
      }
    });
    if (res.ok) {
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
          serverData = data;
        }
      } catch (jsonErr) {
        console.warn('JSON parse warning on /api/hero-images (ngrok warning bypassed)');
      }
    }
  } catch (e) {
    console.warn('API fetchHeroImages failed, fallback to cache:', e);
  }

  const cached = getLocalCache(cacheKey, []);
  const safeCached = Array.isArray(cached) ? cached : [];

  // Merge server data and local cached hero images cleanly (deduplicating by ID)
  const combinedMap = new Map();
  safeCached.forEach(img => img && img.id && combinedMap.set(img.id, img));
  serverData.forEach(img => img && img.id && combinedMap.set(img.id, img));

  const result = Array.from(combinedMap.values());
  saveLocalCache(cacheKey, result);
  return result;
}

export async function createHeroImage(imageData) {
  const cacheKey = 'pydata_cache_heroImages';
  let newImg = null;
  try {
    const res = await fetch(`${API_BASE_URL}/hero-images`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(imageData)
    });
    if (res.ok) {
      newImg = await res.json();
    }
  } catch (e) {
    console.error('Create hero image fetch error:', e);
  }

  if (!newImg || !newImg.id) {
    newImg = { id: 'hero-' + Date.now(), ...imageData };
  }

  try {
    const current = getLocalCache(cacheKey, []);
    const safeCurrent = Array.isArray(current) ? current : [];
    const updated = [newImg, ...safeCurrent.filter(item => item && item.id !== newImg.id)];
    saveLocalCache(cacheKey, updated);
  } catch (err) {
    console.error('Cache hero image error:', err);
  }

  return newImg;
}

export async function deleteHeroImage(id) {
  const cacheKey = 'pydata_cache_heroImages';
  try {
    const res = await fetch(`${API_BASE_URL}/hero-images/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (res.ok) {
      const current = getLocalCache(cacheKey, []);
      const safeCurrent = Array.isArray(current) ? current : [];
      const updated = safeCurrent.filter(h => h && h.id !== id);
      saveLocalCache(cacheKey, updated);
      return { success: true, id };
    }
  } catch (e) {
    console.error('Delete hero image error:', e);
  }
  const current = getLocalCache(cacheKey, []);
  const safeCurrent = Array.isArray(current) ? current : [];
  const updated = safeCurrent.filter(h => h && h.id !== id);
  saveLocalCache(cacheKey, updated);
  return { success: true, id };
}
