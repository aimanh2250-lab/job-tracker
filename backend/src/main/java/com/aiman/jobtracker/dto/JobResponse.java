package com.aiman.jobtracker.dto; //handles what goes in and out between browser and app

import com.aiman.jobtracker.entity.Status;
import java.time.Instant;
import java.time.LocalDate;

public record JobResponse(
        Long id,
        String company,
        String role,
        LocalDate appliedDate,
        Status status,
        String notes,
        Instant createdAt,
        boolean hasResume
) {
}
