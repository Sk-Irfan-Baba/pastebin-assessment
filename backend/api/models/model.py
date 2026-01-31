from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Field, SQLModel
import nanoid

# The Database Model
class Paste(SQLModel, table=True):
    # Using nanoid for URL-friendly IDs (better than UUIDs for sharing)
    id: str = Field(default_factory=lambda: nanoid.generate(size=10), primary_key=True)
    content: str = Field(sa_column_kwargs={"nullable": False}) # Enforce non-null in DB
    max_views: Optional[int] = Field(default=None)
    views_count: int = Field(default=0)
    expires_at: Optional[datetime] = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# The Pydantic Schema for Input Validation
class PasteCreate(SQLModel):
    content: str
    ttl_seconds: Optional[int] = None
    max_views: Optional[int] = None

    # Pydantic will auto-validate that ttl and max_views are >= 1 if provided