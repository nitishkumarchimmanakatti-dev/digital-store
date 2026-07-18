import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { razorpay } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    const { productId } = await request.json();

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Amount should be in the smallest currency unit (paise for INR)
    const amountInPaise = Math.round(product.price * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${productId}`,
      notes: {
        productId: product.id,
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Error creating Razorpay order' },
      { status: 500 }
    );
  }
}
