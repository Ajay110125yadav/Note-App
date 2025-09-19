import React, { useState } from "react"

export default function Login() {
  const [form, setForm] = useState({ email: "", password: ""});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");


  const onChange = (e) => 
    setForm({ ...form, [e.target.name]:e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setMessage("");

    if (!form.email || !form.password) {
      setErrors([{ masg: "All fields are required" }]);
      return;
    }

    setLoading(true);
    try{
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json();
      

      if (!res.ok) {
        setErrors([{ msg: data.message || "Login failed" }]);
        setLoading(false);
        return;
      }

      // success 
      localStorage.setItem("token", data.token);
      localStorage.setItem("User", JSON.stringify(data.user));
      setMessage("Login successful!");
      setForm({ email: "", password: "" });
    } catch (err) {
      console.error(err);
      setErrors([{ msg: "Network or server error" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "2rem auto", padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
      <h2>Login</h2>

      {message && <div style={{ color: "green", marginBottom: 12 }}>{message}</div>}

      {errors.length > 0 && (
        <div style={{ color: "red", marginBottom: 12 }}>
          {errors.map((e,i) => <div key={i}>{e.msg}</div>)}
          </div>
      )}

      <form onSubmit={onSubmit}>
        <label style={{ display: "block", marginBottom: 8}}>
          Email
          <input
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="you@gmail.com"
          required
          style={{ width: "100%", padding: 8, marginTop: 6}}
          />
        </label>
        <label style={{ display: "block", marginBotom: 8}}>
          Password
          <input
          type="password" 
          name="password"
          value={form.password}
          onChange={onChange}
          placeholder="Your password"
          required
          style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <button type="Submit" disabled = {loading} style={{ marginTop:10, padding: "8px 14px"}}>
          {loading ? "Logging in....":"Login"}
        </button>
      </form>
    </div>
  )
}

