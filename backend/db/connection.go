package db

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// COMANDO DOCKER
// docker run --name postgres -e POSTGRES_USER=andres -e POSTGRES_PASSWORD=andres1 -p 5432:5432 -d postgres
var DSN = "host=localhost user=andres password=andres1 dbname=gorm port=5432"
var DB *gorm.DB

func DBConnection() {
	var error error
	DB, error = gorm.Open(postgres.Open(DSN), &gorm.Config{})
	if error != nil {
		log.Fatal(error)
	} else {
		log.Println("BD CONECTADA")
	}
}
