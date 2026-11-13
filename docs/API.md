# REST API

Base URL: `http://localhost:8080/api`

## Students

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/students` | List students |
| GET | `/students/{id}` | Get one student |
| POST | `/students` | Create student |
| PUT | `/students/{id}` | Update student |
| DELETE | `/students/{id}` | Delete student |

Create/update request:
```json
{
  "name": "Asha Rao",
  "rollNumber": "STU001",
  "className": "Java Batch A",
  "email": "asha@example.com"
}
```

## Attendance

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/attendance` | Mark or update a student's attendance |
| GET | `/attendance?date=2026-11-13` | List attendance for a date |
| GET | `/attendance/summary?studentId=1&year=2026&month=11` | Monthly summary |

Mark attendance request:
```json
{
  "studentId": 1,
  "attendanceDate": "2026-11-13",
  "status": "PRESENT"
}
```

A second POST for the same student and date updates the existing record rather than creating a duplicate.

## Notes
- Dates use ISO format `YYYY-MM-DD`.
- Status must be `PRESENT` or `ABSENT`.
- Validation errors return HTTP 400 with an `error` message.
- This learning project does not yet include login/roles; add authentication before production use.
