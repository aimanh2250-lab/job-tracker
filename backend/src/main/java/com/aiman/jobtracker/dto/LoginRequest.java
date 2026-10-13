package com.aiman.jobtracker.dto; //handles what goes in and out between browser and app

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(@NotBlank String email, @NotBlank String password){
}

