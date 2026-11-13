package com.example.attendance.service;

import com.example.attendance.dto.AttendanceRequest;
import com.example.attendance.model.*;
import com.example.attendance.repository.*;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;

@Service
public class AttendanceService {
    private final AttendanceRepository attendance;
    private final StudentRepository students;
    public AttendanceService(AttendanceRepository attendance, StudentRepository students) {
        this.attendance = attendance; this.students = students;
    }
    public Attendance mark(AttendanceRequest request) {
        Student student = students.findById(request.studentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found: " + request.studentId()));
        Attendance record = attendance.findByStudentIdAndAttendanceDate(student.getId(), request.attendanceDate())
                .orElse(new Attendance(student, request.attendanceDate(), request.status()));
        record.setStatus(request.status());
        return attendance.save(record);
    }
    public List<Attendance> byDate(LocalDate date) { return attendance.findByAttendanceDate(date); }
    public Map<String, Object> monthlySummary(Long studentId, int year, int month) {
        if (!students.existsById(studentId)) throw new IllegalArgumentException("Student not found: " + studentId);
        LocalDate from = LocalDate.of(year, month, 1);
        LocalDate to = from.withDayOfMonth(from.lengthOfMonth());
        long total = attendance.countByStudentIdAndAttendanceDateBetween(studentId, from, to);
        long present = attendance.countByStudentIdAndStatusAndAttendanceDateBetween(studentId, AttendanceStatus.PRESENT, from, to);
        double percentage = total == 0 ? 0.0 : Math.round((present * 1000.0 / total)) / 10.0;
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("studentId", studentId); result.put("year", year); result.put("month", month);
        result.put("totalMarkedDays", total); result.put("presentDays", present);
        result.put("absentDays", total - present); result.put("attendancePercentage", percentage);
        return result;
    }
}
