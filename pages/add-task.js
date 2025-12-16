"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import styles from "../styles/add-task.module.css";
import Footer from "../components/Footer";

export default function AddTask() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const saveTask = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please enter task title and description");
      return;
    }

    if (!auth.currentUser) {
      alert("Please login first");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "tasks"), {
        title,
        description,
        completed: false,
        uid: auth.currentUser.uid,
        createdAt: new Date(), 
        lastUpdated: new Date(), 
      });

      setTitle("");
      setDescription("");
      router.push("/"); 
    } catch (error) {
      console.error(error);
      alert("Error adding task");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.card}>
          <h2>Add New Task</h2>

          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.inputField}
          />

          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textArea}
          />

          <button
  onClick={saveTask}
  className={styles.saveBtn}
  disabled={loading}
>
  Save Task
</button>

{loading && (
  <div className={styles.loaderOverlay}>
    <div className={styles.spinner}></div>
  </div>
)}

        </div>
      </main>
       <Footer />
    </>
  );
}
