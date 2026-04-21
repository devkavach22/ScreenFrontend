import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ImagePreview from './components/ImagePreview';
import './App.css';
import "./index.css"

const API_BASE = 'http://localhost:3001/api';


function App() {
  const [view, setView] = useState('login'); // login, users, dates, images
  const [sshConfig, setSshConfig] = useState(null);
  const [data, setData] = useState([]);
  const [path, setPath] = useState({ user: null, date: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Helper to handle API calls
  const callApi = async (endpoint, payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE}/${endpoint}`, {
        ...sshConfig,
        ...payload,
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (config) => {
    setSshConfig(config);
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE}/list-users`, config);
      setData(response.data.users);
      setView('users');
      setSshConfig(config);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const navigate = async (targetView, user = null, date = null) => {
    let result = null;
    if (targetView === 'users') {
      result = await callApi('list-users', {});
      if (result) {
        setData(result.users);
        setPath({ user: null, date: null });
        setView('users');
      }
    } else if (targetView === 'dates') {
      result = await callApi('list-dates', { userPath: user });
      if (result) {
        setData(result.dates);
        setPath({ user, date: null });
        setView('dates');
      }
    } else if (targetView === 'images') {
      result = await callApi('list-images', { userPath: user, date: date });
      if (result) {
        setData(result.images);
        setPath({ user, date });
        setView('images');
      }
    }
  };

  const handleBack = () => {
    if (view === 'dates') navigate('users');
    if (view === 'images') navigate('dates', path.user);
  };

  const handleSelectImage = async (imagePath) => {
    const result = await callApi('get-image', { imagePath });
    if (result) {
      setSelectedImage(result.data);
    }
  };

  const handleRefresh = () => {
    if (view === 'users') navigate('users');
    if (view === 'dates') navigate('dates', path.user);
    if (view === 'images') navigate('images', path.user, path.date);
  };

  return (
    <div className="min-h-screen">
      {view === 'login' ? (
        <Login onConnect={handleConnect} loading={loading} error={error} />
      ) : (
        <Dashboard 
          view={view}
          data={data}
          path={path}
          loading={loading}
          onNavigate={navigate}
          onBack={handleBack}
          onSelectImage={handleSelectImage}
          onRefresh={handleRefresh}
        />
      )}

      {selectedImage && (
        <ImagePreview 
          image={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </div>
  );
}

export default App;
