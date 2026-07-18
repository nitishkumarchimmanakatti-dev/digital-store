import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const priceStr = formData.get('price') as string;
    const fileUrl = formData.get('fileUrl') as string;
    const coverUrl = formData.get('coverUrl') as string | null;

    if (!title || !description || !priceStr || !fileUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const price = parseFloat(priceStr);

    const { id } = await params;

    const product = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
        price,
        fileUrl,
        coverUrl: coverUrl || null,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
