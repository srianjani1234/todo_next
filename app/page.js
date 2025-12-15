"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { auth, db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./login";
import "./globals.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchTodos(currentUser.uid);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  const fetchTodos = async (uid) => {
    const q = query(collection(db, "todos"), where("uid", "==", uid));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTodos(list);
  };

  const saveTodo = async () => {
    if (!task.trim()) return;
    if (!user) return showToast("Login first");

    if (editId) {
      await updateDoc(doc(db, "todos", editId), { title: task });
      showToast("Task edited ✅");
    } else {
      await addDoc(collection(db, "todos"), { title: task, completed: false, uid: user.uid });
      showToast("Task added ✅");
    }
    setTask("");
    setEditId(null);
    fetchTodos(user.uid);
  };

  const deleteTodoItem = async (id) => {
    await deleteDoc(doc(db, "todos", id));
    showToast("Task deleted ❌");
    fetchTodos(user.uid);
  };

  const editTodoItem = (todo) => {
    setTask(todo.title);
    setEditId(todo.id);
  };

  const toggleTodo = async (todo) => {
    await updateDoc(doc(db, "todos", todo.id), { completed: !todo.completed });
    if (!todo.completed) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    fetchTodos(user.uid);
  };

  const total = todos.length;
  const finished = todos.filter(t => t.completed).length;
  const pending = total - finished;

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="container">
      <h2>Todo App</h2>
      <button className="btn-gradient" style={{ float: "right", marginBottom: "10px" }} onClick={() => auth.signOut()}>
        Logout
      </button>

      {toast && <div className="toast">{toast}</div>}

      <div className="progress">
        <strong>Total:</strong> {total} | <strong>Pending:</strong> {pending} | <strong>Finished:</strong> {finished}
      </div>

      <div className="input-box">
        <input type="text" value={task} onChange={(e) => setTask(e.target.value)} placeholder="Enter a task..." />
        <button onClick={saveTodo}>{editId ? "Update" : "Add"}</button>
      </div>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <div className="todo-left">
              <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo)} />
              <span>{todo.title}</span>
            </div>
            <div>
              <button onClick={() => editTodoItem(todo)} className="edit-btn">edit</button>
              <button onClick={() => deleteTodoItem(todo.id)} className="delete-btn">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
