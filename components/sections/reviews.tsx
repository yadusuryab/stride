"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import StarRating_Basic from "../commerce-ui/star-rating-basic";

interface Review {
  name: string;
  phone: string;
  instaid?: string;
  review: string;
  rating: number;
}

const reviewSchema = z.object({
  name: z.string().min(2, "Name required"),
  phone: z.string().min(10, "Phone number required"),
  instaid: z.string().optional(),
  review: z.string().min(5, "Review too short"),
  rating: z.number().min(1, "Give at least 1 star"),
});

const ProductReviewSection = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [openReview, setOpenReview] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Review>({
    name: "",
    phone: "",
    instaid: "",
    review: "",
    rating: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = async () => {
    try {
      const res = await fetch("/api/get-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.success) setReviews(data.reviews);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const handleSubmit = async () => {
    const result : any = reviewSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error?.errors.forEach((e:any) => {
        fieldErrors[e.path[0]] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/create-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          name: formData.name,
          phone: formData.phone,
          instaId: formData.instaid,
          rating: formData.rating,
          review: formData.review,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFormData({ name: "", phone: "", instaid: "", review: "", rating: 0 });
        setErrors({});
        setDialogOpen(false);
        loadReviews(); // refresh reviews
      } else {
        alert("Server error: " + data.message);
      }
    } catch (err) {
      alert("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-semibold">Reviews</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">Write a Review</Button>
          </DialogTrigger>
          <DialogContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}

              <Input
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}

              <Input
                placeholder="Instagram ID (optional)"
                value={formData.instaid}
                onChange={(e) => setFormData({ ...formData, instaid: e.target.value })}
              />

              <Textarea
                placeholder="Write your review..."
                value={formData.review}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              />
              {errors.review && <p className="text-xs text-red-500">{errors.review}</p>}

              <div>
                <StarRating_Basic
                  value={formData.rating}
                  onChange={(val) => setFormData({ ...formData, rating: val })}
                />
                {errors.rating && <p className="text-xs text-red-500">{errors.rating}</p>}
              </div>

              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {reviews.map((rev, index) => (
          <div
            key={index}
            className="border rounded p-3 cursor-pointer bg-muted hover:bg-muted/70"
            onClick={() => setOpenReview(openReview === index ? null : index)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{rev.name}</h4>
                {rev.instaid && <p className="text-sm text-muted-foreground">@{rev.instaid}</p>}
              </div>
              <StarRating_Basic value={rev.rating} readOnly iconSize={18} />
            </div>
            {openReview === index && (
              <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                {rev.review}
              </p>
            )}
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-sm text-muted-foreground">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProductReviewSection;
