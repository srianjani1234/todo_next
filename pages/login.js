"use client";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import styles from "../styles/login.module.css";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) router.push("/");
    });
    return () => unsubscribe();
  }, [router]);

  // Validate email on change
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Simple validation: must contain @gmail.com
    if (!value.includes("@gmail.com")) {
      setEmailError("Email must include @gmail.com");
    } else {
      setEmailError("");
    }
  };

  const handleEmailLogin = async () => {
    setError("");
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!email.includes("@gmail.com")) {
      setEmailError("Email must include @gmail.com");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err) {
      setError("Invalid credentials or user not registered.");
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGithubLogin = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className={styles['login-container']}>
      <div className={styles['login-card']}>
        <h2 className={styles.title}>Login</h2>

        {/* Email validation error */}
        {emailError && <p className={styles.error}>{emailError}</p>}
        {error && <p className={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className={styles['manual-btn']} onClick={handleEmailLogin}>
          Login
        </button>

        <div className={styles.orDivider}>OR</div>

        <button className={styles['google-btn']} onClick={handleGoogleLogin}>
          <FcGoogle size={24} style={{ marginRight: "10px" }} />
          Login with Google
        </button>
        <button className={styles['github-btn']} onClick={handleGithubLogin}>
          <FaGithub size={24} style={{ marginRight: "10px" }} />
          Login with GitHub
        </button>

        <p className={styles.registerText}>
          Not registered?{" "}
          <span
            className={styles.registerLink}
            onClick={() => router.push("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
