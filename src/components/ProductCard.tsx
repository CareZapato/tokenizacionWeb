import React from 'react';
import { Star } from 'lucide-react';

interface ProductCardProps {
  onBuyClick: () => void;
}

export function ProductCard({ onBuyClick }: ProductCardProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
            alt="Running Shoes"
            className="rounded-lg w-full"
          />
        </div>
        <div className="md:w-1/2">
          <div className="bg-orange-500 text-white w-fit px-3 py-1 rounded-full text-sm mb-4">
            Oferta
          </div>
          <h1 className="text-3xl font-bold mb-2">Zapatillas running</h1>
          <div className="flex gap-1 mb-4">
            {[1, 2, 3].map((star) => (
              <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
            {[4, 5].map((star) => (
              <Star key={star} className="w-5 h-5 text-gray-300" />
            ))}
          </div>
          <p className="text-gray-600 mb-6">
            Domina la cancha con las Pro Court X9, diseñadas para maximizar tu rendimiento en cada jugada.
          </p>
          <div className="text-3xl font-bold mb-6">$40.450</div>
          
          <div className="mb-6">
            <p className="mb-2">Selecciona una talla:</p>
            <div className="flex gap-2">
              {[40, 41, 42, 43, 44].map((size) => (
                <button
                  key={size}
                  className={`w-12 h-12 border rounded-md flex items-center justify-center
                    ${size === 41 ? 'bg-gray-900 text-white' : 'hover:border-gray-400'}`}
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
              className="px-8 py-3 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 flex-1"
            >
              Comprar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}