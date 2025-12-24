from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def normalize_password(password: str) -> bytes:
    # normalize → encode → truncate BYTES
    return password.strip().encode("utf-8")[:72]


def hash_password(password: str) -> str:
    password = normalize_password(password)
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    password = normalize_password(password)
    return pwd_context.verify(password, hashed_password)

