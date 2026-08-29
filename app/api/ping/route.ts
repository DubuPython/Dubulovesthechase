import { NextResponse } from 'next/server';

export async function POST() {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    return NextResponse.json({ error: 'Webhook URL missing' }, { status: 500 });
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        content: '🔔 **Ping!** Jo just visited the site and pressed the button.' 
      }),
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send ping' }, { status: 500 });
  }
}