from fastapi import APIRouter
from config.database import get_database

router = APIRouter()
db = get_database()

@router.get("/reports")
def get_reports():
    try:
        orders = list(db["orders"].find({}))

        total = 0
        item_count = {}

        for order in orders:
            # ✅ Safe total
            total += int(order.get("total", 0))

            # ✅ Safe items loop
            items = order.get("items", [])
            if not isinstance(items, list):
                continue

            for item in items:
                name = item.get("name") if isinstance(item, dict) else None
                if not name:
                    continue

                item_count[name] = item_count.get(name, 0) + 1

        popular = sorted(item_count.items(), key=lambda x: x[1], reverse=True)

        return {
            "total": total,
            "popular": popular[:5]
        }

    except Exception as e:
        return {"error": str(e)}