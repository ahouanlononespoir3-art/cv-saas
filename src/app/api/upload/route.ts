// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { parseCVFromText } from '@/lib/ai';
import pdfParse from 'pdf-parse';

export const config = {
  api: { bodyParser: false },
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file     = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 });
    }

    // Only allow PDF
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Seuls les fichiers PDF sont acceptés' }, { status: 400 });
    }

    // Max 5 MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Fichier trop volumineux (max 5 MB)' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer      = Buffer.from(arrayBuffer);

    // Extract text from PDF
    const parsed   = await pdfParse(buffer);
    const text     = parsed.text;

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: 'Impossible d\'extraire le texte du PDF. Essayez un autre fichier.' },
        { status: 422 },
      );
    }

    // Use AI to parse the text into structured data
    const cvData = await parseCVFromText(text);

    return NextResponse.json({ success: true, data: cvData });
  } catch (error) {
    console.error('[UPLOAD]', error);
    return NextResponse.json({ error: 'Erreur lors du traitement du fichier' }, { status: 500 });
  }
}
