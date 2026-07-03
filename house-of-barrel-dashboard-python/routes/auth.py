from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from config.database import get_database
from utils.auth import hash_password, verify_password, create_access_token

router = APIRouter()


# =========================
# LOGIN (OAuth2 Compatible)
# =========================
@router.post("/login")
async def login(user: dict):
    email = user.get("email")
    password = user.get("password")

    db = get_database()
    users_collection = db["users"]

    existing_user = users_collection.find_one({"email": email})

    if not existing_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(password, existing_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"email": email})

    return {
        "access_token": token,
        "role": existing_user.get("role", "user")
    }


# =========================
# REGISTER
# =========================
@router.post("/register")
async def register(user: dict):
    email = user.get("email")
    password = user.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")

    db = get_database()
    users_collection = db["users"]

    # Check if user already exists
    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = hash_password(password)

    users_collection.insert_one({
        "email": email,
        "password": hashed_password,
        "role": "user"   # 👈 Add role field (important)
    })

    return {"message": "User registered successfully"}
