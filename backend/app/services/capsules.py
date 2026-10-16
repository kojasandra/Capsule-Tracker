from typing import Annotated

from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models import Brand, Capsule, FlavorNote
from app.schemas import CapsuleCreate, CapsuleUpdate


class CapsuleService:
    def __init__(
        self,
        db: Annotated[Session, Depends(get_db)],
    ):
        self.db = db

    def list_capsules(self, search: str | None = None, brand_id: int | None = None):
        query = select(Capsule).options(
            selectinload(Capsule.brand), selectinload(Capsule.flavor_notes)
        )
        if search and search.strip():
            query = query.where(Capsule.name.icontains(search.strip(), autoescape=True))
        if brand_id is not None:
            query = query.where(Capsule.brand_id == brand_id)
        return self.db.scalars(
            query.order_by(Capsule.created_at.desc(), Capsule.id.desc())
        ).all()

    def get_capsule(self, capsule_id: int) -> Capsule:
        capsule = self.db.get(Capsule, capsule_id)
        if capsule is None:
            raise HTTPException(status_code=404, detail="Capsule not found")
        return capsule

    def get_brand(self, brand_id: int) -> Brand:
        brand = self.db.get(Brand, brand_id)
        if brand is None:
            raise HTTPException(status_code=422, detail="Select an existing brand")
        return brand

    def get_flavor_notes(self, note_ids: list[int]) -> list[FlavorNote]:
        if len(note_ids) != len(set(note_ids)):
            raise HTTPException(status_code=422, detail="Flavor notes must not be repeated")
        notes = list(self.db.scalars(select(FlavorNote).where(FlavorNote.id.in_(note_ids))))
        if len(notes) != len(note_ids):
            raise HTTPException(status_code=422, detail="Select existing flavor notes")
        return notes

    def create_capsule(self, payload: CapsuleCreate) -> Capsule:
        name = payload.name
        brand_id = payload.brand_id
        flavor_note_ids = payload.flavor_note_ids
        intensity = payload.intensity
        price_per_capsule = payload.price_per_capsule
        stock = payload.stock
        rating = payload.rating
        comment = payload.comment

        brand = self.get_brand(brand_id)
        notes = self.get_flavor_notes(flavor_note_ids)
        capsule = Capsule(
            name=name,
            brand=brand,
            flavor_notes=notes,
            intensity=intensity,
            price_per_capsule=price_per_capsule,
            stock=stock,
            rating=rating,
            comment=comment,
        )
        self.db.add(capsule)
        self.db.commit()
        self.db.refresh(capsule)
        return capsule

    def update_capsule(self, capsule_id: int, payload: CapsuleUpdate) -> Capsule:
        capsule = self.get_capsule(capsule_id)
        supplied_fields = payload.model_fields_set
        name = payload.name
        brand_id = payload.brand_id
        flavor_note_ids = payload.flavor_note_ids
        intensity = payload.intensity
        price_per_capsule = payload.price_per_capsule
        stock = payload.stock
        rating = payload.rating
        comment = payload.comment

        brand = (
            self.get_brand(brand_id)
            if brand_id is not None else None
        )
        notes = (
            self.get_flavor_notes(flavor_note_ids)
            if flavor_note_ids is not None else None
        )
        if brand is not None:
            capsule.brand = brand
        if notes is not None:
            capsule.flavor_notes = notes
        if "name" in supplied_fields:
            capsule.name = name
        if "intensity" in supplied_fields:
            capsule.intensity = intensity
        if "price_per_capsule" in supplied_fields:
            capsule.price_per_capsule = price_per_capsule
        if "stock" in supplied_fields:
            capsule.stock = stock
        if "rating" in supplied_fields:
            capsule.rating = rating
        if "comment" in supplied_fields:
            capsule.comment = comment
        self.db.commit()
        self.db.refresh(capsule)
        return capsule

    def delete_capsule(self, capsule_id: int) -> None:
        capsule = self.get_capsule(capsule_id)
        self.db.delete(capsule)
        self.db.commit()
