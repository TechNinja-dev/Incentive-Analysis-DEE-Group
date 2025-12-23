import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "./assets/dee.png";
import AdminDash from "./AdminDash";


export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  /* ================= RESTORE SESSION ================= */
  useEffect(() => {
    const auth = sessionStorage.getItem("isAuthenticated");
    const storedName = sessionStorage.getItem("name");

    if (auth === "true") {
      setIsAuthenticated(true);
      setName(storedName || "");
    }
  }, []);

  /* ================= TOAST ================= */
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type });
    }, 3000);
  };

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        showToast("Invalid email or password", "error");
        return;
      }

      // Persist session
      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("name", data.name);

      setIsAuthenticated(true);
      setName(data.name);

      showToast("Welcome back", "success");
    } catch (err) {
      console.error(err);
      showToast("Login error", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
    setMenuOpen(false);
    setName("");
    setEmail("");
    setPassword("");
  };

  /* ================= INITIALS ================= */
  const getInitials = (fullName) => {
    if (!fullName) return "";
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (
      parts[0][0].toUpperCase() +
      parts[parts.length - 1][0].toUpperCase()
    );
  };

  return (
    <div
      className={`min-h-screen bg-gray-100 px-4 ${
        isAuthenticated
          ? "pt-24"
          : "flex items-center justify-center"
      }`}
    >
      {/* ================= TOAST ================= */}
      {toast.show && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]">
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg border animate-slide-down ${
              toast.type === "success"
                ? "bg-green-50 border-green-300 text-green-800"
                : "bg-red-50 border-red-300 text-red-800"
            }`}
          >
            <span className="text-xl">
              {toast.type === "success" ? "✔" : "🚫"}
            </span>
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* ================= HEADER ================= */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow px-6 py-4 flex items-center justify-between">
        <img src={logo} alt="Logo" className="h-10 object-contain" />

        {isAuthenticated && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center"
            >
              {getInitials(name)}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border p-4">
                <div className="flex flex-col items-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center">
                    {getInitials(name)}
                  </div>
                  <div className="mt-2 font-semibold text-gray-800">
                    {name}
                  </div>
                </div>

                <Link
                  to="/"
                  className="block px-4 py-2 rounded-md hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Incentive Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= LOGIN CARD ================= */}
      {!isAuthenticated && (
        <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
          <h1 className="text-2xl font-bold text-center mb-6">
            Admin Login
          </h1>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 border rounded-md px-3"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 border rounded-md px-3"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white ${
              loading
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Please wait..." : "Login"}
          </button>
        </div>



      )}
      {isAuthenticated && (
          <div className="mt-6">
            <AdminDash />
          </div>
        )}
    </div>
  );
}
