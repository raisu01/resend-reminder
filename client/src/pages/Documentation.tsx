import { FC, useState } from 'react';
import { FiBook, FiCopy, FiCheck } from 'react-icons/fi';

interface CodeExample {
  language: string;
  code: string;
}

const Documentation: FC = () => {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['curl']);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const languages = [
    { id: 'curl', name: 'cURL' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'php', name: 'PHP' },
    { id: 'ruby', name: 'Ruby' },
    { id: 'java', name: 'Java' },
  ];

  const codeExamples: { [key: string]: CodeExample } = {
    curl: {
      language: 'bash',
      code: `curl -X POST https://resend-reminder.vercel.app/api/send \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "destinataire@example.com",
    "subject": "Rappel important",
    "message": "Votre message ici"
  }'`
    },
    javascript: {
      language: 'javascript',
      code: `// Utilisation avec fetch
const response = await fetch('https://resend-reminder.vercel.app/api/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: 'destinataire@example.com',
    subject: 'Rappel important',
    message: 'Votre message ici'
  })
});

const data = await response.json();
console.log(data);

// Utilisation avec axios
const axios = require('axios');

const response = await axios.post('https://resend-reminder.vercel.app/api/send', {
  to: 'destinataire@example.com',
  subject: 'Rappel important',
  message: 'Votre message ici'
});

console.log(response.data);`
    },
    python: {
      language: 'python',
      code: `import requests

response = requests.post(
    'https://resend-reminder.vercel.app/api/send',
    json={
        'to': 'destinataire@example.com',
        'subject': 'Rappel important',
        'message': 'Votre message ici'
    }
)

print(response.json())`
    },
    php: {
      language: 'php',
      code: `<?php
$data = array(
    'to' => 'destinataire@example.com',
    'subject' => 'Rappel important',
    'message' => 'Votre message ici'
);

$ch = curl_init('https://resend-reminder.vercel.app/api/send');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
print_r($result);`
    },
    ruby: {
      language: 'ruby',
      code: `require 'net/http'
require 'json'

uri = URI('https://resend-reminder.vercel.app/api/send')
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true

request = Net::HTTP::Post.new(uri)
request['Content-Type'] = 'application/json'
request.body = {
  to: 'destinataire@example.com',
  subject: 'Rappel important',
  message: 'Votre message ici'
}.to_json

response = http.request(request)
puts JSON.parse(response.body)`
    },
    java: {
      language: 'java',
      code: `import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;

String json = """
    {
        "to": "destinataire@example.com",
        "subject": "Rappel important",
        "message": "Votre message ici"
    }
    """;

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://resend-reminder.vercel.app/api/send"))
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(json))
    .build();

HttpResponse<String> response = HttpClient.newHttpClient()
    .send(request, HttpResponse.BodyHandlers.ofString());

System.out.println(response.body());`
    }
  };

  const handleLanguageToggle = (languageId: string) => {
    setSelectedLanguages(prev => 
      prev.includes(languageId)
        ? prev.filter(id => id !== languageId)
        : [...prev, languageId]
    );
  };

  const handleCopyCode = async (languageId: string, code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedStates(prev => ({ ...prev, [languageId]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [languageId]: false }));
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-hidden py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -top-48 -right-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -bottom-48 -left-48 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <FiBook className="w-8 h-8 text-emerald-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Documentation
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Découvrez comment intégrer notre API d'envoi d'emails dans votre application.
          </p>
        </div>

        {/* API Information */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8 relative overflow-hidden group hover:bg-white/10 transition-all duration-500">
          {/* Effet de reflet */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-45deg] translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-emerald-400 mb-4">Endpoint</h2>
            <div className="bg-black/50 p-4 rounded-lg font-mono mb-4">
              POST https://resend-reminder.vercel.app/api/send
            </div>
            <h3 className="text-xl font-semibold text-emerald-400 mb-2">Corps de la requête</h3>
            <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
{`{
  "to": "string",     // Adresse email du destinataire
  "subject": "string", // Sujet de l'email
  "message": "string"  // Corps du message
}`}
            </pre>
          </div>
        </div>

        {/* Language Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-emerald-400 mb-4">Sélectionnez vos langages</h2>
          <div className="flex flex-wrap gap-4">
            {languages.map(lang => (
              <label
                key={lang.id}
                className="flex items-center space-x-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedLanguages.includes(lang.id)}
                  onChange={() => handleLanguageToggle(lang.id)}
                  className="hidden"
                />
                <div className={`px-4 py-2 rounded-full border transition-all duration-300 ${
                  selectedLanguages.includes(lang.id)
                    ? 'bg-emerald-400/20 border-emerald-400/50 text-emerald-400'
                    : 'border-white/10 text-gray-400 hover:border-emerald-400/30'
                }`}>
                  <span>{lang.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Code Examples */}
        <div className="space-y-8">
          {selectedLanguages.map(langId => (
            <div
              key={langId}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:bg-white/10 transition-all duration-500"
            >
              {/* Effet de reflet */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-45deg] translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-emerald-400">
                    {languages.find(l => l.id === langId)?.name}
                  </h3>
                  <button
                    onClick={() => handleCopyCode(langId, codeExamples[langId].code)}
                    className="flex items-center space-x-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-300"
                  >
                    {copiedStates[langId] ? (
                      <>
                        <FiCheck className="w-4 h-4" />
                        <span>Copié!</span>
                      </>
                    ) : (
                      <>
                        <FiCopy className="w-4 h-4" />
                        <span>Copier</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                  <code className={`language-${codeExamples[langId].language}`}>
                    {codeExamples[langId].code}
                  </code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Documentation; 