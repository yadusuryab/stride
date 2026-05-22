import { sanityClient } from '@/lib/sanity'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  
  // Pagination
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '12', 10)
  const start = (page - 1) * limit
  
  // Filters
  const home = searchParams.get('home') === 'true'
  const minPrice = parseFloat(searchParams.get('minPrice') || '0')
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999')
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const sort = searchParams.get('sort') || 'newest'

  try {
    let query = ''
    let params = {}

    // Base query conditions
    let conditions = [
      '_type == "product"',
      `salesPrice >= ${minPrice}`,
      `salesPrice <= ${maxPrice}`
    ]

    const q = searchParams.get('q')

if (q) {
  conditions.push(`name match "*${q}*" || description match "*${q}*" || features[] match "*${q}*"`)
}

    if (category) conditions.push(`category->slug.current == "${category}"`)
    if (featured === 'true') conditions.push('featured == true')

    // Sorting
    let sortOrder = ''
    switch (sort) {
      case 'price-asc':
        sortOrder = '| order(price asc)'
        break
      case 'price-desc':
        sortOrder = '| order(price desc)'
        break
      case 'popular':
        // You might want to add a popularity field to your schema
        sortOrder = '| order(views desc)'
        break
      default:
        sortOrder = '| order(_createdAt desc)'
    }

    if (home) {
      // Homepage query - limited featured products
      query = `
        *[${conditions.join(' && ')} && featured == true] 
        ${sortOrder}
        [0...4] {
          _id,
          name,
          "slug": slug.current,
          "image": images[0].asset->url,
          price,
          rating,
          salesPrice,
          featured,
          "category": category->title
        }
      `
    } else {
      // Full product listing with pagination
      query = `
        *[${conditions.join(' && ')}] 
        ${sortOrder}
        [${start}...${start + limit}] {
          _id,
          name,
          "slug": slug.current,
          "image": images[0].asset->url,
          price,
          salesPrice,
          sizes,
          colours,
           rating,
          features,
          description,
          featured,
          "category": category->title,
          "categorySlug": category->slug.current
        }
      `
    }

    const products = await sanityClient.fetch(query, params)
    const totalQuery = `count(*[${conditions.join(' && ')}])`
    const total = await sanityClient.fetch(totalQuery, params)

    return NextResponse.json({ 
      success: true, 
      data: products,
      pagination: {
        page,
        limit,
        total,
        hasNextPage: start + limit < total
      }
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Fetch failed', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}