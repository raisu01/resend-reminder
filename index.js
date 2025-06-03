import express from 'express';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(express.json());

app.post('/send', async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Champs "to", "subject" et "message" requis.' });
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="dark light">
      <title>NoRize - ${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #121212; font-family: Arial, sans-serif;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; background-color: #121212;">
        <tr>
          <td align="center" style="padding: 20px 10px;">
            <!-- Container principal - Responsive -->
            <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; background-color: #1E1E1E; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
              <!-- En-tête -->
              <tr>
                <td style="padding: 40px 0; background: linear-gradient(135deg, rgb(15, 34, 238) 0%, rgb(242, 16, 250) 100%); border-radius: 12px 12px 0 0;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <h1 style="margin: 0; font-size: clamp(24px, 5vw, 32px); color: #ffffff; text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">NoRize</h1>
                        <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: clamp(14px, 3vw, 16px);">Solutions Professionnelles</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Contenu -->
              <tr>
                <td style="padding: clamp(20px, 4vw, 40px) clamp(15px, 3vw, 30px);">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <div style="background-color: #2D2D2D; border-left: 4px solid rgb(242, 16, 250); padding: clamp(15px, 3vw, 25px); margin-bottom: 30px; border-radius: 0 8px 8px 0;">
                          <p style="color: #E0E0E0; font-size: clamp(14px, 3vw, 16px); line-height: 1.6; margin: 0;">
                            ${message.replace(/\n/g, '</p><p style="color: #E0E0E0; font-size: clamp(14px, 3vw, 16px); line-height: 1.6; margin: 12px 0 0;">')}
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Pied de page -->
              <tr>
                <td style="padding: clamp(20px, 4vw, 30px); background-color: #2D2D2D; border-radius: 0 0 12px 12px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <p style="margin: 0; color: #B0B0B0; font-size: clamp(12px, 2.5vw, 14px);">Cordialement,</p>
                        <p style="margin: 8px 0 0; background: linear-gradient(135deg, rgb(15, 34, 238) 0%, rgb(242, 16, 250) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; font-size: clamp(14px, 3vw, 16px);">L'équipe NoRize</p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding-top: clamp(15px, 3vw, 20px);">
                        <p style="margin: 0; color: #808080; font-size: clamp(10px, 2vw, 12px);">© ${new Date().getFullYear()} NoRize. Tous droits réservés.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `
NoRize
-------
${subject}
-------

${message}

Cordialement,
L'équipe NoRize

© ${new Date().getFullYear()} NoRize. Tous droits réservés.
  `;

  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'NoRize <contact@norize.com>',
      to,
      subject: `NoRize - ${subject}`,
      html,
      text,
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
