import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const PIE_COLORS = ['#4CAF50', '#2196F3', '#FFC107'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, logsResponse] = await Promise.all([
          api.get('/explain/stats'),
          api.get('/explain/logs?limit=15')
        ]);

        setStats(statsResponse.data);
        setLogs(logsResponse.data);
      } catch (err) {
        console.error(err);
        setError('Erro de acesso. Sua sessão pode ter expirado.');

        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', color: '#fff', backgroundColor: '#1e1e1e', minHeight: '100vh', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #3c3c3c', paddingBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Painel Analítico</h1>
        <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#ff4444', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Sair do Sistema
        </button>
      </div>

      {error && <p style={{ color: '#ff4444' }}>{error}</p>}

      {stats ? (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: '40px' }}>

          {/* Card de Total */}
          <div style={{ backgroundColor: '#252526', padding: '20px 30px', borderRadius: '8px', minWidth: '250px', border: '1px solid #3c3c3c' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#aaa' }}>Total de Explicações</h3>
            <p style={{ fontSize: '48px', margin: 0, fontWeight: 'bold', color: '#4CAF50' }}>
              {stats.total_explanations}
            </p>
          </div>

          {/* Card de Tópicos (Gráfico de Barras) */}
          <div style={{ backgroundColor: '#252526', padding: '20px 30px', borderRadius: '8px', minWidth: '400px', flex: 2, border: '1px solid #3c3c3c', height: '350px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#aaa', borderBottom: '1px solid #3c3c3c', paddingBottom: '10px' }}>Tópicos Mais Buscados</h3>
            {stats.topics_breakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={stats.topics_breakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                  <XAxis dataKey="topic" stroke="#888" tick={{ fill: '#888', fontSize: 12 }} />
                  <YAxis stroke="#888" tick={{ fill: '#888', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '5px', color: '#fff' }}
                    itemStyle={{ color: '#4CAF50' }}
                    cursor={{ fill: '#333' }}
                  />
                  <Bar dataKey="count" name="Acessos" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ color: '#777' }}>Nenhum dado registrado.</p>
            )}
          </div>

          {/* Card de Níveis (Gráfico de Pizza) */}
          <div style={{ backgroundColor: '#252526', padding: '20px 30px', borderRadius: '8px', minWidth: '300px', flex: 1, border: '1px solid #3c3c3c', height: '350px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#aaa', borderBottom: '1px solid #3c3c3c', paddingBottom: '10px' }}>Distribuição por Nível</h3>
            {stats.levels_breakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie
                    data={stats.levels_breakdown}
                    dataKey="count"
                    nameKey="level"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                  >
                    {stats.levels_breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '5px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '14px', textTransform: 'capitalize' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ color: '#777' }}>Nenhum dado registrado.</p>
            )}
          </div>

        </div>
      ) : (
        <p style={{ color: '#aaa', marginBottom: '40px' }}>Carregando métricas do servidor...</p>
      )}

      {/* Tabela de Histórico de Logs */}
      <div style={{ backgroundColor: '#252526', padding: '20px 30px', borderRadius: '8px', border: '1px solid #3c3c3c' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#aaa', borderBottom: '1px solid #3c3c3c', paddingBottom: '10px' }}>
          Últimas Interações
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #3c3c3c', color: '#aaa' }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>Tópico</th>
                <th style={{ padding: '12px' }}>Nível</th>
                <th style={{ padding: '12px' }}>Resumo da Explicação</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '12px', color: '#888' }}>#{log.id}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{log.topic}</td>
                  <td style={{ padding: '12px', textTransform: 'capitalize', color: '#4CAF50' }}>{log.level}</td>
                  <td style={{ padding: '12px', color: '#ccc', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {log.explanation}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '12px', textAlign: 'center', color: '#777' }}>
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;