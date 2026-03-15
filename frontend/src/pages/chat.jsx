import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function Chat() {
  const location = useLocation();
  const { topic, level } = location.state || { topic: 'Não definido', level: 'iniciante' };

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // A função deve obrigatoriamente ser 'async' para suportar o 'await' interno
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/explain', {
        topic: topic,
        level: level,
        prompt: userMessage.content,
        messages: messages // Histórico sendo enviado corretamente
      });

      const textResponse = response.data.explanation || response.data.resposta || JSON.stringify(response.data);

      setMessages((prev) => [...prev, { role: 'assistant', content: textResponse }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Erro de conexão: Não foi possível obter resposta do backend.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', fontFamily: 'sans-serif', backgroundColor: '#1e1e1e', color: '#ffffff' }}>

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

          {messages.length === 0 && (
            <p style={{ color: '#aaaaaa' }}>O histórico de interação será exibido aqui. Envie uma mensagem para iniciar.</p>
          )}

          {/* Renderização dinâmica dos balões de chat */}
          {messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: '20px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
              <div style={{
                display: 'inline-block',
                padding: '12px 18px',
                borderRadius: '8px',
                backgroundColor: msg.role === 'user' ? '#4CAF50' : '#333333',
                maxWidth: '80%',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{ textAlign: 'left', color: '#aaaaaa', fontStyle: 'italic', marginTop: '10px' }}>
              Processando resposta do modelo...
            </div>
          )}
        </div>

        {/* Área de Entrada */}
        <div style={{ padding: '20px', backgroundColor: '#1e1e1e', borderTop: '1px solid #3c3c3c' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua dúvida ou código..."
              disabled={isLoading}
              style={{ flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid #555', backgroundColor: '#333333', color: '#ffffff' }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              style={{
                padding: '0 20px',
                backgroundColor: isLoading ? '#555555' : '#4CAF50',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Chat;