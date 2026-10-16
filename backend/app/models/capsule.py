from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.brand import Brand
from app.models.capsule_flavor_note import capsule_flavor_notes
from app.models.flavor_note import FlavorNote


class Capsule(Base):
    __tablename__ = "capsules"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    brand_id: Mapped[int] = mapped_column(ForeignKey("brands.id"), index=True)
    brand: Mapped[Brand] = relationship()
    intensity: Mapped[int] = mapped_column(Integer)
    flavor_notes: Mapped[list[FlavorNote]] = relationship(
        secondary=capsule_flavor_notes, order_by=FlavorNote.name
    )
    price_per_capsule: Mapped[Decimal] = mapped_column(Numeric(8, 2))
    stock: Mapped[int] = mapped_column(Integer)
    rating: Mapped[int | None] = mapped_column(Integer, nullable=True)
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
