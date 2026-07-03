from pydantic import BaseModel
from typing import List

class Order(BaseModel):
    transaction_id: str
    customer_name: str
    phone: str
    address: str
    items: List[dict]
    total: str