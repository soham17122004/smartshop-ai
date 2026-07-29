import api from "../api/axios";

// =======================================
// Get Wishlist
// =======================================

export const getWishlist = async () => {
  try {
    const response = await api.get("/wishlist");
    console.log("Wishlist API:", response.data);

    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// =======================================
// Check Wishlist
// =======================================

export const isWishlisted = async (asin) => {
  const wishlist = await getWishlist();

  return wishlist.some(
    (item) => item.asin === asin
  );
};

// =======================================
// Toggle Wishlist
// =======================================

export const toggleWishlist = async (product) => {
  const wishlist = await getWishlist();

  const exists = wishlist.find(
    (item) => item.asin === product.asin
  );

  if (exists) {
    await api.delete(`/wishlist/${product.asin}`);
    return false;
  }

  await api.post("/wishlist", {
    asin: product.asin,
    title: product.title,
    image: product.image,
    price: product.price,
  });

  return true;
};