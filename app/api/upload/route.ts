import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('photo') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // ছবিটিকে Buffer (Binary Data)-এ কনভার্ট করা
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ছবির টাইপ বের করা (যেমন: image/jpeg, image/png)
    const fileType = file.type || 'image/jpeg';

    // MongoDB-তে কানেক্ট করা
    const client = await clientPromise;
    const db = client.db('photoBackup');
    
    // সরাসরি বাইনারি ডেটা এবং তার টাইপ ডাটাবেসে সেভ করা
    const result = await db.collection('photos').insertOne({
      imageBuffer: buffer, // সরাসরি ছবির বাইনারি ডেটা ঢুকছে
      contentType: fileType,
      fileName: file.name,
      uploadedAt: new Date(),
    });

    console.log(`🟢 Photo saved directly to MongoDB! ID: ${result.insertedId}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Saved directly to MongoDB successfully!' 
    }, { status: 200 });

  } catch (error: any) {
    console.error('🔴 DB Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}