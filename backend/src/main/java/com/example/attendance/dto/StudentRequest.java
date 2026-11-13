package com.example.attendance.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record StudentRequest(
    @NotBlank @Size(max = 100) String name,
    @NotBlank @Size(max = 30) String rollNumber,
    @Size(max = 100) String className,
    @Email @Size(max = 120) String email
) {}
