import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { CartContext } from "../Context/CartContext";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/products/");
        setProducts(res.data);
      } catch (err) {
        console.log("Error fetching products:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-xl">
        Loading products...
      </div>
    );
  }

  return (
    <div className="p-5 md:p-10">
      <h1 className="text-2xl font-semibold mb-5">Our Products</h1>

      {products.length === 0 ? (
        <p className="text-gray-500">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6">
          {products.map((item) => {
            // 🔥 FIXED: backend media URL (MOST IMPORTANT LINE)
            const imageUrl =
              item.images &&
              item.images.length > 0 &&
              item.images[0].image
                ? `https://full-stack-project-6-g1yc.onrender.com${item.images[0].image}`
                : "/placeholder.png";

            return (
              <div
                key={item.id}
                className="border rounded-lg shadow hover:shadow-lg p-4"
              >
                <Link to={`/product/${item.id}`}>
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-full h-64 object-cover rounded"
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                  />

                  <h2 className="text-lg font-semibold mt-2">
                    {item.name}
                  </h2>
                  <p className="text-gray-600">₹{item.price}</p>
                </Link>

                <button
                  onClick={() =>
                    addToCart(
                      item.id,
                      item.colors?.[0] || "default",
                      item.sizes?.[0] || "M"
                    )
                  }
                  className="mt-3 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition w-full"
                >
                  Add to Cart 🛒
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
