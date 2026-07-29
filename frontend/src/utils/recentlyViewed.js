export const getRecentlyViewed = () => {
    const data = localStorage.getItem("recentlyViewed");
    return data ? JSON.parse(data) : [];
};

export const addRecentlyViewed = (product) => {

    let products = getRecentlyViewed();

    products = products.filter(
        (item) => item.asin !== product.asin
    );

    products.unshift(product);

    products = products.slice(0, 8);

    localStorage.setItem(
        "recentlyViewed",
        JSON.stringify(products)
    );
};