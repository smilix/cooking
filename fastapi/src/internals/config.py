from pydantic import BaseSettings

JWT_ALGORITHM: str = "HS256"


class Settings(BaseSettings):
    sqlite_file: str

    # to get a string like this run:
    # openssl rand -hex 32
    secret_key: str
    token_expire_minutes: int = 60 * 24 * 30

    access_token_cookie_name: str = "access_token"
    csrf_token_cookie_name: str = "XSRF-TOKEN"
    csrf_token_header_name: str = "X-XSRF-TOKEN"

    # a secure default
    secure_cookie: bool = True

    static_html_folder: str = "static"
    upload_folder: str
    allow_registration: bool = True

    class Config:
        env_file = "ENV"


settings = Settings()
