from sqlalchemy import Column, ForeignKey, Table

from app.database import Base


capsule_flavor_notes = Table(
    "capsule_flavor_notes",
    Base.metadata,
    Column("capsule_id", ForeignKey("capsules.id", ondelete="CASCADE"), primary_key=True),
    Column("flavor_note_id", ForeignKey("flavor_notes.id", ondelete="CASCADE"), primary_key=True),
)
