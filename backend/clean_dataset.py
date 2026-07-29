print("SCRIPT STARTED")
import pandas as pd
import numpy as np
import os

# ==============================
# Configuration
# ==============================

from pathlib import Path

# Current backend folder
BASE_DIR = Path(__file__).resolve().parent

# Dataset path
INPUT_FILE = BASE_DIR / "models" / "marketing_sample_for_amazon_in-ecommerce__20191001_20191031__30k_data.csv"

# Output path
OUTPUT_FILE = BASE_DIR / "models" / "products.csv"

# ==============================
# Load Dataset
# ==============================

print("=" * 60)
print("Loading Dataset...")
print("=" * 60)

df = pd.read_csv(INPUT_FILE, low_memory=False)

print("\n================ COLUMNS ================\n")
print("\n=========================================\n")


print(INPUT_FILE)
print(INPUT_FILE.exists())
print(BASE_DIR)

print(f"Original Shape : {df.shape}")

# ==============================
# Keep Required Columns
# ==============================

required_columns = [
    "Product Title",
    "Category",
    "Brand",
    "Product Description",
    "Mrp",
    "Price",
    "Image Urls",
    "Product Asin"
]

df = df[required_columns]

# ==============================
# Rename Columns
# ==============================

df.rename(columns={
    "Product Title": "title",
    "Category": "category",
    "Brand": "brand",
    "Product Description": "description",
    "Mrp": "mrp",
    "Price": "price",
    "Image Urls": "image",
    "Product Asin": "asin"
}, inplace=True)

# ==============================
# Remove Duplicates
# ==============================

df.drop_duplicates(subset="title", inplace=True)

# ==============================
# Fill Missing Values
# ==============================

df["title"] = df["title"].fillna("Unknown Product")
df["category"] = df["category"].fillna("Unknown")
df["brand"] = df["brand"].fillna("Unknown")
df["description"] = df["description"].fillna("")
df["image"] = df["image"].fillna("")
df["asin"] = df["asin"].fillna("")

# ==============================
# Clean Price Columns
# ==============================

def clean_price(value):
    if pd.isna(value):
        return 0

    value = str(value)

    value = value.replace("₹", "")
    value = value.replace(",", "")
    value = value.replace("Rs.", "")
    value = value.replace("INR", "")
    value = value.strip()

    try:
        return float(value)
    except:
        return 0


df["price"] = df["price"].apply(clean_price)
df["mrp"] = df["mrp"].apply(clean_price)

# ==============================
# Remove Invalid Products
# ==============================

df = df[df["title"] != "Unknown Product"]

df = df[df["price"] > 0]

# ==============================
# Create Discount Percentage
# ==============================

def calculate_discount(row):
    if row["mrp"] == 0:
        return 0

    return round(
        ((row["mrp"] - row["price"]) / row["mrp"]) * 100,
        1
    )

df["discount"] = df.apply(calculate_discount, axis=1)

# ==============================
# Combined Features
# ==============================

df["combined_features"] = (
    df["title"] + " " +
    df["category"] + " " +
    df["brand"] + " " +
    df["description"]
)

# ==============================
# Remove Extra Spaces
# ==============================

df["combined_features"] = (
    df["combined_features"]
    .str.replace("\n", " ", regex=False)
    .str.replace("\r", " ", regex=False)
    .str.replace("\t", " ", regex=False)
    .str.strip()
)

# ==============================
# Reset Index
# ==============================

df.reset_index(drop=True, inplace=True)

# ==============================
# Save Clean Dataset
# ==============================

os.makedirs("../models", exist_ok=True)

df.to_csv(
    OUTPUT_FILE,
    index=False,
    encoding="utf-8-sig"
)

print("=" * 60)
print("Dataset Cleaned Successfully")
print("=" * 60)

print(f"Final Shape : {df.shape}")

print("\nColumns:")

print(df.columns.tolist())

print("\nSaved To:")

print(OUTPUT_FILE)

print("=" * 60)