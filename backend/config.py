from pydantic_settings import BaseSettings
from functools import lru_cache
import json


class Settings(BaseSettings):
    gemini_api_key: str = ""
    groq_api_key: str = ""
    supabase_url: str
    supabase_anon_key: str
    cors_origins: str = "http://localhost:3000"

    def get_cors_origins(self) -> list[str]:
        value = self.cors_origins.strip()
        if not value:
            return ["http://localhost:3000"]

        try:
            parsed = json.loads(value)
            if isinstance(parsed, str):
                return [parsed]
            if isinstance(parsed, list):
                return [str(origin).strip() for origin in parsed if str(origin).strip()]
        except json.JSONDecodeError:
            pass

        return [origin.strip() for origin in value.split(",") if origin.strip()]

    model_config = {"env_file": "../.env", "env_file_encoding": "utf-8"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
