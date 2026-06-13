// src/types/index.ts

export type Plan = 'FREE' | 'PREMIUM';
export type TemplateStyle = 'MODERN' | 'CLASSIC' | 'PREMIUM' | 'MINIMALIST' | 'CORPORATE';
export type ExportFormat = 'PDF' | 'DOCX';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'TRIALING' | 'INACTIVE';

// ─── RESUME DATA ─────────────────────────────────────────────────────────────

export interface PersonalInfo {
  firstName:   string;
  lastName:    string;
  email:       string;
  phone:       string;
  address?:    string;
  city?:       string;
  country?:    string;
  linkedIn?:   string;
  website?:    string;
  photo?:      string;
  summary?:    string;
  title?:      string; // Professional title
}

export interface Education {
  id:          string;
  school:      string;
  degree:      string;
  field:       string;
  startDate:   string;
  endDate?:    string;
  current:     boolean;
  grade?:      string;
  description?: string;
}

export interface Experience {
  id:          string;
  company:     string;
  position:    string;
  location?:   string;
  startDate:   string;
  endDate?:    string;
  current:     boolean;
  description: string;
  achievements?: string[];
}

export interface Skill {
  id:    string;
  name:  string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
}

export interface Language {
  id:    string;
  name:  string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'NATIVE';
}

export interface Certification {
  id:       string;
  name:     string;
  issuer:   string;
  date:     string;
  url?:     string;
}

export interface Reference {
  id:       string;
  name:     string;
  position: string;
  company:  string;
  email?:   string;
  phone?:   string;
}

export interface ResumeContent {
  personalInfo:  PersonalInfo;
  education:     Education[];
  experience:    Experience[];
  skills:        Skill[];
  languages:     Language[];
  certifications: Certification[];
  references:    Reference[];
  targetJob?:    string;
  targetCompany?: string;
  targetSector?: string;
}

// ─── RESUME (DB MODEL) ────────────────────────────────────────────────────────

export interface Resume {
  id:           string;
  userId:       string;
  title:        string;
  template:     TemplateStyle;
  isPublic:     boolean;
  targetJob?:   string;
  targetCompany?: string;
  targetSector?: string;
  content:      ResumeContent;
  aiEnhanced:   boolean;
  atsScore?:    number;
  createdAt:    string;
  updatedAt:    string;
}

// ─── COVER LETTER ─────────────────────────────────────────────────────────────

export interface CoverLetter {
  id:            string;
  userId:        string;
  resumeId?:     string;
  title:         string;
  targetJob:     string;
  targetCompany: string;
  targetSector:  string;
  content:       string;
  aiGenerated:   boolean;
  createdAt:     string;
  updatedAt:     string;
}

// ─── USER ─────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id:          string;
  name?:       string;
  email:       string;
  image?:      string;
  plan:        Plan;
  cvCount:     number;
  letterCount: number;
  createdAt:   string;
}

// ─── API RESPONSES ────────────────────────────────────────────────────────────

export interface ApiResponse<T = void> {
  success: boolean;
  data?:   T;
  error?:  string;
  message?: string;
}

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalResumes:  number;
  totalLetters:  number;
  totalExports:  number;
  thisMonthCVs:  number;
  thisMonthLetters: number;
  plan:          Plan;
  limits: {
    cvLimit:     number;
    letterLimit: number;
    remaining: {
      cv:     number;
      letter: number;
    };
  };
}

// ─── AI GENERATION ───────────────────────────────────────────────────────────

export interface AIGenerateResumeRequest {
  content:      ResumeContent;
  targetJob?:   string;
  targetCompany?: string;
  targetSector?: string;
}

export interface AIGenerateLetterRequest {
  resumeContent?: Partial<ResumeContent>;
  targetJob:    string;
  targetCompany: string;
  targetSector: string;
  tone?:        'PROFESSIONAL' | 'CREATIVE' | 'FORMAL';
}

export interface AIGenerateResult {
  content:  ResumeContent | string;
  atsScore?: number;
  suggestions?: string[];
}

// ─── STRIPE ──────────────────────────────────────────────────────────────────

export interface CheckoutSession {
  url: string;
}

export type SubscriptionPlan = {
  name:     string;
  price:    number;
  currency: string;
  interval: string;
  features: string[];
};

export const PLANS: Record<Plan, SubscriptionPlan> = {
  FREE: {
    name:     'Gratuit',
    price:    0,
    currency: 'EUR',
    interval: 'mois',
    features: [
      '2 CV par mois',
      '2 lettres de motivation',
      '3 templates disponibles',
      'Export PDF',
    ],
  },
  PREMIUM: {
    name:     'Premium',
    price:    9.99,
    currency: 'EUR',
    interval: 'mois',
    features: [
      'CV illimités',
      'Lettres illimitées',
      'Tous les templates',
      'Export PDF & DOCX',
      'Optimisation ATS avancée',
      'Support prioritaire',
    ],
  },
};

export const LIMITS = {
  FREE:    { cv: 2, letter: 2 },
  PREMIUM: { cv: Infinity, letter: Infinity },
};
