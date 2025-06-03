import express from 'express';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import cors from 'cors';
import dashboard, { logRequest } from './dashboard.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware pour servir les fichiers statiques de React
app.use(express.static(path.join(__dirname, '../client/dist')));

app.use(express.json());
// ✅ CORS configuration
const allowedOrigin = 'https://notion-clone-two-ivory.vercel.app';

app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Origin'
  ],
  credentials: true
}));

// Middleware de logging pour toutes les requêtes
app.use(logRequest);

// Route du tableau de bord
app.use('/dashboard', dashboard);

// ✅ Handle preflight OPTIONS request explicitly
app.options('/send', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', [
    'Content-Type',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Origin'
  ].join(', '));
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  return res.sendStatus(200);
});

const generateEmailTemplate = (data) => {
  const { subject, message } = data;
  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">
      <title>${subject}</title>
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
      <style>
        :root {
          color-scheme: light dark;
          supported-color-schemes: light dark;
        }
        @media (prefers-color-scheme: dark) {
          body { background-color: #0A0A0A !important; }
          .dark-text { color: #E0E0E0 !important; }
          .dark-bg { background-color: #1A1A1A !important; }
        }
        @media screen and (max-width: 600px) {
          .mobile-padding {
            padding: 20px !important;
          }
          .mobile-font {
            font-size: 16px !important;
            line-height: 24px !important;
          }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; background-color: #0A0A0A; color: #E0E0E0;">
      <!--[if mso]>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #0A0A0A;">
      <![endif]-->
      <div style="max-width: 600px; margin: 0 auto;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0 auto; background: linear-gradient(45deg, #0A0A0A 0%, #1A1A1A 100%);">
          <tr>
            <td align="center" class="mobile-padding" style="padding: 40px 20px;">
              <!-- Logo et En-tête -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 400px; margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="background: linear-gradient(135deg, #00F5A0 0%, #00D9F5 100%); width: 60px; height: 60px; border-radius: 20px;">
                          <span style="color: #000000; font-size: 24px; font-weight: bold; font-family: 'Segoe UI', Arial, sans-serif;">N</span>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-top: 15px;">
                          <h1 style="margin: 0; font-family: 'Segoe UI', Arial, sans-serif; font-size: 36px; background: linear-gradient(135deg, #00F5A0 0%, #00D9F5 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 2px;">NoRize</h1>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Carte Principale -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background: rgba(255, 255, 255, 0.03); border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.1); overflow: hidden;">
                <!-- En-tête de la Carte -->
                <tr>
                  <td class="mobile-padding" style="padding: 40px; background: linear-gradient(45deg, rgba(0, 245, 160, 0.05) 0%, rgba(0, 217, 245, 0.05) 100%);">
                    <h2 style="margin: 0; font-family: 'Segoe UI', Arial, sans-serif; color: #00F5A0; font-size: 24px; font-weight: 500;">${subject}</h2>
                  </td>
                </tr>

                <!-- Contenu du Message -->
                <tr>
                  <td class="mobile-padding" style="padding: 35px 40px;">
                    ${message.split('\n').map(paragraph => `
                      <p class="mobile-font dark-text" style="font-family: 'Segoe UI', Arial, sans-serif; color: #E0E0E0; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0; letter-spacing: 0.3px;">
                        ${paragraph}
                      </p>
                    `).join('')}
                  </td>
                </tr>

                <!-- Séparateur -->
                <tr>
                  <td>
                    <div style="height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);"></div>
                  </td>
                </tr>

                <!-- Signature -->
                <tr>
                  <td class="mobile-padding" align="center" style="padding: 35px 40px;">
                    <p style="margin: 0 0 5px 0; font-family: 'Segoe UI', Arial, sans-serif; color: #B0B0B0; font-size: 15px;">Cordialement,</p>
                    <p style="margin: 0; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; font-weight: 600; background: linear-gradient(135deg, #00F5A0 0%, #00D9F5 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">L'équipe NoRize</p>
                  </td>
                </tr>
              </table>

              <!-- Pied de Page -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 400px; margin-top: 40px;">
                <tr>
                  <td align="center">
                    <!-- Liens Sociaux -->
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 0 10px;">
                          <a href="#" style="color: #808080; text-decoration: none; font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px;">LinkedIn</a>
                        </td>
                        <td style="padding: 0 10px;">
                          <a href="#" style="color: #808080; text-decoration: none; font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px;">Twitter</a>
                        </td>
                        <td style="padding: 0 10px;">
                          <a href="#" style="color: #808080; text-decoration: none; font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px;">Website</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 20px;">
                    <p style="margin: 0; font-family: 'Segoe UI', Arial, sans-serif; color: #666666; font-size: 13px;">
                      © ${currentYear} NoRize. Tous droits réservés.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
      <!--[if mso]>
      </td></tr></table>
      <![endif]-->
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

// Route pour servir l'application React pour toutes les autres routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
}); 