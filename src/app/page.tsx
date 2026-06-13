// src/app/page.tsx
import Link from 'next/link';
import { CheckCircle2, Sparkles, Zap, Shield, FileText, Star } from 'lucide-react';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'IA Claude Opus',
    desc:  'Powered by Claude d\'Anthropic — reformulation professionnelle, correction orthographique et optimisation automatique.',
  },
  {
    icon: Zap,
    title: 'Optimisation ATS',
    desc:  'Vos CV passent les filtres automatiques des systèmes de tracking. Score ATS en temps réel.',
  },
  {
    icon: FileText,
    title: '5 Templates premium',
    desc:  'Designs modernes, classiques, minimalistes et corporate. Choisissez votre style en un clic.',
  },
  {
    icon: Shield,
    title: 'Export PDF & DOCX',
    desc:  'Téléchargez vos CV dans tous les formats. Prêt à envoyer en moins de 2 minutes.',
  },
];

const TESTIMONIALS = [
  {
    name:   'Sophie M.',
    role:   'Chef de projet digital',
    text:   'J\'ai décroché 3 entretiens en une semaine après avoir utilisé CVPro AI. Les recruteurs ont remarqué mon CV.',
    rating: 5,
  },
  {
    name:   'Karim L.',
    role:   'Développeur fullstack',
    text:   'L\'optimisation ATS a tout changé. Mon CV passe maintenant les filtres automatiques que je ne franchissais pas avant.',
    rating: 5,
  },
  {
    name:   'Marie-Claire D.',
    role:   'Responsable RH',
    text:   'En tant que RH, je recommande CVPro AI à tous les candidats. Les CV générés sont vraiment professionnels.',
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-surface-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-surface-900">CVPro<span className="text-brand-600"> AI</span></span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features"   className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors">Fonctionnalités</Link>
            <Link href="#pricing"    className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors">Tarifs</Link>
            <Link href="#testimonials" className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors">Témoignages</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login"    className="btn-ghost text-sm">Connexion</Link>
            <Link href="/register" className="btn-primary text-sm">Commencer gratuitement</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-24">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-brand-100/60 blur-3xl" />
          <div className="absolute top-40 right-20 h-[300px] w-[300px] rounded-full bg-purple-100/40 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-200 px-4 py-2 text-sm font-medium text-brand-700 mb-8 animate-fade-up">
            <Sparkles className="h-4 w-4" />
            Propulsé par Claude AI d'Anthropic
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-surface-900 mb-6 animate-fade-up [animation-delay:100ms]">
            Votre CV parfait,{' '}
            <span className="text-gradient">généré par l'IA</span>{' '}
            en 60 secondes
          </h1>

          <p className="mx-auto max-w-2xl text-xl text-surface-500 mb-10 leading-relaxed animate-fade-up [animation-delay:200ms]">
            Créez des CV professionnels optimisés ATS et des lettres de motivation
            personnalisées. Décrochez plus d'entretiens, plus vite.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up [animation-delay:300ms]">
            <Link href="/register" className="btn-primary btn-lg shadow-glow">
              <Sparkles className="h-5 w-5" />
              Créer mon CV gratuitement
            </Link>
            <Link href="#features" className="btn-secondary btn-lg">
              Voir comment ça marche
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-surface-400 animate-fade-up [animation-delay:400ms]">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500" /> Gratuit pour commencer</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500" /> Pas de CB requise</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500" /> Résultats immédiats</span>
          </div>
        </div>

        {/* Hero image / mockup */}
        <div className="mx-auto mt-16 max-w-5xl px-6 animate-fade-up [animation-delay:500ms]">
          <div className="relative rounded-3xl border border-surface-200 bg-surface-50 p-2 shadow-2xl">
            <div className="rounded-2xl bg-white overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-100">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4 h-6 rounded-md bg-surface-100 text-xs text-surface-400 flex items-center px-3">
                  cvpro.ai/dashboard
                </div>
              </div>

              {/* Mock dashboard screenshot */}
              <div className="h-[400px] bg-gradient-to-br from-surface-50 via-brand-50/30 to-purple-50/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center mx-auto mb-4 animate-float">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-surface-500 text-sm font-medium">Interface du tableau de bord</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social proof ─────────────────────────────────────────────── */}
      <section className="py-12 border-y border-surface-100 bg-surface-50">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-sm font-medium text-surface-400 mb-8">DÉJÀ +10 000 CV CRÉÉS PAR NOS UTILISATEURS</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
            {['LinkedIn', 'Google', 'Microsoft', 'Amazon', 'Decathlon', 'BNP Paribas'].map(c => (
              <span key={c} className="text-lg font-bold text-surface-700">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="section-title">Tout ce dont vous avez besoin</h2>
            <p className="section-subtitle">Des outils professionnels alimentés par l'IA pour vous démarquer.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-6 group hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200">
                <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-brand-100 transition-colors">
                  <f.icon className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="font-semibold text-surface-900 mb-2">{f.title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="py-24 bg-surface-950 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-3">Comment ça marche</h2>
            <p className="text-lg text-surface-300">3 étapes simples pour un CV professionnel</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Remplissez vos infos', desc: 'Saisissez vos informations ou importez votre CV existant en PDF.' },
              { step: '02', title: "L'IA optimise", desc: 'Claude reformule, corrige et optimise votre contenu pour les ATS.' },
              { step: '03', title: 'Téléchargez', desc: 'Choisissez votre template et exportez en PDF ou DOCX.' },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="text-6xl font-bold text-brand-500/30 mb-4 font-mono">{s.step}</div>
                <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                <p className="text-surface-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="section-title">Tarifs simples et transparents</h2>
            <p className="section-subtitle">Commencez gratuitement, passez au premium quand vous voulez.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <div className="card p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-surface-900">Gratuit</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-surface-900">0€</span>
                  <span className="text-surface-400">/mois</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {['2 CV par mois', '2 lettres de motivation', '3 templates', 'Export PDF'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-surface-600">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn-secondary w-full justify-center">Commencer gratuitement</Link>
            </div>

            {/* Premium */}
            <div className="relative card p-8 border-brand-300 ring-2 ring-brand-500/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="badge-premium px-4 py-1.5 text-sm font-semibold">⭐ Recommandé</span>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-surface-900">Premium</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-surface-900">9,99€</span>
                  <span className="text-surface-400">/mois</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {['CV illimités', 'Lettres illimitées', 'Tous les templates', 'Export PDF & DOCX', 'Score ATS avancé', 'Support prioritaire'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-surface-600">
                    <CheckCircle2 className="h-4 w-4 text-brand-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn-primary w-full justify-center shadow-glow">
                <Sparkles className="h-4 w-4" />
                Commencer en Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 bg-surface-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="section-title">Ils ont décroché leur emploi</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card p-6">
                <div className="flex gap-1 mb-4">
                  {Array(t.rating).fill(0).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-surface-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-surface-900 text-sm">{t.name}</p>
                  <p className="text-xs text-surface-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-surface-900 mb-4">
            Prêt à décrocher votre prochain emploi ?
          </h2>
          <p className="text-lg text-surface-500 mb-8">
            Rejoignez +10 000 professionnels qui utilisent CVPro AI pour se démarquer.
          </p>
          <Link href="/register" className="btn-primary btn-lg shadow-glow">
            <Sparkles className="h-5 w-5" />
            Créer mon CV gratuitement
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="py-12 border-t border-surface-100">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-surface-900">CVPro AI</span>
          </div>
          <p className="text-sm text-surface-400">© 2024 CVPro AI. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-surface-400 hover:text-surface-600">Confidentialité</Link>
            <Link href="/terms"   className="text-sm text-surface-400 hover:text-surface-600">CGU</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
