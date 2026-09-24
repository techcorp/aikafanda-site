import { NextResponse } from 'next/server'
import { revalidateTag, revalidatePath } from 'next/cache'

/**
 * Refresh blog content instantly after publishing in Blogger.
 *
 *   https://your-site.com/api/revalidate?secret=YOUR_SECRET
 *
 * Without this, new posts still appear within 10 minutes (ISR).
 */
export async function GET(request) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret.' }, { status: 401 })
  }

  revalidateTag('blog')
  revalidatePath('/blog')
  revalidatePath('/')

  return NextResponse.json({ revalidated: true, at: new Date().toISOString() })
}
