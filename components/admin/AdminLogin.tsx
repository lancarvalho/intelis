
import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Shield, Lock, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulação de verificação de credenciais
    // Em produção, isso seria uma chamada API real
    setTimeout(() => {
      if (email === 'admin@intelis.org.br' && password === 'admin123') {
        onLoginSuccess();
      } else {
        setError('Credenciais inválidas. Acesso negado.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-intelis-darkBlue p-8 text-center">
           <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
              <Shield size={32} />
           </div>
           <h2 className="text-2xl font-bold text-white">Acesso Administrativo</h2>
           <p className="text-blue-200 text-sm mt-2">Área restrita a oficiais do partido</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <Input 
                    label="E-mail Institucional" 
                    type="email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="admin@intelis.org.br"
                    required
                />
            </div>
            <div>
                <Input 
                    label="Senha" 
                    type="password"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••"
                    required
                />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center gap-2 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <Button 
                type="submit" 
                isLoading={isLoading}
                className="w-full bg-intelis-darkBlue hover:bg-blue-900"
            >
                <Lock size={16} className="mr-2" />
                Acessar Sistema
            </Button>
          </form>

          <div className="mt-6 text-center">
             <button onClick={onBack} className="text-sm text-gray-500 hover:text-intelis-blue">
               Voltar ao site principal
             </button>
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
            <p>Credenciais de Demo:</p>
            <p>admin@intelis.org.br / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};
