"""
Database configuration and connection management for MongoDB
"""
import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB configuration
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "house_of_barrel")

# Global MongoDB client
client = None
db = None


def get_database():
    """
    Get MongoDB database instance
    Creates connection if it doesn't exist
    """
    global client, db
    
    if db is None:
         client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=3000)
         db = client[DATABASE_NAME]
         print(f"✅ Connected to MongoDB: {DATABASE_NAME}")
    
    return db


def close_database():
    """
    Close MongoDB connection
    """
    global client, db
    
    if client:
        client.close()
        client = None
        db = None
        print("🔌 MongoDB connection closed")


def get_reservations_collection():
    """
    Get reservations collection
    """
    database = get_database()
    return database["reservations"]
