from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, model_validator


class BrandResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class FlavorNoteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class CapsuleCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    name: str = Field(min_length=1, max_length=120)
    brand_id: int = Field(gt=0, strict=True)
    intensity: int = Field(ge=1, le=12, strict=True)
    flavor_note_ids: list[int] = Field(default_factory=list)
    price_per_capsule: Decimal = Field(ge=0, max_digits=8, decimal_places=2)
    stock: int = Field(ge=0, le=2147483647, strict=True)
    rating: int | None = Field(default=None, ge=1, le=5, strict=True)
    comment: str | None = Field(default=None, max_length=2000)


class CapsuleUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    name: str | None = Field(default=None, min_length=1, max_length=120)
    brand_id: int | None = Field(default=None, gt=0, strict=True)
    intensity: int | None = Field(default=None, ge=1, le=12, strict=True)
    flavor_note_ids: list[int] | None = None
    price_per_capsule: Decimal | None = Field(default=None, ge=0, max_digits=8, decimal_places=2)
    stock: int | None = Field(default=None, ge=0, le=2147483647, strict=True)
    rating: int | None = Field(default=None, ge=1, le=5, strict=True)
    comment: str | None = Field(default=None, max_length=2000)

    @model_validator(mode="after")
    def reject_null_required_fields(self):
        # Omitted fields stay unchanged; only rating and comment may be cleared.
        for field in self.model_fields_set - {"rating", "comment"}:
            if getattr(self, field) is None:
                raise ValueError(f"{field} cannot be null")
        return self


class CapsuleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    brand_id: int
    brand: BrandResponse
    intensity: int
    flavor_notes: list[FlavorNoteResponse]
    price_per_capsule: Decimal
    stock: int
    rating: int | None
    comment: str | None
    created_at: datetime
