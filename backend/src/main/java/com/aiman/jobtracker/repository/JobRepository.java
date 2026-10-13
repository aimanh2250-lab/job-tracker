package com.aiman.jobtracker.repository; //save and loads from database and send data to service

import com.aiman.jobtracker.entity.JobApplication;
import com.aiman.jobtracker.entity.Status;
import com.aiman.jobtracker.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface JobRepository extends JpaRepository <JobApplication,Long> {
    Optional<JobApplication> findByIdAndUser(Long id, User user);//stop user b to read user a jobs
    @Query("""
    select b from JobApplication b
    where b.user = :user
      and (:status is null or b.status = :status)
      and (lower(b.company) like lower(concat('%', :text, '%'))
           or lower(b.role) like lower(concat('%', :text, '%')))
    """)
    Page<JobApplication> search(@Param("user") User user, @Param("status") Status status,
                      @Param("text") String text, Pageable pageable);


}
