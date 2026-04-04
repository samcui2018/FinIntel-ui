
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authApi";

function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      await register({
        firstName: fullName,
        email,
        password,
      });

      navigate("/login");
    } catch (err: any) {
      setError(err?.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={titleStyle}>Create your account</h1>
          <p style={subtitleStyle}>
            Start building your financial intelligence workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldStyle}>
            <label htmlFor="fullName" style={labelStyle}>
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="confirmPassword" style={labelStyle}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              style={inputStyle}
            />
          </div>

          {error && <div style={errorStyle}>{error}</div>}

          <button type="submit" disabled={isSubmitting} style={primaryButtonStyle}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div style={footerTextStyle}>
          Already have an account?{" "}
          <Link to="/login" style={linkStyle}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

const pageStyle: React.CSSProperties = {
  minHeight: "calc(100vh - 80px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "32px 16px",
  background:
    "linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 460,
  background: "#fff",
  borderRadius: 16,
  padding: 32,
  boxShadow: "0 18px 45px rgba(15, 23, 42, 0.10)",
  border: "1px solid #e5e7eb",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 30,
  fontWeight: 700,
  color: "#111827",
};

const subtitleStyle: React.CSSProperties = {
  marginTop: 8,
  marginBottom: 0,
  fontSize: 15,
  color: "#6b7280",
  lineHeight: 1.5,
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 18,
};

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: "#374151",
};

const inputStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  fontSize: 15,
  outline: "none",
};

const primaryButtonStyle: React.CSSProperties = {
  marginTop: 8,
  padding: "13px 16px",
  border: "none",
  borderRadius: 10,
  background: "#2563eb",
  color: "#fff",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
};

const errorStyle: React.CSSProperties = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  color: "#b91c1c",
  padding: "12px 14px",
  borderRadius: 10,
  fontSize: 14,
};

const footerTextStyle: React.CSSProperties = {
  marginTop: 22,
  textAlign: "center",
  fontSize: 14,
  color: "#6b7280",
};

const linkStyle: React.CSSProperties = {
  color: "#2563eb",
  fontWeight: 600,
  textDecoration: "none",
};

// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { register } from "../services/authApi";
// import { handlePostAuthRouting } from "../utils/postAuthNavigation";

// export default function RegisterPage() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError("");

//     try {
//       setLoading(true);

//       const result = await register({
//         email,
//         password,
//         firstName,
//         lastName,
//       });

//       if (result.token) {
//         localStorage.setItem("token", result.token);
//         localStorage.setItem("userEmail", result.email ?? email);

//         if (result.role) {
//           localStorage.setItem("userRole", result.role);
//         }

//         await handlePostAuthRouting(navigate);
//         return;
//       }

//       navigate("/login");
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Registration failed.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div style={{ maxWidth: 420, margin: "48px auto" }}>
//       <h1>Register</h1>

//       <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
//         <label>
//           First Name
//           <input
//             value={firstName}
//             onChange={e => setFirstName(e.target.value)}
//           />
//         </label>

//         <label>
//           Last Name
//           <input
//             value={lastName}
//             onChange={e => setLastName(e.target.value)}
//           />
//         </label>

//         <label>
//           Email
//           <input
//             type="email"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//           />
//         </label>

//         <label>
//           Password
//           <input
//             type="password"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//           />
//         </label>

//         {error ? <div style={{ color: "crimson" }}>{error}</div> : null}

//         <button type="submit" disabled={loading}>
//           {loading ? "Creating account..." : "Register"}
//         </button>
//       </form>

//       <p style={{ marginTop: 16 }}>
//         Already have an account? <Link to="/login">Login</Link>
//       </p>
//     </div>
//   );
// }

// // import { useState } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import { register } from "../services/authApi";
// // import ErrorMessage from "../components/common/ErrorMessage";

// // function RegisterPage() {
// //   const navigate = useNavigate();

// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [confirmPassword, setConfirmPassword] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   async function handleSubmit(e: React.FormEvent) {
// //     e.preventDefault();
// //     setError("");

// //     if (password !== confirmPassword) {
// //       setError("Passwords do not match.");
// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       const result = await register({ email, password });

// //       localStorage.setItem("token", result.token);
// //       localStorage.setItem("userEmail", result.email);
// //       localStorage.setItem("userRole", result.role);

// //       navigate("/");
// //     } catch (err) {
// //       setError(err instanceof Error ? err.message : "Registration failed.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   return (
// //     <div style={{ maxWidth: 420, margin: "60px auto" }}>
// //       <h1>Register</h1>

// //       <form onSubmit={handleSubmit}>
// //         <div style={{ marginBottom: 12 }}>
// //           <label>Email</label>
// //           <input
// //             style={{ width: "100%" }}
// //             type="email"
// //             value={email}
// //             onChange={(e) => setEmail(e.target.value)}
// //             required
// //           />
// //         </div>

// //         <div style={{ marginBottom: 12 }}>
// //           <label>Password</label>
// //           <input
// //             style={{ width: "100%" }}
// //             type="password"
// //             value={password}
// //             onChange={(e) => setPassword(e.target.value)}
// //             required
// //           />
// //         </div>

// //         <div style={{ marginBottom: 12 }}>
// //           <label>Confirm Password</label>
// //           <input
// //             style={{ width: "100%" }}
// //             type="password"
// //             value={confirmPassword}
// //             onChange={(e) => setConfirmPassword(e.target.value)}
// //             required
// //           />
// //         </div>

// //         <button type="submit" disabled={loading}>
// //           {loading ? "Creating account..." : "Create account"}
// //         </button>

// //         <ErrorMessage message={error} />
// //       </form>

// //       <p style={{ marginTop: 16 }}>
// //         Already have an account? <Link to="/login">Login</Link>
// //       </p>
// //     </div>
// //   );
// // }

// // export default RegisterPage;