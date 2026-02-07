import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance, { BACKEND_URL } from "../api/axiosInstance";

export default function Product() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/products/")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log("Error:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((item) => {
          // ✅ FINAL IMAGE FIX
          const imageUrl =
            item.images &&
            item.images.length > 0 &&
            item.images[0].image
              ? `${BACKEND_URL}${item.images[0].image}`
              : "/placeholder.png";

          return (
            <Link to={`/product/${item.id}`} key={item.id}>
              <div className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition">
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="h-52 w-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />

                <div className="p-4">
                  <h2 className="font-bold text-lg">{item.name}</h2>
                  <p className="text-blue-600 font-semibold text-xl mt-1">
                    ₹{item.price}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
