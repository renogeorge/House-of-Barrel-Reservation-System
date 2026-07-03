from fastapi import APIRouter, HTTPException
from bson import ObjectId
from config.database import get_database

router = APIRouter()
db = get_database()


# ================= GET MENU =================
@router.get("/menu")
def get_menu():
    items = list(db.menu.find({}))

    for item in items:
        item["_id"] = str(item["_id"])
        item["available"] = item.get("available", True)

    return items


# ================= UPDATE BY NAME (USED BY YOUR ADMIN) =================
@router.put("/menu/update")
def update_menu(item: dict):
    name = item.get("name")
    price = item.get("price")

    if not name:
        raise HTTPException(status_code=400, detail="Name required")
    
    result = db.menu.update_one(
    {
        "name": {
            "$regex": name.strip(),
            "$options": "i"
        }
    },
    {
        "$set": {
            "price": price
        }
    }
)

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")

    return {"message": "Updated successfully"}