import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('photoBackup');
    
    // ডাটাবেস থেকে সব ছবি লেটেস্ট অনুযায়ী নিয়ে আসা
    const photosData = await db.collection('photos').find({}).sort({ uploadedAt: -1 }).toArray();

    // বাইনারি বাফারকে ব্রাউজারে দেখানোর উপযোগী Base64 Data URL-এ কনভার্ট করা
    const formattedPhotos = photosData.map(photo => {
      if (photo.imageBuffer) {
        // মঙ্গোডিবি থেকে আসা বাইনারি বাফারকে Base64 এ রূপান্তর
        const base64Image = Buffer.from(photo.imageBuffer.buffer || photo.imageBuffer).toString('base64');
        return {
          id: photo._id,
          fileName: photo.fileName,
          // এই URL টি সরাসরি HTML <img> ট্যাগের src-তে বসানো যাবে
          url: `data:${photo.contentType};base64,${base64Image}`,
          uploadedAt: photo.uploadedAt
        };
      }
      return null;
    }).filter(p => p !== null);

    return NextResponse.json(formattedPhotos, { status: 200 });

  } catch (error: any) {
    console.error('🔴 Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}