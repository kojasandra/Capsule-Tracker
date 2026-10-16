from sqlalchemy import text
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Brand, Capsule, FlavorNote


from app.database import SessionLocal



SAMPLES = [
    ("Arpeggio", "Nespresso", 9, "Cocoa, roasted cereal", "0.45", 24, 5, "My morning favorite."),
    ("Volluto", "Nespresso", 4, "Biscuit, sweet fruit", "0.42", 12, 4, "Lovely as a short espresso."),
    ("Roma", "Nespresso", 8, "Wood, toasted grain", "0.45", 8, None, None),
    ("Colombia", "Nespresso", 6, "Red fruit, wine", "0.55", 16, 5, "Bright and fruity."),
    ("Espresso Intenso", "Dolce Gusto", 7, "Dark chocolate, spice", "0.38", 20, 4, None),
    ("Lungo", "Dolce Gusto", 6, "Roasted nuts, malt", "0.36", 6, 3, "Good for a longer cup."),
    ("Ristretto", "L'OR", 11, "Cocoa, warm spice", "0.40", 10, 4, "Strong afternoon pick."),
    ("Classico", "Lavazza", 5, "Caramel, cereal", "0.35", 0, None, None),
]


def populate_data(db: Session) -> int:
    inserted = 0
    for name, brand_name, intensity, notes, price, stock, rating, comment in SAMPLES:
        brand = db.scalar(select(Brand).where(Brand.name == brand_name))
        if brand is None:
            brand = Brand(name=brand_name)
            db.add(brand)
            db.flush()
        selected_notes = []
        for note_name in dict.fromkeys(part.strip() for part in notes.split(",") if part.strip()):
            note = db.scalar(select(FlavorNote).where(FlavorNote.name == note_name))
            if note is None:
                note = FlavorNote(name=note_name)
                db.add(note)
                db.flush()
            selected_notes.append(note)
        existing = db.scalar(select(Capsule.id).where(
            Capsule.name == name, Capsule.brand_id == brand.id
        ))
        if existing is not None:
            continue
        db.add(Capsule(
            name=name, brand=brand, intensity=intensity, flavor_notes=selected_notes,
            price_per_capsule=Decimal(price), stock=stock,
            rating=rating, comment=comment,
        ))
        inserted += 1
    return inserted


def reset_data() -> int:

    with SessionLocal.begin() as db:
        db.execute(text(
            "TRUNCATE TABLE capsule_flavor_notes, capsules, flavor_notes, brands "
            "RESTART IDENTITY"
        ))
        return populate_data(db)
