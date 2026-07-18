import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const priceStr = formData.get('price') as string;
    const price = parseFloat(priceStr);
    
    // The URLs are now provided by UploadThing
    const fileUrl = formData.get('fileUrl') as string;
    const coverUrl = formData.get('coverUrl') as string | null;
    
    if (!title || !description || isNaN(price) || !fileUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save product to database
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        fileUrl,
        coverUrl,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
