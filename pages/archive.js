"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // one ../

import { db, auth } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import '../styles/archive.css';

export default function Archive() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const q = query(collection(db,"archived"), where("uid","==", auth.currentUser.uid));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc=>({id: doc.id, ...doc.data()}));
      setTasks(list);
    }
    fetchTasks();
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <h2>Archived Tasks</h2>
        <table className="todo-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task=>(
              <tr key={task.id}>
                <td>{task.id.slice(0,5)}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}
