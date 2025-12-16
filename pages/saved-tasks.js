"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import styles from "../styles/home.module.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function SavedTasks() {
  const router = useRouter();
  const [user, setUser] = useState(auth.currentUser);
  const [savedTasks, setSavedTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch saved tasks
  const fetchSavedTasks = async () => {
    if (!user) return;
    setLoading(true);
    const q = query(collection(db, "savedTasks"), where("uid", "==", user.uid));
    const snapshot = await getDocs(q);
    const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setSavedTasks(tasks);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchSavedTasks();
    });
    return () => unsubscribe();
  }, []);

  // Delete saved task
  const deleteSavedTask = async (taskId) => {
    if (!confirm("Are you sure you want to delete this saved task?")) return;
    await deleteDoc(doc(db, "savedTasks", taskId));
    fetchSavedTasks();
  };

  if (!user) return <div>Please login first</div>;

  return (
    <>
    <Navbar/>
    <main className={styles.main}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => router.push("/")}>
          ← Back
        </button>
        <h2>Saved Tasks</h2>
      </div>

      {loading && <p className={styles.loader}>Loading saved tasks...</p>}

      <table className={styles.taskTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {savedTasks.map((task, idx) => (
            <tr key={task.id}>
              <td>{idx + 1}</td>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteSavedTask(task.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {savedTasks.length === 0 && !loading && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                No saved tasks.
              </td>
            </tr>
          )}
        </tbody>
      </table>
     
    </main>
    <Footer/>
    </>

    
  );
}
