"use client";
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";
import styles from "../styles/navbar.module.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img className={styles.image}
          src="data:image/jpeg;base64,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" // replace with your image path in /public
          alt="Todo App"
          
        />
      </div>

<div className={styles.welcome}>
  {user ? (
    <>
      Hello,{" "}
      {user.email
        ? user.email.split("@")[0].replace(/[0-9]/g, "") // remove digits
        : user.phoneNumber || "User"}{" "}
      – let’s manage your tasks!
    </> 
  ) : null}
</div>


      <div>
        {user ? (
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className={styles.loginBtn} onClick={() => router.push("/login")}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
