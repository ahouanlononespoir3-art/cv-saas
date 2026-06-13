// src/lib/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_SERVER_HOST,
  port:   parseInt(process.env.EMAIL_SERVER_PORT ?? '587'),
  secure: process.env.EMAIL_SERVER_PORT === '465',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendPasswordResetEmail(
  email: string,
  token: string,
): Promise<void> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      email,
    subject: 'Réinitialisation de votre mot de passe — CVPro AI',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .body { padding: 40px 32px; }
    .btn { display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; margin: 24px 0; }
    .footer { background: #f8fafc; padding: 24px 32px; text-align: center; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>CVPro AI</h1>
    </div>
    <div class="body">
      <h2>Réinitialisez votre mot de passe</h2>
      <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.</p>
      <a href="${resetUrl}" class="btn">Réinitialiser mon mot de passe</a>
      <p style="color: #64748b; font-size: 14px;">Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
    </div>
    <div class="footer">
      <p>© 2024 CVPro AI — Tous droits réservés</p>
    </div>
  </div>
</body>
</html>
    `,
  });
}

export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      email,
    subject: 'Bienvenue sur CVPro AI ! 🎉',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .body { padding: 40px 32px; }
    .btn { display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; margin: 24px 0; }
    .feature { display: flex; gap: 12px; margin: 16px 0; padding: 16px; background: #f8fafc; border-radius: 8px; }
    .footer { background: #f8fafc; padding: 24px 32px; text-align: center; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Bienvenue sur CVPro AI ! 🎉</h1>
    </div>
    <div class="body">
      <h2>Bonjour ${name} !</h2>
      <p>Votre compte CVPro AI est prêt. Commencez à créer des CV professionnels optimisés par l'IA dès maintenant.</p>
      <div class="feature"><span>✨</span><span><strong>Génération IA</strong> — CV et lettres de motivation en quelques secondes</span></div>
      <div class="feature"><span>📊</span><span><strong>Optimisation ATS</strong> — Passez les filtres des recruteurs</span></div>
      <div class="feature"><span>🎨</span><span><strong>Templates premium</strong> — 5 designs professionnels</span></div>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="btn">Créer mon premier CV</a>
    </div>
    <div class="footer">
      <p>© 2024 CVPro AI — Tous droits réservés</p>
    </div>
  </div>
</body>
</html>
    `,
  });
}
