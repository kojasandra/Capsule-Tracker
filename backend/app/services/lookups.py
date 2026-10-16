from typing import Annotated

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Brand, FlavorNote


class LookupService:
    def __init__(self, db: Annotated[Session, Depends(get_db)]):
        self.db = db

    def list_brands(self):
        return self.db.scalars(select(Brand).order_by(Brand.name)).all()

    def list_flavor_notes(self):
        return self.db.scalars(select(FlavorNote).order_by(FlavorNote.name)).all()
