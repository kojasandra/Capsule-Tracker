from typing import Annotated

from fastapi import APIRouter, Depends

from app.schemas import FlavorNoteResponse
from app.services.lookups import LookupService

router = APIRouter(prefix="/flavor-notes", tags=["Flavor notes"])
Service = Annotated[LookupService, Depends(LookupService)]


@router.get("", response_model=list[FlavorNoteResponse])
def list_flavor_notes(service: Service):
    return service.list_flavor_notes()
