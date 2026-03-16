import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function Chat() {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('iniciante');

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [sessionId, setSessionId] = useState(null);
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ensina_logica_history');
      if (saved) {
        const parsedData = JSON.parse(saved);
        // Validação de segurança extraída das iterações anteriores
        if (Array.isArray(parsedData)) {
          setHistoryList(parsedData);
        }
      }
    } catch (e) {
      console.error("Erro ao ler o histórico local", e);
    }
  }, []);

  const saveToHistory = (id, currentTopic, currentLevel) => {
    setHistoryList((prev) => {
      if (prev.some(item => item.id === id)) return prev;
      const newList = [{ id, topic: currentTopic, level: currentLevel }, ...prev];
      localStorage.setItem('ensina_logica_history', JSON.stringify(newList));
      return newList;
    });
  };

  const handleSend = async () => {
    if (!input || typeof input !== 'string' || input.trim() === '' || isLoading) return;

    if (!topic || typeof topic !== 'string' || topic.trim() === '') {
      alert('Por favor, defina um tópico na barra lateral esquerda antes de iniciar.');
      return;
    }

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const payload = {
        topic: topic,
        level: level,
        prompt: userMessage.content,
        session_id: sessionId
      };

      const response = await axios.post('http://127.0.0.1:8000/explain', payload);
      const textResponse = response.data.explanation;
      const returnedSessionId = response.data.session_id;

      if (!sessionId && returnedSessionId) {
        setSessionId(returnedSessionId);
        saveToHistory(returnedSessionId, topic, level);
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: textResponse }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Erro de conexão com o servidor.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setSessionId(null);
    setTopic('');
    setLevel('iniciante');
  };

  const loadSession = async (id) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/explain/session/${id}`);
      const data = response.data;

      setSessionId(data.session?.id || null);
      setTopic(data.session?.topic || '');
      setLevel(data.session?.level || 'iniciante');
      setMessages(data.messages || []);

    } catch (error) {
      console.error(error);
      alert('Não foi possível carregar o histórico desta sessão.');
    } finally {
      setIsLoading(false);
    }
  };

  const isTopicValid = typeof topic === 'string' && topic.trim() !== '';
  const isInputDisabled = isLoading || !isTopicValid;

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
              value={topic || ''}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Condicionais, Listas..."
              disabled={sessionId !== null}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#333', color: '#fff', boxSizing: 'border-box', opacity: sessionId !== null ? 0.5 : 1 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#aaa' }}>Nível de Dificuldade</label>
            <select
              value={level || 'iniciante'}
              onChange={(e) => setLevel(e.target.value)}
              disabled={sessionId !== null}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#333', color: '#fff', boxSizing: 'border-box', opacity: sessionId !== null ? 0.5 : 1 }}
            >
              <option value="iniciante">Iniciante</option>
              <option value="intermediário">Intermediário</option>
              <option value="avançado">Avançado</option>
            </select>
          </div>
        </div>

        {/* Quadro de Histórico Dinâmico */}
        <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
          <h2 style={{ fontSize: '14px', margin: '0 0 10px 0', color: '#cccccc', textTransform: 'uppercase' }}>Histórico</h2>

          {historyList.length === 0 ? (
            <p style={{ fontSize: '12px', color: '#777', fontStyle: 'italic', lineHeight: '1.5' }}>
              Nenhuma sessão recente encontrada.
            </p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {historyList.map((item) => (
                <li key={item.id} style={{ marginBottom: '8px' }}>
                  <button
                    onClick={() => loadSession(item.id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px',
                      backgroundColor: sessionId === item.id ? '#3c3c3c' : 'transparent',
                      color: '#ddd',
                      border: '1px solid #3c3c3c',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    <strong style={{ display: 'block', color: '#4CAF50', marginBottom: '4px' }}>{item.topic}</strong>
                    <span style={{ fontSize: '11px', color: '#888', textTransform: 'capitalize' }}>Nível: {item.level}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

      {/* Área Principal do Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>

        {/* AQUI ESTÁ A CORREÇÃO DE ARQUITETURA: key={sessionId || 'empty'} forçando a remontagem segura */}
        <div key={sessionId || 'empty'} style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          {topic ? (
             <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Tópico Atual: {topic} {sessionId && <span style={{fontSize: '14px', color: '#777'}}>(Sessão #{sessionId})</span>}</h1>
          ) : (
             <h1 style={{ fontSize: '24px', marginBottom: '20px', color: '#777' }}>Defina um tópico ao lado para começar</h1>
          )}

          {messages.length === 0 ? (
            <p style={{ color: '#aaaaaa' }}>Aguardando o envio da sua mensagem para iniciar a aula.</p>
          ) : null}

          {messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: '20px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
              <div style={{
                display: 'inline-block',
                padding: '12px 18px',
                borderRadius: '8px',
                backgroundColor: msg.role === 'user' ? '#4CAF50' : '#333333',
                maxWidth: '80%',
                lineHeight: '1.5',
                textAlign: 'left'
              }}>
                {msg.role === 'user' ? (
                  <span style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</span>
                ) : (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                )}
              </div>
            </div>
          ))}

          {isLoading ? (
            <div style={{ textAlign: 'left', color: '#aaaaaa', fontStyle: 'italic', marginTop: '10px' }}>
              Processando histórico ou resposta...
            </div>
          ) : null}
        </div>

        <div style={{ padding: '20px', backgroundColor: '#1e1e1e', borderTop: '1px solid #3c3c3c' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={input || ''}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua dúvida ou código..."
              disabled={isInputDisabled}
              style={{ flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid #555', backgroundColor: '#333', color: '#fff' }}
            />
            <button
              onClick={handleSend}
              disabled={isInputDisabled}
              style={{
                padding: '0 20px',
                backgroundColor: isInputDisabled ? '#555' : '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: isInputDisabled ? 'not-allowed' : 'pointer'
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