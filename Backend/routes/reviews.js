const express = require("express");
const Review = require("../models/Review");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: Number(req.params.productId),
    }).sort({
      createdAt: -1,
    });

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

router.post("/:productId", authenticate, async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: "Rating must be between 1 and 5",
      });
    }

    const existing = await Review.findOne({
      productId,
      userId: req.user.userId,
    });

    if (existing) {
      return res.status(409).json({
        error: "You already reviewed this product",
      });
    }

    const review = await Review.create({
      productId,
      userId: req.user.userId,
      userEmail: req.user.email,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

module.exports = router;