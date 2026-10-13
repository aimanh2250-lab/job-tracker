package com.aiman.jobtracker.entity; //one database table eg Job application class > job_application table

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "job_application")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    private Instant createdAt;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private LocalDate appliedDate;

    @Column(length = 2000)
    private String notes;
    private String resumePath;

    @ManyToOne(optional = false) //Many roles to one user !!!!
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING) //EnumType String shows "Applied" and else instead of default "Applied = 1"
    @Column(nullable = false)
    private Status status;

    public void setUser(User user) { //method to change a field (setCompany)
        this.user = user;
    }

    public void setStatus(Status status) { //method to change a field (setCompany)
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public Status getStatus() {
        return status;
    }

    protected JobApplication() {

    }

    public JobApplication (String company, String role) {
        this.company = company ;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public String getCompany() { //method to read a field (getCompany)
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setAppliedDate(LocalDate appliedDate) {
        this.appliedDate = appliedDate;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public void setResumePath(String resumePath) {
        this.resumePath = resumePath;
    }

    public String getRole() {
        return role;
    }

    public LocalDate getAppliedDate() {
        return appliedDate;
    }

    public String getNotes() {
        return notes;
    }

    public String getResumePath() {
        return resumePath;
    }
}