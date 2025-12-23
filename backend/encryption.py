from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def normalize_password(password: str) -> str:
    # strip whitespace and enforce bcrypt limit
    return password.strip()[:72]

def hash_password(password: str) -> str:
    password = normalize_password(password)
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    password = normalize_password(password)
    return pwd_context.verify(password, hashed_password)

