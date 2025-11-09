import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2, FileText } from 'lucide-react';

export default function ResourceUploadUI({ username = 'anonymous' }) {
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const RESOURCE_TYPES = [
    'PRINTED PDF',
    'WRITTEN NOTES',
    'PAST PAPER'
  ];

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
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (selectedFile.size > MAX_SIZE_BYTES) {
      setError('File is too large. Maximum size is 20 MB.');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    
    setFile(selectedFile);
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    setResponse(null);

    console.log('DEBUG submit start', { subject, title, type, file, username });

    if (!subject.trim()) {
      setError('Please enter a subject name');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    if (!type) {
      setError('Please select a resource type');
      return;
    }
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('subject', subject.trim());
      formData.append('title', title.trim());
      formData.append('type', type);
      formData.append('file', file);
      formData.append('username', username || 'anonymous');

      console.log('DEBUG FormData prepared');
      for (let pair of formData.entries()) {
        console.log('FormData entry:', pair[0], pair[1] && pair[1].name ? pair[1].name : pair[1]);
      }

      const uploadRes = await fetch('http://localhost:5000/api/resource_upload', {
        method: 'POST',
        body: formData,
      });

      const uploadText = await uploadRes.text().catch(() => '');
      let uploadData = null;
      try { 
        uploadData = uploadText ? JSON.parse(uploadText) : null; 
      } catch { 
        uploadData = null; 
      }

      console.log('DEBUG upload response', { 
        status: uploadRes.status, 
        bodyText: uploadText, 
        bodyJson: uploadData 
      });

      if (!uploadRes.ok) {
        const serverMsg = (uploadData && (uploadData.message || uploadData.error)) 
          || uploadText 
          || `Upload failed with status ${uploadRes.status}`;
        throw new Error(serverMsg);
      }

      if (!uploadData || !uploadData.success) {
        const serverMsg = (uploadData && (uploadData.message || uploadData.error)) 
          || 'Upload returned unexpected payload';
        throw new Error(serverMsg);
      }

      setResponse(uploadData);

      // capture values to send to resource_library API before clearing the form
      const s = subject.trim();
      const t = title.trim();
      const ty = type;
      const user = username || 'anonymous';
      const drivelink = uploadData && (uploadData.driveLink || uploadData.viewLink || uploadData.drive_link || uploadData.link || '');

      // Clear form on success
      setSubject('');
      setTitle('');
      setType('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      // Notify resource library API with ordered JSON: subject, title, type, username, drivelink
      (async () => {
        try {
          const payload = {};
          payload.subject = s;
          payload.title = t;
          payload.type = ty;
          payload.username = user;
          payload.drive_link = drivelink;

          console.log('DEBUG posting metadata to /api/resource_library', payload);

          const notifyRes = await fetch('http://localhost:5000/api/resource_library', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          const notifyText = await notifyRes.text().catch(() => '');
          let notifyJson = null;
          try { notifyJson = notifyText ? JSON.parse(notifyText) : null; } catch { notifyJson = null; }
          console.log('DEBUG resource_library response', { status: notifyRes.status, bodyText: notifyText, bodyJson: notifyJson });

          if (!notifyRes.ok) {
            console.warn('resource_library API returned non-OK status', notifyRes.status);
          }
        } catch (err) {
          console.warn('Failed to POST metadata to /api/resource_library', err);
        }
      })();

    } catch (err) {
      console.error('Upload error (detailed):', err);
      setError(err.message || 'Failed to upload file. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 rounded-full mb-4">
              <FileText className="w-8 h-8 text-violet-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Resource Upload</h1>
            <p className="text-gray-500 mt-2">Share educational resources</p>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject Name
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Mathematics, Physics"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                placeholder="e.g., Chapter 5 Notes"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Resource Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed bg-white"
              >
                <option value="">Select resource type</option>
                {RESOURCE_TYPES.map((resourceType) => (
                  <option key={resourceType} value={resourceType}>
                    {resourceType}
                  </option>
                ))}
              </select>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                      {response.message || 'Resource uploaded successfully!'}
                    </p>
                    {response.viewLink && (
                      <a
                        href={response.viewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-sm text-violet-600 hover:text-violet-800 font-medium underline"
                      >
                        View Resource &rarr;
                      </a>
                    )}
                    {response.driveLink && !response.viewLink && (
                      <a
                        href={response.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-sm text-violet-600 hover:text-violet-800 font-medium underline"
                      >
                        View Resource &rarr;
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-violet-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Resource
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}