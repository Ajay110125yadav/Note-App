import React, { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setMessage("");

    // basic client-side validation
    if (!form.name || !form.email || !form.password) {
      setErrors([{ msg: "All fields are required" }]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(form), // 
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors); 
        } else {
          setErrors([{ msg: data.message || "Registration failed" }]);
        }
        setLoading(false);
        return;
      }

      // success: token and user returned
      const { token, user } = data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setMessage("Registration successful - logged in!");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      console.error(err);
      setErrors([{ msg: "Network or server error" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "2rem auto",
        padding: "1.5rem",
        border: "1px solid #ddd",
        borderRadius: 8,
      }}
    >
      <h2>Register</h2>

      {message && (
        <div style={{ color: "green", marginBottom: 12 }}>{message}</div>
      )}

      {errors.length > 0 && ( 
        <div style={{ color: "red", marginBottom: 12 }}>
          {errors.map((e, i) => (
            <div key={i}>{e.msg}</div>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Name
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Your name"
            required
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          Email
          <input
            name="email"
            type="email" // 
            value={form.email}
            onChange={onChange} // 
            placeholder="you@gmail.com"
            required
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="min 6 chars"
            required
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{ margin: 10, padding: "8px 14px" }}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
