package com.aiman.jobtracker.dto; //handles what goes in and out between browser and app

import com.aiman.jobtracker.entity.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record JobRequest( //Rule : @Notblank and etc must be inside bracket for record
        @NotBlank String company,
        @NotBlank String role,
        @NotNull LocalDate appliedDate,
        @NotNull Status status,
        @Size(max = 2000) String notes
) {

}
