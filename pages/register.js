"use client";
import { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar"; // one ../

import styles from "../styles/login.module.css";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleRegister = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGithubRegister = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles['login-container']}>
        <div className={styles['login-card']}>
          <h2 className={styles.title}>Register</h2>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          {/* Manual Email/Password Registration */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className={styles['manual-btn']} onClick={handleRegister}>
            Register
          </button>

          <div className={styles.orDivider}>OR</div>

          {/* Social Registration with Icons */}
          <button className={styles['google-btn']} onClick={handleGoogleRegister}>
            <FcGoogle size={24} style={{ marginRight: "10px" }} />
            Register with Google
          </button>
          <button className={styles['github-btn']} onClick={handleGithubRegister}>
            <FaGithub size={24} style={{ marginRight: "10px" }} />
            Register with GitHub
          </button>

          <p className={styles.registerText}>
            Already registered?{" "}
            <span
              className={styles.registerLink}
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
