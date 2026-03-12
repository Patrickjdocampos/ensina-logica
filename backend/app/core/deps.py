from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.security import SECRET_KEY, ALGORITHM
from app.services.user_service import get_user_by_email
from app.models.user import User

# Define onde o Swagger e a API devem procurar a rota de login para obter o token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Tenta decodificar o token usando nossa chave secreta
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Busca o usuário no banco para garantir que ele ainda existe
    user = get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception

    return user