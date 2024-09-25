import React, { useState, useEffect } from "react";

export const UserList = () => {
  const [users, setUsers] = useState([]); // Inicializa como un array
  const [tasks, setTasks] = useState({}); // Inicializa como un objeto
  const [expandedUser, setExpandedUser] = useState(null);

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

  return (
    <div>
      <h1>Lista de Usuarios</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <React.Fragment key={user.ID}>
              <tr onClick={() => handleUserClick(user.ID)}>
                <td>{user.Firstname}</td>
                <td>{user.Lastname}</td>
                <td>{user.Email}</td>
              </tr>
              {expandedUser === user.ID && (
                <tr>
                  <td colSpan="3">
                    {Array.isArray(tasks[user.ID]) ? (
                      <ul>
                        {tasks[user.ID].map((task) => (
                          <li key={task.ID}>
                            <strong>{task.Title}</strong>: {task.Description}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Cargando tareas...</p>
                    )}
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
