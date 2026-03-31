import { Router } from "express";
import Review from "../models/Review";
import Business from "../models/Business";

const router = Router();

const updateBusinessRating = async (businessId: string) => {
  const reviews = await Review.find({ businessId });

  const reviewCount = reviews.length;
  let averageReviewScore = 0;

  if (reviewCount > 0) {
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
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

    const newReview = await Review.create({
      businessId,
      userId,
      rating,
      review
    });

    await updateBusinessRating(businessId);

    res.json(newReview);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// GET REVIEWS
router.get("/business/:businessId", async (req, res) => {
  try {
    const reviews = await Review.find({ businessId: req.params.businessId });
    res.json(reviews);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE REVIEW
router.put("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: "Not found" });

    review.rating = req.body.rating ?? review.rating;
    review.review = req.body.review ?? review.review;

    await review.save();
    await updateBusinessRating(review.businessId.toString());

    res.json(review);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE REVIEW
router.delete("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: "Not found" });

    const businessId = review.businessId;

    await Review.findByIdAndDelete(req.params.id);
    await updateBusinessRating(businessId.toString());

    res.json({ message: "Deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
