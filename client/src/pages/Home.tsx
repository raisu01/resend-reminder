import { FiMail, FiCheckCircle, FiBarChart2, FiArrowRight, FiZap, FiRefreshCw, FiBook } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import logo from '../../public/logo.png'

const features = [
  {
    icon: <FiMail className="w-6 h-6 text-black group-hover:rotate-12 transition-transform duration-300" />,
    title: 'Emails Responsifs',
    description: "Templates d'emails optimisés pour tous les appareils et clients de messagerie."
  },
  {
    icon: <FiCheckCircle className="w-6 h-6 text-black group-hover:scale-110 transition-transform duration-300" />,
    title: 'Suivi en Temps Réel',
    description: "Visualisez l'état de vos envois et les statistiques en direct."
  },
  {
    icon: <FiBarChart2 className="w-6 h-6 text-black group-hover:translate-y-[-2px] transition-transform duration-300" />,
    title: 'Analyses Détaillées',
    description: "Tableaux de bord complets avec historique et métriques de performance."
  }
]

const Home = () => {
  return (
    <div className="min-h-screen w-full py-20 bg-black text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
      </div>

      <div className="w-full px-4 mx-auto max-w-7xl relative">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-6 mb-20">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br from-emerald-400 to-cyan-400 transform hover:rotate-6 transition-transform duration-300 hover:shadow-lg hover:shadow-emerald-500/25">
            <span className="text-4xl font-bold text-black"><img src={logo} alt="Logo" className="w-10 h-10" /></span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
            NoRize Reminder
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl">
            Une solution élégante pour l'envoi automatisé d'emails avec un suivi en temps réel et une interface moderne.
          </p>
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="group inline-flex items-center bg-gradient-to-br from-emerald-400 to-cyan-400 text-black px-6 py-3 rounded-lg font-medium hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              Accéder au Dashboard 
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              to="/docs"
              className="group inline-flex items-center border border-emerald-400/20 text-emerald-400 px-6 py-3 rounded-lg font-medium hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 hover:bg-emerald-400/10"
            >
              Documentation
              <FiBook className="ml-2 group-hover:rotate-12 transition-transform duration-300" />
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="flex flex-col items-center space-y-16">
          <div className="flex items-center space-x-3">
            <FiZap className="w-6 h-6 text-emerald-400 animate-bounce" />
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent text-center">
              Fonctionnalités Principales
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group flex flex-col bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:-translate-y-2 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/50 relative overflow-hidden"
              >
                {/* Effet de reflet */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-45deg] translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 mb-4 group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-20 flex flex-col items-center space-y-12">
          <div className="flex items-center space-x-3">
            <FiRefreshCw className="w-6 h-6 text-cyan-400 animate-spin-slow" />
            <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Comment ça marche ?
            </h2>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 w-full max-w-3xl hover:border-cyan-500/50 transition-colors duration-300 relative overflow-hidden group">
            {/* Effet de reflet */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-45deg] translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            </div>
            <div className="relative z-10">
              <ul className="space-y-6">
                {[1, 2, 3].map((step) => (
                  <li key={step} className="group/step flex items-start relative overflow-hidden">
                    {/* Effet de reflet pour chaque étape */}
                    <div className="absolute inset-0 opacity-0 group-hover/step:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-45deg] translate-x-[-100%] group-hover/step:translate-x-[200%] transition-transform duration-1000"></div>
                    </div>
                    <div className="flex-shrink-0 relative z-10">
                      <FiCheckCircle className="w-6 h-6 mt-1 text-emerald-400 group-hover/step:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="ml-4 relative z-10">
                      <p className="font-bold text-emerald-400 group-hover/step:text-emerald-300 transition-colors duration-300">
                        {step === 1 ? '1. Configuration Simple' : step === 2 ? '2. Envoi et Suivi' : '3. Analyse des Résultats'}
                      </p>
                      <p className="text-gray-400 group-hover/step:text-gray-300 transition-colors duration-300">
                        {step === 1 && "Intégrez l'API avec vos identifiants et commencez à envoyer des emails."}
                        {step === 2 && "Envoyez vos emails et suivez leur statut en temps réel dans le dashboard."}
                        {step === 3 && "Consultez les statistiques détaillées et optimisez vos campagnes."}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
