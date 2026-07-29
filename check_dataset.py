import pandas as pd

amazon = pd.read_csv("Amazon/products.csv")

print("Columns:")
print(amazon.columns.tolist())

print("\nFirst 5 Rows:")
print(amazon.head())