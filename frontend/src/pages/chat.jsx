import { useState } from 'react';
import axios from 'axios';

function Chat() {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('iniciante');

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Novo estado para controlar a sessão no banco de dados
  const [sessionId, setSessionId] = useState(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!topic.trim()) {
      alert('Por favor, defina um tópico na barra lateral esquerda antes de iniciar.');
      return;
    }

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // O payload agora envia o session_id. Se for null, o backend criará uma nova sessão.
      const payload = {
        topic: topic,
        level: level,
        prompt: userMessage.content,
        session_id: sessionId
      };

      const response = await axios.post('http://127.0.0.1:8000/explain', payload);

      const textResponse = response.data.explanation;

      // Captura o ID da sessão gerado pelo backend na primeira interação
      if (!sessionId && response.data.session_id) {
        setSessionId(response.data.session_id);
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: textResponse }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Erro de conexão: Não foi possível obter resposta do backend.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    // Reseta o contexto local e desvincula a sessão atual
    setMessages([]);
    setInput('');
    setSessionId(null);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', fontFamily: 'sans-serif', backgroundColor: '#1e1e1e', color: '#ffffff' }}>

      {/* Barra Lateral Esquerda */}
      <div style={{ width: '280px', backgroundColor: '#252526', borderRight: '1px solid #3c3c3c', display: 'flex', flexDirection: 'column' }}>

        <div style={{ padding: '20px', borderBottom: '1px solid #3c3c3c' }}>
          <button
            onClick={handleNewChat}
            style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px' }}
          >
            + Novo Chat
          </button>

          <h2 style={{ fontSize: '14px', margin: '0 0 10px 0', color: '#cccccc', textTransform: 'uppercase' }}>Configuração</h2>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#aaa' }}>Tópico de Estudo</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Condicionais, Listas..."
              disabled={sessionId !== null} // Bloqueia edição de parâmetros no meio da conversa
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#333', color: '#fff', boxSizing: 'border-box', opacity: sessionId !== null ? 0.5 : 1 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#aaa' }}>Nível de Dificuldade</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              disabled={sessionId !== null} // Bloqueia edição de parâmetros no meio da conversa
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#333', color: '#fff', boxSizing: 'border-box', opacity: sessionId !== null ? 0.5 : 1 }}
            >
              <option value="iniciante">Iniciante</option>
              <option value="intermediário">Intermediário</option>
              <option value="avançado">Avançado</option>
            </select>
          </div>
        </div>

        <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
          <h2 style={{ fontSize: '14px', margin: '0 0 10px 0', color: '#cccccc', textTransform: 'uppercase' }}>Histórico</h2>
          <p style={{ fontSize: '12px', color: '#777', fontStyle: 'italic', lineHeight: '1.5' }}>
            A lista de sessões anteriores será implementada nesta área.
          </p>
        </div>

      </div>

      {/* Área Principal do Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>

        <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          {topic ? (
             <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Tópico Atual: {topic} {sessionId && <span style={{fontSize: '14px', color: '#777'}}>(Sessão #{sessionId})</span>}</h1>
          ) : (
             <h1 style={{ fontSize: '24px', marginBottom: '20px', color: '#777' }}>Defina um tópico ao lado para começar</h1>
          )}

          {messages.length === 0 && (
            <p style={{ color: '#aaaaaa' }}>Aguardando o envio da sua mensagem para iniciar a aula.</p>
          )}

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

        <div style={{ padding: '20px', backgroundColor: '#1e1e1e', borderTop: '1px solid #3c3c3c' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua dúvida ou código..."
              disabled={isLoading || !topic.trim()}
              style={{ flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid #555', backgroundColor: '#333', color: '#fff' }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !topic.trim()}
              style={{
                padding: '0 20px',
                backgroundColor: (isLoading || !topic.trim()) ? '#555' : '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: (isLoading || !topic.trim()) ? 'not-allowed' : 'pointer'
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