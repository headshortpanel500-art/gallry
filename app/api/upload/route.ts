import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import fs from 'fs';
import path from 'path';

// Next.js-কে বলা হচ্ছে বডি পার্সিং লিমিট হ্যান্ডেল করতে (ছবি সাইজের জন্য)
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

    // ছবিটিকে Buffer-এ কনভার্ট করা
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ১. লোকালি ছবি সেভ করার জন্য 'public/uploads' ফোল্ডার পাথ তৈরি
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // ইউনিক নাম দিয়ে ছবি সেভ করা
    const fileName = `backup_${Date.now()}_${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    await fs.promises.writeFile(filePath, buffer);

    // ব্রাউজারে দেখানোর জন্য ছবির লোকাল URL পাথ
    const imageUrl = `/uploads/${fileName}`;

    // ২. এবার তথ্যটি MongoDB ডাটাবেসে সেভ করা
    const client = await clientPromise;
    const db = client.db('photoBackup'); // তোমার ডাটাবেসের নাম
    
    const result = await db.collection('photos').insertOne({
      url: imageUrl,
      fileName: fileName,
      uploadedAt: new Date(),
    });

    console.log(`🟢 Photo Saved! Database ID: ${result.insertedId}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Photo uploaded and saved to DB successfully!',
      id: result.insertedId 
    }, { status: 200 });

  } catch (error: any) {
    console.error('🔴 Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}