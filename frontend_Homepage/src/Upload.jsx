import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function FileUploadUI({ username = 'anonymous' }) {
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError('Invalid file type. Only PDF, DOC, DOCX files are allowed.');
      setFile(null);
      // Clear file input
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (selectedFile.size > MAX_SIZE_BYTES) {
      setError('File is too large. Maximum size is 20 MB.');
      setFile(null);
      // Clear file input
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    
    setFile(selectedFile);
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    setResponse(null);

    console.log('DEBUG submit start', { subject, title, file, username });

    if (!subject.trim()) {
      setError('Please enter a subject name');
      console.log('DEBUG validation failed: subject empty');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a title');
      console.log('DEBUG validation failed: title empty');
      return;
    }
    if (!file) {
      setError('Please select a file to upload');
      console.log('DEBUG validation failed: file missing');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('title', title);
      formData.append('file', file);

      // DEBUG: show FormData keys (file name not directly visible in FormData keys in some browsers)
      for (let pair of formData.entries()) {
        console.log('FormData entry:', pair[0], pair[1] && pair[1].name ? pair[1].name : pair[1]);
      }

      const uploadRes = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadText = await uploadRes.text().catch(() => '');
      let uploadData = null;
      try { uploadData = uploadText ? JSON.parse(uploadText) : null; } catch { uploadData = null; }

      console.log('DEBUG upload response', { status: uploadRes.status, bodyText: uploadText, bodyJson: uploadData });

      if (!uploadRes.ok) {
        const serverMsg = (uploadData && (uploadData.message || uploadData.error)) || uploadText || `Upload failed with status ${uploadRes.status}`;
        throw new Error(serverMsg);
      }

      if (!uploadData || !uploadData.success) {
        const serverMsg = (uploadData && (uploadData.message || uploadData.error)) || 'Upload returned unexpected payload';
        throw new Error(serverMsg);
      }

      const driveLink = uploadData.viewLink || uploadData.driveLink || uploadData.link || '';

      const notePayload = {
        subject: subject.trim(),
        title: title.trim(),
        drive_link: driveLink,
        username: username || 'anonymous'
      };

      console.log('DEBUG posting notes payload', notePayload);

      const notesRes = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notePayload)
      });

      const notesText = await notesRes.text().catch(() => '');
      let notesData = null;
      try { notesData = notesText ? JSON.parse(notesText) : null; } catch { notesData = null; }

      console.log('DEBUG notes response', { status: notesRes.status, bodyText: notesText, bodyJson: notesData });

      if (!notesRes.ok) {
        const notesMsg = (notesData && (notesData.message || notesData.error)) || notesText || `Notes save failed with status ${notesRes.status}`;
        throw new Error(notesMsg);
      }

      setResponse({
        ...uploadData,
        notesSaved: true,
        notesMessage: notesData && notesData.message
      });

      setSubject('');
      setTitle('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

    } catch (err) {
      console.error('Upload error (detailed):', err);
      setError(err.message || 'Failed to upload file. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Upload className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">File Upload</h1>
            <p className="text-gray-500 mt-2">Share your files securely</p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject Name
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject name"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-2">
                Select File (PDF, DOC, DOCX - Max 20MB)
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="file-input"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: <span className="font-medium">{file.name}</span> ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {error && (
              <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {response && response.success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900 mb-2">
                      {response.message || 'File uploaded successfully!'}
                    </p>
                    {response.viewLink && (
                      <a
                        href={response.viewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-sm text-indigo-600 hover:text-indigo-800 font-medium underline"
                      >
                        View File &rarr;
                      </a>
                    )}
                    {response.notesSaved && response.notesMessage && (
                      <p className="text-xs text-gray-600 mt-2">
                        Note: {response.notesMessage}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload File
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
