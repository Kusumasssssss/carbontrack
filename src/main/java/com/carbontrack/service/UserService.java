package com.carbontrack.service;

import com.carbontrack.entity.User;
import com.carbontrack.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updatePreferences(String email, String preferredUnits, String goalVisibility) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (preferredUnits != null) {
            user.setPreferredUnits(preferredUnits);
        }
        if (goalVisibility != null) {
            user.setGoalVisibility(goalVisibility);
        }
        
        return userRepository.save(user);
    }
}