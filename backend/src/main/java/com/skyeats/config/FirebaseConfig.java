package com.skyeats.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.project-id}")
    private String projectId;

    @PostConstruct
    public void initialize() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                System.out.println("Initializing Firebase for project: " + projectId);
                
                // For email/password authentication, we can initialize with minimal config
                // The Firebase client SDK handles authentication, backend just verifies tokens
                FirebaseOptions options = FirebaseOptions.builder()
                        .setProjectId(projectId)
                        .build();

                FirebaseApp.initializeApp(options);
                System.out.println("Firebase initialized successfully for project: " + projectId);
            }
        } catch (Exception e) {
            System.err.println("Failed to initialize Firebase: " + e.getMessage());
            System.err.println("Note: This is expected if no Firebase credentials are configured");
            System.err.println("For email/password auth, the frontend handles authentication directly");
            // Don't throw exception - let the app start without Firebase Admin SDK
            System.out.println("Continuing without Firebase Admin SDK - token verification will be disabled");
        }
    }

    @Bean
    public FirebaseAuth firebaseAuth() {
        try {
            return FirebaseAuth.getInstance();
        } catch (Exception e) {
            System.err.println("Firebase Auth not available: " + e.getMessage());
            return null; // Return null if Firebase is not properly configured
        }
    }
}