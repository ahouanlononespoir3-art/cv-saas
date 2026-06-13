// src/app/(auth)/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const schema = z.object({
  email: z.string().email('Email invalide'),
});
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: data.email }),
      });

      if (res.ok) {
        setSent(true);
      } else {
        toast.error('Erreur lors de l\'envoi');
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="card p-8 text-center">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-surface-900 mb-2">Email envoyé !</h2>
        <p className="text-surface-500 text-sm mb-6">
          Si un compte existe avec cet email, vous recevrez un lien de réinitialisation dans quelques minutes.
        </p>
        <Link href="/login" className="btn-secondary w-full justify-center">
          <ArrowLeft className="h-4 w-4" />
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <div className="card p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Mot de passe oublié</h1>
        <p className="text-surface-500 text-sm mt-1">
          Entrez votre email pour recevoir un lien de réinitialisation.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
            <input
              {...register('email')}
              type="email"
              placeholder="vous@exemple.com"
              className={cn('input pl-10', errors.email && 'input-error')}
            />
          </div>
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          Envoyer le lien
        </button>
      </form>

      <div className="mt-4 text-center">
        <Link href="/login" className="text-sm text-surface-500 hover:text-brand-600 flex items-center justify-center gap-1">
          <ArrowLeft className="h-3 w-3" /> Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
