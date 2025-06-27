'use client'
import Image from "next/image";
const Card = ({ cardClickHandler, product }) => {
  console.log("probject==>>", product)
  return (
    <div
      className="rounded-md w-50 h-80 shadow-2xl p-4 hover:shadow-lg transition-shadow cursor-pointer bg-gray-100 mb-3.5"
      onClick={() => cardClickHandler(product)}
    >
      <div className="block">
        {/* Image container with fixed aspect ratio */}
        <div className="relative h-40 mb-3 rounded-sm bg-gray-100">
          {product?.catalogImages?.[0]?.url && (
            <Image
              src={product?.catalogImages?.[0]?.url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          )}
        </div>

        {/* Product info */}
        <h2 className="text-lg font-medium line-clamp-1 text-black">{product.name}</h2>

        {/* Pricing */}
        <div className="mt-1">
          {product.salePrice ? (
            <div className="flex gap-2 items-center">
              <span className="font-semibold text-black">
                ${product.salePrice.toFixed(2)}
              </span>
              <span className="text-sm line-through text-red-500">
                ${product.price.toFixed(2)}
              </span>
            </div>
          ) : (
            product.price && (
              <span className="font-medium text-black">
                ${product.price.toFixed(2)}
              </span>
            )
          )}
        </div>

        {/* Description (only shown if exists) */}
        {product.description && (
          <p className="text-sm mt-1 line-clamp-2 text-black">
            {product.description}
          </p>
        )}
      </div>
    </div>
  )
}

export default Card;