package com.aiman.jobtracker.service; //does the real work after controller reads token inc rules and check the owner

import com.aiman.jobtracker.dto.LoginRequest;
import com.aiman.jobtracker.dto.LoginResponse;
import com.aiman.jobtracker.dto.RegisterRequest;
import com.aiman.jobtracker.dto.UserResponse;
import com.aiman.jobtracker.entity.User;
import com.aiman.jobtracker.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, TokenService tokenservice) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenservice;
    }

    public UserResponse register(RegisterRequest request) {
        if (userRepository.findByEmail((request.email())).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }
        String hash = passwordEncoder.encode(request.password());
        User saved = userRepository.save(new User(request.email(), hash)); // store only the BCrypt hash, never the plain password
        log.info("New user registered with id {}", saved.getId());
        return new UserResponse(saved.getId() , saved.getEmail());
    }
    public LoginResponse login(LoginRequest request) { //same message for unknown email and wrong password, so nobody can find out which emails exist
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            log.warn("Failed login attempt");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
        String token = tokenService.createToken(user.getEmail()); //make a token for this user email only
        return new LoginResponse(token);
    }
}
