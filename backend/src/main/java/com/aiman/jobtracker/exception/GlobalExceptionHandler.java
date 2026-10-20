package com.aiman.jobtracker.exception; //Catches errors from all controllers

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException; //catch broken bodies
import org.springframework.web.bind.MethodArgumentNotValidException; //the error @Valid thros when a rule fails
import org.springframework.web.bind.annotation.ExceptionHandler; //when this error "  " happend, run this method
import org.springframework.web.bind.annotation.RestControllerAdvice; //watch all controllers for errors
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException; //catch wrong value
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.server.ResponseStatusException;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler (ResponseStatusException.class)
    public ProblemDetail handleStatus (ResponseStatusException ex){
        return ProblemDetail.forStatusAndDetail(ex.getStatusCode(), ex.getReason()); //getStatusCode number (404) & getReason (message)
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Some fields are not valid");
        Map<String, String> errors = new HashMap<>(); //Map<String, String> : field -> message. new HashMap<>() :make it empty
        ex.getBindingResult().getFieldErrors() //each wrong field, add a row: its name and its message
                .forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
        problem.setProperty("errors", errors); //adds that list to the answer
        return problem;
    }
    @ExceptionHandler (HttpMessageNotReadableException.class)
    public ProblemDetail handleBadBody (HttpMessageNotReadableException ex){
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Request body is missing or not valid");
    }
    @ExceptionHandler (MethodArgumentTypeMismatchException.class)
    public ProblemDetail handleBadParam (MethodArgumentTypeMismatchException ex){
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Invalid value for " + ex.getName()); //+ : join these two text together
    }
    @ExceptionHandler (MaxUploadSizeExceededException.class)
    public ProblemDetail handleTooBig (MaxUploadSizeExceededException ex){
        return ProblemDetail.forStatusAndDetail(HttpStatus.CONTENT_TOO_LARGE, "File is too large (max 5 MB)");
    }

}
