import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:8080/api'; // Your backend URL

function App() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post(`${API_URL}/users/register`, { username, password, email });
      alert('Registration successful!');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, { username, password });
      setUser(response.data);
      alert('Login successful!');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user.id);

    try {
      await axios.post(`${API_URL}/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully!');
      fetchFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/files/user/${user.id}`);
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await axios.delete(`${API_URL}/files/delete/${fileId}`, {
        params: { userId: user.id },
      });
      alert('File deleted successfully!');
      fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleDownload = (filePath) => {
    window.open(`${API_URL}/files/download/${filePath}?userId=${user.id}`, '_blank');
  };

  const handleUpdate = async (fileId) => {
    // Implement file update logic if needed
  };

  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user]);

  return (
    <div className="App">
      <h1>File Upload App</h1>

      {!user ? (
        <div>
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleRegister}>Register</button>

          <h2>Login</h2>
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h2>Upload File</h2>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload</button>

          <h2>Files</h2>
          <ul>
            {files.map((file) => (
              <li key={file.id}>
                {file.fileName} - {file.fileSize} bytes
                <button onClick={() => handleDownload(file.filePath)}>Download</button>
                <button onClick={() => handleDelete(file.id)}>Delete</button>
                {/* Implement Update functionality if needed */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
