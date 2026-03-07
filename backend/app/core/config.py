from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+asyncpg://trutina:trutina@postgres:5432/trutina"
    redis_url: str = "redis://redis:6379/0"
    anthropic_api_key: str = ""
    trutina_api_key: str = Field(description="Required API key — no default, must be set via env var")
    abn_api_guid: str = ""

    upload_dir: str = "/uploads"
    max_upload_bytes: int = 20 * 1024 * 1024  # 20MB
    max_webhook_payload_bytes: int = 50 * 1024 * 1024  # 50MB base64 limit

    # CORS — comma-separated allowed origins
    cors_origins: str = "https://trutina.vercel.app,https://trutina.com.au"

    # Rate limiting
    rate_limit_default: str = "60/minute"
    rate_limit_auth: str = "5/minute"

    # Trial account expiry (days)
    trial_expiry_days: int = 30

    # Broker risk thresholds
    broker_velocity_window_days: int = 7
    broker_velocity_threshold: int = 5
    broker_fraud_rate_threshold: float = 0.20


settings = Settings()
