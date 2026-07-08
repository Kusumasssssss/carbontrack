package com.carbontrack.controller;

import com.carbontrack.entity.User;
import com.carbontrack.service.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import com.carbontrack.dto.UserPreferenceDto;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
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