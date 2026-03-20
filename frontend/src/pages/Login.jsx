import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Controle de modo
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegistering) {
        // Fluxo 1: Criação da Conta
        await axios.post('https://ensina-logica-api.onrender.com/auth/register', {
          email: email,
          password: password
        });
      }

      // Fluxo 2: Autenticação (Executado para Login ou automaticamente após o Cadastro)
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      const response = await axios.post('https://ensina-logica-api.onrender.com/auth/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const token = response.data.access_token;
      localStorage.setItem('token', token);

      // Redireciona para o Dashboard (posteriormente mudaremos para o Chat)
      navigate('/');

    } catch (err) {
      console.error(err);
      if (err.response?.status === 400 && isRegistering) {
        setError('Este e-mail já está cadastrado no sistema.');
      } else {
        setError(isRegistering ? 'Erro ao criar conta. Tente novamente.' : 'Falha na autenticação. Verifique seu e-mail e senha.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#1e1e1e', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#252526', padding: '40px', borderRadius: '8px', width: '100%', maxWidth: '400px', border: '1px solid #3c3c3c' }}>

        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#4CAF50' }}>Ensina Lógica</h2>

        {error && <div style={{ backgroundColor: '#ff4444', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="email"
            placeholder="E-mail"
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
            {isLoading ? 'Aguarde...' : (isRegistering ? 'Cadastrar' : 'Entrar')}
          </button>
        </form>

        <p
          onClick={toggleMode}
          style={{ textAlign: 'center', marginTop: '20px', color: '#aaa', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}
        >
          {isRegistering ? 'Já tem uma conta? Entre aqui.' : 'Não tem uma conta? Faça seu cadastro.'}
        </p>

      </div>
    </div>
  );
}

export default Login;