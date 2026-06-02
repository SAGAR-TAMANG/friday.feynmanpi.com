import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const os = searchParams.get('os');
  const urlOnly = searchParams.get('urlOnly') === 'true';

  // The public URL of your Cloudflare R2 bucket
  const BASE_URL = 'https://download.friday.feynmanpi.com';

  const handleResponse = (filename: string | null, errorMsg?: string) => {
    if (filename) {
      const finalUrl = `${BASE_URL}/${filename}`;
      // Return JSON if requested by the client-side toast handler
      return urlOnly ? NextResponse.json({ url: finalUrl }) : NextResponse.redirect(finalUrl);
    }
    
    // Error cases
    if (urlOnly) {
      return NextResponse.json({ error: errorMsg || 'File not found' }, { status: 404 });
    }
    return NextResponse.redirect('https://friday.feynmanpi.com');
  };

  try {
    if (os === 'windows') {
      const response = await fetch(`${BASE_URL}/latest.yml`, { next: { revalidate: 60 } }); 
      if (!response.ok) return handleResponse(null, 'Windows release not uploaded yet.');
      
      const ymlText = await response.text();
      const match = ymlText.match(/path:\s*(.+)/);
      if (match && match[1]) {
        return handleResponse(match[1].trim());
      }
    } 
    
    if (os === 'mac') {
      const response = await fetch(`${BASE_URL}/latest-mac.yml`, { next: { revalidate: 60 } });
      if (!response.ok) return handleResponse(null, 'macOS release not uploaded yet.');
      
      const ymlText = await response.text();
      const match = ymlText.match(/path:\s*(.+)/);
      if (match && match[1]) {
        return handleResponse(match[1].trim());
      }
    }

    return handleResponse(null, 'Invalid OS specified.');

  } catch (error) {
    console.error('Download routing error:', error);
    return handleResponse(null, 'Server error while locating download.');
  }
}
