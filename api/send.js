import express from 'express';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import cors from 'cors';

dotenv.config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(express.json());
import cors from 'cors';

app.use(cors({
  origin: 'https://notion-clone-two-ivory.vercel.app',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

const generateEmailTemplate = (data) => {
  const { subject, message } = data;
  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="dark light">
      <title>NoRize - ${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: 'Segoe UI', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; background: linear-gradient(45deg, #0A0A0A 0%, #1A1A1A 100%);">
        <tr>
          <td align="center" style="padding: 40px 10px;">
            <!-- Container Principal -->
            <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px;">
              <!-- Logo et En-tête -->
              <tr>
                <td align="center" style="padding-bottom: 30px;">
                  <div style="background: linear-gradient(135deg, #00F5A0 0%, #00D9F5 100%); width: 60px; height: 60px; border-radius: 20px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center;">
                    <span style="color: #000; font-size: 24px; font-weight: bold;">N</span>
                  </div>
                  <h1 style="margin: 0; font-size: clamp(28px, 5vw, 36px); background: linear-gradient(135deg, #00F5A0 0%, #00D9F5 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 2px;">NoRize</h1>
                </td>
              </tr>

              <!-- Carte Principale -->
              <tr>
                <td>
                  <div style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.1); overflow: hidden;">
                    <!-- En-tête de la Carte -->
                    <div style="padding: clamp(30px, 5vw, 40px) clamp(20px, 4vw, 40px); background: linear-gradient(45deg, rgba(0, 245, 160, 0.05) 0%, rgba(0, 217, 245, 0.05) 100%);">
                      <h2 style="margin: 0; color: #00F5A0; font-size: clamp(20px, 4vw, 24px); font-weight: 500;">${subject}</h2>
                    </div>

                    <!-- Contenu du Message -->
                    <div style="padding: clamp(25px, 4vw, 35px) clamp(20px, 4vw, 40px);">
                      ${message.split('\n').map(paragraph => `
                        <p style="color: #E0E0E0; font-size: clamp(15px, 3vw, 16px); line-height: 1.6; margin: 0 0 15px 0; letter-spacing: 0.3px;">
                          ${paragraph}
                        </p>
                      `).join('')}
                    </div>

                    <!-- Séparateur -->
                    <div style="height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);"></div>

                    <!-- Signature -->
                    <div style="padding: clamp(25px, 4vw, 35px) clamp(20px, 4vw, 40px); text-align: center;">
                      <p style="margin: 0 0 5px 0; color: #B0B0B0; font-size: clamp(14px, 2.5vw, 15px);">Cordialement,</p>
                      <p style="margin: 0; font-size: clamp(16px, 3vw, 18px); font-weight: 600; background: linear-gradient(135deg, #00F5A0 0%, #00D9F5 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">L'équipe NoRize</p>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Pied de Page -->
              <tr>
                <td align="center" style="padding-top: 40px;">
                  <!-- Liens Sociaux -->
                  <div style="margin-bottom: 20px;">
                    <a href="#" style="display: inline-block; margin: 0 10px; color: #808080; text-decoration: none; font-size: 14px;">LinkedIn</a>
                    <a href="#" style="display: inline-block; margin: 0 10px; color: #808080; text-decoration: none; font-size: 14px;">Twitter</a>
                    <a href="#" style="display: inline-block; margin: 0 10px; color: #808080; text-decoration: none; font-size: 14px;">Website</a>
                  </div>
                  <!-- Copyright -->
                  <p style="margin: 0; color: #666; font-size: clamp(12px, 2vw, 13px);">
                    © ${currentYear} NoRize. Tous droits réservés.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

app.post('/send', async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ 
      success: false, 
      message: 'Champs "to", "subject" et "message" requis.' 
    });
  }

  const emailData = {
    subject,
    message
  };

  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'NoRize <contact@norize.com>',
      to,
      subject: `NoRize - ${subject}`,
      html: generateEmailTemplate(emailData),
      text: `
NoRize
-------
${subject}
-------

${message}

Cordialement,
L'équipe NoRize

© ${new Date().getFullYear()} NoRize. Tous droits réservés.
      `
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de l\'envoi de l\'email',
        error: error.message 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Email envoyé avec succès' 
    });
  } catch (err) {
    console.error('Erreur d\'envoi:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'envoi de l\'email',
      error: err.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
}); 