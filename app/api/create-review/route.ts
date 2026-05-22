import { sanityClient } from '@/lib/sanity'
import { NextRequest, NextResponse } from 'next/server'

// Helper to calculate new average
function calculateNewAverageRating(existingAvg: number, totalReviews: number, newRating: number) {
  return ((existingAvg * totalReviews) + newRating) / (totalReviews + 1)
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      productId,
      name,
      phone,
      instaId,
      rating,
      review,
    } = body

    if (!productId || !rating || !name || !phone || !review) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 })
    }

    // 1. Create the review
    const reviewDoc = {
      _type: 'review',
      product: { _type: 'reference', _ref: productId },
      name,
      phone,
      instaId,
      rating,
      review,
      createdAt: new Date().toISOString(),
    }

    await sanityClient.create(reviewDoc)

    // 2. Fetch all ratings of this product
    const existingRatings = await sanityClient.fetch(
      `*[_type == "review" && product._ref == $productId]{rating}`,
      { productId }
    )

    const totalReviews = existingRatings.length
    const sumRatings = existingRatings.reduce((sum: number, r: any) => sum + r.rating, 0)
    const avgRating = parseFloat((sumRatings / totalReviews).toFixed(2))

    // 3. Update product with new avgRating
    await sanityClient.patch(productId).set({ rating: avgRating }).commit()

    return NextResponse.json({ success: true, message: 'Review submitted successfully' })
  } catch (error) {
    console.error('Create review error:', error)
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 })
  }
}
