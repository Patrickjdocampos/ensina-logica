import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // O FastAPI espera form-data para o OAuth2PasswordRequestForm
      const params = new URLSearchParams();
      params.append('username', email); // O campo deve se chamar 'username', mesmo sendo um email
      params.append('password', password);

      const response = await axios.post('http://127.0.0.1:8000/auth/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      // Extrai o token e armazena localmente no navegador
      const token = response.data.access_token;
      localStorage.setItem('token', token);

      // Redireciona para o futuro dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Falha na autenticação. Verifique seu e-mail e senha.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#1e1e1e', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#252526', padding: '40px', borderRadius: '8px', width: '100%', maxWidth: '400px', border: '1px solid #3c3c3c' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Acesso Restrito</h2>

        {error && <div style={{ backgroundColor: '#ff4444', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="email"
            placeholder="E-mail Administrativo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: '#fff' }}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: '#fff' }}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{ padding: '12px', backgroundColor: isLoading ? '#555' : '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
          >
            {isLoading ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;