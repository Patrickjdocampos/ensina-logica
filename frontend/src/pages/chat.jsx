import { useLocation } from 'react-router-dom';

function Chat() {
  const location = useLocation();
  const { topic, level } = location.state || { topic: 'Não definido', level: 'iniciante' };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: 'sans-serif', backgroundColor: '#1e1e1e', color: '#ffffff' }}>

      {/* Barra Lateral */}
      <div style={{ width: '260px', backgroundColor: '#252526', borderRight: '1px solid #3c3c3c', padding: '20px' }}>
        <h2 style={{ fontSize: '16px', margin: '0 0 20px 0', color: '#cccccc' }}>Parâmetros Iniciais</h2>
        <div style={{ fontSize: '14px', marginBottom: '10px' }}>
          <strong>Tópico:</strong> {topic}
        </div>
        <div style={{ fontSize: '14px' }}>
          <strong>Nível:</strong> {level}
        </div>
      </div>

      {/* Área Principal */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>

        {/* Histórico de Mensagens */}
        <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Explicando: {topic}</h1>
          <p style={{ color: '#aaaaaa' }}>O texto gerado pela API será renderizado nesta seção.</p>
        </div>

        {/* Área de Entrada */}
        <div style={{ padding: '20px', backgroundColor: '#1e1e1e', borderTop: '1px solid #3c3c3c' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Digite sua dúvida ou código..."
              style={{ flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid #555', backgroundColor: '#333333', color: '#ffffff' }}
            />
            <button style={{ padding: '0 20px', backgroundColor: '#4CAF50', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Enviar
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Chat;