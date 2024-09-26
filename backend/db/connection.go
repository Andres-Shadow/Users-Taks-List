package db

import (
	"log"
	"os"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

var DATABASE *gorm.DB

func DBConnection() {
	host := os.Getenv("DATABASE_HOST")
	dbPassword := os.Getenv("DATABASE_ROOT_PASSWORD")
	dbUser := "root"

	var dsn = dbUser + ":" + dbPassword + "@tcp(" + host + ":3306)/users_tasks?charset=utf8mb4&parseTime=True&loc=Local"

	for {
		var err error
		DATABASE, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
			NamingStrategy: schema.NamingStrategy{
				SingularTable: true,
			},
		})
		if err != nil {
			log.Println("Failed to connect to database. Retrying in 10 seconds...")
			time.Sleep(10 * time.Second) // Wait for 5 seconds before retrying
		} else {
			log.Println("DB Connected")
			break // Exit the loop once the connection is successful
		}
	}
}
