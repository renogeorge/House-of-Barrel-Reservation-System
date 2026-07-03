"""
Reservation data models and schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ReservationCreate(BaseModel):
    """
    Schema for creating a new reservation
    """
    name: str = Field(..., min_length=1, max_length=100, description="Customer name")
    phone: str = Field(..., min_length=10, max_length=20, description="Customer phone number")
    date: str = Field(..., description="Reservation date (YYYY-MM-DD)")
    time: str = Field(..., description="Reservation time (HH:MM)")
    guests: int = Field(..., ge=1, le=20, description="Number of guests (1-20)")
    tableType: str = Field(..., description="Type of table (e.g., 'Standard', 'VIP', 'Outdoor')")
    specialRequests: Optional[str] = Field(None, max_length=500, description="Special requests or notes")
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "phone": "+1234567890",
                "date": "2024-02-15",
                "time": "19:00",
                "guests": 4,
                "tableType": "VIP",
                "specialRequests": "Window seating preferred"
            }
        }


class ReservationResponse(BaseModel):
    """
    Schema for reservation response
    """
    id: str = Field(..., description="Reservation ID")
    name: str
    phone: str
    date: str
    time: str
    guests: int
    tableType: str
    specialRequests: Optional[str] = None
    createdAt: str = Field(..., description="Timestamp when reservation was created")
    status: str = Field(default="pending", description="Reservation status")

    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "65a1b2c3d4e5f6g7h8i9j0k1",
                "name": "John Doe",
                "phone": "+1234567890",
                "date": "2024-02-15",
                "time": "19:00",
                "guests": 4,
                "tableType": "VIP",
                "specialRequests": "Window seating preferred",
                "createdAt": "2024-01-30T10:30:00"
            }
        }
