package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Firstname string `gorm:"not null"`
	Lastname  string `gorm:"not null"`
	Email     string `gorm:"not null"`
	Tasks     []Task
}
