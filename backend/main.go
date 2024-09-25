package main

import (
	"net/http"

	"users_task_backend/db"
	"users_task_backend/models"
	"users_task_backend/routes"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {

	db.DBConnection()
	db.DATABASE.AutoMigrate(models.Task{})
	db.DATABASE.AutoMigrate(models.User{})

	r := mux.NewRouter()
	// Index route
	r.HandleFunc("/", routes.HomeHandler)
	// routes usuario
	r.HandleFunc("/users", routes.GetUsersHandler).Methods("GET")
	r.HandleFunc("/users/{id}", routes.GetUserHandler).Methods("GET")
	r.HandleFunc("/users", routes.PostUserHandler).Methods("POST")
	r.HandleFunc("/users/{id}", routes.DeleteUserHandler).Methods("DELETE")
	// routes tareas
	r.HandleFunc("/tasks", routes.GetTasksHandler).Methods("GET")
	r.HandleFunc("/tasks/{id}", routes.GetTaskHandler).Methods("GET")
	r.HandleFunc("/tasks", routes.CreateTaskHandler).Methods("POST")
	r.HandleFunc("/tasks/{id}", routes.DeleteTaskHandler).Methods("DELETE")

	// Configurar CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // Permitir todas las fuentes
		AllowedMethods:   []string{"GET", "POST", "DELETE", "PUT", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	// Envolver el router con el middleware de CORS
	handler := c.Handler(r)

	http.ListenAndServe(":9090", handler)
}
