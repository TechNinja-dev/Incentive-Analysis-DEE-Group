import { useState } from "react";
import logo from "./assets/dee.png";

const carList = [
  "Nios",
  "i20",
  "Exter",
  "Aura",
  "Venue",
  "Verna",
  "Alcazar",
  "Creta"
];

const incentiveAmount = {
  Nios: 1500,
  i20: 1000,
  Exter: 1000,
  Aura: 1000,
  Venue: 1500,
  Verna: 1000,
  Creta: 1000,
  Alcazar: 5000
};

export default function App() {
  const [target, setTarget] = useState(0);
  const [tenure, setTenure] = useState(null);

  const [data, setData] = useState(
    carList.reduce((acc, car) => {
      acc[car] = { quantity: 0, minSlab: 2 };
      return acc;
    }, {})
  );

const updateQuantity = (car, delta) => {
  setData((prev) => {
    const newQuantity = Math.max(0, prev[car].quantity + delta);

    // If Creta quantity becomes > 0 → reset tenure
    if (car === "Creta" && newQuantity > 0) {
      setTenure(null);
    }

    return {
      ...prev,
      [car]: {
        ...prev[car],
        quantity: newQuantity
      }
    };
  });
};


  const handleSubmit = async () => {
    const payload = {
      target,
      tenure: tenure, 
      cars: carList.map((car) => ({
        name: car,
        quantity: data[car].quantity,
        min_slab: data[car].minSlab,
        amount_per_unit: incentiveAmount[car],
        total_amount: data[car].quantity * incentiveAmount[car]
      }))
    };

    try {
      const response = await fetch("http://localhost:8000/incentives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log(result);
      alert("Data submitted successfully");
    } catch (error) {
      console.error(error);
      alert("Submission failed");
    }
  };

  const isTenureEditable = data["Creta"].quantity === 0;

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow mb-6">
        <img src={logo} alt="Logo" className="h-10 object-contain" />
        <h1 className="text-3xl font-semibold">Incentive Analyser</h1>
      </div>

      {/* Target + Button */}
      <div className="bg-white rounded-2xl shadow p-4 mb-6 flex items-center">
        <div className="flex items-center gap-4">
          <label className="text-lg font-semibold">Target</label>
          <input
            type="number"
            min="0"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="w-24 h-10 border rounded-md px-3"
          />
        </div>

        <div className="ml-auto">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Calculate
          </button>
        </div>
      </div>

      {/* TABLE + TENURE SIDE BY SIDE */}
      <div className="flex gap-6 items-start">

        {/* TABLE */}
        <div className="flex-1 bg-white rounded-2xl shadow p-6">
          <div className="grid grid-cols-[180px_220px_120px_180px_200px] pb-3 mb-4 border-b font-semibold text-gray-600">
            <span>Vehicle</span>
            <span>Quantity</span>
            <span>Min Slab</span>
            <span>Amount / Unit Sold</span>
            <span>Total Amount</span>
          </div>

          <div className="space-y-4">
            {carList.map((car) => {
              const totalAmount =
                data[car].quantity * incentiveAmount[car];

              return (
                <div
                  key={car}
                  className="grid grid-cols-[180px_220px_120px_180px_200px] items-center border-b pb-3"
                >
                  <span className="text-lg">{car}</span>

                  <div className="flex items-center gap-3">
                    <div className="w-14 h-10 flex items-center justify-center border rounded-md bg-gray-50 font-medium">
                      {data[car].quantity}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateQuantity(car, -1)}
                        className="w-8 h-8 rounded-full bg-gray-200"
                      >
                        -
                      </button>
                      <button
                        onClick={() => updateQuantity(car, 1)}
                        className="w-8 h-8 rounded-full bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <span className="text-center font-medium">
                    {data[car].minSlab}
                  </span>

                  <span className="font-medium">
                    ₹ {incentiveAmount[car]}
                  </span>

                  <span className="font-semibold">
                    ₹ {totalAmount}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* WORKING TENURE */}
        <div
          className={`w-80 bg-white rounded-2xl shadow p-4
            ${!isTenureEditable ? "opacity-50 pointer-events-none" : ""}
          `}
        >
          <label className="block text-lg font-semibold mb-2">
            Working Tenure (in months)
          </label>
          <input
            type="number"
            min="0"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            className="w-full h-10 border rounded-md px-3"
            placeholder="Enter tenure"
          />
        </div>

      </div>
    </div>
  );
}
