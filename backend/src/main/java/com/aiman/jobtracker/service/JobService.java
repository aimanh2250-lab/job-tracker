package com.aiman.jobtracker.service; //does the real work after controller reads token inc rules and check the owner

import com.aiman.jobtracker.dto.JobRequest;
import com.aiman.jobtracker.dto.JobResponse;
import com.aiman.jobtracker.entity.JobApplication;
import com.aiman.jobtracker.entity.Status;
import com.aiman.jobtracker.entity.User;
import com.aiman.jobtracker.repository.JobRepository;
import com.aiman.jobtracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class JobService {
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    @Value("${app.upload-dir}")
    private String uploadDir;

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
    public Page<JobResponse> list(String email, String q, Status status, Pageable pageable){ //my job
        User user = findUser(email);
        if (q == null){
            q = ""; //empty search parameter arrive as null. PostgreSQL can't apply lower() to a null of unknown type. so turn into empty string
        }
        return jobRepository.search(user, status, q, pageable).map(job -> toResponse(job));
    }
    public JobResponse getOne(String email, Long id){ //view one job
        User user = findUser(email);
        JobApplication jobApplication = jobRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
        return toResponse(jobApplication);
    }
    public JobResponse update(String email, Long id, JobRequest request) { //CRUD -> Edit method
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
    public void delete(String email, Long id){//CRUD -> Delete method
        User user = findUser(email);
        JobApplication jobApplication = jobRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
        jobRepository.delete(jobApplication);
    }

    public void setUploadDir(String uploadDir) {
        this.uploadDir = uploadDir;
    }

    public JobResponse uploadResume(String email, Long id, MultipartFile file) throws IOException {
        User user = findUser(email);
        JobApplication jobApplication = jobRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
        List<String> allowed = List.of("application/pdf","application/vnd.openxmlformats-officedocument.wordprocessingml.document"); //docx type
        if (file.isEmpty() || !allowed.contains(file.getContentType())) {  //|| : OR
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only PDF or DOCX files are allowed");
        }
        Path dir = Paths.get(uploadDir).toAbsolutePath();
        Files.createDirectories(dir);
        String name = UUID.randomUUID() + (file.getContentType().equals("application/pdf") ? ".pdf" : ".docx");
        Files.copy(file.getInputStream(), dir.resolve(name), StandardCopyOption.REPLACE_EXISTING);
        jobApplication.setResumePath(name);
        return toResponse(jobRepository.save(jobApplication));
    }

    public Path getResume(String email , Long id) {
        User user = findUser(email);
        JobApplication jobApplication = jobRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
        if (jobApplication.getResumePath() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No resume uploaded");
        }
        return Paths.get(uploadDir).toAbsolutePath().resolve(jobApplication.getResumePath());
    }
}
