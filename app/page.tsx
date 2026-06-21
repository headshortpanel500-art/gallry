'use client';

import React, { useEffect, useState } from 'react';

interface Photo {
  id: string;
  fileName: string;
  uploadedAt: string;
  url: string;
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ছবি লোড করার ফাংশন
  async function fetchPhotos() {
    try {
      const res = await fetch('/api/photos');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPhotos(data);
      }
    } catch (err) {
      console.error("Failed to load photos", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPhotos();
  }, []);

  // ছবি ডিলিট করার ফাংশন
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // বাটনে ক্লিক করলে যাতে লাইটবক্স ওপেন না হয়ে যায়
    
    if (!confirm("Are you sure you want to delete this photo from MongoDB?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/photos?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        // ডিলিট সফল হলে স্টেট থেকে ছবিটিকে সরিয়ে ফেলা
        setPhotos(photos.filter(photo => photo.id !== id));
        if (selectedPhoto?.id === id) setSelectedPhoto(null); // বড় করা থাকলে ওটা ক্লোজ হবে
      } else {
        alert("Failed to delete: " + data.error);
      }
    } catch (err) {
      console.error("Error deleting photo:", err);
      alert("Something went wrong while deleting.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a13] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#101a35] via-[#070a13] to-[#03050a] text-white font-sans selection:bg-blue-500 selection:text-white">
      
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-blue-500/10 bg-[#070a13]/70 backdrop-blur-xl sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)] ring-1 ring-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent">
              CLOUD VAULT <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 ml-1">PRO</span>
            </h1>
            <p className="text-xs text-blue-400/60 font-mono">backupph.vercel.app</p>
          </div>
        </div>

        <div className="text-sm bg-blue-950/30 border border-blue-500/20 backdrop-blur-md px-5 py-2.5 rounded-xl text-blue-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live Sync:</span> 
          <span className="font-mono font-bold text-white bg-blue-500/30 px-2 py-0.5 rounded-md ml-1">{photos.length}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        <div className="mb-12 border-l-4 border-blue-500 pl-6 py-2 bg-gradient-to-r from-blue-500/5 to-transparent rounded-r-xl">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Secure Database <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Dashboard</span>
          </h2>
          <p className="text-gray-400 mt-2 text-sm max-w-2xl">
            Manage your assets securely. Delete any content directly from your remote MongoDB collection below.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-blue-500 border-r-cyan-400 rounded-full animate-spin"></div>
            </div>
            <p className="text-blue-300/80 text-sm font-mono tracking-widest animate-pulse">UPLINKING DATABASE...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && photos.length === 0 && (
          <div className="text-center py-28 border border-dashed border-blue-500/20 rounded-3xl bg-[#090f1f]/60 backdrop-blur-sm max-w-xl mx-auto shadow-2xl">
            <h3 className="text-xl font-bold text-gray-200">No Assets Found</h3>
            <p className="text-gray-400 text-sm mt-2">Database cluster is empty.</p>
          </div>
        )}

        {/* Photo Grid */}
        {!loading && photos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <div 
                key={photo.id} 
                onClick={() => setSelectedPhoto(photo)}
                className="group relative bg-[#0b1224] border border-blue-500/10 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all duration-500 hover:-translate-y-1.5 cursor-pointer shadow-lg flex flex-col justify-between"
              >
                <div className="aspect-[4/3] w-full bg-[#111a33] overflow-hidden relative">
                  <img 
                    src={photo.url} 
                    alt={photo.fileName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070a13] via-transparent to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
                  
                  {/* Premium Red Delete Button (Hover করলে গ্লো করবে) */}
                  <button
                    onClick={(e) => handleDelete(e, photo.id)}
                    disabled={deletingId === photo.id}
                    className="absolute top-3 left-3 p-2 rounded-xl bg-red-950/80 hover:bg-red-600 border border-red-500/30 text-red-400 hover:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] z-20 disabled:opacity-50"
                    title="Delete permanently"
                  >
                    {deletingId === photo.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Footer Info */}
                <div className="p-4 bg-gradient-to-b from-[#0b1224] to-[#070b16]">
                  <p className="text-sm font-semibold text-gray-200 truncate group-hover:text-blue-400 transition-colors duration-300">
                    {photo.fileName}
                  </p>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-blue-500/5">
                    <p className="text-[11px] font-mono text-gray-500">
                      {new Date(photo.uploadedAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox Preview */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/10 shadow-2xl relative bg-[#070a13]"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selectedPhoto.url} alt={selectedPhoto.fileName} className="max-w-full max-h-[75vh] object-contain mx-auto" />
            <div className="p-4 bg-[#0b1224] flex justify-between items-center gap-4">
              <p className="text-sm font-mono text-gray-300 truncate max-w-xs">{selectedPhoto.fileName}</p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={(e) => handleDelete(e, selectedPhoto.id)}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-semibold text-white transition-all flex items-center space-x-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete</span>
                </button>
                <button onClick={() => setSelectedPhoto(null)} className="text-xs text-gray-400 hover:text-white px-2 py-1">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}