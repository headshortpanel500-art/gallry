// app/api/telegram-upload/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Vercel হোস্টিংয়ে ভিডিও আপলোডের সময় যাতে টাইমআউট না হয় (সর্বোচ্চ ৬০ সেকেন্ড)
export const maxDuration = 60;

const BOT_TOKEN = '8607330487:AAFQ7JtMAahMncHtxMLIhUn53j7WI3YUBU8';
const CHANNEL_ID = '-1004331318679';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // অ্যান্ড্রয়েড থেকে পাঠানো 'photo' অথবা 'video' ফাইল রিসিভ করা
    const photoFile = formData.get('photo') as File | null;
    const videoFile = formData.get('video') as File | null;

    const file = photoFile || videoFile;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // ফাইলটি ভিডিও নাকি ছবি তা ডিটেক্ট করা
    const isVideo = videoFile !== null || file.type.startsWith('video/');
    const telegramMethod = isVideo ? 'sendVideo' : 'sendPhoto';
    const telegramField = isVideo ? 'video' : 'photo';

    // ফাইলটিকে Buffer-এ কনভার্ট করা
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // টেলিগ্রাম সার্ভারে পাঠানোর জন্য FormData তৈরি করা
    const telegramForm = new FormData();
    telegramForm.append('chat_id', CHANNEL_ID);
    
    const blob = new Blob([buffer], { type: file.type });
    telegramForm.append(telegramField, blob, file.name);

    // টেলিগ্রামের অফিশিয়াল এন্ডপয়েন্টে (sendPhoto অথবা sendVideo) পাঠানো
    const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${telegramMethod}`, {
      method: 'POST',
      body: telegramForm,
    });

    const telegramResult = await telegramResponse.json();

    // টেলিগ্রাম রেসপন্স চেক করা
    if (telegramResult.ok) {
      console.log(`🟢 Asset successfully redirected to Telegram! Method: ${telegramMethod}, Message ID: ${telegramResult.result.message_id}`);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Saved directly to Telegram Channel successfully!',
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