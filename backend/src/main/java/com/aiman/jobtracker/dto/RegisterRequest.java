package com.aiman.jobtracker.dto; //handles what goes in and out between browser and app

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Email String email, @NotBlank @Size(min = 8) String password)
{}

