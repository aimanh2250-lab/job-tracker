package com.aiman.jobtracker.controller; //handles the web part : reads token from browser after user login and sends answer + stat code

import com.aiman.jobtracker.dto.JobRequest;
import com.aiman.jobtracker.dto.JobResponse;
import com.aiman.jobtracker.entity.Status;
import com.aiman.jobtracker.service.JobService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
public class JobController {
    private final JobService jobService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED) //Create Method
    public JobResponse create (@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody JobRequest request) { //Valid : stop automatic constrains
        return jobService.create(jwt.getSubject() , request);           //Requestbody: body (JSON Form)
    }

    @GetMapping //List Method means open page cna see all the application
    public Page<JobResponse> list (@AuthenticationPrincipal Jwt jwt, @RequestParam(required = false) String q, @RequestParam(required = false) Status status, @PageableDefault(size = 10, sort = "appliedDate", direction = Sort.Direction.DESC) Pageable pageable) {
        return jobService.list(jwt.getSubject(), q, status, pageable); //Req Param : reads the extra settings after the ? in an address
    }                                                                  //eg:/api/jobs(dish)?q=grab&status=APPLIED(extra wish)

    @GetMapping("/{id}") //get one method means to see the job details
    public JobResponse getOne (@AuthenticationPrincipal Jwt jwt, @PathVariable Long id){ //AuthenticationPrincipal:the token
        return jobService.getOne(jwt.getSubject(), id);
    }

    @PutMapping("/{id}") //update job method means to change status (Applied > Interview)
    public JobResponse update (@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody JobRequest request, @PathVariable Long id ){ //Path variable :inside the address path (/api/jobs/5)
        return jobService.update(jwt.getSubject(), id, request);
    }

    @DeleteMapping("/{id}") //delete job method
    @ResponseStatus (HttpStatus.NO_CONTENT)
    public void delete (@AuthenticationPrincipal Jwt jwt, @PathVariable Long id){
        jobService.delete(jwt.getSubject(), id);
    }

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }
}

