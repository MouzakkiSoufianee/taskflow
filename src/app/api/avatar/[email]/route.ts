import { NextRequest, NextResponse } from 'next/server'

// Generate a simple avatar based on email
function generateAvatarSVG(email: string, size = 40) {
  // Get initials from email
  const initial = email.charAt(0).toUpperCase()
  
  // Generate a consistent color based on email hash
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  // Convert hash to hue (0-360)
  const hue = Math.abs(hash) % 360
  
  // Create SVG with gradient background
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:hsl(${hue}, 70%, 60%);stop-opacity:1" />
          <stop offset="100%" style="stop-color:hsl(${(hue + 40) % 360}, 70%, 70%);stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="url(#grad)" />
      <text x="${size/2}" y="${size/2 + 6}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${size * 0.4}" font-weight="600" fill="white">${initial}</text>
    </svg>
  `.trim()
  
  return svg
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ email: string }> }
) {
  try {
    const { email } = await context.params
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    
    // Decode the email from URL encoding
    const decodedEmail = decodeURIComponent(email)
    
    // Generate SVG avatar
    const svg = generateAvatarSVG(decodedEmail)
    
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    })
  } catch (error) {
    console.error('Error generating avatar:', error)
    return NextResponse.json({ error: 'Failed to generate avatar' }, { status: 500 })
  }
}
