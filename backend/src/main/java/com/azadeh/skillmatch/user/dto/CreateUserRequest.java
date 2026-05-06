package com.azadeh.skillmatch.user.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class CreateUserRequest {

    private String name;
    private String email;
    @Size(min = 6)
    private String password;

   }