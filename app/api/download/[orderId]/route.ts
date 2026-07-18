import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { readFile } from 'fs/promises';
import { basename } from 'path';

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const resolvedParams = await params;
    const orderId = resolvedParams.orderId;
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { product: true }
    });

    if (!order || order.status !== 'COMPLETED') {
      return new NextResponse('Order not found or incomplete', { status: 404 });
    }

    const fileUrl = order.product.fileUrl;
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Failed to fetch file from storage');
      
      const fileBuffer = await response.arrayBuffer();
      const filename = fileUrl.split('/').pop() || 'download';

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      });
    } catch (e) {
      console.error('File fetch error:', e);
      return new NextResponse('File not found in storage', { status: 404 });
    }

  } catch (error) {
    console.error('Download error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
