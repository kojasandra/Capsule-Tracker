from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class FlavorNote(Base):
    __tablename__ = "flavor_notes"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(2000), unique=True)
