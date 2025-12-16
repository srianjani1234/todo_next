"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import styles from "../../styles/add-task.module.css"; 
import Footer from "../../components/Footer";

export default function EditTask() {
  const router = useRouter();
  const params = useParams(); 
  const taskId = params?.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!taskId) return;
    const fetchTask = async () => {
      try {
        const docRef = doc(db, "tasks", taskId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setDescription(data.description);
        } else {
          alert("Task not found");
          router.push("/");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchTask();
  }, [taskId]);

  const updateTask = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please enter title and description");
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, "tasks", taskId);
     await updateDoc(docRef, {
  title,
  description,
  lastUpdated: new Date(), 
});

      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Error updating task");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.card}>
          <h2>Edit Task</h2>

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
  onClick={updateTask}
  className={styles.saveBtn}
  disabled={loading}
>
  Update Task
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
