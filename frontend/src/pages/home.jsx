import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('iniciante');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!topic.trim()) return;
    navigate('/chat', { state: { topic, level } });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Ensina Lógica</h1>
      <p>Bem-vindo. Qual conceito de programação você quer entender hoje?</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Ex: Laço for, Arrays, Funções..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        >
          <option value="iniciante">Nível Iniciante</option>
          <option value="basico">Nível Básico</option>
          <option value="avancado">Nível Avançado</option>
        </select>
        <button
          onClick={handleSubmit}
          style={{ padding: '10px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Explicar
        </button>
      </div>
    </div>
  );
}

export default Home;