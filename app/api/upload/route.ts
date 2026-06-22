// app/api/telegram-upload/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

const BOT_TOKEN = '8607330487:AAFQ7JtMAahMncHtxMLIhUn53j7WI3YUBU8';
const CHANNEL_ID = '-1004331318679';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // অ্যান্ড্রয়েড থেকে পাঠানো ডেটা রিসিভ করা
    const photoFile = formData.get('photo') as File | null;
    const videoFile = formData.get('video') as File | null;
    const deviceName = formData.get('device_name') as string | null; // 📱 ফোনের নাম রিসিভ করলাম

    const file = photoFile || videoFile;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const mimeType = file.type || '';
    const isVideo = videoFile !== null || mimeType.startsWith('video/') || file.name.endsWith('.mp4');
    
    const telegramMethod = isVideo ? 'sendVideo' : 'sendPhoto';
    const telegramField = isVideo ? 'video' : 'photo';

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const telegramForm = new FormData();
    telegramForm.append('chat_id', CHANNEL_ID);
    
    const defaultMime = isVideo ? 'video/mp4' : 'image/jpeg';
    const blob = new Blob([buffer], { type: mimeType || defaultMime });
    telegramForm.append(telegramField, blob, file.name);

    // 🎯 টেলিগ্রামের ক্যাপশনে ফোনের নাম যুক্ত করে দেওয়া
    const uploadDevice = deviceName || 'Unknown Device';
    const captionText = `📱 Uploaded From: ${uploadDevice}\n📁 File: ${file.name}`;
    telegramForm.append('caption', captionText);

    // টেলিগ্রাম এপিআই কল
    const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${telegramMethod}`, {
      method: 'POST',
      body: telegramForm,
    });

    const telegramResult = await telegramResponse.json();

    if (telegramResult.ok) {
      console.log(`🟢 Success from ${uploadDevice}! Message ID: ${telegramResult.result.message_id}`);
      return NextResponse.json({ 
        success: true, 
        message: `Saved from ${uploadDevice} successfully!`,
        messageId: telegramResult.result.message_id
      }, { status: 200 });
    } else {
      console.error('🔴 Telegram API Error:', telegramResult);
      return NextResponse.json({ error: telegramResult.description || 'Telegram upload failed.' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('🔴 Relay Server Error:', error);
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}