package entity

import (
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {

	return db

}

func SetupDatabase() {

	database, err := gorm.Open(sqlite.Open("sa-65.db"), &gorm.Config{})

	if err != nil {

		panic("failed to connect database")

	}

	// Migrate the schema

	database.AutoMigrate(
		&Role{},
		&Gender{},
		&Position{},
		&JobType{},
		&Distributor{},
		&Building{},
		&Room{},
		&User{},
		&Device{},
		&Room_has_Device{},
		&Request{},
		&Cart{},
		&History{},
		&DMGLevel{},
		&Estimate{}, // 15
		&Brand{},
		&Type{},
	)

	db = database

	password, err := bcrypt.GenerateFromPassword([]byte("123456"), 14)

	db.Model(&Role{}).Create(&Role{Name: "User"})
	db.Model(&Role{}).Create(&Role{Name: "Tech"})
	db.Model(&Role{}).Create(&Role{Name: "Admin"})
	db.Model(&Gender{}).Create(&Gender{Name: "Male"})
	db.Model(&Gender{}).Create(&Gender{Name: "Female"})
	db.Model(&Position{}).Create(&Position{Position: "A"})
	db.Model(&Position{}).Create(&Position{Position: "B"})
	db.Model(&Distributor{}).Create(&Distributor{Name: "ร้านA", Location: ".."})
	db.Model(&Distributor{}).Create(&Distributor{Name: "ร้านB", Location: ".."})
	db.Model(&Brand{}).Create(&Brand{Name: "Brand A"})
	db.Model(&Brand{}).Create(&Brand{Name: "Brand B"})
	db.Model(&Type{}).Create(&Type{Name: "คอม"})
	db.Model(&Type{}).Create(&Type{Name: "notebook"})
	db.Model(&Estimate{}).Create(&Estimate{Name: "การบำรุงรักษาโดยการซ่อมแซมส่วนที่เสีย"})
	db.Model(&Estimate{}).Create(&Estimate{Name: "การบำรุงรักษาตามแผน"})
	db.Model(&Estimate{}).Create(&Estimate{Name: "การบำรุงรักษาโดยการคาดคะเน"})
	db.Model(&Estimate{}).Create(&Estimate{Name: "แนวคิดใหม่ในวงการบำรุงรักษา"})

	var male, female Gender
	db.Raw("SELECT * FROM genders WHERE name = ?", "Male").Scan(&male)
	db.Raw("SELECT * FROM genders WHERE name = ?", "Female").Scan(&female)

	var r_user, r_tech, r_admin Role
	db.Raw("SELECT * FROM roles WHERE name = ?", "User").Scan(&r_user)
	db.Raw("SELECT * FROM roles WHERE name = ?", "Tech").Scan(&r_tech)
	db.Raw("SELECT * FROM roles WHERE name = ?", "Admin").Scan(&r_admin)

	var position Position
	db.Raw("SELECT * FROM Positions WHERE Position = ?", "A").Scan(&position)

	db.Model(&User{}).Create(&User{
		Name:         "สมใส ใจดี",
		Email:        "somsai57@gmail.com",
		Phone_number: "0831234567",
		Password:     string(password),
		Role:         r_user,
		Gender:       male,
		Position:     position,
	})

	db.Model(&User{}).Create(&User{
		Name:         "วันดี มีแสง",
		Email:        "wandi123@gmail.com",
		Phone_number: "0987654567",
		Password:     string(password),
		Role:         r_tech,
		Gender:       female,
		Position:     position,
	})

	db.Model(&User{}).Create(&User{
		Name:         "สุขใจ สายสี",
		Email:        "sukjai@gmail.com",
		Phone_number: "0992314532",
		Password:     string(password),
		Role:         r_tech,
		Gender:       female,
		Position:     position,
	})

	db.Model(&User{}).Create(&User{
		Name:         "Admin",
		Email:        "admin",
		Phone_number: "0555555552",
		Password:     string(password),
		Role:         r_admin,
		Gender:       male,
		Position:     position,
	})

	var user User
	db.Raw("SELECT * FROM users WHERE email = ?", "test").Scan(&user)

	db.Model(&Building{}).Create(&Building{Name: "ตึกA"})
	db.Model(&Building{}).Create(&Building{Name: "ตึกB"})

	var buildingA, buildingB Building
	db.Raw("SELECT * FROM buildings WHERE name = ?", "ตึกA").Scan(&buildingA)
	db.Raw("SELECT * FROM buildings WHERE name = ?", "ตึกB").Scan(&buildingB)

	db.Model(&Room{}).Create(&Room{Name: "ห้องA", Building: buildingA})
	db.Model(&Room{}).Create(&Room{Name: "ห้องB", Building: buildingB})
	db.Model(&Room{}).Create(&Room{Name: "ห้องA1", Building: buildingA})
	db.Model(&Room{}).Create(&Room{Name: "ห้องB1", Building: buildingB})

	var roomA, roomB Room
	db.Raw("SELECT * FROM rooms WHERE name = ?", "ห้องA").Scan(&roomA)
	db.Raw("SELECT * FROM rooms WHERE name = ?", "ห้องB").Scan(&roomB)

	db.Model(&JobType{}).Create(&JobType{Name: "ซ่อมคอม"})
	db.Model(&JobType{}).Create(&JobType{Name: "ซ่อมรถ"})

	var brandA, brandB Brand
	db.Raw("SELECT * FROM brands WHERE name = ?", "Brand A").Scan(&brandA)
	db.Raw("SELECT * FROM brands WHERE name = ?", "Brand B").Scan(&brandB)

	var typeA, typeB Type
	db.Raw("SELECT * FROM types WHERE name = ?", "คอม").Scan(&typeA)
	db.Raw("SELECT * FROM types WHERE name = ?", "notebook").Scan(&typeB)

	var distributoreA, distributoreB Distributor
	db.Raw("SELECT * FROM Distributors WHERE name = ?", "ร้านA").Scan(&distributoreA)
	db.Raw("SELECT * FROM Distributors WHERE name = ?", "ร้านB").Scan(&distributoreB)

	db.Model(&Device{}).Create(&Device{
		Brand:       brandA,
		Type:        typeA,
		Distributor: distributoreA,
	})
	db.Model(&Device{}).Create(&Device{
		Brand:       brandB,
		Type:        typeA,
		Distributor: distributoreA,
	})
	db.Model(&Device{}).Create(&Device{
		Brand:       brandA,
		Type:        typeB,
		Distributor: distributoreA,
	})
	db.Model(&Device{}).Create(&Device{
		Brand:       brandA,
		Type:        typeA,
		Distributor: distributoreB,
	})

	var deviceA, deviceB, deviceA1 Device
	db.Raw("SELECT * FROM devices WHERE id = ?", "1").Scan(&deviceA)
	db.Raw("SELECT * FROM devices WHERE id = ?", "2").Scan(&deviceB)
	db.Raw("SELECT * FROM devices WHERE id = ?", "3").Scan(&deviceA1)

	db.Model(&Room_has_Device{}).Create(&Room_has_Device{
		User:   user,
		Device: deviceA,
		Room:   roomA,
	})
	db.Model(&Room_has_Device{}).Create(&Room_has_Device{
		User:   user,
		Device: deviceB,
		Room:   roomA,
	})
	db.Model(&Room_has_Device{}).Create(&Room_has_Device{
		User:   user,
		Device: deviceA1,
		Room:   roomB,
	})

	// มีการ add ข้อมูล user RHD Device แค่นั้น (รวม Entityลูกด้วยนะ เช่น role Gender อะไรแบบนี้)
}
