from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+asyncpg://mortgageshield:mortgageshield@postgres:5432/mortgageshield"
    redis_url: str = "redis://redis:6379/0"
    anthropic_api_key: str = ""
    loanapi_key: str = "dev-key-change-in-prod"
    abn_api_guid: str = ""

    upload_dir: str = "/uploads"
    max_upload_bytes: int = 20 * 1024 * 1024  # 20MB

    # Broker risk thresholds
    broker_velocity_window_days: int = 7
    broker_velocity_threshold: int = 5
    broker_fraud_rate_threshold: float = 0.20


settings = Settings()
