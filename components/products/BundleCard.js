import Image from 'next/image';

export default function BundleCard({ bundle, onAddToCart }) {
  const discountPrice = bundle.price * (1 - bundle.discount / 100);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 border-purple-100 relative">
      <div className="absolute top-0 right-0 bg-purple-600 text-white px-3 py-1 font-bold text-sm z-10">
        Save {bundle.discount}%
      </div>
      
      <div className="relative h-48">
        <Image 
          src={bundle.previewImage || '/images/placeholder-bundle.jpg'}
          alt={bundle.name}
          layout="fill"
          objectFit="cover"
          className="hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{bundle.name}</h3>
        <p className="text-gray-600 mb-4">{bundle.description}</p>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-400 line-through mr-2">
              ${bundle.price.toFixed(2)}
            </span>
            <span className="text-2xl font-bold text-purple-600">
              ${discountPrice.toFixed(2)}
            </span>
          </div>
          
          <button
            onClick={onAddToCart}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
          >
            Add Bundle
          </button>
        </div>
      </div>
    </div>
  );
}