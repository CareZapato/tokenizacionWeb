import React, { useState } from "react";
import { ProductCard } from "./components/ProductCard";
import { PaymentModal } from "./components/PaymentModal";

function App() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <ProductCard onBuyClick={() => setIsPaymentModalOpen(true)} />
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={36990}
      />
    </div>
  );
}

export default App;
