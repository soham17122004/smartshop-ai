print("TRAIN MODEL STARTED")
import joblib
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

print("=" * 60)
print("Loading Products Dataset...")
print("=" * 60)

# Load cleaned dataset
products = pd.read_csv("models/products.csv")

# Fill missing values
products["combined_features"] = products["combined_features"].fillna("")

print(f"Total Products : {len(products)}")

print("\nCreating TF-IDF Matrix...")

tfidf = TfidfVectorizer(
    stop_words="english",
    max_features=10000
)

tfidf_matrix = tfidf.fit_transform(products["combined_features"])

print("TF-IDF Shape :", tfidf_matrix.shape)

print("\nGenerating Cosine Similarity Matrix...")

cosine_sim = cosine_similarity(tfidf_matrix)

print("Cosine Matrix Shape :", cosine_sim.shape)

print("\nSaving Model...")

joblib.dump(tfidf, "models/tfidf_vectorizer.pkl")
joblib.dump(cosine_sim, "models/cosine_similarity.pkl")

print("=" * 60)
print("Model Training Completed Successfully")
print("=" * 60)

print("\nFiles Saved")

print("✔ models/tfidf_vectorizer.pkl")
print("✔ models/cosine_similarity.pkl")