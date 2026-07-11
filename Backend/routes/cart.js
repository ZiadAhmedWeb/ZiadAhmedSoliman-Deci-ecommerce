const express = require('express');
const prisma = require('../prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

async function getOrCreateCart(userId) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  return cart;
}

router.get('/', authenticate, async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.userId);
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }

    const cart = await getOrCreateCart(req.user.userId);

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    let item;
    if (existingItem) {
      item = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (quantity || 1) },
      });
    } else {
      item = await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity: quantity || 1 },
      });
    }

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.put('/:itemId', authenticate, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ error: 'quantity is required' });
    }

    const item = await prisma.cartItem.update({
      where: { id: parseInt(req.params.itemId) },
      data: { quantity },
    });

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.delete('/:itemId', authenticate, async (req, res) => {
  try {
    await prisma.cartItem.delete({
      where: { id: parseInt(req.params.itemId) },
    });
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.post('/checkout', authenticate, async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Delivery address is required' });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          error: `Not enough stock for ${item.product.name} (only ${item.product.stock} left)`,
        });
      }
    }

    await prisma.$transaction([
      ...cart.items.map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      ),
      prisma.cartItem.deleteMany({ where: { cartId: cart.id } }),
    ]);

    res.json({ message: `Order placed! Delivering to: ${address}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;