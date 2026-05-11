package com.azadeh.skillmatch.auth.controller;

import com.azadeh.skillmatch.auth.dto.AuthResponse;
import com.azadeh.skillmatch.auth.dto.LoginRequest;
import com.azadeh.skillmatch.auth.dto.RegisterRequest;
import com.azadeh.skillmatch.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}