import { FC, useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPlus, FiFilter, FiCheck, FiClock, FiX, FiInbox, FiRefreshCw, FiSend } from 'react-icons/fi';
import { Email } from '../types';
import logo from '../../public/logo.png'
import { sendEmail, checkEmailStatus } from '../services/api';

const Dashboard: FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [filter, setFilter] = useState<'all' | 'delivered' | 'pending'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    message: ''
  });

  // Charger les emails depuis le localStorage
  useEffect(() => {
    const storedEmails = localStorage.getItem('emails');
    if (storedEmails) {
      setEmails(JSON.parse(storedEmails));
    }
    setIsLoading(false);
  }, []);

  // Vérifier le statut des emails en attente
  useEffect(() => {
    const checkPendingEmails = async () => {
      const pendingEmails = emails.filter(email => email.status === 'pending');
      
      for (const email of pendingEmails) {
        try {
          const response = await checkEmailStatus(email.id);
          if (response.success && response.status !== email.status) {
            const updatedEmails = emails.map(e => 
              e.id === email.id ? { ...e, status: response.status as Email['status'] } : e
            );
            setEmails(updatedEmails);
            localStorage.setItem('emails', JSON.stringify(updatedEmails));
          }
        } catch (error) {
          console.error(`Erreur lors de la vérification du statut pour l'email ${email.id}:`, error);
        }
      }
    };

    const interval = setInterval(checkPendingEmails, 5000);
    return () => clearInterval(interval);
  }, [emails]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Créer un nouvel email avec le statut initial "pending"
      const newEmail: Email = {
        id: Date.now(),
        ...formData,
        status: 'pending',
        sentAt: new Date().toISOString()
      };

      // Mettre à jour le localStorage immédiatement avec l'email en attente
      const updatedEmails = [newEmail, ...emails];
      setEmails(updatedEmails);
      localStorage.setItem('emails', JSON.stringify(updatedEmails));

      // Envoyer l'email via l'API
      const response = await sendEmail({
        to: formData.to,
        subject: formData.subject,
        text: formData.message
      });

      // Mettre à jour l'email avec le statut retourné par l'API
      const finalUpdatedEmails = updatedEmails.map(email => 
        email.id === newEmail.id ? { 
          ...email,
          status: response.status
        } : email
      );
      setEmails(finalUpdatedEmails);
      localStorage.setItem('emails', JSON.stringify(finalUpdatedEmails));

      // Réinitialiser le formulaire si l'envoi est réussi
      if (response.success) {
        setFormData({ to: '', subject: '', message: '' });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmails = emails.filter(email => {
    if (filter === 'all') return true;
    return email.status === filter;
  });

  const getStatusIcon = (status: Email['status']) => {
    switch (status) {
      case 'delivered':
        return <FiCheck className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />;
      case 'pending':
        return <FiClock className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />;
      case 'failed':
        return <FiX className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />;
      default:
        return null;
    }
  };

  const getStatusStyle = (status: Email['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20 hover:bg-emerald-400/20 hover:border-emerald-400/30';
      case 'pending':
        return 'bg-amber-400/10 text-amber-400 border-amber-400/20 hover:bg-amber-400/20 hover:border-amber-400/30';
      case 'failed':
        return 'bg-red-400/10 text-red-400 border-red-400/20 hover:bg-red-400/20 hover:border-red-400/30';
      default:
        return 'bg-gray-400/10 text-gray-400 border-gray-400/20 hover:bg-gray-400/20 hover:border-gray-400/30';
    }
  };

  const getStatusText = (status: Email['status']) => {
    switch (status) {
      case 'delivered':
        return 'Délivré';
      case 'pending':
        return 'En attente';
      case 'failed':
        return 'Échoué';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -top-48 -right-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -bottom-48 -left-48 animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <nav className="border-b border-white/10 backdrop-blur-sm bg-black/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-emerald-400 to-cyan-400 group-hover:rotate-6 transition-transform duration-300">
                <span className="text-lg font-bold text-black"><img src={logo} alt="Logo" className="w-10 h-10" /></span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                NoRize
              </span>
            </Link>
            <button 
              onClick={() => setShowForm(true)}
              className="group inline-flex items-center px-4 py-2 bg-gradient-to-br from-emerald-400 to-cyan-400 text-black rounded-lg font-medium hover:-translate-y-0.5 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              <FiPlus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Nouveau rappel
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="mb-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:bg-white/10 transition-all duration-500">
            {/* Effet de reflet */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-45deg] translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-emerald-400 mb-4">Tester un nouvel e-mail</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="to" className="block text-sm font-medium text-gray-300 mb-1">
                    Destinataire
                  </label>
                  <input
                    type="email"
                    id="to"
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                    Sujet
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                    rows={4}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="group inline-flex items-center px-4 py-2 bg-gradient-to-br from-emerald-400 to-cyan-400 text-black rounded-lg font-medium hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <FiSend className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Envoyer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-emerald-500/20 relative overflow-hidden group hover:bg-white/10">
          {/* Effet de reflet */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-45deg] translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          </div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 overflow-x-hidden">
              <div className="flex items-center space-x-3 overflow-x-hidden">
                <FiInbox className="w-6 h-6 text-emerald-400 animate-bounce " />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Emails envoyés
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <select 
                    className="appearance-none bg-white/5 border border-white/10 text-white rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 hover:border-emerald-400/30 transition-colors duration-300"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as typeof filter)}
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="delivered">Délivrés</option>
                    <option value="pending">En attente</option>
                  </select>
                  <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-emerald-400 transition-colors duration-300" />
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <FiRefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                <p className="text-gray-400 animate-pulse">Chargement des emails...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Destinataire</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Sujet</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Statut</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date d'envoi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 overflow-x-hidden">
                    {filteredEmails.map(email => (
                      <tr 
                        key={email.id}
                        className="group/row hover:bg-white/5 transition-all duration-300 relative overflow-hidden"
                      >
                        {/* Effet de reflet pour chaque ligne */}
                        <div className="absolute inset-0 opacity-0 group-hover/row:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-45deg] translate-x-[-100%] group-hover/row:translate-x-[200%] transition-transform duration-1000"></div>
                        </div>
                        <td className="py-4 px-4 relative">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 flex items-center justify-center group-hover/row:scale-110 transition-transform duration-300">
                              <FiMail className="w-4 h-4 text-emerald-400" />
                            </div>
                            <span className="text-white group-hover/row:text-emerald-400 transition-colors duration-300">
                              {email.to}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-300 group-hover/row:text-white transition-colors duration-300 relative">
                          {email.subject}
                        </td>
                        <td className="py-4 px-4 relative">
                          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border transition-all duration-300 ${getStatusStyle(email.status)}`}>
                            {getStatusIcon(email.status)}
                            <span>{getStatusText(email.status)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-400 group-hover/row:text-gray-300 transition-colors duration-300 relative">
                          {new Date(email.sentAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredEmails.length === 0 && (
                  <div className="text-center py-12 space-y-4">
                    <FiMail className="w-12 h-12 text-gray-500 mx-auto animate-bounce" />
                    <p className="text-gray-400">Aucun email trouvé</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 