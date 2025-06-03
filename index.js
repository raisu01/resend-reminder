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
      <title>NoRize - ${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
      <table cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; background-color: #f4f4f4;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- En-tête -->
              <tr>
                <td style="padding: 40px 0; background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%); border-radius: 8px 8px 0 0;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <h1 style="margin: 0; font-size: 32px; color: #ffffff; text-transform: uppercase; letter-spacing: 2px;">NoRize</h1>
                        <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">Solutions Professionnelles</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Contenu -->
              <tr>
                <td style="padding: 40px 30px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding: 0 0 20px;">
                        <div style="background-color: #f8f9fa; border-left: 4px solid #1a237e; padding: 20px; margin-bottom: 30px;">
                          <p style="color: #2c3e50; font-size: 16px; line-height: 1.6; margin: 0;">
                            ${message.replace(/\n/g, '</p><p style="color: #2c3e50; font-size: 16px; line-height: 1.6; margin: 12px 0 0;">')}
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Pied de page -->
              <tr>
                <td style="padding: 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <p style="margin: 0; color: #666; font-size: 14px;">Cordialement,</p>
                        <p style="margin: 8px 0 0; color: #1a237e; font-weight: bold; font-size: 16px;">L'équipe NoRize</p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding-top: 20px;">
                        <p style="margin: 0; color: #999; font-size: 12px;">© ${new Date().getFullYear()} NoRize. Tous droits réservés.</p>
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
