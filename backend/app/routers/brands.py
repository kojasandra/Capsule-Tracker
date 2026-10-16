from typing import Annotated

from fastapi import APIRouter, Depends

from app.schemas import BrandResponse
from app.services.lookups import LookupService

router = APIRouter(prefix="/brands", tags=["Brands"])
Service = Annotated[LookupService, Depends(LookupService)]


@router.get("", response_model=list[BrandResponse])
def list_brands(service: Service):
    return service.list_brands()
