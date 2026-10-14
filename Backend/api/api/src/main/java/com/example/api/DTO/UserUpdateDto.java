package com.example.api.DTO;

import lombok.Data;

@Data
public class UserUpdateDto {
    private String oldEmail;
    private String oldPassword;
    private String newEmail;
    private String newPassword;
}