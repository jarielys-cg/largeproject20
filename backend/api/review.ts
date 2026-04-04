import { Router } from "express";
import Review from "../models/Review.js";
import Business from "../models/Business.js";

const router = Router();

const updateBusinessRating = async (businessId: string) => {
  const reviews = await Review.find({ businessId });

  const reviewCount = reviews.length;
  let averageReviewScore = 0;

  if (reviewCount > 0) {
    const total = reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    averageReviewScore = total / reviewCount;
  }

  await Business.findByIdAndUpdate(businessId, {
    reviewCount,
    averageReviewScore
  });
};

// ADD REVIEW
router.post("/", async (req, res) => {
  try {
    const { businessId, userId, rating, review } = req.body;

    if (!businessId || !userId || !rating || !review) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const newReview = await Review.create({
      businessId,
      userId,
      rating,
      review
    });

    await updateBusinessRating(businessId);

    return res.status(201).json(newReview);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// GET REVIEWS FOR ONE BUSINESS
router.get("/business/:businessId", async (req, res) => {
  try {
    const reviews = await Review.find({ businessId: req.params.businessId });
    return res.json(reviews);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// UPDATE REVIEW
router.put("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (req.body.rating !== undefined) {
      if (req.body.rating < 1 || req.body.rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }
      review.rating = req.body.rating;
    }

    if (req.body.review !== undefined) {
      review.review = req.body.review;
    }

    await review.save();
    await updateBusinessRating(review.businessId.toString());

    return res.json(review);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// DELETE REVIEW
router.delete("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const businessId = review.businessId.toString();

    await Review.findByIdAndDelete(req.params.id);
    await updateBusinessRating(businessId);

    return res.json({ message: "Review deleted successfully" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
