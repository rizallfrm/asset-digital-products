import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/products/${product.id}`} className="block relative h-48">
        <Image
          src={product.previewImageUrl || "/images/placeholder-product.jpg"}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-purple-600 transition">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-purple-600">
            ${product.price}
          </span>
          <button
            onClick={onAddToCart}
            className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded-md text-sm font-medium transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
