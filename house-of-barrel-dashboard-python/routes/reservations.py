"""
API routes for reservation management
"""
from fastapi import APIRouter, HTTPException, status, Depends, Body
from typing import List
from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel 
from models.reservation import ReservationCreate, ReservationResponse
from config.database import get_reservations_collection
from utils.auth import get_current_user

router = APIRouter()


# ==============================
# CREATE RESERVATION (Protected)
# ==============================
@router.post(
    "/reservation",
    response_model=ReservationResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_reservation(
    reservation: ReservationCreate,
    current_user: dict = Depends(get_current_user)  # 🔐 Requires valid JWT
):
    try:
        collection = get_reservations_collection()

        reservation_doc = {
            "name": reservation.name,
            "phone": reservation.phone,
            "date": reservation.date,
            "time": reservation.time,
            "guests": reservation.guests,
            "tableType": reservation.tableType,
            "specialRequests": reservation.specialRequests,
            "createdAt": datetime.utcnow().isoformat(),
            "userEmail": current_user.get("sub"),  # 👈 store logged-in user
            "status": "pending"

        }

        result = collection.insert_one(reservation_doc)

        return ReservationResponse(
            id=str(result.inserted_id),
            name=reservation_doc["name"],
            phone=reservation_doc["phone"],
            date=reservation_doc["date"],
            time=reservation_doc["time"],
            guests=reservation_doc["guests"],
            tableType=reservation_doc["tableType"],
            specialRequests=reservation_doc["specialRequests"],
            createdAt=reservation_doc["createdAt"]
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create reservation: {str(e)}"
        )



# =================================
# GET ALL RESERVATIONS (Admin Only)
# =================================
@router.get("/reservations", response_model=List[ReservationResponse])
async def get_all_reservations():


    try:
        collection = get_reservations_collection()
        reservations = list(collection.find())

        return [
            ReservationResponse(
                id=str(res["_id"]),
                name=res["name"],
                phone=res["phone"],
                date=res["date"],
                time=res["time"],
                guests=res["guests"],
                tableType=res["tableType"],
                specialRequests=res.get("specialRequests"),
                createdAt=res["createdAt"],
                status=res.get("status", "pending")

            )
            for res in reservations
        ]

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch reservations: {str(e)}"
        )


# =================================
# DELETE RESERVATION (Admin Only)
# =================================
@router.delete(
    "/admin/reservation/{id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_reservation(
    id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        collection = get_reservations_collection()

        if not ObjectId.is_valid(id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid reservation ID format"
            )

        result = collection.delete_one({"_id": ObjectId(id)})

        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Reservation with ID {id} not found"
            )

        return None

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete reservation: {str(e)}"
        )
  # -------------------------------
# STATUS UPDATE MODEL
# -------------------------------
class StatusUpdate(BaseModel):
    status: str="pending"


# -------------------------------
# UPDATE RESERVATION STATUS
# -------------------------------
@router.put("/admin/reservation/{id}/status")
async def update_reservation_status(
    id: str,
    data: StatusUpdate = Body(...),
    current_user: dict = Depends(get_current_user)
):
    collection = get_reservations_collection()

    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")

    result = collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"status": data.status}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Reservation not found")

    return {"message": "Status updated"}
