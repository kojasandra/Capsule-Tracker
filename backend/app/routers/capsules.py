from typing import Annotated

from fastapi import APIRouter, Depends, Query, Response, status

from app.schemas import CapsuleCreate, CapsuleResponse, CapsuleUpdate
from app.services.capsules import CapsuleService

router = APIRouter(prefix="/capsules", tags=["Capsules"])
Service = Annotated[CapsuleService, Depends(CapsuleService)]


@router.get("", response_model=list[CapsuleResponse])
def list_capsules(
    service: Service,
    search: Annotated[str | None, Query(max_length=120)] = None,
    brand_id: Annotated[int | None, Query(gt=0)] = None,
):
    return service.list_capsules(search, brand_id)


@router.get("/{capsule_id}", response_model=CapsuleResponse)
def get_capsule(capsule_id: int, service: Service):
    return service.get_capsule(capsule_id)


@router.post("", response_model=CapsuleResponse, status_code=status.HTTP_201_CREATED)
def create_capsule(payload: CapsuleCreate, service: Service):
    return service.create_capsule(payload)


@router.patch("/{capsule_id}", response_model=CapsuleResponse)
def update_capsule(capsule_id: int, payload: CapsuleUpdate, service: Service):
    return service.update_capsule(capsule_id, payload)


@router.delete("/{capsule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_capsule(capsule_id: int, service: Service):
    service.delete_capsule(capsule_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

