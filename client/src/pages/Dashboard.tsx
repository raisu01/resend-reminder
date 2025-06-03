import { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPlus, FiFilter, FiCheck, FiClock, FiX, FiInbox, FiRefreshCw } from 'react-icons/fi';
import { Email } from '../types';

const Dashboard: FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [filter, setFilter] = useState<'all' | 'delivered' | 'pending'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        // Simulation des données
        const mockEmails: Email[] = [
          {
            id: 1,
            to: 'user@example.com',
            subject: 'Rappel important',
            message: 'Contenu du rappel',
            status: 'delivered',
            sentAt: new Date().toISOString()
          },
          {
            id: 2,
            to: 'client@example.com',
            subject: 'Suivi de commande',
            message: 'Détails de la commande',
            status: 'pending',
            sentAt: new Date().toISOString()
          }
        ];
        setEmails(mockEmails);
      } catch (error) {
        console.error('Erreur lors du chargement des emails:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmails();
  }, []);

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
                <span className="text-lg font-bold text-black">N</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                NoRize
              </span>
            </Link>
            <button className="group inline-flex items-center px-4 py-2 bg-gradient-to-br from-emerald-400 to-cyan-400 text-black rounded-lg font-medium hover:-translate-y-0.5 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20">
              <FiPlus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Nouveau rappel
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-emerald-500/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center space-x-3">
              <FiInbox className="w-6 h-6 text-emerald-400 animate-bounce" />
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
                <tbody className="divide-y divide-white/5">
                  {filteredEmails.map(email => (
                    <tr 
                      key={email.id}
                      className="group hover:bg-white/5 transition-all duration-300"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <FiMail className="w-4 h-4 text-emerald-400" />
                          </div>
                          <span className="text-white group-hover:text-emerald-400 transition-colors duration-300">
                            {email.to}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-300 group-hover:text-white transition-colors duration-300">
                        {email.subject}
                      </td>
                      <td className="py-4 px-4">
                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border transition-all duration-300 ${getStatusStyle(email.status)}`}>
                          {getStatusIcon(email.status)}
                          <span>{getStatusText(email.status)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
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
      </main>
    </div>
  );
};

export default Dashboard; 