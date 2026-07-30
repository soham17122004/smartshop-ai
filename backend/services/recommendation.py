import os
import re
import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

# =====================================================
# Load Dataset
# =====================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRODUCTS_CSV_PATH = os.path.join(BASE_DIR, "models", "products.csv")

products = pd.read_csv(PRODUCTS_CSV_PATH)
products.fillna("", inplace=True)

products["price"] = pd.to_numeric(products["price"], errors="coerce").fillna(0)
products["mrp"] = pd.to_numeric(products["mrp"], errors="coerce").fillna(0)
products["discount"] = pd.to_numeric(products["discount"], errors="coerce").fillna(0)

products["asin"] = products["asin"].astype(str).str.strip()
products["title"] = products["title"].astype(str).str.strip()
products["brand"] = products["brand"].astype(str).str.strip()
products["category"] = products["category"].astype(str).str.strip()

# =====================================================
# Load Cosine Similarity Model
# =====================================================

# Build cosine similarity from products.csv
products["combined_text"] = (
    products["title"].fillna("") + " " +
    products["brand"].fillna("") + " " +
    products["category"].fillna("") + " " +
    products["description"].fillna("")
)

tfidf = TfidfVectorizer(
    stop_words="english",
    max_features=5000
)

tfidf_matrix = tfidf.fit_transform(products["combined_text"])

# =====================================================
# Image Helper
# =====================================================

DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"

def get_first_image(image):
    if not image or str(image).strip() == "":
        return DEFAULT_FALLBACK_IMAGE
    image = str(image).strip()
    if "|" in image:
        image = image.split("|")[0].strip()
    image = re.sub(r"\._.*?_\.", ".", image)
    image = image.replace("images-na.ssl-images-amazon.com", "m.media-amazon.com")
    return image

# =====================================================
# Product Serializer
# =====================================================

def serialize_product(row, similarity=None):
    img = get_first_image(row["image"])
    data = {
        "asin": row["asin"],
        "title": row["title"],
        "brand": row["brand"] if row["brand"] else "Amazon",
        "category": row["category"] if row["category"] else "General",
        "description": row["description"] if row["description"] else "High quality Amazon product recommended by AI recommendation engine.",
        "price": float(row["price"]) if float(row["price"]) > 0 else 999.0,
        "mrp": float(row["mrp"]),
        "discount": float(row["discount"]),
        "image": img,
    }
    if similarity is not None:
        data["similarity"] = round(float(similarity), 3)
    return data

# =====================================================
# Search Products
# =====================================================

def search_products(query, limit=50):
    query = str(query).strip().lower()
    if query == "":
        return [serialize_product(row) for _, row in products.head(limit).iterrows()]

    matches = products[
        products["title"].str.lower().str.contains(query, regex=False, na=False) |
        products["brand"].str.lower().str.contains(query, regex=False, na=False) |
        products["category"].str.lower().str.contains(query, regex=False, na=False)
    ].head(limit)

    if matches.empty:
        matches = products.head(limit)

    return [serialize_product(row) for _, row in matches.iterrows()]

# =====================================================
# Admin Add & Delete Product Management
# =====================================================

def add_new_product(data):
    global products
    new_asin = data.get("asin") or f"ASIN-{len(products)+1000}"
    new_row = {
        "asin": str(new_asin),
        "title": str(data.get("title", "New Product")),
        "brand": str(data.get("brand", "Amazon")),
        "category": str(data.get("category", "General")),
        "description": str(data.get("description", "High quality store item.")),
        "price": float(data.get("price", 999)),
        "mrp": float(data.get("mrp", 1499)),
        "discount": float(data.get("discount", 20)),
        "image": str(data.get("image", DEFAULT_FALLBACK_IMAGE)),
    }

    new_df = pd.DataFrame([new_row])
    products = pd.concat([new_df, products], ignore_index=True)
    return serialize_product(new_df.iloc[0])

def delete_product(asin):
    global products
    products = products[products["asin"] != asin]
    return True

# =====================================================
# Get All Brands
# =====================================================

def get_all_brands():
    valid_brands = products[products["brand"] != ""]["brand"].value_counts()
    result = []
    for brand_name, count in valid_brands.items():
        result.append({
            "name": brand_name,
            "count": int(count)
        })
    return result

# =====================================================
# Get All Categories
# =====================================================

def get_all_categories():
    valid_cats = products[products["category"] != ""]["category"].value_counts()
    result = []
    for cat_name, count in valid_cats.items():
        result.append({
            "name": cat_name,
            "count": int(count)
        })
    return result

# =====================================================
# Filter Products by Brand
# =====================================================

def get_products_by_brand(brand_name, limit=50):
    brand_name = str(brand_name).strip().lower()
    matches = products[
        products["brand"].str.lower() == brand_name
    ]

    if matches.empty:
        matches = products[
            products["brand"].str.lower().str.contains(brand_name, regex=False, na=False)
        ]

    if matches.empty:
        matches = products[
            products["title"].str.lower().str.contains(brand_name, regex=False, na=False)
        ]

    if matches.empty:
        matches = products.head(limit)

    return [serialize_product(row) for _, row in matches.head(limit).iterrows()]

# =====================================================
# Filter Products by Category (Robust Multi-Fallback)
# =====================================================

CATEGORY_MAP = {
    "kitchen": ["grocery & gourmet foods", "detergents & dishwash", "food", "kitchen", "cook", "dish", "recipe"],
    "beauty": ["skin care", "hair care", "fragrance", "bath & shower", "beauty", "lotion", "cream"],
    "skin care": ["skin care", "cream", "lotion", "serum", "moisturizer", "anti ageing"],
    "grocery": ["grocery & gourmet foods", "food", "snack", "tea", "coffee"],
    "hair care": ["hair care", "shampoo", "conditioner", "hair oil", "keratin"],
    "electronics": ["device", "electric", "digital", "tech", "gadget", "charger", "titanium", "needle"],
    "fashion": ["women", "men", "wear", "shirt", "dress", "fashion", "caps"],
    "sports": ["sport", "fitness", "outdoor", "gym", "ball"],
    "books": ["book", "read", "guide", "novel"],
    "health": ["health", "care", "supplement", "vitamin", "medical", "snore"],
    "home": ["bath & shower", "detergents & dishwash", "home", "room", "decor", "towel", "cleaning", "soap"],
}

def get_products_by_category(category_name, limit=50):
    category_name = str(category_name).strip().lower()
    
    matches = products[products["category"].str.lower() == category_name]

    if matches.empty:
        matches = products[
            products["category"].str.lower().str.contains(category_name, regex=False, na=False)
        ]

    if matches.empty:
        matches = products[
            products["title"].str.lower().str.contains(category_name, regex=False, na=False) |
            products["description"].str.lower().str.contains(category_name, regex=False, na=False)
        ]

    if matches.empty and category_name in CATEGORY_MAP:
        keywords = CATEGORY_MAP[category_name]
        cond = pd.Series(False, index=products.index)
        for kw in keywords:
            cond = cond | products["category"].str.lower().str.contains(kw, regex=False, na=False)
            cond = cond | products["title"].str.lower().str.contains(kw, regex=False, na=False)
        matches = products[cond]

    if matches.empty:
        for key, keywords in CATEGORY_MAP.items():
            if key in category_name or category_name in key:
                cond = pd.Series(False, index=products.index)
                for kw in keywords:
                    cond = cond | products["category"].str.lower().str.contains(kw, regex=False, na=False)
                    cond = cond | products["title"].str.lower().str.contains(kw, regex=False, na=False)
                matches = products[cond]
                if not matches.empty:
                    break

    if matches.empty:
        matches = products.head(limit)

    return [serialize_product(row) for _, row in matches.head(limit).iterrows()]

# =====================================================
# Product Details (ASIN) with Fail-Safe Fallback
# =====================================================

def get_product_details(asin):
    asin = str(asin).strip()
    match = products[products["asin"] == asin]

    if match.empty:
        match = products[products["asin"].str.contains(asin, case=False, regex=False, na=False)]

    if match.empty:
        match = products.head(1)

    if match.empty:
        return {
            "asin": asin,
            "title": "Amazon Product",
            "brand": "Amazon",
            "category": "General",
            "description": "High quality product from Amazon store.",
            "price": 999.0,
            "mrp": 1499.0,
            "discount": 33.0,
            "image": DEFAULT_FALLBACK_IMAGE,
        }

    return serialize_product(match.iloc[0])

# =====================================================
# Recommendations
# =====================================================

def recommend(asin, top_n=8):
    asin = str(asin).strip()

    match = products[products["asin"] == asin]

    if match.empty:
        return [
            serialize_product(row)
            for _, row in products.head(top_n).iterrows()
        ]

    idx = match.index[0]

    # Compute similarity only for the requested product
    similarity_scores = linear_kernel(
        tfidf_matrix[idx:idx + 1],
        tfidf_matrix
    ).flatten()

    similar_indices = similarity_scores.argsort()[::-1]

    recommendations = []

    for product_index in similar_indices:

        if product_index == idx:
            continue

        row = products.iloc[product_index]

        recommendations.append(
            serialize_product(
                row,
                similarity=float(similarity_scores[product_index])
            )
        )

        if len(recommendations) >= top_n:
            break

    if not recommendations:
        recommendations = [
            serialize_product(row)
            for _, row in products.head(top_n).iterrows()
        ]

    return recommendations  