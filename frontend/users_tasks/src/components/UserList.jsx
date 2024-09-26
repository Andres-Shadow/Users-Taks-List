import React, { useState, useEffect } from "react";

export const UserList = () => {
  const [users, setUsers] = useState([]); // Inicializa como un array
  const [tasks, setTasks] = useState({}); // Inicializa como un objeto
  const [expandedUser, setExpandedUser] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(null); // Estado para mostrar el formulario de agregar tarea
  const [newTask, setNewTask] = useState({ title: "", description: "" }); // Estado para los campos del formulario

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
      await fetch(`http://localhost:9090/tasks/user/${userId}`)
        .then((res) => res.json())
        .then((data) =>
          setTasks((prevTasks) => ({
            ...prevTasks,
            [userId]: data, // Asegúrate de que data es un array
          }))
        )
        .catch((err) => console.error(err));
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

  return (
    <div>
      <h1>Lista de Usuarios</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <React.Fragment key={user.ID}>
              <tr>
                <td>{user.Firstname}</td>
                <td>{user.Lastname}</td>
                <td>{user.Email}</td>
                <td>
                  <button onClick={() => handleUserClick(user.ID)}>
                    {expandedUser === user.ID
                      ? "Ocultar Tareas"
                      : "Mostrar Tareas"}
                  </button>
                  <button onClick={() => showAddTaskForm(user.ID)}>
                    Agregar Tarea
                  </button>
                </td>
              </tr>
              {expandedUser === user.ID && (
                <tr>
                  <td colSpan="4">
                    {Array.isArray(tasks[user.ID]) ? (
                      <table className="subtable">
                        <thead>
                          <tr>
                            <th>Tarea</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tasks[user.ID].map((task) => (
                            <tr key={task.ID}>
                              <td>{task.Title}</td>
                              <td>{task.Description}</td>
                              <td>
                                <button
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
                      <p>Cargando tareas...</p>
                    )}
                  </td>
                </tr>
              )}
              {showTaskForm === user.ID && (
                <tr>
                  <td colSpan="4">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddTask(user.ID);
                      }}
                    >
                      <div>
                        <label>Título:</label>
                        <input
                          type="text"
                          name="title"
                          value={newTask.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label>Descripción:</label>
                        <input
                          type="text"
                          name="description"
                          value={newTask.description}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <button type="submit">Agregar</button>
                      <button type="button" onClick={hideAddTaskForm}>
                        Cancelar
                      </button>
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
