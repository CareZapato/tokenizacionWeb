import React from "react";
import { Star } from "lucide-react";

interface ProductCardProps {
  onBuyClick: () => void;
}

export function ProductCard({ onBuyClick }: ProductCardProps) {
  const images = [
    "/src/assets/camiseta1.png", // Imagen principal y miniatura 1
    "/src/assets/camiseta2.png", // Imagen miniatura 2
    "/src/assets/camiseta3.png", // Imagen miniatura 3
    "/src/assets/camiseta4.png", // Imagen miniatura 4
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50">
      {/* Cabecera */}
      <div className="bg-gray-200 text-center py-4 mb-6 rounded-md">
        <h1 className="text-2xl font-bold text-gray-700">
          Demo Tokenización Estándar Marca
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Columna de imágenes pequeñas */}
        <div className="md:w-1/6 flex flex-col gap-4">
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Producto ${index + 1}`}
              className="rounded-lg cursor-pointer border border-gray-300 hover:border-gray-500 object-cover"
              style={{ height: "25%", flexGrow: 1 }}
            />
          ))}
        </div>

        {/* Imagen principal y detalles */}
        <div className="md:w-5/6 flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <img
              src="/src/assets/camiseta1.png"
              alt="Camiseta deportiva"
              className="rounded-lg w-full h-full object-cover"
            />
          </div>
          <div className="md:w-1/2">
            {/* Etiqueta oferta */}
            <div className="bg-red-600 text-white w-fit px-3 py-1 rounded-full text-sm mb-4">
              Oferta
            </div>
            <h1 className="text-3xl font-bold mb-2">Camiseta deportiva</h1>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4].map((star) => (
                <Star
                  key={star}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
              {[5].map((star) => (
                <Star key={star} className="w-5 h-5 text-gray-300" />
              ))}
            </div>
            <p className="text-gray-600 mb-6">
              Experimenta comodidad y estilo con esta camiseta deportiva de alto
              rendimiento, perfecta para entrenamientos o uso casual.
            </p>
            <div className="text-3xl font-bold mb-6">$36.990</div>

            <div className="mb-6">
              <p className="mb-2">Selecciona una talla:</p>
              <div className="flex gap-2">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    className={`w-12 h-12 border rounded-md flex items-center justify-center
                      ${
                        size === "M"
                          ? "bg-gray-900 text-white"
                          : "hover:border-gray-400"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button className="px-8 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800">
                Volver
              </button>
              <button
                onClick={onBuyClick}
                className="px-8 py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 flex-1"
              >
                Comprar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
