# Student Attendance Management System

A beginner-friendly full-stack mobile application to manage students and daily attendance.

## Features
- Add and list students
- Delete a student
- Mark a student Present or Absent for a selected date
- Update an existing attendance status for the same student/date
- View daily totals
- REST API monthly attendance summary

## Tech stack
- React Native + Expo (JavaScript)
- Java 17 + Spring Boot 3
- Spring Data JPA / Hibernate
- MySQL
- REST API

## Requirements
- Java 17+
- Maven 3.8+ (or use an IDE with Maven support)
- MySQL 8+
- Node.js LTS and npm
- Expo Go on a phone, or an iOS/Android simulator

## 1. Database
Create a MySQL database:
```sql
CREATE DATABASE student_attendance;
```
The backend uses `spring.jpa.hibernate.ddl-auto=update` to create tables. Alternatively, run `database/schema.sql` in MySQL.

Set your MySQL password in the environment before starting the backend:
```bash
export DB_USERNAME=root
export DB_PASSWORD='YOUR_MYSQL_PASSWORD'
```
Do not commit passwords to GitHub.

## 2. Start backend
```bash
cd backend
mvn spring-boot:run
```
API starts at `http://localhost:8080`.

Test:
```bash
curl http://localhost:8080/api/students
```

## 3. Configure and start frontend
Edit `frontend/src/services/api.js` and set `API_BASE_URL`:
- iOS simulator: `http://localhost:8080/api`
- Android emulator: `http://10.0.2.2:8080/api`
- Physical phone: `http://YOUR_MAC_LAN_IP:8080/api` (phone and Mac must be on same Wi-Fi)

Then:
```bash
cd frontend
npm install
npx expo start
```
Scan the QR code with Expo Go. For a physical phone, use your Mac's LAN IP in the API URL, not `localhost`.

## 4. First use
1. Add a student with a unique roll number.
2. Choose a date in `YYYY-MM-DD` format.
3. Tap `P` to mark Present or `A` to mark Absent.
4. Tap the same student's other status to update the record.
5. Delete a student using the × control.

## API documentation
See [docs/API.md](docs/API.md).

## Suggested future enhancements
- Teacher login and role-based access with Spring Security/JWT
- Edit student details
- Attendance calendar and monthly report screen
- Search/filter by class
- Export attendance to CSV/PDF
- Automated tests and deployment

## Project structure
- `backend/` Spring Boot REST API
- `frontend/` Expo React Native app
- `database/` MySQL schema
- `docs/` API documentation

## Important
This is a learning/portfolio starter, not a production-ready school system. Add authentication, authorization, audit logs, backups, and stricter CORS rules before real deployment.
