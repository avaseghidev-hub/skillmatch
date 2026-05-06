package com.azadeh.skillmatch.user.controller;

import com.azadeh.skillmatch.user.dto.CreateUserRequest;
import com.azadeh.skillmatch.user.dto.UserResponse;
import com.azadeh.skillmatch.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Create a new user
    @PostMapping
    public UserResponse createUser(@Valid @RequestBody CreateUserRequest request) {
        return userService.createUser(request);
    }

    // Get all users
    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

}