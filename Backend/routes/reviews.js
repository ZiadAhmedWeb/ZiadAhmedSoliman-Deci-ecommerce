const express = require('express');
const prisma = require('../prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/:productId', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(req.params.productId) },
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.post('/:productId', authenticate, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = parseInt(req.params.productId);

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const existing = await prisma.review.findFirst({
      where: { productId, userId: req.user.userId },
    });
    if (existing) {
      return res.status(409).json({ error: 'You already reviewed this product' });
    }

    const review = await prisma.review.create({
      data: { rating, comment, productId, userId: req.user.userId },
      include: { user: { select: { email: true } } },
    });

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;