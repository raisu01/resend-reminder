interface SendEmailParams {
  to: string;
  subject: string;
  message: string;
}

export const sendEmail = async ({ to, subject, message }: SendEmailParams) => {
  try {
    const response = await fetch('/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, message }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de l\'envoi de l\'email');
    }

    return data;
  } catch (error) {
    console.error('Erreur service email:', error);
    throw error;
  }
}; 