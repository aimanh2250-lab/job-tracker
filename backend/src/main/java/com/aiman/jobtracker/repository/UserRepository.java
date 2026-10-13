package com.aiman.jobtracker.repository; //save and loads from database and send data to service

import com.aiman.jobtracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}
