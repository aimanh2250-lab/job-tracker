package com.aiman.jobtracker.service;

import com.aiman.jobtracker.dto.RegisterRequest;
import com.aiman.jobtracker.dto.UserResponse;
import com.aiman.jobtracker.entity.User;
import com.aiman.jobtracker.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse register(RegisterRequest request) {
        if (userRepository.findByEmail((request.email())).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This Email already exist and register");
        }
        String hash = passwordEncoder.encode(request.password());
        User saved = userRepository.save(new User(request.email(), hash));
        return new UserResponse(saved.getId() , saved.getEmail());
    }
}
