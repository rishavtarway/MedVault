import './DocumentList.css';

function DocumentList({ documents, onDelete, isLoading }) {
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDownload = (id, filename) => {
        // Create a link to download the file
        const link = document.createElement('a');
        link.href = `http://localhost:3001/documents/${id}`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = async (id, filename) => {
        if (!window.confirm(`Are you sure you want to delete "${filename}"?`)) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/documents/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Delete failed');
            }

            onDelete(id, 'Document deleted successfully!');
        } catch (err) {
            onDelete(null, null, err.message || 'Failed to delete document');
        }
    };

    if (isLoading) {
        return (
            <div className="documents-section">
                <h2 className="section-title">
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    Your Documents
                </h2>
                <div className="documents-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading documents...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="documents-section">
            <h2 className="section-title">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                Your Documents
                {documents.length > 0 && (
                    <span className="document-count">{documents.length}</span>
                )}
            </h2>

            {documents.length === 0 ? (
                <div className="empty-state animate-fade-in">
                    <div className="empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                            <polyline points="13 2 13 9 20 9" />
                        </svg>
                    </div>
                    <h3>No documents yet</h3>
                    <p>Upload your first medical document to get started</p>
                </div>
            ) : (
                <div className="documents-grid">
                    {documents.map((doc, index) => (
                        <div
                            key={doc.id}
                            className="document-card animate-slide-in"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="document-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                                <span className="file-type">PDF</span>
                            </div>

                            <div className="document-info">
                                <h4 className="document-name" title={doc.filename}>
                                    {doc.filename}
                                </h4>
                                <div className="document-meta">
                                    <span className="meta-item">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        {formatDate(doc.created_at)}
                                    </span>
                                    <span className="meta-item">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                        </svg>
                                        {formatFileSize(doc.filesize)}
                                    </span>
                                </div>
                            </div>

                            <div className="document-actions">
                                <button
                                    className="btn btn-secondary btn-icon"
                                    onClick={() => handleDownload(doc.id, doc.filename)}
                                    title="Download"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                </button>
                                <button
                                    className="btn btn-danger btn-icon"
                                    onClick={() => handleDelete(doc.id, doc.filename)}
                                    title="Delete"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        <line x1="10" y1="11" x2="10" y2="17" />
                                        <line x1="14" y1="11" x2="14" y2="17" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DocumentList;
