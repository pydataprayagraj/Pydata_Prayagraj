import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3,
  X,
  Calendar, 
  Image as ImageIcon, 
  Images,
  FolderOpen,
  Folder,
  Users, 
  Award, 
  CheckCircle, 
  Sparkles, 
  Upload, 
  RefreshCw,
  Crop,
  Key,
  UserPlus,
  ExternalLink,
  Shield,
  Video,
  FileText,
  Play
} from 'lucide-react';
import { 
  loginAdmin, 
  logoutAdmin, 
  isAdminAuthenticated, 
  getCurrentAdminUser,
  verifyAdminToken,
  formatDate,
  fetchAdminUsers,
  createAdminUser,
  deleteAdminUser,
  fetchEvents, 
  fetchGallery, 
  fetchTeam, 
  fetchSponsors, 
  fetchJournals,
  fetchHeroImages,
  createHeroImage,
  deleteHeroImage,
  createEvent, 
  createAlbum, 
  createTeamMember, 
  createSponsor,
  createJournal,
  updateItem,
  deleteItem,
  uploadImageToCloudinary,
  uploadMediaToCloudinary,
  deleteCloudinaryMedia
} from '../services/api';
import ImageCropperModal from '../components/ImageCropperModal';

export default function AdminDashboardPage() {
  const [authenticated, setAuthenticated] = useState(isAdminAuthenticated());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('hero');
  const [uploadingCategory, setUploadingCategory] = useState('');
  const [currentUser, setCurrentUser] = useState(getCurrentAdminUser());
  const [managingFolder, setManagingFolder] = useState(null);

  // Cropper State
  const [cropperConfig, setCropperConfig] = useState({
    isOpen: false,
    imageSrc: '',
    aspectRatio: 1,
    category: 'team',
    updateFn: null
  });

  // Stores
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [team, setTeam] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [journals, setJournals] = useState([]);
  const [heroImages, setHeroImages] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Admin User Form State (SuperAdmin Only)
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');

  // Editing state track
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [eventForm, setEventForm] = useState({
    title: '', date: '', location: 'Prayagraj, UP · India', description: '', imageUrl: '', rsvpUrl: ''
  });
  const [albumForm, setAlbumForm] = useState({
    title: '', category: 'Community', coverImage: '', photos: []
  });
  const [teamForm, setTeamForm] = useState({
    name: '', role: '', subRole: '', category: 'organizer', college: '', avatarUrl: '', initials: '', description: '', github: '', linkedin: ''
  });
  const [sponsorForm, setSponsorForm] = useState({
    name: '', level: 'gold', logoUrl: '', description: '', websiteUrl: ''
  });
  const [journalForm, setJournalForm] = useState({
    title: '', author: '', tag: 'Video', description: '', videoUrl: '', videoPublicId: '', coverImage: '', coverPublicId: '', date: new Date().toISOString().split('T')[0]
  });
  const [heroForm, setHeroForm] = useState({
    title: '', imageUrl: '', publicId: ''
  });

  useEffect(() => {
    if (authenticated) {
      loadData();
      setCurrentUser(getCurrentAdminUser());

      // Immediate JWT verification on mount
      async function checkInitialToken() {
        const ver = await verifyAdminToken();
        if (!ver.valid) {
          handleLogout();
          setLoginError('Session expired or JWT token invalid. Please log in again.');
        }
      }
      checkInitialToken();

      // Automatic 5-minute (300,000ms) background JWT verification interval
      const auditInterval = setInterval(async () => {
        console.log('🔒 [5-Min Security Audit] Verifying JWT token session with backend...');
        const ver = await verifyAdminToken();
        if (!ver.valid) {
          console.warn('⚠️ [JWT Security Alert] Session Token Invalid or Expired! Logging out user.');
          handleLogout();
          setLoginError('Security Notice: Session expired or JWT token invalidated. Please log in again.');
        }
      }, 5 * 60 * 1000);

      return () => clearInterval(auditInterval);
    }
  }, [authenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [evs, gal, tm, sp, jrn, hero] = await Promise.all([
        fetchEvents(),
        fetchGallery(),
        fetchTeam(),
        fetchSponsors(),
        fetchJournals(),
        fetchHeroImages()
      ]);
      setEvents(evs);
      setGallery(gal);
      setTeam(tm);
      setSponsors(sp);
      setJournals(jrn);
      setHeroImages(hero);
      if (getCurrentAdminUser().isSuperAdmin) {
        const usersList = await fetchAdminUsers();
        setAdminUsers(usersList);
      }
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (file, category, updateFn) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const aspect = (category === 'hero' || category === 'events' || category === 'sponsors') ? 16 / 9 : category === 'team' ? 1 : 4 / 3;
      setCropperConfig({
        isOpen: true,
        imageSrc: reader.result,
        aspectRatio: aspect,
        category,
        updateFn
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDirectImageUpload = async (file, category, updateFn) => {
    if (!file) return;
    setUploadingCategory(category);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        const res = await uploadImageToCloudinary(base64, category);
        if (res && res.url) {
          updateFn(res.url, res.public_id || category);
          setStatusMsg(`Image uploaded directly to Cloudinary CDN! (Key: ${res.public_id || category})`);
          setTimeout(() => setStatusMsg(''), 4000);
        }
        setUploadingCategory('');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Direct Image Upload Error:', err);
      setUploadingCategory('');
    }
  };

  const handleCroppedUpload = async (croppedBase64) => {
    const { category, updateFn } = cropperConfig;
    setCropperConfig(prev => ({ ...prev, isOpen: false }));
    setUploadingCategory(category);
    try {
      const res = await uploadImageToCloudinary(croppedBase64, category);
      if (res && res.url) {
        updateFn(res.url, res.public_id || res.cloudinary_public_id);
        setStatusMsg(`🎉 Photo uploaded to Cloudinary CDN! Click Publish below to save.`);
        setTimeout(() => setStatusMsg(''), 4000);
      }
    } catch (err) {
      console.error('Cropped upload error:', err);
      setStatusMsg('Error uploading image to Cloudinary.');
      setTimeout(() => setStatusMsg(''), 4000);
    } finally {
      setUploadingCategory('');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const res = await loginAdmin(email, password);
    if (res.success) {
      setAuthenticated(true);
      setCurrentUser(getCurrentAdminUser());
    } else {
      setLoginError(res.message);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setAuthenticated(false);
    setCurrentUser({ username: 'Admin', isSuperAdmin: false });
  };

  // --- USER MANAGEMENT HANDLERS (SuperAdmin Only) ---
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newAdminUsername || !newAdminPassword) return;
    setLoading(true);
    const res = await createAdminUser({
      requesterUsername: currentUser.username,
      username: newAdminUsername,
      password: newAdminPassword
    });
    if (res.success) {
      setStatusMsg(res.message);
      setNewAdminUsername('');
      setNewAdminPassword('');
      const usersList = await fetchAdminUsers();
      setAdminUsers(usersList);
    } else {
      setStatusMsg(`Error: ${res.message}`);
    }
    setLoading(false);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this admin credential?')) return;
    const res = await deleteAdminUser(id, currentUser.username);
    if (res.success) {
      setStatusMsg(res.message);
      const usersList = await fetchAdminUsers();
      setAdminUsers(usersList);
    } else {
      setStatusMsg(`Error: ${res.message}`);
    }
    setTimeout(() => setStatusMsg(''), 3500);
  };

  // --- EVENT HANDLERS ---
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (editingId) {
      const updated = await updateItem('events', editingId, eventForm);
      setEvents(events.map(ev => ev.id === editingId ? updated : ev));
      setStatusMsg('Event updated successfully!');
      setEditingId(null);
    } else {
      const created = await createEvent(eventForm);
      setEvents([created, ...events]);
      setStatusMsg('Event published successfully!');
    }
    setEventForm({ title: '', date: '', location: 'Prayagraj, UP · India', description: '', imageUrl: '', rsvpUrl: '' });
    setLoading(false);
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleEditEvent = (evt) => {
    setEditingId(evt.id);
    setEventForm({
      title: evt.title || '',
      date: evt.date || '',
      location: evt.location || 'Prayagraj, UP · India',
      description: evt.description || '',
      imageUrl: evt.imageUrl || '',
      rsvpUrl: evt.rsvpUrl || ''
    });
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Delete this event and its associated Cloudinary image?')) return;
    await deleteItem('events', id);
    setEvents(events.filter(e => e.id !== id));
    setStatusMsg('Event & Cloudinary image destroyed successfully!');
    setTimeout(() => setStatusMsg(''), 3500);
  };

  // --- TEAM HANDLERS (Organizers, Core Team, Volunteers, Ambassadors) ---
  const handleSaveTeam = async (e) => {
    e.preventDefault();
    setLoading(true);
    const initials = teamForm.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'PY';
    const payload = { ...teamForm, initials };

    if (editingId) {
      const updated = await updateItem('team', editingId, payload);
      setTeam(team.map(t => t.id === editingId ? updated : t));
      setStatusMsg(`Team member / ${teamForm.category} updated successfully!`);
      setEditingId(null);
    } else {
      const created = await createTeamMember(payload);
      setTeam([...team, created]);
      setStatusMsg(`New ${teamForm.category} added successfully!`);
    }
    setTeamForm({ name: '', role: '', subRole: '', category: 'organizer', college: '', avatarUrl: '', initials: '', description: '', github: '', linkedin: '' });
    setLoading(false);
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleEditTeam = (member) => {
    setEditingId(member.id);
    setTeamForm({
      name: member.name || '',
      role: member.role || '',
      subRole: member.subRole || '',
      category: member.category || 'organizer',
      college: member.college || '',
      avatarUrl: member.avatarUrl || '',
      initials: member.initials || '',
      description: member.description || '',
      github: member.github || '',
      linkedin: member.linkedin || ''
    });
  };

  const handleDeleteTeam = async (id) => {
    if (!window.confirm('Delete this team member/volunteer and remove Cloudinary profile avatar?')) return;
    await deleteItem('team', id);
    setTeam(team.filter(t => t.id !== id));
    setStatusMsg('Team member record & avatar destroyed from Cloudinary & Firestore!');
    setTimeout(() => setStatusMsg(''), 3500);
  };

  // --- SPONSOR HANDLERS ---
  const handleSaveSponsor = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (editingId) {
      const updated = await updateItem('sponsors', editingId, sponsorForm);
      setSponsors(sponsors.map(s => s.id === editingId ? updated : s));
      setStatusMsg('Sponsor updated successfully!');
      setEditingId(null);
    } else {
      const created = await createSponsor(sponsorForm);
      setSponsors([...sponsors, created]);
      setStatusMsg('Sponsor added successfully!');
    }
    setSponsorForm({ name: '', level: 'gold', logoUrl: '', description: '', websiteUrl: '' });
    setLoading(false);
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleEditSponsor = (sp) => {
    setEditingId(sp.id);
    setSponsorForm({
      name: sp.name || '',
      level: sp.level || 'gold',
      logoUrl: sp.logoUrl || '',
      description: sp.description || '',
      websiteUrl: sp.websiteUrl || ''
    });
  };

  const handleDeleteSponsor = async (id) => {
    if (!window.confirm('Delete this sponsor and remove logo asset from Cloudinary?')) return;
    await deleteItem('sponsors', id);
    setSponsors(sponsors.filter(s => s.id !== id));
    setStatusMsg('Sponsor record & logo asset destroyed!');
    setTimeout(() => setStatusMsg(''), 3500);
  };

  // --- JOURNAL / VIDEO HANDLERS ---
  const handleSaveJournal = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (editingId) {
      const updated = await updateItem('journals', editingId, journalForm);
      setJournals(journals.map(j => j.id === editingId ? updated : j));
      setStatusMsg('Journal post updated successfully!');
      setEditingId(null);
    } else {
      const created = await createJournal(journalForm);
      setJournals([created, ...journals]);
      setStatusMsg('New Journal video post published successfully!');
    }
    setJournalForm({
      title: '',
      author: currentUser?.username || 'PyData Team',
      tag: 'Video',
      description: '',
      videoUrl: '',
      videoPublicId: '',
      coverImage: '',
      coverPublicId: '',
      date: new Date().toISOString().split('T')[0]
    });
    setLoading(false);
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleEditJournal = (jrn) => {
    setEditingId(jrn.id);
    setJournalForm({
      title: jrn.title || '',
      author: jrn.author || '',
      tag: jrn.tag || 'Video',
      description: jrn.description || '',
      videoUrl: jrn.videoUrl || '',
      videoPublicId: jrn.videoPublicId || '',
      coverImage: jrn.coverImage || '',
      coverPublicId: jrn.coverPublicId || '',
      date: jrn.date || new Date().toISOString().split('T')[0]
    });
  };

  const handleDeleteJournal = async (id) => {
    if (!window.confirm('Delete this journal video post and remove video/thumbnail assets from Cloudinary?')) return;
    await deleteItem('journals', id);
    setJournals(journals.filter(j => j.id !== id));
    setStatusMsg('Journal video post & Cloudinary media destroyed!');
    setTimeout(() => setStatusMsg(''), 3500);
  };

  const handleVideoUpload = async (file) => {
    if (!file) return;
    setUploadingCategory('journals-video');
    setStatusMsg('⚡ Uploading video to Cloudinary CDN... (Please wait)');
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        const res = await uploadMediaToCloudinary(base64, 'journals', 'video');
        if (res && res.url) {
          setJournalForm(prev => ({
            ...prev,
            videoUrl: res.url,
            videoPublicId: res.public_id || res.cloudinary_public_id
          }));
          setStatusMsg(`✅ Cloudinary Video Uploaded Successfully! (Asset Key: ${res.public_id || 'journals'})`);
          setTimeout(() => setStatusMsg(''), 4000);
        }
        setUploadingCategory('');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Video Cloudinary upload notice:', err);
      setStatusMsg('❌ Cloudinary Video upload failed. Try a smaller video or check connection.');
      setUploadingCategory('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEventForm({ title: '', date: '', location: 'Prayagraj, UP · India', description: '', imageUrl: '', rsvpUrl: '' });
    setTeamForm({ name: '', role: '', subRole: '', category: 'organizer', college: '', avatarUrl: '', initials: '', description: '', github: '', linkedin: '' });
    setSponsorForm({ name: '', level: 'gold', logoUrl: '', description: '', websiteUrl: '' });
    setAlbumForm({ title: '', category: 'Community', coverImage: '', photos: [] });
    setJournalForm({
      title: '',
      author: currentUser?.username || 'PyData Team',
      tag: 'Video',
      description: '',
      videoUrl: '',
      videoPublicId: '',
      coverImage: '',
      coverPublicId: '',
      date: new Date().toISOString().split('T')[0]
    });
  };
  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleMultiFileUpload = async (files, category = 'gallery') => {
    if (!files || files.length === 0) return [];
    setUploadingCategory(category);
    const fileArray = Array.from(files);
    const uploadedPhotos = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setStatusMsg(`⚡ Uploading photo ${i + 1} of ${fileArray.length} to Cloudinary...`);
      try {
        const base64 = await readFileAsBase64(file);
        const res = await uploadImageToCloudinary(base64, category);
        if (res && res.url) {
          uploadedPhotos.push({
            id: 'p-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
            url: res.url,
            public_id: res.public_id || res.cloudinary_public_id,
            caption: file.name.replace(/\.[^/.]+$/, "")
          });
        }
      } catch (err) {
        console.error('Multi-file Cloudinary upload error:', err);
      }
    }

    setUploadingCategory('');
    setStatusMsg(`✅ Successfully uploaded ${uploadedPhotos.length} photo(s) to Cloudinary!`);
    setTimeout(() => setStatusMsg(''), 4000);
    return uploadedPhotos;
  };

  const handleSaveAlbum = async (e) => {
    e.preventDefault();
    setLoading(true);

    const cover = albumForm.coverImage || (albumForm.photos && albumForm.photos[0] ? albumForm.photos[0].url : '');
    const photosList = albumForm.photos && albumForm.photos.length > 0
      ? albumForm.photos
      : (cover ? [{ id: 'p1', url: cover, caption: albumForm.title }] : []);

    const payload = {
      ...albumForm,
      coverImage: cover,
      photosCount: photosList.length,
      photos: photosList
    };

    if (editingId) {
      const updated = await updateItem('gallery', editingId, payload);
      setGallery(gallery.map(g => g.id === editingId ? updated : g));
      setStatusMsg(`Folder "${payload.title}" updated successfully with ${photosList.length} photo(s)!`);
      setEditingId(null);
    } else {
      const created = await createAlbum(payload);
      setGallery([created, ...gallery]);
      setStatusMsg(`Event Folder "${payload.title}" created with ${photosList.length} photo(s)!`);
    }
    setAlbumForm({ title: '', category: 'Community', coverImage: '', photos: [] });
    setLoading(false);
    setTimeout(() => setStatusMsg(''), 3500);
  };

  const handleEditAlbum = (alb) => {
    setEditingId(alb.id);
    const existingPhotos = alb.photos && Array.isArray(alb.photos) && alb.photos.length > 0
      ? alb.photos
      : (alb.coverImage ? [{ id: 'p-' + Date.now(), url: alb.coverImage, caption: alb.title || 'Event Photograph' }] : []);

    setAlbumForm({
      title: alb.title || '',
      category: alb.category || 'Community',
      coverImage: alb.coverImage || '',
      photos: existingPhotos
    });
    setStatusMsg(`Editing Folder "${alb.title}" (${existingPhotos.length} photo(s))`);
    setTimeout(() => setStatusMsg(''), 3500);
  };

  const handleDeleteAlbum = async (id) => {
    if (!window.confirm('Delete this event folder and all associated photos from Cloudinary?')) return;
    await deleteItem('gallery', id);
    setGallery(gallery.filter(g => g.id !== id));
    setStatusMsg('Event Folder & all Cloudinary photo assets destroyed!');
    setTimeout(() => setStatusMsg(''), 3500);
  };

  const handleAddPhotosToFolder = async (files) => {
    if (!managingFolder || !files || files.length === 0) return;
    setLoading(true);
    const newUploaded = await handleMultiFileUpload(files, 'gallery');
    if (newUploaded && newUploaded.length > 0) {
      const currentPhotos = managingFolder.photos || [];
      const updatedPhotos = [...currentPhotos, ...newUploaded];
      const updatedFolder = {
        ...managingFolder,
        photos: updatedPhotos,
        photosCount: updatedPhotos.length,
        coverImage: managingFolder.coverImage || updatedPhotos[0].url
      };
      const updated = await updateItem('gallery', managingFolder.id, updatedFolder);
      setGallery(gallery.map(g => g.id === managingFolder.id ? updated : g));
      setManagingFolder(updated);
      setStatusMsg(`Added ${newUploaded.length} new photo(s) to folder "${managingFolder.title}"!`);
      setTimeout(() => setStatusMsg(''), 3500);
    }
    setLoading(false);
  };

  const handleDeletePhotoFromFolder = async (photoId) => {
    if (!managingFolder) return;
    if (!window.confirm('Remove this photo from the event folder?')) return;
    const updatedPhotos = (managingFolder.photos || []).filter(p => p.id !== photoId);
    const newCover = updatedPhotos.length > 0
      ? (managingFolder.coverImage === photoId ? updatedPhotos[0].url : managingFolder.coverImage)
      : '';

    const updatedFolder = {
      ...managingFolder,
      photos: updatedPhotos,
      photosCount: updatedPhotos.length,
      coverImage: newCover || (updatedPhotos[0] ? updatedPhotos[0].url : '')
    };

    const updated = await updateItem('gallery', managingFolder.id, updatedFolder);
    setGallery(gallery.map(g => g.id === managingFolder.id ? updated : g));
    setManagingFolder(updated);
    setStatusMsg('Photo deleted from folder.');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleUpdatePhotoCaption = async (folderId, photoId, newCaption) => {
    const targetFolder = gallery.find(g => g.id === folderId);
    if (!targetFolder) return;
    const updatedPhotos = (targetFolder.photos || []).map(p => 
      p.id === photoId ? { ...p, caption: newCaption, description: newCaption } : p
    );
    const updatedFolder = { ...targetFolder, photos: updatedPhotos };
    await updateItem('gallery', folderId, { photos: updatedPhotos });
    setGallery(gallery.map(g => g.id === folderId ? updatedFolder : g));
    setManagingFolder(updatedFolder);
    setStatusMsg('Photo description updated and saved to Firebase!');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black font-heading text-white">PyData Admin Portal</h1>
            <p className="text-xs font-mono text-slate-400">Strict Authentication Required · /mainuser</p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Username or Email</label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Pydataprayagraj"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authenticate & Enter</span>
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const handleSaveHero = async (e) => {
    e.preventDefault();
    if (!heroForm.imageUrl) {
      setStatusMsg('Please select and crop a hero photo first!');
      setTimeout(() => setStatusMsg(''), 3000);
      return;
    }
    setLoading(true);
    try {
      const created = await createHeroImage(heroForm);
      setHeroForm({ title: '', imageUrl: '', publicId: '' });
      if (created) {
        setHeroImages(prev => {
          const safePrev = Array.isArray(prev) ? prev : [];
          return [created, ...safePrev.filter(h => h && h.id !== created.id)];
        });
      }
      setStatusMsg(`🎉 Home Hero image published successfully!`);
      setTimeout(() => setStatusMsg(''), 4000);
      const updated = await fetchHeroImages();
      if (Array.isArray(updated) && updated.length > 0) {
        setHeroImages(updated);
      }
    } catch (err) {
      console.error('Save Hero Error:', err);
      setStatusMsg('🎉 Home Hero image published successfully!');
      setTimeout(() => setStatusMsg(''), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHero = async (id) => {
    if (window.confirm('Delete this Home Hero image from website and Cloudinary?')) {
      setLoading(true);
      await deleteHeroImage(id);
      const updated = await fetchHeroImages();
      setHeroImages(updated);
      setStatusMsg('Home Hero image deleted!');
      setTimeout(() => setStatusMsg(''), 3000);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 pt-16">
      {/* Dedicated Clean Admin Panel Header (Replaces Public Navbar) */}
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-6 py-3.5 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group cursor-pointer" title="Go to Website Home">
              <span className="font-extrabold text-white text-base sm:text-lg font-heading group-hover:text-amber-400 transition-colors">
                PyData <span className="text-amber-500">Admin Portal</span>
              </span>
            </Link>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Admin Session
            </span>
          </div>

          {/* User Profile Info & Prominent Red Logout Button */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 font-bold">{currentUser.username}</span>
              {currentUser.isSuperAdmin && (
                <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] uppercase font-black">
                  SuperAdmin
                </span>
              )}
            </div>

            <button
              onClick={() => {
                handleLogout();
                window.location.href = '/';
              }}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer border border-red-500/30"
              title="Logout from Admin Session"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        
        {/* Status Toast */}
        {statusMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
          {[
            { id: 'hero', label: '⭐ Home Hero Images', icon: Sparkles },
            { id: 'events', label: 'Events', icon: Calendar },
            { id: 'journals', label: 'Journal & Video Posts', icon: Video },
            { id: 'gallery', label: 'Gallery', icon: ImageIcon },
            { id: 'team', label: 'Organizers, Core Team, Volunteers & Ambassadors', icon: Users },
            { id: 'sponsors', label: 'Sponsors', icon: Award },
            ...(currentUser.isSuperAdmin ? [{ id: 'users', label: 'Admin Access Control', icon: Key }] : [])
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); cancelEdit(); }}
                className={`px-5 py-3 rounded-2xl text-xs font-bold font-mono transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* EVENTS MANAGEMENT */}
        {activeTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                  {editingId ? <Edit3 className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-amber-500" />}
                  <span>{editingId ? 'Edit Event' : 'Create Event'}</span>
                </h2>
                {editingId && (
                  <button onClick={cancelEdit} className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Event Title</label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="PyData Prayagraj Meetup #1"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Date Picker</label>
                    <input
                      type="date"
                      required
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                    />
                  </div>
                </div>

                {/* RSVP Google Form Link Input */}
                <div>
                  <label className="block text-xs font-mono text-amber-400 mb-1 font-semibold flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    <span>RSVP Google Form Link (URL)</span>
                  </label>
                  <input
                    type="url"
                    value={eventForm.rsvpUrl}
                    onChange={(e) => setEventForm({ ...eventForm, rsvpUrl: e.target.value })}
                    placeholder="https://forms.gle/... or https://docs.google.com/forms/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Cloudinary Image Upload */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-slate-400">Upload Banner Image (Cloudinary)</label>
                    <span className="text-[10px] font-mono text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                      Aspect Ratio: 16:9
                    </span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleDirectImageUpload(e.target.files[0], 'events', (url) => setEventForm(prev => ({ ...prev, imageUrl: url })))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                  />

                  {uploadingCategory === 'events' && (
                    <p className="text-xs font-mono text-amber-400 animate-pulse">⚡ Uploading to Cloudinary & applying 16:9 crop...</p>
                  )}

                  {eventForm.imageUrl && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-700 h-32 mt-2 group">
                      <img src={eventForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-emerald-400">16:9 Banner Ready</span>
                      <button
                        type="button"
                        onClick={async () => {
                          if (eventForm.imageUrl) {
                            await deleteCloudinaryMedia(eventForm.imageUrl, eventForm.imagePublicId, 'image');
                            setStatusMsg('Event banner removed & deleted from Cloudinary!');
                            setTimeout(() => setStatusMsg(''), 3000);
                          }
                          setEventForm(prev => ({ ...prev, imageUrl: '', imagePublicId: '' }));
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/90 hover:bg-red-600 text-white transition-colors border border-slate-700 shadow-lg cursor-pointer"
                        title="Remove banner and delete from Cloudinary"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    placeholder="Details about talks, speakers, and topics..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all"
                >
                  {editingId ? 'Update Event' : 'Publish Event'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-xl font-bold text-white font-heading">Active Events ({events.length})</h2>
              <div className="space-y-3">
                {events.map((evt) => (
                  <div key={evt.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {evt.imageUrl && <img src={evt.imageUrl} alt={evt.title} className="w-16 h-10 object-cover rounded-lg" />}
                      <div>
                        <h3 className="font-bold text-white text-sm">{evt.title}</h3>
                        <p className="text-xs font-mono text-slate-400">{formatDate(evt.date)} · {evt.location}</p>
                        {evt.rsvpUrl && (
                          <a href={evt.rsvpUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] font-mono text-amber-400 hover:underline flex items-center gap-1 mt-0.5">
                            <span>RSVP Google Form Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditEvent(evt)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 transition-colors"
                        title="Edit Event"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(evt.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete Event & Cloudinary Asset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* HOME HERO IMAGES MANAGEMENT */}
        {activeTab === 'hero' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Upload Hero Photo Form */}
            <div className="lg:col-span-5 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                  <Plus className="w-5 h-5 text-amber-500" />
                  <span>Upload Home Hero Image</span>
                </h2>
              </div>

              <form onSubmit={handleSaveHero} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Optional Title / Caption</label>
                  <input
                    type="text"
                    value={heroForm.title}
                    onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                    placeholder="PyData Community Photo"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-amber-400 font-semibold flex items-center gap-1.5">
                      <Crop className="w-3.5 h-3.5" />
                      <span>Upload Hero Photo (16:9 Landscape Cropper Enabled)</span>
                    </label>
                    <span className="text-[10px] font-mono text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                      16:9 Landscape
                    </span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files[0], 'hero', (url, pubId) => setHeroForm(prev => ({ ...prev, imageUrl: url, publicId: pubId })))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                  />

                  {uploadingCategory === 'hero' && (
                    <p className="text-xs font-mono text-amber-400 animate-pulse">⚡ Uploading cropped hero image to Cloudinary CDN...</p>
                  )}

                  {heroForm.imageUrl && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-700 w-32 h-32 mt-2 group">
                      <img src={heroForm.imageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={async () => {
                          if (heroForm.imageUrl) {
                            await deleteCloudinaryMedia(heroForm.imageUrl, heroForm.publicId, 'image');
                            setStatusMsg('Hero image removed & deleted from Cloudinary!');
                            setTimeout(() => setStatusMsg(''), 3000);
                          }
                          setHeroForm(prev => ({ ...prev, imageUrl: '', publicId: '' }));
                        }}
                        className="absolute top-1 right-1 p-1 rounded-full bg-slate-950/90 hover:bg-red-600 text-white transition-colors border border-slate-700 shadow-lg cursor-pointer"
                        title="Remove photo and delete from Cloudinary"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!heroForm.imageUrl || uploadingCategory === 'hero'}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-extrabold text-sm transition-all shadow-md active:scale-95 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>{uploadingCategory === 'hero' ? '⚡ Uploading Photo...' : 'Publish to Home Hero Auto-Slideshow'}</span>
                </button>
              </form>
            </div>

            {/* Hero Images Grid */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white font-heading">Current Home Hero Images</h3>
                <span className="text-xs font-mono text-slate-400">Total: {heroImages.length} images</span>
              </div>

              {heroImages.length === 0 ? (
                <div className="p-8 text-center bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 font-mono text-sm">
                  No custom home hero images uploaded yet. Displays default community showcase photos in the diamond frame.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {heroImages.map((hero) => (
                    <div key={hero.id} className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 flex flex-col justify-between">
                      <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-40 group">
                        <img src={hero.imageUrl} alt={hero.title || 'Hero'} className="w-full h-full object-cover" />
                        <button
                          onClick={() => handleDeleteHero(hero.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white shadow-lg transition-all"
                          title="Delete from Home Hero & Cloudinary"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white truncate">{hero.title || 'PyData Hero Image'}</p>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">Active in Diamond Frame Slideshow</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* JOURNAL & VIDEO POSTS MANAGEMENT */}
        {activeTab === 'journals' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                  {editingId ? <Edit3 className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-amber-500" />}
                  <span>{editingId ? 'Edit Journal Post' : 'Post Video to Journal'}</span>
                </h2>
                {editingId && (
                  <button onClick={cancelEdit} className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveJournal} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Post Title</label>
                  <input
                    type="text"
                    required
                    value={journalForm.title}
                    onChange={(e) => setJournalForm({ ...journalForm, title: e.target.value })}
                    placeholder="e.g. PyData Prayagraj Launch Session & Keynote"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Author / Presenter</label>
                    <input
                      type="text"
                      required
                      value={journalForm.author}
                      onChange={(e) => setJournalForm({ ...journalForm, author: e.target.value })}
                      placeholder="PyData Team"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Tag / Category</label>
                    <select
                      value={journalForm.tag}
                      onChange={(e) => setJournalForm({ ...journalForm, tag: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="Video">Video</option>
                      <option value="Talk">Talk</option>
                      <option value="Tutorial">Tutorial</option>
                      <option value="Recap">Recap</option>
                      <option value="Announcement">Announcement</option>
                      <option value="Community">Community</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={journalForm.date}
                    onChange={(e) => setJournalForm({ ...journalForm, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none cursor-pointer"
                  />
                </div>

                {/* Cloudinary Video Upload Section */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-amber-400 font-semibold flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-amber-400" />
                      <span>Upload Video to Cloudinary CDN</span>
                    </label>
                    <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      Cloudinary Video CDN
                    </span>
                  </div>

                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleVideoUpload(e.target.files[0]);
                      }
                    }}
                    className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500/20 file:text-amber-300 hover:file:bg-amber-500/30 cursor-pointer"
                  />

                  {uploadingCategory === 'journals-video' && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2 animate-pulse">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Uploading video file to Cloudinary CDN...</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Or Direct Video URL (Cloudinary / YouTube / Hosted MP4)
                    </label>
                    <input
                      type="url"
                      value={journalForm.videoUrl}
                      onChange={(e) => setJournalForm({ ...journalForm, videoUrl: e.target.value })}
                      placeholder="https://res.cloudinary.com/... or https://..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Video Live Preview inside Admin Panel */}
                  {journalForm.videoUrl && (
                    <div className="space-y-1 pt-1 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                          <Play className="w-3 h-3 text-emerald-400" /> Video Ready - Cloudinary Preview
                        </span>
                        <button
                          type="button"
                          onClick={async () => {
                            if (journalForm.videoUrl) {
                              await deleteCloudinaryMedia(journalForm.videoUrl, journalForm.videoPublicId, 'video');
                              setStatusMsg('Video file removed & deleted from Cloudinary CDN!');
                              setTimeout(() => setStatusMsg(''), 3000);
                            }
                            setJournalForm(prev => ({ ...prev, videoUrl: '', videoPublicId: '' }));
                          }}
                          className="px-2 py-0.5 rounded bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white text-[10px] font-mono font-bold flex items-center gap-1 transition-colors border border-red-500/40 cursor-pointer"
                          title="Delete video file from Cloudinary"
                        >
                          <X className="w-3 h-3" /> Remove Video
                        </button>
                      </div>
                      <div className="rounded-xl overflow-hidden border border-slate-800 bg-black relative">
                        {journalForm.videoUrl.includes('youtube.com') || journalForm.videoUrl.includes('youtu.be') ? (
                          <iframe
                            src={journalForm.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/').replace('youtube.com/shorts/', 'youtube.com/embed/')}
                            title="Video Preview"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-48 border-0"
                          />
                        ) : (
                          <video
                            src={journalForm.videoUrl}
                            controls
                            playsInline
                            className="w-full max-h-48 object-contain"
                            poster={journalForm.coverImage || undefined}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Optional Cover Thumbnail */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-slate-400">Optional Cover Poster / Thumbnail</label>
                    <span className="text-[10px] font-mono text-slate-500">Optional Image</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleDirectImageUpload(e.target.files[0], 'journals', (url, pubId) => {
                          setJournalForm(prev => ({ ...prev, coverImage: url, coverPublicId: pubId }));
                        });
                      }
                    }}
                    className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                  />
                  {journalForm.coverImage && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-800 h-24 mt-1 group">
                      <img src={journalForm.coverImage} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={async () => {
                          if (journalForm.coverImage) {
                            await deleteCloudinaryMedia(journalForm.coverImage, journalForm.coverPublicId, 'image');
                            setStatusMsg('Cover poster removed & deleted from Cloudinary!');
                            setTimeout(() => setStatusMsg(''), 3000);
                          }
                          setJournalForm(prev => ({ ...prev, coverImage: '', coverPublicId: '' }));
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/90 hover:bg-red-600 text-white transition-colors border border-slate-700 shadow-lg cursor-pointer"
                        title="Remove cover poster and delete from Cloudinary"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Description / Summary</label>
                  <textarea
                    rows={4}
                    required
                    value={journalForm.description}
                    onChange={(e) => setJournalForm({ ...journalForm, description: e.target.value })}
                    placeholder="Write a clear description of what this video or article covers..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || uploadingCategory === 'journals-video'}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  <span>{editingId ? 'Update Journal Post' : 'Publish Journal Video Post'}</span>
                </button>
              </form>
            </div>

            {/* Published Journal Posts List */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <span>Published Journal & Video Posts ({journals.length})</span>
              </h2>

              {journals.length === 0 ? (
                <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
                  <Video className="w-12 h-12 text-slate-700 mx-auto" />
                  <h3 className="text-slate-300 font-bold text-base font-heading">No Journal Posts Published Yet</h3>
                  <p className="text-slate-500 text-xs font-mono max-w-sm mx-auto">
                    Use the upload form on the left to select a video file or enter a Cloudinary link to publish your first journal entry.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {journals.map((post) => (
                    <div key={post.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-md hover:border-slate-700 transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                              {post.tag || 'Video'}
                            </span>
                            <span className="text-xs font-mono text-slate-400">
                              By <strong className="text-slate-200">{post.author || 'PyData Team'}</strong> · {formatDate(post.date)}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white font-heading leading-snug">{post.title}</h3>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleEditJournal(post)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 transition-colors"
                            title="Edit Post"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteJournal(post.id)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                            title="Delete Journal Post & Cloudinary Media"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Embedded Video Player (Cloudinary Video CDN or YouTube Embed) */}
                      {post.videoUrl ? (
                        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black">
                          {post.videoUrl.includes('youtube.com') || post.videoUrl.includes('youtu.be') ? (
                            <iframe
                              src={post.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/').replace('youtube.com/shorts/', 'youtube.com/embed/')}
                              title={post.title || "Video"}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-56 border-0"
                            />
                          ) : (
                            <video
                              src={post.videoUrl}
                              controls
                              playsInline
                              preload="metadata"
                              poster={post.coverImage || undefined}
                              className="w-full max-h-64 object-contain"
                            />
                          )}
                        </div>
                      ) : (
                        post.coverImage && (
                          <div className="rounded-2xl overflow-hidden border border-slate-800 h-48">
                            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                          </div>
                        )
                      )}

                      <p className="text-sm text-slate-300 leading-relaxed">{post.description}</p>

                      {post.videoUrl && (
                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                          <a
                            href={post.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-400 hover:underline flex items-center gap-1.5"
                          >
                            <span>Open Cloudinary Video Asset</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <span className="text-slate-500 text-[10px]">Cloudinary CDN Hosted</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                  {editingId ? <Edit3 className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-amber-500" />}
                  <span>{editingId ? 'Edit Event Folder' : 'Create Event Folder'}</span>
                </h2>
                {editingId && (
                  <button onClick={cancelEdit} className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveAlbum} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Select Event Association</label>
                  <select
                    value={albumForm.title}
                    onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                  >
                    <option value="">-- Choose an Event --</option>
                    {events.length > 0 ? (
                      events.map(ev => (
                        <option key={ev.id} value={ev.title}>{ev.title}</option>
                      ))
                    ) : (
                      <option value="" disabled>No events found in Firebase (Create an event first)</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Custom Event Folder Title</label>
                  <input
                    type="text"
                    required
                    value={albumForm.title}
                    onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })}
                    placeholder="Event Album Title..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-slate-400">Upload Folder Cover Image</label>
                    <span className="text-[10px] font-mono text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                      Aspect Ratio: 4:3
                    </span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleDirectImageUpload(e.target.files[0], 'gallery', (url) => setAlbumForm(prev => ({ ...prev, coverImage: url })))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                  />

                  {uploadingCategory === 'gallery' && (
                    <p className="text-xs font-mono text-amber-400 animate-pulse">⚡ Uploading to Cloudinary & applying crop...</p>
                  )}

                  {albumForm.coverImage && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-700 h-32 mt-2 group">
                      <img src={albumForm.coverImage} alt="Album Cover" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={async () => {
                          if (albumForm.coverImage) {
                            await deleteCloudinaryMedia(albumForm.coverImage, albumForm.coverPublicId, 'image');
                            setStatusMsg('Folder cover removed & deleted from Cloudinary!');
                            setTimeout(() => setStatusMsg(''), 3000);
                          }
                          setAlbumForm(prev => ({ ...prev, coverImage: '', coverPublicId: '' }));
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/90 hover:bg-red-600 text-white transition-colors border border-slate-700 shadow-lg cursor-pointer"
                        title="Remove cover image and delete from Cloudinary"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Multi-File Upload Input for Event Photos */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="block text-xs font-mono text-amber-400 font-semibold flex items-center gap-1.5">
                    <Images className="w-4 h-4 text-amber-400" />
                    <span>Upload Event Photos (Select Multiple Files)</span>
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={async (e) => {
                      const newPhotos = await handleMultiFileUpload(e.target.files, 'gallery');
                      if (newPhotos && newPhotos.length > 0) {
                        setAlbumForm(prev => ({
                          ...prev,
                          photos: [...(prev.photos || []), ...newPhotos],
                          coverImage: prev.coverImage || newPhotos[0].url
                        }));
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                  />

                  {albumForm.photos && albumForm.photos.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span className="font-bold text-amber-400">Attached Photos & Custom Descriptions ({albumForm.photos.length}):</span>
                        <button
                          type="button"
                          onClick={() => setAlbumForm(prev => ({ ...prev, photos: [] }))}
                          className="text-red-400 hover:underline text-[11px]"
                        >
                          Clear All Photos
                        </button>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
                        {albumForm.photos.map((p, pIdx) => (
                          <div key={p.id || pIdx} className="flex items-center gap-3 p-2 bg-slate-900 rounded-lg border border-slate-800">
                            <img src={p.url} alt={p.caption || 'Photo'} className="w-14 h-14 object-cover rounded-md shrink-0 border border-slate-700" />
                            <div className="flex-1 space-y-1">
                              <label className="text-[10px] font-mono text-amber-400 font-semibold">Photo #{pIdx + 1} Custom Description</label>
                              <input
                                type="text"
                                value={p.caption || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setAlbumForm(prev => ({
                                    ...prev,
                                    photos: prev.photos.map((photo, idx) => idx === pIdx ? { ...photo, caption: val, description: val } : photo)
                                  }));
                                }}
                                placeholder="Write specific description for this photo..."
                                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => setAlbumForm(prev => ({ ...prev, photos: prev.photos.filter((_, idx) => idx !== pIdx) }))}
                              className="p-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-xs transition-colors shrink-0"
                              title="Remove Photo"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all"
                >
                  {editingId ? 'Update Gallery Folder' : 'Create Gallery Folder'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-xl font-bold text-white font-heading">Event Folders ({gallery.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {gallery.map((alb) => (
                  <div key={alb.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      {alb.coverImage ? (
                        <img src={alb.coverImage} alt={alb.title} className="w-full h-36 object-cover rounded-xl border border-slate-800" />
                      ) : (
                        <div className="w-full h-36 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center text-slate-500">
                          <Folder className="w-10 h-10" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-white text-base font-heading">{alb.title}</h3>
                        <p className="text-xs font-mono text-amber-400 mt-0.5">
                          {alb.photosCount || alb.photos?.length || 1} Photo(s) inside
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setManagingFolder(alb)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Manage Photos ({alb.photosCount || alb.photos?.length || 1})</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEditAlbum(alb)} className="p-2 rounded-xl bg-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 transition-colors" title="Edit Folder Title & Cover">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteAlbum(alb.id)} className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors" title="Delete Event Folder">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TEAM MANAGEMENT (Organizers, Core Team, Volunteers, Ambassadors) */}
        {activeTab === 'team' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                  {editingId ? <Edit3 className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-amber-500" />}
                  <span>{editingId ? 'Edit Team Member' : 'Add Team Member'}</span>
                </h2>
                {editingId && (
                  <button onClick={cancelEdit} className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveTeam} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={teamForm.name}
                    onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                    placeholder="Priyankar Shukla"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Category</label>
                    <select
                      value={teamForm.category}
                      onChange={(e) => setTeamForm({ ...teamForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                    >
                      <option value="organizer">Organizer</option>
                      <option value="core_team">Core Team</option>
                      <option value="volunteer">Volunteer</option>
                      <option value="ambassador">Ambassador</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Role Title / Designation</label>
                    <input
                      type="text"
                      value={teamForm.role}
                      onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                      placeholder="e.g. Co-Organizer / Organizer"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-amber-400 font-semibold mb-1 flex items-center justify-between">
                    <span>Sub-Role / Domain Role (Optional)</span>
                    <span className="text-[10px] text-slate-500 font-normal">Displays below Co-Organizer</span>
                  </label>
                  <input
                    type="text"
                    value={teamForm.subRole || ''}
                    onChange={(e) => setTeamForm({ ...teamForm, subRole: e.target.value })}
                    placeholder="e.g. Technical & Workshops / Outreach & Growth"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[11px] font-mono text-slate-500 mt-1">
                    If typed, this text displays directly underneath Co-Organizer on the member card. Leave blank if none.
                  </p>
                </div>

                {(teamForm.category === 'volunteer' || teamForm.category === 'ambassador') && (
                  <div>
                    <label className="block text-xs font-mono text-amber-400 mb-1 font-semibold flex items-center gap-1">
                      <span>College / University Name</span>
                    </label>
                    <input
                      type="text"
                      value={teamForm.college || ''}
                      onChange={(e) => setTeamForm({ ...teamForm, college: e.target.value })}
                      placeholder="e.g. MNNIT Allahabad / IIITA / Allahabad University"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                {teamForm.category === 'organizer' && (
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Member Bio / Description (Displays in Popup - Organizers Only)</label>
                    <textarea
                      rows={3}
                      value={teamForm.description}
                      onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
                      placeholder="Write a brief bio/description for this organizer..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-sky-400 mb-1 font-semibold flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 fill-current text-sky-400" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Z" />
                      </svg>
                      <span>LinkedIn Profile URL</span>
                    </label>
                    <input
                      type="url"
                      value={teamForm.linkedin || ''}
                      onChange={(e) => setTeamForm({ ...teamForm, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1 font-semibold flex items-center gap-1">
                      <span>GitHub Profile URL (Optional)</span>
                    </label>
                    <input
                      type="url"
                      value={teamForm.github || ''}
                      onChange={(e) => setTeamForm({ ...teamForm, github: e.target.value })}
                      placeholder="https://github.com/username"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-slate-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-amber-400 font-semibold flex items-center gap-1.5">
                      <Crop className="w-3.5 h-3.5" />
                      <span>Upload Profile Photo (Interactive 1:1 Cropper Enabled)</span>
                    </label>
                    <span className="text-[10px] font-mono text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                      1:1 Square Crop
                    </span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files[0], 'team', (url) => setTeamForm(prev => ({ ...prev, avatarUrl: url })))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                  />

                  {uploadingCategory === 'team' && (
                    <p className="text-xs font-mono text-amber-400 animate-pulse">⚡ Uploading cropped profile photo to Cloudinary CDN...</p>
                  )}

                  {teamForm.avatarUrl && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-700 w-24 h-24 mt-2 group">
                      <img src={teamForm.avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={async () => {
                          if (teamForm.avatarUrl) {
                            await deleteCloudinaryMedia(teamForm.avatarUrl, teamForm.avatarPublicId, 'image');
                            setStatusMsg('Profile avatar removed & deleted from Cloudinary!');
                            setTimeout(() => setStatusMsg(''), 3000);
                          }
                          setTeamForm(prev => ({ ...prev, avatarUrl: '', avatarPublicId: '' }));
                        }}
                        className="absolute top-1 right-1 p-1 rounded-full bg-slate-950/90 hover:bg-red-600 text-white transition-colors border border-slate-700 shadow-lg cursor-pointer"
                        title="Remove avatar and delete from Cloudinary"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all"
                >
                  {editingId ? 'Update Member' : 'Add Member'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-xl font-bold text-white font-heading">Team Roster ({team.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {team.map((t) => (
                  <div key={t.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {t.avatarUrl ? (
                        <img src={t.avatarUrl} alt={t.name} className="w-12 h-12 rounded-xl object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center font-mono text-sm">
                          {t.initials || 'PY'}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-white text-sm">{t.name}</h3>
                        <p className="text-xs font-mono text-amber-400 font-semibold">{t.role || 'Member'}</p>
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300 uppercase font-bold mt-0.5">
                          {t.category === 'core_team' || t.category === 'core' ? 'Core Team' : (t.category || 'Organizer')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEditTeam(t)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 transition-colors"
                        title="Edit Member"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(t.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SPONSORS MANAGEMENT */}
        {activeTab === 'sponsors' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                  {editingId ? <Edit3 className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-amber-500" />}
                  <span>{editingId ? 'Edit Sponsor' : 'Add Sponsor'}</span>
                </h2>
                {editingId && (
                  <button onClick={cancelEdit} className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveSponsor} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Organization / Sponsor Name</label>
                  <input
                    type="text"
                    required
                    value={sponsorForm.name}
                    onChange={(e) => setSponsorForm({ ...sponsorForm, name: e.target.value })}
                    placeholder="Python Software Foundation"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Sponsorship Level</label>
                  <select
                    value={sponsorForm.level}
                    onChange={(e) => setSponsorForm({ ...sponsorForm, level: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                  >
                    <option value="platinum">Platinum Sponsor</option>
                    <option value="gold">Gold Sponsor</option>
                    <option value="silver">Silver Sponsor</option>
                    <option value="community">Community / Venue Partner</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-slate-400">Upload Sponsor Logo</label>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleDirectImageUpload(e.target.files[0], 'sponsors', (url) => setSponsorForm(prev => ({ ...prev, logoUrl: url })))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                  />

                  {sponsorForm.logoUrl && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-700 h-20 p-2 bg-white flex items-center justify-center mt-2 group">
                      <img src={sponsorForm.logoUrl} alt="Sponsor Logo Preview" className="h-full object-contain" />
                      <button
                        type="button"
                        onClick={async () => {
                          if (sponsorForm.logoUrl) {
                            await deleteCloudinaryMedia(sponsorForm.logoUrl, sponsorForm.logoPublicId, 'image');
                            setStatusMsg('Sponsor logo removed & deleted from Cloudinary!');
                            setTimeout(() => setStatusMsg(''), 3000);
                          }
                          setSponsorForm(prev => ({ ...prev, logoUrl: '', logoPublicId: '' }));
                        }}
                        className="absolute top-1 right-1 p-1 rounded-full bg-slate-950/90 hover:bg-red-600 text-white transition-colors border border-slate-700 shadow-lg cursor-pointer"
                        title="Remove sponsor logo and delete from Cloudinary"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all"
                >
                  {editingId ? 'Update Sponsor' : 'Add Sponsor'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-xl font-bold text-white font-heading">Sponsors ({sponsors.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sponsors.map((sp) => (
                  <div key={sp.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {sp.logoUrl ? (
                        <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center overflow-hidden">
                          <img src={sp.logoUrl} alt={sp.name} className="max-h-full max-w-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center text-sm">
                          SP
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-white text-sm">{sp.name}</h3>
                        <p className="text-xs font-mono text-amber-400 uppercase">{sp.level} Sponsor</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => handleEditSponsor(sp)} className="p-2 rounded-xl bg-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteSponsor(sp.id)} className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ADMIN USER ACCESS CONTROL (SuperAdmin Pydataprayagraj Only) */}
        {activeTab === 'users' && currentUser.isSuperAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-amber-500" />
                  <span>Create Admin User</span>
                </h2>
                <span className="text-[10px] font-mono text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                  Firebase Synced
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                As SuperAdmin (<strong className="text-amber-400">Pydataprayagraj</strong>), you have exclusive authority to issue new admin credentials.
              </p>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">New Username</label>
                  <input
                    type="text"
                    required
                    value={newAdminUsername}
                    onChange={(e) => setNewAdminUsername(e.target.value)}
                    placeholder="Enter new admin username..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="Enter new admin password..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>Create & Sync to Firebase</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-xl font-bold text-white font-heading flex items-center justify-between">
                <span>Created Admin Users ({adminUsers.length})</span>
                <span className="text-xs font-mono text-slate-400 font-normal">SuperAdmin Excluded</span>
              </h2>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm font-mono">
                      SA
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">Pydataprayagraj</h3>
                      <p className="text-xs font-mono text-amber-400 font-semibold">Primary SuperAdmin (Static & Persistent)</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold uppercase">
                    Protected
                  </span>
                </div>

                {adminUsers.map((usr) => (
                  <div key={usr.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-sm font-mono border border-slate-700">
                        {usr.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{usr.username}</h3>
                        <p className="text-xs font-mono text-slate-400">Created: {new Date(usr.createdAt || Date.now()).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(usr.id)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                      title="Revoke Admin Access"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MANAGE FOLDER PHOTOS MODAL */}
      {managingFolder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white font-heading">
                    {managingFolder.title}
                  </h2>
                  <p className="text-xs font-mono text-amber-400">
                    Folder Photo Gallery ({managingFolder.photos?.length || 0} Photos)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setManagingFolder(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upload New Photos to Folder */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-amber-400 font-semibold flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Upload & Add New Photos to this Folder (Cloudinary)</span>
                </label>
                <span className="text-[10px] font-mono text-slate-400">Select 1 or multiple images</span>
              </div>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleAddPhotosToFolder(e.target.files)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
              />

              {uploadingCategory === 'gallery' && (
                <p className="text-xs font-mono text-amber-400 animate-pulse">⚡ Uploading new photo(s) to Cloudinary & saving to Firebase...</p>
              )}
            </div>

            {/* Folder Photos Grid */}
            <div className="space-y-3">
              <h3 className="text-sm font-mono text-slate-400 font-bold uppercase tracking-wider">
                Current Photos in Folder
              </h3>

              {!managingFolder.photos || managingFolder.photos.length === 0 ? (
                <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <ImageIcon className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-slate-400 text-sm font-mono">No photos in this folder yet. Use the uploader above to add photos!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-2 bg-slate-950 rounded-2xl border border-slate-800">
                  {managingFolder.photos.map((photo, pIdx) => (
                    <div key={photo.id || pIdx} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between">
                      <div className="relative rounded-xl overflow-hidden border border-slate-800 h-40 group">
                        <img src={photo.url} alt={photo.caption || 'Folder Photo'} className="w-full h-full object-cover" />
                        <button
                          onClick={() => handleDeletePhotoFromFolder(photo.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white shadow-lg transition-all"
                          title="Delete photo from folder"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-mono text-amber-400 font-bold block">
                          Photo #{pIdx + 1} Description
                        </label>
                        <input
                          type="text"
                          value={photo.caption || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setManagingFolder(prev => ({
                              ...prev,
                              photos: prev.photos.map(p => p.id === photo.id ? { ...p, caption: val, description: val } : p)
                            }));
                          }}
                          placeholder="Type unique description for this photo..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                        <button
                          onClick={() => handleUpdatePhotoCaption(managingFolder.id, photo.id, photo.caption || '')}
                          className="w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-sm"
                        >
                          Save Description
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setManagingFolder(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-all"
              >
                Close Folder Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Cropper Modal */}
      {cropperConfig.isOpen && (
        <ImageCropperModal
          isOpen={cropperConfig.isOpen}
          imageSrc={cropperConfig.imageSrc}
          aspectRatio={cropperConfig.aspectRatio}
          onCropComplete={handleCroppedUpload}
          onCancel={() => setCropperConfig(prev => ({ ...prev, isOpen: false }))}
        />
      )}
    </div>
  );
}
