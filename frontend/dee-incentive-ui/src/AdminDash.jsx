import { useState } from "react";

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

export default function AdminDash() {
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const handleAddAdmin = async () => {
    if (adminForm.password !== adminForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/addAdmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: adminForm.name,
          email: adminForm.email,
          password: adminForm.password
        })
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Failed to add admin");
        return;
      }

      alert("Admin added successfully");
      setShowAddAdmin(false);
      setAdminForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
    } catch (err) {
      alert("Server error");
    }
  };


  const [overallAmount, setOverallAmount] = useState("");
  const [config, setConfig] = useState({});


  const updateConfig = (car, field, value) => {
    setConfig((prev) => ({
      ...prev,
      [car]: {
        ...prev[car],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    const payload = {
      month: new Date().toISOString().slice(0, 7), // YYYY-MM
      overall_amt: Number(overallAmount),
      configs: config
    };

    try {
      const res = await fetch("http://localhost:8000/load", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        alert("Failed to save configuration");
        return;
      }

      alert("Configuration saved successfully");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex gap-8 items-start">

        {/* ===== LEFT : CONFIG TABLE ===== */}
        <div className="flex-1 bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6">
            Incentive Configuration
          </h2>

          {/* Header */}
          <div className="grid grid-cols-[200px_220px_220px] font-semibold text-gray-600 border-b pb-3 mb-4">
            <span>Vehicle</span>
            <span>Min Slab</span>
            <span>Amount / Unit</span>
          </div>

          {/* Rows */}
          {carList.map((car) => (
            <div
              key={car}
              className="grid grid-cols-[200px_220px_220px] items-center border-b py-4 gap-4"
            >
              <span className="font-medium">{car}</span>

              <input
                type="number"
                min="1"
                placeholder="Enter slab"
                className="h-10 border rounded-md px-3 focus:ring-2 focus:ring-blue-500"
                value={config[car]?.min_slab || ""}
                onChange={(e) =>
                  updateConfig(car, "min_slab", Number(e.target.value))
                }
              />

              <input
                type="number"
                min="0"
                placeholder="Enter amount"
                className="h-10 border rounded-md px-3 focus:ring-2 focus:ring-blue-500"
                value={config[car]?.amount || ""}
                onChange={(e) =>
                  updateConfig(car, "amount", Number(e.target.value))
                }
              />
            </div>
          ))}
        </div>

        {/* ===== RIGHT : OVERALL + SAVE ===== */}
        <div className="w-80 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow p-5">
            <label className="block font-semibold mb-2">
              Overall Amount
            </label>
            <input
              type="number"
              min="0"
              placeholder="Enter overall amount"
              value={overallAmount}
              onChange={(e) => setOverallAmount(e.target.value)}
              className="w-full h-11 border rounded-md px-3 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"
          >
            Save Configuration
          </button>

          <button
            onClick={() => setShowAddAdmin(true)}
            className="fixed bottom-6 right-6 z-50 px-6 py-3 rounded-xl 
                       bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg"
          >
            + Add Admin
          </button>
        </div>

      </div>
      {showAddAdmin && (
  <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">

      <button
        onClick={() => setShowAddAdmin(false)}
        className="absolute top-3 right-4 text-gray-500 text-xl"
      >
        ×
      </button>

      <h2 className="text-2xl font-bold mb-4">Add New Admin</h2>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          value={adminForm.name}
          onChange={(e) =>
            setAdminForm({ ...adminForm, name: e.target.value })
          }
          className="w-full h-11 border-2 border-gray-300 rounded-md px-3"
        />

        <input
          type="email"
          placeholder="Email"
          value={adminForm.email}
          onChange={(e) =>
            setAdminForm({ ...adminForm, email: e.target.value })
          }
          className="w-full h-11 border-2 border-gray-300 rounded-md px-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={adminForm.password}
          onChange={(e) =>
            setAdminForm({ ...adminForm, password: e.target.value })
          }
          className="w-full h-11 border-2 border-gray-300 rounded-md px-3"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={adminForm.confirmPassword}
          onChange={(e) =>
            setAdminForm({ ...adminForm, confirmPassword: e.target.value })
          }
          className="w-full h-11 border-2 border-gray-300 rounded-md px-3"
        />
      </div>

      <button
        onClick={handleAddAdmin}
        className="w-full mt-5 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"
      >
        Create Admin
      </button>
    </div>
  </div>
)}

    </div>
  );
}
