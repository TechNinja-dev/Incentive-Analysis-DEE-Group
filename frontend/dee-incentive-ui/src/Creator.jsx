import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Creator() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    query: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const [toast, setToast] = useState({ show: false, type: "", text: "" });

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      access_key: import.meta.env.VITE_WEB3FORMS_KEY,
      name: form.name,
      email: form.email,
      subject: "Query from Incentive Dashboard",
      message: form.query
    };

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (result.success) {
      setToast({
        show: true,
        type: "success",
        text: "Message sent successfully! I’ll get back to you soon."
      });
      setForm({ name: "", email: "", query: "" });
    } else {
      setToast({
        show: true,
        type: "error",
        text: "Submission failed. Please try again."
      });
    }
  } catch (err) {
    setToast({
      show: true,
      type: "error",
      text: "Network error. Please try again later."
    });
  }

  setTimeout(() => {
    setToast({ show: false, type: "", text: "" });
  }, 3500);
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-14">

    {toast.show && (
  <div
    className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 
    px-6 py-4 rounded-xl shadow-lg text-white font-semibold
    transition-all duration-300
    ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
  >
    {toast.text}
  </div>
)}

      <div className="max-w-5xl mx-auto space-y-10">

        {/* ===== BACK BUTTON ===== */}
<button
  onClick={() => navigate("/")}
  className="fixed top-6 right-6 z-50 px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg"
>
  ← Back to Dashboard
</button>

        {/* ===== HERO ===== */}
        <div className="bg-white rounded-3xl shadow-lg p-10 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full opacity-40" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-green-100 rounded-full opacity-40" />

          <h1 className="text-4xl font-extrabold mb-4">
            Hi, I’m <span className="text-blue-600">Prakhar Srivastava</span>
          </h1>

          <p className="text-lg text-gray-700 max-w-3xl leading-relaxed">
            I developed this application with one clear goal — to make
            incentive calculation and performance tracking simple,
            transparent, and reliable for sales teams and management.
            This system removes manual effort and ensures everyone
            works with the same, accurate numbers.
          </p>
        </div>

        {/* ===== WHY THIS APP / FOCUS ===== */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-bold mb-3">
              Why this application?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              In many sales environments, incentive calculations are
              time-consuming, confusing, and prone to errors.
              This application centralizes all rules in one place so
              sales performance, slabs, and incentives are calculated
              automatically and consistently.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-bold mb-3">
              What this system focuses on
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>• Clear incentive rules defined by management</li>
              <li>• Accurate calculations without manual effort</li>
              <li>• Transparency for sales executives</li>
              <li>• Easy updates when incentive policies change</li>
              <li>• Faster decision-making using reliable data</li>
            </ul>
          </div>
        </div>

        {/* ===== CONTACT CARDS ===== */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="text-3xl mb-2">📧</div>
            <p className="font-semibold">Email</p>
            <p className="text-gray-600 mt-1">
              prakharsrivastava019@email.com
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="text-3xl mb-2">📞</div>
            <p className="font-semibold">Phone</p>
            <p className="text-gray-600 mt-1">
              +91-9792486222
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="text-3xl mb-2">🔗</div>
            <p className="font-semibold">LinkedIn</p>
            <a
              href="https://www.linkedin.com/in/prakhar-srivastava-58bb85303/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline mt-1 block"
            >
              View Profile
            </a>
          </div>
        </div>

        {/* ===== QUERY FORM ===== */}
        <div className="bg-white rounded-3xl shadow-lg p-10">
          <h2 className="text-3xl font-bold mb-2">
            Get in touch
          </h2>
          <p className="text-gray-600 mb-6">
            Have a question, feedback, or suggestion? Feel free to reach out.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-semibold mb-1">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full h-11 border-2 border-gray-300 rounded-md px-3 
                          focus:border-blue-600 focus:ring-2 focus:ring-blue-200 
                          bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full h-11 border-2 border-gray-300 rounded-md px-3 
                          focus:border-blue-600 focus:ring-2 focus:ring-blue-200 
                          bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Your Message
              </label>
              <textarea
                name="query"
                required
                rows="4"
                value={form.query}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded-md px-3 py-2 
                           focus:border-blue-600 focus:ring-2 focus:ring-blue-200 
                           bg-white"

              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:opacity-90"
            >
              Send Message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
