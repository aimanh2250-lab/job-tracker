package com.aiman.jobtracker.repository;

import com.aiman.jobtracker.entity.JobApplication;
import com.aiman.jobtracker.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JobRepository extends JpaRepository <JobApplication,Long> {
    Page<JobApplication> findByUser(User user , Pageable pageable);
    Optional<JobApplication> findByIdAndUser(Long id, User user);

}
