// https://gist.github.com/rodrigoborgesdeoliveira/987683cfbfcc8d800192da1e73adc486

export default function extractVideoID(url: string): string | undefined {
  if (url.includes('youtube.com/watch?')) {
    const params = url.split('youtube.com/watch?')[1].split('&');
    for (const p of params) {
      if (p.includes('v=')) {
        return p.split('v=')[1];
      }
      else if (p.includes('v%3D')) {
        return p.split('v%3D')[1];
      }
    }
  }

  if (url.includes('youtube.com/v/')) {
    return url.split('youtube.com/v/')[1].split('?')[0];
  }

  if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1].split('?')[0];
  }

  if (url.includes('www.youtube.com/attribution_link')) {
    const goodBit = url.includes('&u=/') ? url.split('&u=/')[1] : url.split('&u=%2F')[1];
    const params = goodBit.split('watch%3F')[1].split('%26');
    for (const p of params) {
      if (p.includes('v%3D')) {
        return p.split('v%3D')[1];
      }
    }
  }

  if (url.includes('youtube.com/embed/')) {
    return url.split('youtube.com/embed/')[1].split('?')[0];
  }

  if (url.includes('youtube-nocookie.com/embed/')) {
    return url.split('youtube-nocookie.com/embed/')[1].split('?')[0];
  }

  if (url.includes('youtube.com/e/')) {
    return url.split('youtube.com/e/')[1].split('?')[0];    
  }

  return undefined;
}