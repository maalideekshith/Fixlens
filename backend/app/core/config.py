from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str

    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"

    LLM_API_KEY: str
    LLM_MODEL: str

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()