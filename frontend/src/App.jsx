import { useState, useEffect, useCallback } from 'react';
import FileUpload from './components/FileUpload';
import DocumentList from './components/DocumentList';
import Toast from './components/Toast';
import './App.css';

function App() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/documents');
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      showToast('Failed to load documents. Make sure the backend is running.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleUploadSuccess = (document, message) => {
    setDocuments((prev) => [document, ...prev]);
    showToast(message, 'success');
  };

  const handleDelete = (deletedId, message, error) => {
    if (error) {
      showToast(error, 'error');
      return;
    }
    setDocuments((prev) => prev.filter((doc) => doc.id !== deletedId));
    showToast(message, 'success');
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <div className="logo-text">
              <h1>MedVault</h1>
              <span>Medical Document Portal</span>
            </div>
          </div>
          <div className="header-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Secure Portal
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
          <DocumentList
            documents={documents}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </div>
      </main>

      <footer className="footer">
        <p>© 2024 MedVault - Healthcare Document Management System</p>
      </footer>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
