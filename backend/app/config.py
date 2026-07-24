from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Database - defaults to local SQLite so the API runs with zero setup.
    # Point this at Postgres (see .env.example) once docker-compose is up.
    database_url: str = "sqlite+aiosqlite:///./mirra.db"

    # Auth
    secret_key: str = "change-this-to-a-random-32-char-string"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    # Redis (used by later branches: sessions, celery)
    redis_url: str = "redis://localhost:6379"

    # CORS - frontend (5173), marketing (5174), avatar (5175)
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
    ]

    # File storage
    upload_dir: str = "./uploads"

    # Local LLM (Ollama) for interview question generation
    ollama_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.1:8b"


settings = Settings()
