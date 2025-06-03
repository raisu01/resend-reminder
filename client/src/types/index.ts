export interface Email {
  id: number;
  to: string;
  subject: string;
  message: string;
  status: 'pending' | 'delivered' | 'failed';
  sentAt: string;
}

export interface EmailFormData {
  to: string;
  subject: string;
  message: string;
} 