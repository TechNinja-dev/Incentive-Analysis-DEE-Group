import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "./assets/dee.png";

const carList = [
  "Nios",
  "i20",
  "Exter",
  "Aura",
  "Aura_CNG",
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
  Aura_CNG: 1000,
  Venue: 1500,
  Verna: 1000,
  Creta: 3000,
  Alcazar: 5000
};

export default function Dashboard() {
  const [target, setTarget] = useState(0);
  const [tenure, setTenure] = useState(null);
  const [incentiveResult, setIncentiveResult] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const [data, setData] = useState(
    carList.reduce((acc, car) => {
      acc[car] = { quantity: 0, minSlab: 2 };
      return acc;
    }, {})
  );

  const calculateTotalAmount = (qty, slab, amt) => {
    if (qty < slab) return 0;
    return Math.floor(qty / slab) * slab * amt;
  };

  const handleClear = () => {
  // Reset target, tenure, incentive
  setTarget(0);
  setTenure(null);
  setIncentiveResult(0);

  // Reset all car quantities
  setData(
    carList.reduce((acc, car) => {
      acc[car] = { quantity: 0, minSlab: 2 };
      return acc;
    }, {})
  );
};


  const updateQuantity = (car, delta) => {
    setData((prev) => {
      const newQty = Math.max(0, prev[car].quantity + delta);
      if (car === "Creta" && newQty > 0) setTenure(null);

      return {
        ...prev,
        [car]: { ...prev[car], quantity: newQty }
      };
    });
  };

  const totalQuantity = carList.reduce(
    (sum, car) => sum + data[car].quantity,
    0
  );

const handleSubmit = async () => {
  try {
    console.log("🟢 Button clicked");

    const payload = {
      target,
      total_quantity: totalQuantity,
      tenure: data["Creta"].quantity > 0 ? null : tenure,
      cars: carList.map((car) => ({
        name: car,
        quantity: data[car].quantity,
        min_slab: data[car].minSlab,
        total_amount: calculateTotalAmount(
          data[car].quantity,
          data[car].minSlab,
          incentiveAmount[car]
        )
      }))
    };

    console.log("📦 Payload:", payload);

    const res = await fetch("http://localhost:8000/incentives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
      body: JSON.stringify(payload)
    });

    console.log("📡 Response status:", res.status);

    const result = await res.json();
    console.log("✅ Backend result:", result);

    setIncentiveResult(result);
  } catch (err) {
    console.error("❌ API ERROR:", err);
    alert("API call failed. Check console.");
  }
};


  const isTenureEditable = data["Creta"].quantity === 0;

  return (
    <div className="min-h-screen bg-gray-100 pt-[150px] px-6">

      {/* ===== TOP HEADER ===== */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow px-6 py-4 flex items-center justify-between">
        <img src={logo} alt="Logo" className="h-10 object-contain" />

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-3 rounded-md hover:bg-gray-100"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>


        {menuOpen && (
          <div className="absolute right-6 top-16 bg-white rounded-xl shadow-lg w-48 border">
            <Link
              to="/admin"
              className="block px-4 py-3 hover:bg-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              Admin
            </Link>
            <Link
              to="/creator"
              className="block px-4 py-3 hover:bg-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              Meet The Creator
            </Link>
          </div>
        )}
      </div>

      {/* ===== BELOW HEADER BAR ===== */}
      <div className="fixed top-[88px] left-0 right-0 z-40 bg-white shadow px-6 py-3 flex items-center">
        {/* Target */}
        <div className="flex items-center gap-3">
          <label className="font-semibold">
            Target without Creta
          </label>
          <input
            type="number"
            min="0"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="w-24 h-9 border rounded-md px-3"
          />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Incentive */}
        <div className="text-lg font-semibold">
          Incentive:&nbsp;
          <span className="text-green-600 text-2xl font-bold">
            ₹ {incentiveResult}
          </span>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex  gap-6 items-start mt-6">

        {/* TABLE */}
        <div className="flex-1 bg-white rounded-2xl shadow p-6">
          <div className="grid grid-cols-[180px_220px_120px_180px_200px] pb-3 mb-4 border-b font-semibold text-gray-600">
            <span>Vehicle</span>
            <span>Quantity</span>
            <span>Min Slab</span>
            <span>Amount / Unit Sold</span>
            <span>Total Amount</span>
          </div>

          {carList.map((car) => {
            const totalAmount = calculateTotalAmount(
              data[car].quantity,
              data[car].minSlab,
              incentiveAmount[car]
            );

            return (
              <div
                key={car}
                className="grid grid-cols-[180px_220px_120px_180px_200px] items-center border-b pb-3"
              >
                <span>{car}</span>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-10 flex items-center justify-center border rounded-md bg-gray-50">
                    {data[car].quantity}
                  </div>
                    <button
                      onClick={() => updateQuantity(car, -1)}
                      className="w-9 h-9 text-xl font-bold rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      −
                    </button>

                    <button
                      onClick={() => updateQuantity(car, 1)}
                      className="w-9 h-9 text-xl font-bold rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      +
                    </button>


                </div>

                <span className="text-center">{data[car].minSlab}</span>
                <span>₹ {incentiveAmount[car]}</span>
                <span className="font-semibold">₹ {totalAmount}</span>
              </div>
            );
          })}
        </div>

        {/* RIGHT PANEL */}
        <div className="w-80 flex flex-col gap-4">
          <div
            className={`bg-white rounded-2xl shadow p-4 ${
              !isTenureEditable ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <label className="block font-semibold mb-2">
              Working Tenure (in months)
            </label>
            <input
              type="number"
              min='0'
              value={tenure ?? ""}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full h-10 border rounded-md px-3"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Calculate
          </button>
          <button
            onClick={handleClear}
            className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
          >
            Clear
          </button>

        </div>
      </div>
    </div>
  );
}
