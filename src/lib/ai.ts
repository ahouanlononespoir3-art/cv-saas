// src/lib/ai.ts — Version Groq (gratuit, sans carte bancaire)
import type { ResumeContent } from '@/types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL        = 'llama-3.3-70b-versatile'; // Modèle gratuit et puissant

// Fonction interne pour appeler l'API Groq
async function callGroq(prompt: string, maxTokens = 4000): Promise<string> {
  const res = await fetch(GROQ_API_URL, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model:       MODEL,
      max_tokens:  maxTokens,
      temperature: 0.4,
      messages:    [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

// ─── AMÉLIORER UN CV ──────────────────────────────────────────────────────────

export async function enhanceResume(
  content:       ResumeContent,
  targetJob?:    string,
  targetCompany?: string,
  targetSector?: string,
): Promise<{ enhanced: ResumeContent; atsScore: number; suggestions: string[] }> {

  const prompt = `
Tu es un expert en recrutement et rédaction de CV professionnel.

DONNÉES DU CV (JSON):
${JSON.stringify(content, null, 2)}

POSTE VISÉ: ${targetJob ?? 'Non spécifié'}
ENTREPRISE: ${targetCompany ?? 'Non spécifiée'}
SECTEUR: ${targetSector ?? 'Non spécifié'}

MISSION:
1. Corriger toutes les fautes d'orthographe et grammaire
2. Reformuler chaque description de manière professionnelle
3. Ajouter des mots-clés ATS pertinents pour le poste visé
4. Quantifier les réalisations si possible (ex: "Augmenté les ventes de 30%")
5. Améliorer le résumé professionnel pour qu'il soit percutant

Réponds UNIQUEMENT avec un JSON valide (sans balises markdown, sans texte avant ou après) :
{
  "enhanced": { ...même structure JSON que l'entrée avec les améliorations... },
  "atsScore": 85,
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}
`;

  try {
    const text  = await callGroq(prompt, 6000);
    const clean = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
    const parsed = JSON.parse(clean);
    return parsed;
  } catch (err) {
    console.error('[AI enhanceResume] Parse error:', err);
    return { enhanced: content, atsScore: 72, suggestions: [] };
  }
}

// ─── GÉNÉRER UNE LETTRE DE MOTIVATION ────────────────────────────────────────

export async function generateCoverLetter(
  resumeContent:  Partial<ResumeContent>,
  targetJob:      string,
  targetCompany:  string,
  targetSector:   string,
  tone:           'PROFESSIONAL' | 'CREATIVE' | 'FORMAL' = 'PROFESSIONAL',
): Promise<string> {

  const { personalInfo, experience, skills } = resumeContent;

  const tones = {
    PROFESSIONAL: 'professionnel, chaleureux et dynamique',
    CREATIVE:     'créatif, original et mémorable tout en restant professionnel',
    FORMAL:       'très formel, sobre et conventionnel',
  };

  const prompt = `
Tu es un expert en rédaction de lettres de motivation en français.

CANDIDAT:
Nom: ${personalInfo?.firstName ?? ''} ${personalInfo?.lastName ?? ''}
Titre: ${personalInfo?.title ?? ''}
Résumé: ${personalInfo?.summary ?? ''}
Expériences: ${(experience ?? []).slice(0, 2).map(e => `${e.position} chez ${e.company}`).join(', ')}
Compétences: ${(skills ?? []).slice(0, 6).map(s => s.name).join(', ')}

POSTE VISÉ: ${targetJob}
ENTREPRISE: ${targetCompany}
SECTEUR: ${targetSector}
TON: ${tones[tone]}

Rédige une lettre de motivation complète (350-420 mots) avec:
- Un paragraphe d'accroche percutant mentionnant le poste et l'entreprise
- Un paragraphe sur les compétences et expériences pertinentes
- Un paragraphe sur la motivation spécifique pour cette entreprise
- Une conclusion avec call-to-action et formule de politesse

IMPORTANT: Réponds UNIQUEMENT avec le texte de la lettre, sans titre, sans commentaire.
Commence directement par "Madame, Monsieur," ou l'équivalent.
`;

  try {
    return await callGroq(prompt, 1500);
  } catch (err) {
    console.error('[AI generateCoverLetter] Error:', err);
    return 'Erreur lors de la génération. Veuillez réessayer.';
  }
}

// ─── PARSER UN CV IMPORTÉ EN PDF ──────────────────────────────────────────────

export async function parseCVFromText(text: string): Promise<Partial<ResumeContent>> {
  const prompt = `
Tu es un expert en analyse de CV. Extrais les informations de ce texte de CV.

TEXTE:
${text.slice(0, 3000)}

Réponds UNIQUEMENT avec un JSON valide (sans markdown) correspondant exactement à cette structure:
{
  "personalInfo": {
    "firstName": "",
    "lastName": "",
    "email": "",
    "phone": "",
    "address": "",
    "city": "",
    "country": "",
    "linkedIn": "",
    "website": "",
    "title": "",
    "summary": ""
  },
  "education": [
    {
      "id": "edu_1",
      "school": "",
      "degree": "",
      "field": "",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "current": false,
      "grade": "",
      "description": ""
    }
  ],
  "experience": [
    {
      "id": "exp_1",
      "company": "",
      "position": "",
      "location": "",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "current": false,
      "description": "",
      "achievements": []
    }
  ],
  "skills": [
    { "id": "skill_1", "name": "", "level": "INTERMEDIATE" }
  ],
  "languages": [
    { "id": "lang_1", "name": "", "level": "B2" }
  ],
  "certifications": [],
  "references": []
}
`;

  try {
    const text_out = await callGroq(prompt, 3000);
    const clean    = text_out.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
    return JSON.parse(clean);
  } catch {
    return {};
  }
}
