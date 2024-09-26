import React, { useState, useEffect } from "react";

export const UserList = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState({});
  const [expandedUser, setExpandedUser] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [newUser, setNewUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:9090/users", {
          method: "GET",
        });
        const data = await response.json();
        setUsers(data); // Asegúrate de que data es un array
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  // Fetch tasks for a specific user
  const fetchTasks = async (userId) => {
    console.log("Fetching tasks for user:", userId);
    if (!tasks[userId]) {
      try {
        const response = await fetch(
          `http://localhost:9090/tasks/user/${userId}`
        );
        const data = await response.json();
        setTasks((prevTasks) => ({
          ...prevTasks,
          [userId]: data, // Asegúrate de que data es un array
        }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Handle user click to expand/collapse task list
  const handleUserClick = (userId) => {
    if (expandedUser === userId) {
      setExpandedUser(null); // Collapse if clicked again
    } else {
      setExpandedUser(userId);
      fetchTasks(userId);
    }
  };

  // Handle marking task as completed
  const markTaskAsCompleted = (taskId, userId) => {
    console.log(`Task ${taskId} completed for user ${userId}`);
    // Delete task from backend
    fetch(`http://localhost:9090/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          // Remove task from state
          setTasks((prevTasks) => ({
            ...prevTasks,
            [userId]: prevTasks[userId].filter((task) => task.ID !== taskId),
          }));
        } else {
          console.error("Failed to mark task as completed:", res);
        }
      })
      .catch((err) => console.error(err));
  };

  // Handle showing the add task form
  const showAddTaskForm = (userId) => {
    setShowTaskForm(userId); // Muestra el formulario solo para el usuario seleccionado
  };

  // Handle hiding the add task form
  const hideAddTaskForm = () => {
    setShowTaskForm(null); // Oculta el formulario
    setNewTask({ title: "", description: "" }); // Limpia los campos del formulario
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  // Handle adding a new task
  const handleAddTask = (userId) => {
    // Aquí puedes implementar la lógica para agregar la tarea, como hacer un POST a tu API.
    console.log(`Adding task for user ${userId}:`, newTask);
    // Armar el cuerpo de la solicitud POST
    const body = JSON.stringify({
      Title: newTask.title,
      Description: newTask.description,
      UserID: userId,
    });

    fetch("http://localhost:9090/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Failed to add task");
      })
      .then((data) => {
        // Actualiza el estado de las tareas
        setTasks((prevTasks) => ({
          ...prevTasks,
          [userId]: [...prevTasks[userId], data],
        }));
      });
    hideAddTaskForm(); // Oculta el formulario tras agregar la tarea
  };

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const body = JSON.stringify({
      Firstname: newUser.firstname,
      Lastname: newUser.lastname,
      Email: newUser.email,
    });

    fetch("http://localhost:9090/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Failed to add user");
      })
      .then((data) => {
        setUsers([...users, data]);
        setNewUser({ firstname: "", lastname: "", email: "" });
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Lista de Usuarios
      </h1>

      {/* Formulario para agregar un nuevo usuario */}
      <form
        className="w-full max-w-4xl mb-8 bg-white p-6 shadow-md rounded-lg"
        onSubmit={handleAddUser}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            name="firstname"
            value={newUser.firstname}
            onChange={handleUserFormChange}
            placeholder="Nombre"
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="lastname"
            value={newUser.lastname}
            onChange={handleUserFormChange}
            placeholder="Apellido"
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleUserFormChange}
            placeholder="Correo"
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600 transition-colors"
          >
            Agregar Usuario
          </button>
        </div>
      </form>
      <table className="table-auto w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Nombre</th>
            <th className="py-2 px-4 text-left">Apellido</th>
            <th className="py-2 px-4 text-left">Correo</th>
            <th className="py-2 px-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <React.Fragment key={user.ID}>
              <tr className="border-b hover:bg-gray-50 transition-colors">
                <td className="py-2 px-4">{user.Firstname}</td>
                <td className="py-2 px-4">{user.Lastname}</td>
                <td className="py-2 px-4">{user.Email}</td>
                <td className="py-2 px-4 flex items-center justify-center gap-2">
                  <button
                    className="bg-blue-500 text-white rounded-full px-4 py-1 hover:bg-blue-600 transition-colors"
                    onClick={() => handleUserClick(user.ID)}
                  >
                    {expandedUser === user.ID
                      ? "Ocultar Tareas"
                      : "Mostrar Tareas"}
                  </button>
                  <button
                    className="bg-green-500 text-white rounded-full px-4 py-1 hover:bg-green-600 transition-colors"
                    onClick={() => showAddTaskForm(user.ID)}
                  >
                    Agregar Tarea
                  </button>
                </td>
              </tr>
              {expandedUser === user.ID && (
                <tr>
                  <td colSpan="4">
                    {Array.isArray(tasks[user.ID]) ? (
                      <table className="table-auto w-full mt-4 bg-gray-50 shadow-inner rounded-lg">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="py-2 px-4 text-left">Tarea</th>
                            <th className="py-2 px-4 text-left">Descripción</th>
                            <th className="py-2 px-4 text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tasks[user.ID].map((task) => (
                            <tr
                              key={task.ID}
                              className="border-b hover:bg-gray-100 transition-colors"
                            >
                              <td className="py-2 px-4">{task.Title}</td>
                              <td className="py-2 px-4">{task.Description}</td>
                              <td className="py-2 px-4 text-center">
                                <button
                                  className="bg-yellow-500 text-white rounded-full px-3 py-1 hover:bg-yellow-600 transition-colors"
                                  onClick={() =>
                                    markTaskAsCompleted(task.ID, user.ID)
                                  }
                                >
                                  Marcar como Finalizada
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-center text-gray-600 py-4">
                        No hay tareas para mostrar...
                      </p>
                    )}
                  </td>
                </tr>
              )}
              {showTaskForm === user.ID && (
                <tr>
                  <td colSpan="4" className="bg-gray-50 p-4">
                    <form
                      className="flex flex-col gap-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddTask(user.ID);
                      }}
                    >
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700">
                          Título:
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={newTask.title}
                          onChange={handleInputChange}
                          required
                          className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700">
                          Descripción:
                        </label>
                        <input
                          type="text"
                          name="description"
                          value={newTask.description}
                          onChange={handleInputChange}
                          required
                          className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex gap-4">
                        <button
                          type="submit"
                          className="bg-green-500 text-white rounded-full px-4 py-2 hover:bg-green-600 transition-colors"
                        >
                          Agregar
                        </button>
                        <button
                          type="button"
                          onClick={hideAddTaskForm}
                          className="bg-red-500 text-white rounded-full px-4 py-2 hover:bg-red-600 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
