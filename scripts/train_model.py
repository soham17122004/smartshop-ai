import os
import joblib
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load dataset
amazon = pd.read_csv("Amazon/products.csv")

# Fill only text columns
amazon["title"] = amazon["title"].fillna("").astype(str)

amazon["reviews"] = (
    amazon["reviews"]
    .astype("string")
    .fillna("")
)

# Convert reviews to string in case pandas inferred a numeric dtype
amazon["reviews"] = amazon["reviews"].astype(str)

# Create combined features
amazon["combined_features"] = (
    amazon["title"] + " " + amazon["reviews"]
)

# TF-IDF
tfidf = TfidfVectorizer(stop_words="english")
tfidf_matrix = tfidf.fit_transform(amazon["combined_features"])

# Cosine similarity
cosine_sim = cosine_similarity(tfidf_matrix)

# Create models folder
os.makedirs("backend/models", exist_ok=True)

# Save models
joblib.dump(tfidf, "backend/models/tfidf_vectorizer.pkl")
joblib.dump(cosine_sim, "backend/models/cosine_similarity.pkl")

# Save dataset
amazon.to_csv("backend/models/products.csv", index=False)

print("✅ Model trained successfully!")