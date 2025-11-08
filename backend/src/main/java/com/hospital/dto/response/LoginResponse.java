package com.hospital.dto.response;

import com.hospital.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private UserRole role;
    private Long userId;
    private String userName;
}

