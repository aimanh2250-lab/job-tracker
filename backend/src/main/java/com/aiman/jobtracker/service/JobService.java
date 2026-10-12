package com.aiman.jobtracker.service;

import com.aiman.jobtracker.dto.JobRequest;
import com.aiman.jobtracker.dto.JobResponse;
import com.aiman.jobtracker.entity.JobApplication;
import com.aiman.jobtracker.entity.User;
import com.aiman.jobtracker.repository.JobRepository;
import com.aiman.jobtracker.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.domain.Pageable;

@Service
public class JobService {
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobService(JobRepository jobRepository, UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }
    private JobResponse toResponse(JobApplication job){
        return new JobResponse(
                job.getId(),
                job.getCompany(),
                job.getRole(),
                job.getAppliedDate(),
                job.getStatus(),
                job.getNotes(),
                job.getCreatedAt()
        );
    }
    private User findUser(String email){ //user deleted after their token was made. token still valid but user gone. so 401
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }
    public JobResponse create(String email, JobRequest request){ //CRUD -> Create method
         User user = findUser(email); //who is calling
         JobApplication job = new JobApplication(request.company(), request.role()); //a new job with comp + role
         job.setAppliedDate(request.appliedDate());
         job.setStatus(request.status());
         job.setNotes(request.notes());
         job.setUser(user); //the user
         JobApplication saved = jobRepository.save(job); //save it
         return toResponse(saved); //send it back Data transfer obj
    }
    public Page<JobResponse> list(String email, Pageable pageable){ //my job
        User user = findUser(email);
        return jobRepository.findByUser(user, pageable).map(job -> toResponse(job));
    }
    public JobResponse getOne(String email, Long id){ //view one job
        User user = findUser(email);
        JobApplication jobApplication = jobRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
        return toResponse(jobApplication);
    }
    public JobResponse update(String email, Long id, JobRequest request) {
        User user = findUser(email);
        JobApplication jobApplication = jobRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
        jobApplication.setCompany(request.company());
        jobApplication.setRole(request.role());
        jobApplication.setAppliedDate(request.appliedDate());
        jobApplication.setStatus(request.status());
        jobApplication.setNotes(request.notes());
        return toResponse(jobRepository.save(jobApplication));
    }

}
