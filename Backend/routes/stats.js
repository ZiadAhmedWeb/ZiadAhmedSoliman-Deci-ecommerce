const express = require('express');
const prisma = require('../prisma/client');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const [userCount, productCount, categoryCount, reviewCount] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.category.count(),
      prisma.review.count(),
    ]);

    res.json({ userCount, productCount, categoryCount, reviewCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;