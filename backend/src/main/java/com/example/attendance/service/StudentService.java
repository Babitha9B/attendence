package com.example.attendance.service;

import com.example.attendance.dto.StudentRequest;
import com.example.attendance.model.Student;
import com.example.attendance.repository.StudentRepository;\nimport com.example.attendance.repository.AttendanceRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StudentService {
    private final StudentRepository students;
    public StudentService(StudentRepository students) { this.students = students; }

    public List<Student> findAll() { return students.findAll(); }
    public Student findById(Long id) {
        return students.findById(id).orElseThrow(() -> new IllegalArgumentException("Student not found: " + id));
    }
    public Student create(StudentRequest request) {
        if (students.existsByRollNumber(request.rollNumber()))
            throw new IllegalArgumentException("Roll number already exists");
        return students.save(new Student(request.name(), request.rollNumber(), request.className(), request.email()));
    }
    public Student update(Long id, StudentRequest request) {
        Student s = findById(id);
        students.findByRollNumber(request.rollNumber()).filter(other -> !other.getId().equals(id))
                .ifPresent(other -> { throw new IllegalArgumentException("Roll number already exists"); });
        s.setName(request.name()); s.setRollNumber(request.rollNumber());
        s.setClassName(request.className()); s.setEmail(request.email());
        return students.save(s);
    }
    public void delete(Long id) {\n        Student student = findById(id);\n        attendance.deleteByStudentId(id);\n        students.delete(student);\n    }
}
