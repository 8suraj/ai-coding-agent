import json
from functools import lru_cache

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "AI Coding Agent Backend"
    gemini_api_key: str | None = Field(None, alias="GEMINI_API_KEY")
    gemini_model: str = Field("gemini-2.0-flash-exp", alias="GEMINI_MODEL")
    max_history_messages: int = Field(10, alias="MAX_HISTORY_MESSAGES")
    allowed_origins: list[str] = Field(
        default_factory=lambda: ["http://localhost:5173"]
    )
    allowed_origins_raw: str | None = Field(default=None, alias="ALLOWED_ORIGINS")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @model_validator(mode="after")
    def _apply_allowed_origins(self) -> "Settings":
        if self.allowed_origins_raw:
            raw_value = self.allowed_origins_raw.strip()
            parsed: list[str] | None = None
            if raw_value:
                try:
                    decoded = json.loads(raw_value)
                    if isinstance(decoded, list):
                        parsed = [
                            str(item).strip() for item in decoded if str(item).strip()
                        ]
                except json.JSONDecodeError:
                    parsed = [
                        origin.strip()
                        for origin in raw_value.split(",")
                        if origin.strip()
                    ]
            if parsed:
                self.allowed_origins = parsed
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
