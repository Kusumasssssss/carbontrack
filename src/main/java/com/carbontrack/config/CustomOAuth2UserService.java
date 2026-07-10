package com.carbontrack.config;

import com.carbontrack.entity.AuthProvider;
import com.carbontrack.entity.User;
import com.carbontrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        AuthProvider authProvider = registrationId.equalsIgnoreCase("github") ? AuthProvider.GITHUB : AuthProvider.GOOGLE;

        String email = oAuth2User.getAttribute("email");
        if (email == null && authProvider == AuthProvider.GITHUB) {
            String login = oAuth2User.getAttribute("login");
            if (login != null) {
                email = login + "@github.com";
            }
        }

        if (email == null) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        String name = oAuth2User.getAttribute("name");

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User existingUser = userOptional.get();
            boolean changed = false;
            if (!existingUser.getAuthProvider().equals(authProvider)) {
                existingUser.setAuthProvider(authProvider);
                changed = true;
            }
            if (name != null && (existingUser.getFullName() == null || existingUser.getFullName().trim().isEmpty())) {
                existingUser.setFullName(name);
                changed = true;
            }
            if (changed) {
                userRepository.save(existingUser);
            }
        } else {
            // Register new user
            User newUser = User.builder()
                    .email(email)
                    .username(email.split("@")[0] + "_" + System.currentTimeMillis()) 
                    .fullName(name)
                    .authProvider(authProvider)
                    .role("USER")
                    .build();
            userRepository.save(newUser);
        }

        return oAuth2User;
    }
}
