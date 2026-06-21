import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export async function GET() {
  try {
    if (!uri) {
      return NextResponse.json({ error: "MONGODB_URI is not defined" }, { status: 500 });
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('photoBackup');

    // সব ছবি নতুন থেকে পুরানো ক্রমানুসারে নিয়ে আসা
    const photos = await db.collection('photos')
      .find({})
      .sort({ uploadedAt: -1 })
      .toArray();

    // ছবিগুলোকে ফ্রন্টএন্ডের জন্য প্রসেস করা
    const formattedPhotos = photos.map(photo => {
      let base64Image = '';
      if (photo.imageBuffer) {
        // MongoDB Binary-কে Base64 এ কনভার্ট করা
        base64Image = `data:${photo.contentType};base64,${photo.imageBuffer.buffer.toString('base64')}`;
      }

      return {
        id: photo._id.toString(), // এখানে ফিক্স করা হয়েছে
        imageName: photo.imageName,
        uploadedAt: photo.uploadedAt,
        src: base64Image
      };
    });

    await client.close();
    return NextResponse.json({ success: true, photos: formattedPhotos });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}