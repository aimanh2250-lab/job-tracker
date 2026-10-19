package com.aiman.jobtracker.service;

import com.aiman.jobtracker.entity.User;
import com.aiman.jobtracker.repository.JobRepository;
import com.aiman.jobtracker.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JobServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JobRepository jobRepository;

    @InjectMocks
    private JobService jobService;

    @Test
    void getOneHidesOtherUsersJob() {
        User userB = new User("b@test.com", "hash");
        when(userRepository.findByEmail("b@test.com")).thenReturn(Optional.of(userB));
        when(jobRepository.findByIdAndUser(1L, userB)).thenReturn(Optional.empty());
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> jobService.getOne("b@test.com", 1L));
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    }
}