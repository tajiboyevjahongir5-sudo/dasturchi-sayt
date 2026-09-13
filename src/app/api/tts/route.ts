import { NextRequest, NextResponse } from 'next/server';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import crypto from 'crypto';

// In-memory LRU cache for synthesized audio buffers (max 250 items)
const audioCache = new Map<string, { buffer: Buffer; timestamp: number }>();
const MAX_CACHE_ITEMS = 250;

function getCachedAudio(key: string): Buffer | null {
  const item = audioCache.get(key);
  if (!item) return null;
  item.timestamp = Date.now();
  return item.buffer;
}

function setCachedAudio(key: string, buffer: Buffer) {
  if (audioCache.size >= MAX_CACHE_ITEMS) {
    // Delete oldest entry
    let oldestKey: string | null = null;
    let oldestTime = Infinity;
    for (const [k, v] of audioCache.entries()) {
      if (v.timestamp < oldestTime) {
        oldestTime = v.timestamp;
        oldestKey = k;
      }
    }
    if (oldestKey) audioCache.delete(oldestKey);
  }
  audioCache.set(key, { buffer, timestamp: Date.now() });
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const text = searchParams.get('text') || '';

  return handleTTS(text);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = body.text || '';

    return handleTTS(text);
  } catch {
    return NextResponse.json({ success: false, error: 'Noto‘g‘ri so‘rov tanasi' }, { status: 400 });
  }
}

async function handleTTS(rawText: string) {
  const text = rawText.trim();
  if (!text) {
    return NextResponse.json({ success: false, error: 'Matn kiritilmagan' }, { status: 400 });
  }

  // Limit utterance length to 1000 characters
  const trimmedText = text.length > 1000 ? text.substring(0, 1000) + '...' : text;

  // Dedicated natural Uzbek teacher voice (Sardor)
  const voice = 'uz-UZ-SardorNeural';

  const cacheKey = crypto.createHash('md5').update(`v2-96k:${voice}:${trimmedText}`).digest('hex');

  // Check cache
  const cachedBuffer = getCachedAudio(cacheKey);
  if (cachedBuffer) {
    return new Response(new Uint8Array(cachedBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': cachedBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Cache': 'HIT',
      },
    });
  }

  try {
    // Generate audio using MsEdgeTTS with high-fidelity 96kbps MP3
    const ttsPromise = (async () => {
      const tts = new MsEdgeTTS();
      await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
      const { audioStream } = tts.toStream(trimmedText);

      const chunks: Buffer[] = [];
      await new Promise<void>((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        audioStream.on('data', (chunk: any) => chunks.push(Buffer.from(chunk)));
        audioStream.on('end', () => resolve());
        audioStream.on('error', (err) => reject(err));
      });

      return Buffer.concat(chunks);
    })();

    const timeoutPromise = new Promise<Buffer>((_, reject) => {
      setTimeout(() => reject(new Error('TTS generation timeout')), 9000);
    });

    const finalBuffer = await Promise.race([ttsPromise, timeoutPromise]);

    // Save in cache
    setCachedAudio(cacheKey, finalBuffer);

    return new Response(new Uint8Array(finalBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': finalBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('TTS API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ovoz hosil qilishda xatolik yuz berdi'
      }, 
      { status: 500 }
    );
  }
}
