package com.aiman.jobtracker.service;

import com.aiman.jobtracker.dto.LoginRequest;
import com.aiman.jobtracker.dto.RegisterRequest;
import com.aiman.jobtracker.entity.User;
import com.aiman.jobtracker.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private TokenService tokenService;

    @InjectMocks
    private AuthService authService;

    @Test
    void registerRejectsTakenEmail() {
        when(userRepository.findByEmail("a@test.com")).thenReturn(Optional.of(new User("a@test.com", "hash")));
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> authService.register(new RegisterRequest("a@test.com", "password123")));
        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
    }

    @Test
    void loginRejectsWrongPassword() {
        when(userRepository.findByEmail("a@test.com")).thenReturn(Optional.of(new User("a@test.com", "hash")));
        when(passwordEncoder.matches("wrong password", "hash")).thenReturn(false);
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> authService.login(new LoginRequest("a@test.com", "wrong password")));
        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatusCode());
    }
}


