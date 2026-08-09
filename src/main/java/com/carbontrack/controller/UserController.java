package com.carbontrack.controller;

import com.carbontrack.entity.User;
import com.carbontrack.service.UserService;
import com.carbontrack.service.AuthService;
import com.carbontrack.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import com.carbontrack.dto.UserPreferenceDto;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AuthService authService;
    private final UserRepository userRepository;

    public UserController(UserService userService, AuthService authService, UserRepository userRepository) {
        this.userService = userService;
        this.authService = authService;
        this.userRepository = userRepository;
    }

    // Get current user profile
    @GetMapping("/me")
    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user;
    }

    // Save User
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    // Get All Users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Update Preferences
    @PutMapping("/preferences")
    public User updatePreferences(@RequestBody UserPreferenceDto dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userService.updatePreferences(email, dto.getPreferredUnits(), dto.getGoalVisibility());
    }
}