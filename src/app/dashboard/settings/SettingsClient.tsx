// src/app/dashboard/settings/SettingsClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import {
  User, Mail, Crown, CreditCard, Shield,
  Loader2, CheckCircle2, AlertCircle, Sparkles,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Props {
  user: {
    id: string; name: string; email: string;
    image?: string; plan: string; cvCount: number;
    letterCount: number; createdAt: string;
  };
  subscription: {
    plan: string; status: string;
    stripeCurrentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
  } | null;
}

export default function SettingsClient({ user, subscription }: Props) {
  const router      = useRouter();
  const { update }  = useSession();
  const [name, setName]       = useState(user.name ?? '');
  const [saving,  setSaving]  = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [managing,  setManaging]  = useState(false);

  const isPremium = user.plan === 'PREMIUM';

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name }),
      });
      if (res.ok) {
        await update({ name });
        toast.success('Profil mis à jour !');
        router.refresh();
      } else {
        toast.error('Erreur de sauvegarde');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res  = await fetch('/api/stripe/create-checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ returnUrl: window.location.href }),
      });
      const json = await res.json();
      if (json.success) {
        window.location.href = json.data.url;
      } else {
        toast.error('Erreur Stripe');
      }
    } finally {
      setUpgrading(false);
    }
  };

  const handleManageBilling = async () => {
    setManaging(true);
    try {
      const res  = await fetch('/api/stripe/billing-portal', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({}),
      });
      const json = await res.json();
      if (json.success) {
        window.location.href = json.data.url;
      } else {
        toast.error('Aucun abonnement actif');
      }
    } finally {
      setManaging(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-up">
      <h1 className="text-2xl font-bold text-surface-900">Paramètres</h1>

      {/* Profile */}
      <div className="card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-brand-100 flex items-center justify-center">
            <User className="h-5 w-5 text-brand-600" />
          </div>
          <h2 className="font-semibold text-surface-900">Profil</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center flex-shrink-0">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              <span className="text-white text-xl font-bold">
                {(user.name ?? user.email).charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-surface-900">{user.name}</p>
            <p className="text-sm text-surface-400">{user.email}</p>
            <p className="text-xs text-surface-400 mt-0.5">Membre depuis {formatDate(user.createdAt)}</p>
          </div>
        </div>

        <div className="divider" />

        <div className="space-y-4">
          <div>
            <label className="label">Nom complet</label>
            <input
              className="input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Jean Dupont"
            />
          </div>
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-300" />
              <input className="input pl-10 opacity-60 cursor-not-allowed" value={user.email} disabled />
            </div>
            <p className="text-xs text-surface-400 mt-1">L'email ne peut pas être modifié.</p>
          </div>
        </div>

        <button onClick={handleSaveProfile} disabled={saving} className="btn-primary">
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Sauvegarde...</> : 'Sauvegarder le profil'}
        </button>
      </div>

      {/* Usage */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-green-100 flex items-center justify-center">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          <h2 className="font-semibold text-surface-900">Utilisation</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'CV créés',   value: user.cvCount,     limit: isPremium ? '∞' : '2' },
            { label: 'Lettres',    value: user.letterCount, limit: isPremium ? '∞' : '2' },
          ].map(s => (
            <div key={s.label} className="rounded-xl bg-surface-50 p-4">
              <p className="text-2xl font-bold text-surface-900">{s.value}</p>
              <p className="text-xs text-surface-500 mt-0.5">{s.label}</p>
              <p className="text-xs text-surface-400">Limite : {s.limit}/mois</p>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription */}
      <div className="card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-amber-100 flex items-center justify-center">
            <Crown className="h-5 w-5 text-amber-600" />
          </div>
          <h2 className="font-semibold text-surface-900">Abonnement</h2>
        </div>

        {isPremium ? (
          <>
            <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="h-5 w-5 text-amber-300" />
                    <span className="font-bold text-lg">Plan Premium</span>
                  </div>
                  <p className="text-white/80 text-sm">CV illimités · Tous les templates · Export PDF & DOCX</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">9,99€</p>
                  <p className="text-white/70 text-sm">/mois</p>
                </div>
              </div>
              {subscription?.stripeCurrentPeriodEnd && (
                <p className="text-white/70 text-xs mt-3">
                  {subscription.cancelAtPeriodEnd
                    ? `⚠ Annulation prévue le ${formatDate(subscription.stripeCurrentPeriodEnd)}`
                    : `Prochain renouvellement : ${formatDate(subscription.stripeCurrentPeriodEnd)}`
                  }
                </p>
              )}
            </div>

            <button onClick={handleManageBilling} disabled={managing} className="btn-secondary w-full justify-center">
              {managing ? <><Loader2 className="h-4 w-4 animate-spin" /> Chargement...</> : <><CreditCard className="h-4 w-4" /> Gérer mon abonnement</>}
            </button>
          </>
        ) : (
          <>
            <div className="rounded-2xl bg-surface-50 border border-surface-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-surface-900">Plan Gratuit</span>
                <span className="badge bg-surface-200 text-surface-600">Actif</span>
              </div>
              <ul className="space-y-2">
                {[
                  { text: '2 CV par mois', ok: true },
                  { text: '2 lettres de motivation', ok: true },
                  { text: 'CV illimités', ok: false },
                  { text: 'Tous les templates', ok: false },
                  { text: 'Export DOCX', ok: false },
                ].map(f => (
                  <li key={f.text} className="flex items-center gap-2 text-sm">
                    {f.ok
                      ? <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      : <AlertCircle   className="h-4 w-4 text-surface-300 flex-shrink-0" />
                    }
                    <span className={f.ok ? 'text-surface-700' : 'text-surface-400 line-through'}>{f.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 p-5 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-5 w-5 text-amber-300" />
                <span className="font-bold text-lg">Passer Premium</span>
              </div>
              <p className="text-white/80 text-sm mb-4">
                Débloquez tout : CV illimités, 5 templates, export DOCX, score ATS avancé.
              </p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold">9,99€</span>
                <span className="text-white/70">/mois · Sans engagement</span>
              </div>
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="w-full bg-white text-brand-700 font-semibold py-2.5 rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
              >
                {upgrading
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Redirection Stripe...</>
                  : <><Crown className="h-4 w-4 text-amber-500" /> Passer Premium maintenant</>
                }
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
