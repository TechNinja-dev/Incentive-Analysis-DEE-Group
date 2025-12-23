import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "./assets/dee.png";


export default function Admin() {
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [name,setName]=useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" // "success" | "error"
  });
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type });
    }, 3000); // auto hide in 3 sec
  };




    const handleLogin = async () => {
      try {
        setLoading(true);
      
        const res = await fetch("http://localhost:8000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
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
      
        setIsAuthenticated(true);
        showToast("Welcome Back", "success");
      } catch (err) {
        console.error(err);
        showToast("Login error", "error");
      } finally {
        setLoading(false);
      }
    };



  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        showToast("User already exists !", "error");
        return;
      }

      showToast("Sign Up Successfull !", "success");
      setName(name)
      setIsLogin(true);
      setPassword("");
      setConfirmPassword("");
      setIsAuthenticated(true)
    } catch (err) {
      console.error(err);
      showToast("SignUp Failed !", "error");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (
    parts[0][0].toUpperCase() +
    parts[parts.length - 1][0].toUpperCase()
  );
};



  return (
  
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
{/* TOP SLIDE-IN NOTIFICATION */}
{toast.show && (
  <div className="fixed top-4 left-1/2 z-[100] -translate-x-1/2">
    <div
      className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg border
        animate-slide-down
        ${
          toast.type === "success"
            ? "bg-green-50 border-green-300 text-green-800"
            : "bg-red-50 border-red-300 text-red-800"
        }
      `}
    >
      {/* ICON */}
      <div className="flex items-center justify-center w-6 h-6">
        {toast.type === "success" ? (
          <span className="text-green-600 text-xl">✔</span>
        ) : (
          <span className="text-red-600 text-xl">🚫</span>
        )}
      </div>

      {/* MESSAGE */}
      <span className="font-medium">{toast.message}</span>
    </div>
  </div>
)}



        {/* ===== TOP HEADER ===== */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow px-6 py-4 flex items-center justify-between">
          <img src={logo} alt="Logo" className="h-10 object-contain" />

          {isAuthenticated && (
            <div className="relative">
              {/* Small profile circle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center"
              >
                {getInitials(name)}
              </button>
          
              {/* Dropdown */}
              {menuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border p-4">

                  {/* Profile section */}
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
                    onClick={() => {
                      setIsAuthenticated(false);
                      setMenuOpen(false);
                      setName("");
                      setEmail("");
                      setPassword("");
                    }}
                    className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>







      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        
        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-6">
          Admin {isLogin ? "Login" : "Signup"}
        </h1>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Name
          </label>
          <input
            type="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-10 border rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 border rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="admin@example.com"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-10 border rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
          />
        </div>

        {/* Confirm Password (Signup only) */}
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-10 border rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm password"
            />
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          disabled={loading}
          onClick={isLogin ? handleLogin : handleSignup}
          className={`w-full py-3 mt-2 rounded-xl font-semibold text-white
            ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}
          `}
        >
          {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
        </button>


        {/* Toggle */}
        <div className="text-center mt-4 text-sm">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-600 font-semibold hover:underline"
              >
                Signup
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
