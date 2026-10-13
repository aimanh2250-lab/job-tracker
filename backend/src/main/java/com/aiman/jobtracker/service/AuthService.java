package com.aiman.jobtracker.service; //does the real work after controller reads token inc rules and check the owner

import com.aiman.jobtracker.dto.LoginRequest;
import com.aiman.jobtracker.dto.LoginResponse;
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
    private final TokenService tokenService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, TokenService tokenservice) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenservice;
    }

    public UserResponse register(RegisterRequest request) {
        if (userRepository.findByEmail((request.email())).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This Email already exist and register");
        }
        String hash = passwordEncoder.encode(request.password());
        User saved = userRepository.save(new User(request.email(), hash)); // Why hash? easy part
        return new UserResponse(saved.getId() , saved.getEmail());
    }
    public LoginResponse login(LoginRequest request) { //email or password is incorrect. throw error
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password, Please try again !"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password, Please try again !");
        }
        String token = tokenService.createToken(user.getEmail()); //make a token for this user email only
        return new LoginResponse(token); //send it back
    }
}
