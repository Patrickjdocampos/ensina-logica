import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Chat() {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('iniciante');

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [sessionId, setSessionId] = useState(null);
  const [historyList, setHistoryList] = useState([]);

  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/explain/history');
      setHistoryList(response.data);
    } catch (error) {
      console.error("Erro ao carregar histórico", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
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

      const response = await api.post('/explain/', payload);
      const textResponse = response.data.explanation;
      const returnedSessionId = response.data.session_id;

      if (!sessionId && returnedSessionId) {
        setSessionId(returnedSessionId);
        fetchHistory();
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
      const response = await api.get(`/explain/session/${id}`);
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

  const handleDeleteSession = async (id, e) => {
    e.stopPropagation();

    const confirmar = window.confirm("Confirmar exclusão desta sessão?");
    if (!confirmar) return;

    try {
      await api.delete(`/explain/session/${id}`);
      if (sessionId === id) {
        handleNewChat();
      }
      fetchHistory();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir a sessão.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
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
            style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px' }}
          >
            Novo Chat
          </button>

          <h2 style={{ fontSize: '11px', margin: '0 0 10px 0', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Configuração</h2>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#aaa' }}>Tópico de Estudo</label>
            <input
              type="text"
              value={topic || ''}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Condicionais..."
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

        {/* Histórico */}
        <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
          <h2 style={{ fontSize: '11px', margin: '0 0 10px 0', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Suas Sessões</h2>

          {historyList.length === 0 ? (
            <p style={{ fontSize: '12px', color: '#555', fontStyle: 'italic', lineHeight: '1.5' }}>
              Nenhum histórico encontrado.
            </p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {historyList.map((item) => (
                <li key={item.id} style={{ marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '5px', backgroundColor: sessionId === item.id ? '#333' : 'transparent', padding: '10px', borderRadius: '4px', border: '1px solid #3c3c3c' }}>
                  <button
                    onClick={() => loadSession(item.id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0',
                      backgroundColor: 'transparent',
                      color: '#ddd',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    <strong style={{ display: 'block', color: sessionId === item.id ? '#4CAF50' : '#ccc', marginBottom: '4px' }}>{item.topic}</strong>
                    <span style={{ fontSize: '11px', color: '#777', textTransform: 'capitalize' }}>Nível: {item.level}</span>
                  </button>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
                    <button
                      onClick={(e) => handleDeleteSession(item.id, e)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: 'transparent',
                        color: '#ff4444',
                        border: '1px solid #555',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        letterSpacing: '0.5px'
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Rodapé da Barra Lateral */}
        <div style={{ padding: '20px', borderTop: '1px solid #3c3c3c', display: 'flex', flexDirection: 'column', gap: '10px' }}>
           <button
             onClick={() => navigate('/dashboard')}
             style={{ width: '100%', padding: '8px', backgroundColor: 'transparent', color: '#4CAF50', border: '1px solid #4CAF50', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}
           >
             Painel Administrativo
           </button>
           <button
             onClick={handleLogout}
             style={{ width: '100%', padding: '8px', backgroundColor: '#333', color: '#aaa', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}
           >
             Sair da Conta
           </button>
        </div>

      </div>

      {/* Área Principal do Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>

        <div key={sessionId || 'empty'} style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          {topic ? (
             <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Tópico Atual: {topic}</h1>
          ) : (
             <h1 style={{ fontSize: '24px', marginBottom: '20px', color: '#777' }}>Defina um tópico ao lado para começar</h1>
          )}

          {messages.length === 0 ? (
            <p style={{ color: '#aaaaaa' }}>Aguardando o envio da sua mensagem para iniciar a sessão.</p>
          ) : null}

          {messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: '20px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
              <div style={{
                display: 'inline-block',
                padding: '12px 18px',
                borderRadius: '8px',
                backgroundColor: msg.role === 'user' ? '#4CAF50' : '#2d2d2d',
                maxWidth: '80%',
                lineHeight: '1.5',
                textAlign: 'left',
                border: msg.role === 'user' ? 'none' : '1px solid #444'
              }}>
                {msg.role === 'user' ? (
                  <span style={{ whiteSpace: 'pre-wrap', color: '#fff' }}>{msg.content}</span>
                ) : (
                  <ReactMarkdown
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <SyntaxHighlighter
                            {...props}
                            children={String(children).replace(/\n$/, '')}
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{ borderRadius: '5px', padding: '15px', marginTop: '10px', marginBottom: '10px', fontSize: '14px' }}
                          />
                        ) : (
                          <code {...props} className={className} style={{ backgroundColor: '#1e1e1e', padding: '2px 4px', borderRadius: '4px', color: '#ffcc00' }}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}

          {isLoading ? (
            <div style={{ textAlign: 'left', color: '#777', fontStyle: 'italic', marginTop: '10px', fontSize: '14px' }}>
              Processando resposta...
            </div>
          ) : null}

          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: '20px', backgroundColor: '#1e1e1e', borderTop: '1px solid #3c3c3c' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={input || ''}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua dúvida ou peça um exemplo de código..."
              disabled={isInputDisabled}
              style={{ flex: 1, padding: '15px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2d2d2d', color: '#fff', fontSize: '14px' }}
            />
            <button
              onClick={handleSend}
              disabled={isInputDisabled}
              style={{
                padding: '0 25px',
                backgroundColor: isInputDisabled ? '#444' : '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: isInputDisabled ? 'not-allowed' : 'pointer',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                fontSize: '12px'
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