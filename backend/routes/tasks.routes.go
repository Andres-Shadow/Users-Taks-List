package routes

import (
	"encoding/json"
	"net/http"
	"users_task_backend/db"
	"users_task_backend/models"

	"github.com/gorilla/mux"
)

func GetTasksHandler(w http.ResponseWriter, r *http.Request) {

	var tasks []models.Task
	db.DATABASE.Find(&tasks)
	json.NewEncoder(w).Encode(&tasks)
}

func GetTaskHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var task models.Task
	db.DATABASE.First(&task, params["id"])

	if task.ID == 0 {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("Task not found"))
		return
	}

	json.NewEncoder(w).Encode(&task)
}

func GetUserTasksHandler(w http.ResponseWriter, r *http.Request) {
	var tasks []models.Task
	params := mux.Vars(r)
	db.DATABASE.Where("user_id = ?", params["id"]).Find(&tasks)
	if len(tasks) == 0 {
		//retorna un array vacio
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("Tasks not found"))
		return
	}
	json.NewEncoder(w).Encode(&tasks)
}

func CreateTaskHandler(w http.ResponseWriter, r *http.Request) {
	var task models.Task
	json.NewDecoder(r.Body).Decode(&task)
	createdTask := db.DATABASE.Create(&task)
	err := createdTask.Error

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
	}

	json.NewEncoder(w).Encode(&task)
}

func DeleteTaskHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var task models.Task
	db.DATABASE.First(&task, params["id"])

	if task.ID == 0 {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("Task not found"))
		return
	}

	db.DATABASE.Unscoped().Delete(&task)
	w.WriteHeader(http.StatusOK)
}
