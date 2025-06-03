import express from 'express';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(express.json());

app.post('/sendReminder', async (req, res) => {
  const data = req.body;

  if (!data || !data.toEmail || !data.clientName || !data.accountName || !data.expiryDate || data.daysUntilExpiry === undefined) {
    return res.status(400).json({ success: false, message: 'Données incomplètes.' });
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333; margin: 0;">Rappel d'expiration de compte</h1>
      </div>
      
      <div style="background-color: ${
        data.daysUntilExpiry <= 0 ? '#ffebee' : 
        data.daysUntilExpiry <= 10 ? '#fff3e0' : '#e8f5e9'
      }; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="color: ${
          data.daysUntilExpiry <= 0 ? '#c62828' :
          data.daysUntilExpiry <= 10 ? '#ef6c00' : '#2e7d32'
        }; font-size: 18px; font-weight: bold; margin: 0;">
          ${data.daysUntilExpiry <= 0 
            ? '⚠️ Action immédiate requise'
            : data.daysUntilExpiry <= 10
            ? '⚠️ Attention : Expiration proche'
            : '✅ Compte actif'}
        </p>
      </div>

      <div style="margin-bottom: 30px;">
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          Bonjour,<br><br>
          Nous vous informons que le compte de <strong>${data.clientName}</strong> pour <strong>${data.accountName}</strong> 
          ${data.daysUntilExpiry <= 0 ? 'a expiré' : `expire dans ${data.daysUntilExpiry} jours`}.
        </p>
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          Date d'expiration : <strong>${data.expiryDate}</strong>
        </p>
      </div>

      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <p style="color: #333; font-size: 16px; margin: 0;">
          ${data.daysUntilExpiry <= 0 
            ? 'Votre compte a expiré. Veuillez le renouveler dès que possible pour éviter toute interruption de service.'
            : data.daysUntilExpiry <= 10
            ? 'Votre compte arrive bientôt à expiration. Pensez à le renouveler pour éviter toute interruption de service.'
            : 'Votre compte est toujours actif. Cette notification est envoyée à titre préventif.'}
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px; margin: 0;">
          Cordialement,<br>
          <strong>L'équipe NoRize</strong>
        </p>
      </div>
    </div>
  `;

  const text = `
Rappel d'expiration de compte

Bonjour,

Nous vous informons que le compte de ${data.clientName} pour ${data.accountName} 
${data.daysUntilExpiry <= 0 ? 'a expiré' : `expire dans ${data.daysUntilExpiry} jours`}.

Date d'expiration : ${data.expiryDate}

${data.daysUntilExpiry <= 0 
  ? 'Votre compte a expiré. Veuillez le renouveler dès que possible pour éviter toute interruption de service.'
  : data.daysUntilExpiry <= 10
  ? 'Votre compte arrive bientôt à expiration. Pensez à le renouveler pour éviter toute interruption de service.'
  : 'Votre compte est toujours actif. Cette notification est envoyée à titre préventif.'}

Cordialement,
L'équipe NoRize
  `;

  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'NoRize <onboarding@resend.dev>',
      to: data.toEmail,
      subject: `Rappel d'expiration - ${data.accountName}`,
      text,
      html,
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return res.status(500).json({ success: false, message: error.message });
    }

    res.status(200).json({ success: true, message: 'Rappel envoyé avec succès' });
  } catch (err) {
    console.error('Erreur d'envoi:', err);
    res.status(500).json({ success: false, message: 'Erreur lors de l'envoi de l'email' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});

