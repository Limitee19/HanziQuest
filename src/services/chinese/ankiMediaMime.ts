// Shared MIME helpers for Anki media files & data URLs.

const AUDIO_EXT_MIME: Record<string, string> = {
  mp3: 'audio/mpeg',
  m4a: 'audio/mp4', // FIX: was 'audio/m4a' (invalid) — WebView silently refused to play
  aac: 'audio/aac',
  ogg: 'audio/ogg',
  oga: 'audio/ogg',
  opus: 'audio/ogg',
  wav: 'audio/wav',
  flac: 'audio/flac',
};

const IMAGE_EXT_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  bmp: 'image/bmp',
  svg: 'image/svg+xml',
};

/** Resolves MIME type for a media filename. */
export function getMimeType(fileName: string): { mimeType: string; mediaType: 'image' | 'audio' } {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (AUDIO_EXT_MIME[ext]) return { mediaType: 'audio', mimeType: AUDIO_EXT_MIME[ext] };
  if (IMAGE_EXT_MIME[ext]) return { mediaType: 'image', mimeType: IMAGE_EXT_MIME[ext] };
  return { mediaType: 'image', mimeType: 'application/octet-stream' };
}

/** Detect audio MIME from a data URL, normalizing legacy/invalid subtypes (e.g. audio/m4a). */
export function audioMimeFromDataUrl(dataUrl: string): string {
  const m = dataUrl.slice(0, 60).match(/data:audio\/([a-z0-9.+-]+)/i);
  if (m) {
    const sub = m[1].toLowerCase();
    if (sub === 'm4a' || sub === 'x-m4a' || sub === 'mp4a') return 'audio/mp4';
    if (sub === 'x-mpeg' || sub === 'mp3') return 'audio/mpeg';
    return `audio/${sub}`;
  }
  return 'audio/mpeg';
}
