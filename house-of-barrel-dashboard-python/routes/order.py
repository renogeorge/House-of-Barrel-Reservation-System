from fastapi import APIRouter, HTTPException
from datetime import datetime
from config.database import get_database
from fastapi.responses import FileResponse
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


router = APIRouter()


# Helper function to get orders collection
def get_orders_collection():
    db = get_database()
    return db["orders"]


# CREATE ORDER
@router.post("/api/orders")
def create_order(order: dict):
    orders_collection = get_orders_collection()

    order["created_at"] = datetime.now()
    order["status"] = "pending"

    if "transaction_id" not in order or not order["transaction_id"]:
        order["transaction_id"] = "HOB" + str(int(datetime.now().timestamp()))

    result = orders_collection.insert_one(order)

    order["_id"] = str(result.inserted_id)

    return order


# GET ALL ORDERS
@router.get("/api/orders")
def get_orders():
    orders_collection = get_orders_collection()

    orders = list(orders_collection.find())

    for order in orders:
        order["_id"] = str(order["_id"])

    return orders



@router.get("/api/orders/{transaction_id}/invoice")
def generate_invoice(transaction_id: str):
    pdfmetrics.registerFont(TTFont('NotoSans', 'fonts/NotoSans.ttf'))
    orders_collection = get_orders_collection()

    order = orders_collection.find_one({"transaction_id": transaction_id})

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    file_path = f"invoice_{transaction_id}.pdf"

    # Create PDF
    c = canvas.Canvas(file_path, pagesize=letter)

    c.setFont("NotoSans", 12)
    c.drawString(180, 750, "HOUSE OF BARREL")

    c.setFont("NotoSans", 12)
    c.drawString(50, 700, f"Transaction ID: {transaction_id}")
    c.drawString(50, 680, f"Customer: {order.get('customer_name', '')}")
    c.drawString(50, 660, f"Phone: {order.get('phone', '')}")
    c.drawString(50, 640, f"Total: {order.get('total', '')}")

    y = 600
    c.drawString(50, y, "Items:")

    for item in order.get("items", []):
        y -= 20
        c.drawString(
            60,
            y,
            f"{item['name']} x{item['quantity']} - ₹{item['price']}"
        )

    c.save()

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename="invoice.pdf"
    )


    # UPDATE ORDER STATUS
@router.put("/api/orders/{transaction_id}/status")
def update_order_status(transaction_id: str, status: str):
    orders_collection = get_orders_collection()

    result = orders_collection.update_one(
        {"transaction_id": transaction_id},
        {"$set": {"status": status}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")

    return {"message": "Status updated successfully"}