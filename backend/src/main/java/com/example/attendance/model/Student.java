package com.example.attendance.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
public class Student {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100)
    private String name;
    @Column(nullable = false, unique = true, length = 30)
    private String rollNumber;
    @Column(length = 100)
    private String className;
    @Column(length = 120)
    private String email;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Student() {}
    public Student(String name, String rollNumber, String className, String email) {
        this.name = name; this.rollNumber = rollNumber; this.className = className; this.email = email;
    }
    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }
    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
