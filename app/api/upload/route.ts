import { NextRequest, NextResponse } from 'next/server';

// Next.js এপিআই কনফিগারেশন
export const config = {
  api: {
    bodyParser: false,
  },
};

// তোমার টেলিগ্রাম ক্রেডেনশিয়ালস
const BOT_TOKEN = '8607330487:AAFQ7JtMAahMncHtxMLIhUn53j7WI3YUBU8';
const CHANNEL_ID = '-1004331318679';

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

    // টেলিগ্রাম সার্ভারে ফাইল পাঠানোর জন্য নতুন FormData তৈরি করা
    const telegramForm = new FormData();
    telegramForm.append('chat_id', CHANNEL_ID);
    
    // Blob আকারে বাফার ফাইলটি টেলিগ্রাম ফর্মে যুক্ত করা
    const blob = new Blob([buffer], { type: file.type || 'image/jpeg' });
    telegramForm.append('photo', blob, file.name);

    // টেলিগ্রামের অফিশিয়াল sendPhoto এন্ডপয়েন্টে রিকোয়েস্ট পাঠানো
    const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: telegramForm,
    });

    const telegramResult = await telegramResponse.json();

    // টেলিগ্রাম যদি সাকসেসফুলি রেসপন্স করে
    if (telegramResult.ok) {
      console.log(`🟢 Photo successfully redirected to Telegram Channel! Message ID: ${telegramResult.result.message_id}`);
      
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