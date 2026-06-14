// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return uuidv4();
}

export function formatDate(date: string | Date): string {
 return d.toLocaleDateString('fr-FR', {
  year:  'numeric',
  month: 'numeric',
  day:   'numeric',
});
}

export function formatMonthYear(date: string): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  const d = new Date(parseInt(year), parseInt(month) - 1);
  return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + '...';
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
}

export function getPlanLimits(plan: 'FREE' | 'PREMIUM') {
  return plan === 'PREMIUM'
    ? { cv: Infinity, letter: Infinity }
    : { cv: 2, letter: 2 };
}

export function canCreateCV(plan: string, cvCount: number): boolean {
  if (plan === 'PREMIUM') return true;
  // Reset monthly - but we track lifetime for simplicity here
  // In production, you'd track monthly usage separately
  return cvCount < 2;
}

export function canCreateLetter(plan: string, letterCount: number): boolean {
  if (plan === 'PREMIUM') return true;
  return letterCount < 2;
}

export const SKILL_LEVELS: Record<string, string> = {
  BEGINNER:     'Débutant',
  INTERMEDIATE: 'Intermédiaire',
  ADVANCED:     'Avancé',
  EXPERT:       'Expert',
};

export const LANGUAGE_LEVELS: Record<string, string> = {
  A1:     'Débutant (A1)',
  A2:     'Élémentaire (A2)',
  B1:     'Intermédiaire (B1)',
  B2:     'Intermédiaire avancé (B2)',
  C1:     'Avancé (C1)',
  C2:     'Maîtrise (C2)',
  NATIVE: 'Langue maternelle',
};
