import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // Verifica a existência do token no armazenamento local
  const token = localStorage.getItem('token');

  if (!token) {
    // Se não houver token, bloqueia a renderização e redireciona para o login.
    // O parâmetro 'replace' substitui o histórico, impedindo que o usuário volte com a seta do navegador.
    return <Navigate to="/login" replace />;
  }

  // Se o token existir, renderiza o componente protegido (Dashboard)
  return children;
}

export default ProtectedRoute;
