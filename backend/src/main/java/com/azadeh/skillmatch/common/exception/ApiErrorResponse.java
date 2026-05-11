package com.azadeh.skillmatch.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ApiErrorResponse {

    private int status;

    private String message;

    private String path;

    private LocalDateTime timestamp;
}