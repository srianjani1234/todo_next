"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import styles from "../styles/home.module.css";
import Footer from "../components/Footer";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(auth.currentUser);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  // Fetch tasks
  const fetchTasks = async (currentUser) => {
    if (!currentUser) return;
    setLoading(true);

    const q = query(
      collection(db, "tasks"),
      where("uid", "==", currentUser.uid)
    );

    const snapshot = await getDocs(q);

    const taskList = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort(
        (a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0)
      );

    setTasks(taskList);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchTasks(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Toggle individual selection
  const toggleSelect = (taskId) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  // Toggle all checkboxes
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map((task) => task.id));
    }
    setSelectAll(!selectAll);
  };

  // Delete selected tasks
  const deleteSelectedTasks = async () => {
    if (!selectedTasks.length) return;
    if (!confirm("Are you sure you want to delete selected tasks?")) return;

    setLoading(true);
    try {
      for (let id of selectedTasks) {
        await deleteDoc(doc(db, "tasks", id));
      }
      setSelectedTasks([]);
      setSelectAll(false);
      fetchTasks(user);
    } catch (error) {
      console.error(error);
      alert("Error deleting tasks");
    }
    setLoading(false);
  };

  // Save selected tasks
  const saveSelectedTasks = async () => {
    if (!selectedTasks.length) return;
    if (!confirm("Are you sure you want to save selected tasks?")) return;

    setLoading(true);
    try {
      for (let id of selectedTasks) {
        const taskRef = doc(db, "tasks", id);
        const taskSnap = await getDocs(collection(db, "tasks"));
        const taskDoc = taskSnap.docs.find((doc) => doc.id === id);
        if (taskDoc) {
          const data = taskDoc.data();
          await addDoc(collection(db, "savedTasks"), {
            ...data,
            uid: user.uid,
            createdAt: data.createdAt || new Date(),
          });
          await deleteDoc(taskRef);
        }
      }
      setSelectedTasks([]);
      setSelectAll(false);
      fetchTasks(user);
      alert("Selected tasks saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Error saving tasks");
    }
    setLoading(false);
  };

  // Pagination & Search
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * tasksPerPage;
  const indexOfFirst = indexOfLast - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  if (!user) return <div>Please login first</div>;

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.topBar}>
          <button
            className={styles.addTaskBtn}
            onClick={() => router.push("/add-task")}
          >
            + Add Task
          </button>

          <button
            className={styles.savedTasksBtn}
            onClick={() => router.push("/saved-tasks")}
          >
            Saved Tasks
          </button>

          <input
            type="text"
            placeholder="Search by task title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />

          <button className={styles.selectAllBtn} onClick={toggleSelectAll}>
            {selectAll ? "Unselect All" : "Select All"}
          </button>

          {selectedTasks.length > 0 && (
            <div className={styles.selectedActions}>
              <button
                className={styles.deleteAllBtn}
                onClick={deleteSelectedTasks}
              >
                Delete All Selected
              </button>
              <button
                className={styles.saveAllBtn}
                onClick={saveSelectedTasks}
              >
                Save All Selected
              </button>
            </div>
          )}
        </div>

        {loading && (
          <div className={styles.loaderWrapper}>
            <div className={styles.spinner}></div>
          </div>
        )}

        <table className={styles.taskTable}>
          <thead>
            <tr>
              <th>Select</th>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.map((task, idx) => (
              <tr key={task.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(task.id)}
                    onChange={() => toggleSelect(task.id)}
                  />
                </td>
                <td>{idx + 1 + (currentPage - 1) * tasksPerPage}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>
                  <button
                    className={styles.editBtn}
                    onClick={() => router.push(`/edit-task/${task.id}`)}
                  >
                    EDIT
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={async () => {
                      if (
                        confirm("Are you sure you want to delete this task?")
                      ) {
                        await deleteDoc(doc(db, "tasks", task.id));
                        fetchTasks(user);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? styles.activePage : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
       
      </main>
       <Footer/>
    </>
  );
}
