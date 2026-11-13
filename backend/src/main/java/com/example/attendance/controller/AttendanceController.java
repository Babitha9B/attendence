package com.example.attendance.controller;

import com.example.attendance.dto.AttendanceRequest;
import com.example.attendance.model.Attendance;
import com.example.attendance.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
    private final AttendanceService service;
    public AttendanceController(AttendanceService service) { this.service = service; }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Attendance mark(@Valid @RequestBody AttendanceRequest request) { return service.mark(request); }
    @GetMapping public List<Attendance> byDate(@RequestParam LocalDate date) { return service.byDate(date); }
    @GetMapping("/summary")
    public Map<String, Object> summary(@RequestParam Long studentId, @RequestParam int year, @RequestParam int month) {
        return service.monthlySummary(studentId, year, month);
    }
}
