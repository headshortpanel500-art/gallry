import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// ১. ডাটাবেস থেকে সব ছবি নিয়ে আসার GET মেথড (আগেরটাই)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('photoBackup');
    
    const photosData = await db.collection('photos').find({}).sort({ uploadedAt: -1 }).toArray();

    const formattedPhotos = photosData.map(photo => {
      if (photo.imageBuffer) {
        const base64Image = Buffer.from(photo.imageBuffer.buffer || photo.imageBuffer).toString('base64');
        return {
          id: photo._id.toString(), // ID কে স্ট্রিং বানিয়ে নেওয়া হলো ফ্রন্টএন্ডের জন্য
          fileName: photo.fileName,
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

// ২. নতুন যোগ করা DELETE মেথড (ছবি ডিলিট করার জন্য)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Photo ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('photoBackup');

    // MongoDB থেকে নির্দিষ্ট ID এর ডকুমেন্ট ডিলিট করা
    const result = await db.collection('photos').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    console.log(`🔴 Photo Deleted from DB! ID: ${id}`);
    return NextResponse.json({ success: true, message: 'Photo deleted successfully!' }, { status: 200 });

  } catch (error: any) {
    console.error('🔴 Delete Error:', error);
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}