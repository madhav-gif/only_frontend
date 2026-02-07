import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { CartContext } from "../Context/CartContext";
import { WishlistContext } from "../Context/WishlistContext";

const BASE_URL = "https://full-stack-project-6-g1yc.onrender.com";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(`/products/${id}/`)
      .then((res) => {
        const data = res.data;
        setProduct(data);

        if (data.images?.length > 0) {
          setMainImage(`${BASE_URL}${data.images[0].image}`);
        } else {
          setMainImage("/placeholder.png");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const requireLogin = () => {
    if (!localStorage.getItem("access")) {
      alert("Please login first");
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!requireLogin()) return;
    if (!selectedColor) return alert("Select color");
    addToCart(product.id, selectedColor, selectedSize);
  };

  const cartItem = cart?.find(
    (c) =>
      c.product.id === product.id &&
      c.selected_color === selectedColor &&
      (c.selected_size || "") === (selectedSize || "")
  );

  if (loading) return <h1 className="text-center mt-10">Loading...</h1>;
  if (!product) return <h1 className="text-center mt-10">Not found</h1>;

  return (
    <div className="p-6 flex flex-col md:flex-row gap-10">
      {/* Images */}
      <div className="flex gap-4">
        <div className="flex flex-col gap-3">
          {product.images?.map((img) => {
            const imgUrl = `${BASE_URL}${img.image}`;
            return (
              <img
                key={img.id}
                src={imgUrl}
                onClick={() => setMainImage(imgUrl)}
                className={`w-20 h-20 object-cover rounded-lg border cursor-pointer ${
                  mainImage === imgUrl ? "border-blue-600" : "border-gray-300"
                }`}
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
            );
          })}
        </div>

        <img
          src={mainImage}
          className="w-96 h-[420px] object-cover rounded-xl shadow"
          onError={(e) => (e.target.src = "/placeholder.png")}
        />
      </div>

      {/* Info */}
      <div className="md:w-1/2">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-2xl text-blue-600 mt-4">₹{product.price}</p>
        <p className="mt-4">{product.description}</p>

        {/* Colors */}
        {product.colors?.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold">Colors</h3>
            <div className="flex gap-3 mt-2 flex-wrap">
              {product.colors.map((c, i) => (
                <span
                  key={i}
                  onClick={() => setSelectedColor(c)}
                  className={`px-4 py-2 border rounded-lg cursor-pointer ${
                    selectedColor === c
                      ? "bg-black text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-6 mt-10">
          {cartItem ? (
            <button
              onClick={() => removeFromCart(cartItem.id)}
              className="bg-red-600 text-white px-6 py-3 rounded-lg"
            >
              Remove ❌
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg"
            >
              Add to Cart 🛒
            </button>
          )}

          <button
            onClick={() => requireLogin() && addToWishlist(product.id)}
            className="bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            ❤️ Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}
