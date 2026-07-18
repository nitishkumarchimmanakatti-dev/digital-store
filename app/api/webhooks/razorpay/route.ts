import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === 'order.paid' || event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;
      const buyerEmail = paymentEntity.email || 'Unknown';
      const productId = paymentEntity.notes?.productId;

      if (orderId && productId) {
        // Upsert order in database
        await prisma.order.upsert({
          where: { razorpayOrderId: orderId },
          update: {
            status: 'COMPLETED',
            buyerEmail: buyerEmail,
            razorpayPaymentId: paymentId,
          },
          create: {
            productId: productId,
            buyerEmail: buyerEmail,
            status: 'COMPLETED',
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
          }
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling Razorpay webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
