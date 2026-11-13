package com.example.attendance.dto;

import com.example.attendance.model.AttendanceStatus;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record AttendanceRequest(
    @NotNull Long studentId,
    @NotNull LocalDate attendanceDate,
    @NotNull AttendanceStatus status
) {}
