import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Usa o nosso cliente centralizado. O token vai automaticamente!
        const response = await api.get('/explain/stats');
        setStats(response.data);
      } catch (err) {
        console.error(err);
        setError('Erro de acesso. Sua sessão pode ter expirado.');

        // Se o backend recusar (401 Não Autorizado), limpa o token e joga para o Login
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchStats();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', color: '#fff', backgroundColor: '#1e1e1e', minHeight: '100vh', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #3c3c3c', paddingBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Painel Administrativo</h1>
        <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#ff4444', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Sair do Sistema
        </button>
      </div>

      {error && <p style={{ color: '#ff4444' }}>{error}</p>}

      {stats ? (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>

          {/* Card de Total */}
          <div style={{ backgroundColor: '#252526', padding: '20px 30px', borderRadius: '8px', minWidth: '250px', border: '1px solid #3c3c3c' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#aaa' }}>Total de Explicações Geradas</h3>
            <p style={{ fontSize: '48px', margin: 0, fontWeight: 'bold', color: '#4CAF50' }}>
              {stats.total_explanations}
            </p>
          </div>

          {/* Podemos adicionar os cards de tópicos e níveis aqui depois */}

        </div>
      ) : (
        <p style={{ color: '#aaa' }}>Carregando métricas do servidor...</p>
      )}
    </div>
  );
}

export default Dashboard;