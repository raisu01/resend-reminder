import { Resend } from 'resend';


const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Activer CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'https://resend-reminder.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Gérer les requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Vérifier la méthode HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Méthode non autorisée'
    });
  }

  // Extraire les données
  const { to, subject, message } = req.body;

  // Valider les champs requis
  if (!to || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'Champs "to", "subject" et "message" requis.'
    });
  }

  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'NoRize <contact@norize.com>',
      to,
      subject: `NoRize - ${subject}`,
      html: generateEmailTemplate({ subject, message }),
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

    return res.status(200).json({
      success: true,
      message: 'Email envoyé avec succès'
    });
  } catch (err) {
    console.error('Erreur d\'envoi:', err);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de l\'email',
      error: err.message
    });
  }
}

const generateEmailTemplate = (data) => {
  const { subject, message } = data;
  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${subject}</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #0A0A0A;
          font-family: 'Segoe UI', Arial, sans-serif;
          color: #E0E0E0;
        }
        .container {
          max-width: 600px;
          margin: auto;
          padding: 20px;
          background-color: #1A1A1A;
          border-radius: 12px;
          border: 1px solid #2a2a2a;
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
        }
        .logo-img {
          width: 70px;
          height: auto;
          border-radius: 12px;
        }
        .brand {
          margin-top: 10px;
          font-size: 32px;
          background: linear-gradient(135deg, #00F5A0 0%, #00D9F5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: bold;
        }
        .subject {
          font-size: 20px;
          font-weight: 600;
          color: #00F5A0;
          padding: 20px 0;
          border-bottom: 1px solid #333;
        }
        .message {
          padding: 20px 0;
          line-height: 1.7;
          font-size: 15px;
          color: #CCCCCC;
        }
        .message p {
          margin-bottom: 16px;
        }
        .signature {
          text-align: center;
          padding-top: 10px;
        }
        .signature p {
          margin: 4px 0;
          color: #aaa;
          font-size: 14px;
        }
        .signature .team {
          font-weight: bold;
          font-size: 16px;
          background: linear-gradient(135deg, #00F5A0 0%, #00D9F5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .footer {
          font-size: 13px;
          color: #999;
          text-align: center;
          padding-top: 30px;
          border-top: 1px solid #2a2a2a;
        }
        .social a {
          color: #888;
          margin: 0 10px;
          text-decoration: none;
          font-size: 14px;
        }
        @media screen and (max-width: 600px) {
          .container {
            padding: 16px;
          }
          .brand {
            font-size: 24px;
          }
          .subject {
            font-size: 18px;
          }
          .message {
            font-size: 14px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img class="logo-img" src="https://resend-reminder.vercel.app/client/public/logo.png  " alt="Logo NoRize" />
          <div class="brand">NoRize</div>
        </div>

        <div class="subject">${subject}</div>

        <div class="message">
          ${message
            .split('\n')
            .filter(line => line.trim() !== '')
            .map(line => `<p>${line.trim()}</p>`)
            .join('')}
        </div>

        <div class="signature">
          <p>Cordialement,</p>
          <p class="team">L'équipe NoRize</p>
        </div>

        <div class="footer">
          <div class="social">
            <a href="#">LinkedIn</a> |
            <a href="#">Twitter</a> |
            <a href="#">Site Web</a>
          </div>
          <p style="margin-top: 10px;">© ${currentYear} NoRize. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
