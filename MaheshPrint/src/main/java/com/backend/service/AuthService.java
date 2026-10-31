
package com.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Value("${quickprint.admin.username}")
    private String adminUsername;

    @Value("${quickprint.admin.password}")
    private String adminPassword;

    public boolean login(String username, String password) {

        if (username == null || password == null) {
            return false;
        }

        return adminUsername.equals(username)
                && adminPassword.equals(password);
    }
}
