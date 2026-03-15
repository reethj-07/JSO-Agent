from pydantic_settings import BaseSettings
from pydantic import field_validator
from functools import lru_cache
import json


class Settings(BaseSettings):
    gemini_api_key: str = ""
    groq_api_key: str = ""
    supabase_url: str
    supabase_anon_key: str
    cors_origins: list[str] = ["http://localhost:3000"]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors(cls, v):
        if isinstance(v, str):
            try:
                parsed = json.loads(v)
                if isinstance(parsed, str):
                    return [parsed]
                return [origin.strip() for origin in parsed if str(origin).strip()]
            except json.JSONDecodeError:
                return [s.strip() for s in v.split(",") if s.strip()]
        return v

    model_config = {"env_file": "../.env", "env_file_encoding": "utf-8"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
