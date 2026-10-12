package com.aiman.jobtracker.controller;

import com.aiman.jobtracker.dto.LoginRequest;
import com.aiman.jobtracker.dto.LoginResponse;
import com.aiman.jobtracker.dto.RegisterRequest;
import com.aiman.jobtracker.dto.UserResponse;
import com.aiman.jobtracker.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register (@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login (@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
