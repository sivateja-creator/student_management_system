import { useState, useEffect } from "react";

const API = "http://localhost:8080/api/students";
const emptyForm = { id: "", name: "", email: "", department: "", marks: "" };

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  function showMessage(text, error) {
    setMessage(text);
    setIsError(error);
  }

  // Get all students from backend
  async function loadStudents() {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      showMessage("Cannot connect to backend", true);
    }
  }

  // Load students when the page opens
  useEffect(() => {
    loadStudents();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Add or Update
  async function handleSubmit(e) {
    e.preventDefault();

    // Validation
    if (form.id === "") {
      showMessage("Student ID is required", true);
      return;
    }
    if (form.name.trim() === "") {
      showMessage("Name is required", true);
      return;
    }
    if (form.email.trim() === "" || !form.email.includes("@")) {
      showMessage("A valid Email is required", true);
      return;
    }
    if (form.marks === "" || Number(form.marks) < 0 || Number(form.marks) > 100) {
      showMessage("Marks must be between 0 and 100", true);
      return;
    }

    const student = {
      id: Number(form.id),
      name: form.name.trim(),
      email: form.email.trim(),
      department: form.department.trim(),
      marks: Number(form.marks),
    };

    const url = editing ? API + "/" + form.id : API;
    const method = editing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });

      if (!res.ok) {
        const text = await res.text();
        showMessage(text || "Something went wrong", true);
        return;
      }

      showMessage(editing ? "Student updated successfully" : "Student added successfully", false);
      setForm(emptyForm);
      setEditing(false);
      loadStudents();
    } catch (err) {
      showMessage("Cannot connect to backend", true);
    }
  }

  // Fill the form with the selected student
  function handleEdit(student) {
    setForm({
      id: student.id,
      name: student.name,
      email: student.email,
      department: student.department || "",
      marks: student.marks,
    });
    setEditing(true);
    setMessage("");
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditing(false);
    setMessage("");
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this student?")) {
      return;
    }
    try {
      const res = await fetch(API + "/" + id, { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text();
        showMessage(text || "Delete failed", true);
        return;
      }
      showMessage("Student deleted successfully", false);
      loadStudents();
    } catch (err) {
      showMessage("Cannot connect to backend", true);
    }
  }

  return (
    <div className="container">
      <h1>Student Management System</h1>

      {message && <p className={isError ? "message error" : "message success"}>{message}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input
          type="number"
          name="id"
          placeholder="Student ID"
          value={form.id}
          onChange={handleChange}
          disabled={editing}
        />
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
        />
        <input type="number" name="marks" placeholder="Marks (0-100)" value={form.marks} onChange={handleChange} />

        <button type="submit">{editing ? "Update Student" : "Add Student"}</button>
        {editing && (
          <button type="button" className="cancel" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Marks</th>
            <th>Grade</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="7">No students found</td>
            </tr>
          ) : (
            students.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.department}</td>
                <td>{s.marks}</td>
                <td>{s.grade}</td>
                <td>
                  <button className="edit" onClick={() => handleEdit(s)}>
                    Edit
                  </button>
                  <button className="delete" onClick={() => handleDelete(s.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;