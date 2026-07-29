import pandas as pd

products = pd.read_csv("backend/models/products.csv")

print("Columns:")
print(products.columns)

print("\nData types:")
print(products.dtypes)

print("\nMissing values:")
print(products.isna().sum())

print("\nFirst 5 rows:")
print(products.head())