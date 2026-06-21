// app/page.tsx
'use client';

import React, { useEffect, useState } from 'react';

interface Photo {
  id: string;
  imageName: string;
  uploadedAt: string;
  src: string;
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch('/api/photos');
        const data = await res.json();
        if (data.success) {
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
    <div className="min-h-screen bg-gradient-to-b from-[#0B0F19] via-[#111827] to-[#0B0F19] text-white font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Header / Navbar */}
      <header className="border-b border-blue-900/30 bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {/* Blue Glowing Icon */}
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Cloud Vault
            </h1>
            <p className="text-xs text-gray-400">backupph.vercel.app</p>
          </div>
        </div>

        <div className="text-sm bg-blue-950/40 border border-blue-800/40 px-4 py-2 rounded-lg text-blue-400 shadow-inner">
          Total Backup: <span className="font-bold text-white ml-1">{photos.length}</span> Photos
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Welcome Section */}
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Welcome to Your <span className="text-blue-500">Secure Vault</span>
          </h2>
          <p className="text-gray-400 mt-2 text-sm max-w-xl">
            All your mobile backup images are safely processed, encrypted, and stored inside your custom MongoDB cluster.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm animate-pulse">Connecting to database...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && photos.length === 0 && (
          <div className="text-center py-24 border border-dashed border-blue-900/40 rounded-2xl bg-[#0E1424]/40">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-900/60 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5M5 19v-2a2 2 0 00-2-2h11" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-300">No photos backed up yet</h3>
            <p className="text-gray-500 text-sm mt-1">Connect your mobile app to begin automatic sync.</p>
          </div>
        )}

        {/* Premium High Quality Photo Grid */}
        {!loading && photos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <div 
                key={photo.id} 
                className="group relative bg-[#0E1424] border border-blue-900/20 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all duration-300 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] flex flex-col justify-between"
              >
                {/* Image Section */}
                <div className="aspect-[4/3] w-full bg-[#161F38] overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={photo.src} 
                    alt={photo.imageName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <span className="text-xs text-blue-300 truncate w-full">{photo.imageName}</span>
                  </div>
                </div>

                {/* Info Footer of Card */}
                <div className="p-4 bg-gradient-to-b from-[#0E1424] to-[#0A0E1A]">
                  <p className="text-sm font-medium text-gray-200 truncate group-hover:text-blue-400 transition-colors">
                    {photo.imageName || 'Untitled Sync'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(photo.uploadedAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}