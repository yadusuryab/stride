import { sanityClient } from '@/lib/sanity'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const query = `*[_type == "category"]{ 
      _id, 
      name, 
      "slug": slug.current, 
      "image": image.asset->url 
    }`

    const categories = await sanityClient.fetch(query)
    console.log(categories)
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
