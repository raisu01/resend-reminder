import axios from 'axios';

export interface EmailData {
  subject: string;
  text?: string;
  html?: string;
  to: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  error?: any;
  id?: number;
  status: 'delivered' | 'pending' | 'failed';
}

const API_URL = 'https://resend-reminder.vercel.app/api';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type'
  },
  withCredentials: false
});

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sendEmail = async (emailData: EmailData): Promise<EmailResponse> => {
  try {
    // Attendre 2 secondes pour simuler le délai d'envoi
    await wait(2000);

    const response = await axiosInstance.post('/send', {
      to: emailData.to,
      subject: emailData.subject,
      message: emailData.text || emailData.html || ''
    });

    return {
      success: true,
      message: 'Email envoyé avec succès',
      status: 'delivered',
      ...response.data
    };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Échec de l\'envoi de l\'email',
      status: 'failed',
      error
    };
  }
};

export const checkEmailStatus = async (emailId: string | number): Promise<EmailResponse> => {
  try {
    const response = await axiosInstance.get(`/status/${emailId}`);
    return {
      success: true,
      message: 'Statut récupéré avec succès',
      ...response.data
    };
  } catch (error) {
    console.error('Erreur lors de la vérification du statut:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Échec de la vérification du statut',
      error
    };
  }
}; 