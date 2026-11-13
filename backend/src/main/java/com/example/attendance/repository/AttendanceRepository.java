package com.example.attendance.repository;

import com.example.attendance.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {\n    void deleteByStudentId(Long studentId);
    List<Attendance> findByAttendanceDate(LocalDate date);
    List<Attendance> findByStudentIdAndAttendanceDateBetween(Long studentId, LocalDate from, LocalDate to);
    Optional<Attendance> findByStudentIdAndAttendanceDate(Long studentId, LocalDate date);
    long countByStudentIdAndStatusAndAttendanceDateBetween(Long studentId, com.example.attendance.model.AttendanceStatus status, LocalDate from, LocalDate to);
    long countByStudentIdAndAttendanceDateBetween(Long studentId, LocalDate from, LocalDate to);
}
