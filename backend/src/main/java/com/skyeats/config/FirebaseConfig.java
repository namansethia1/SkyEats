package com.skyeats.config;

import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.project-id}")
    private String projectId;

    @PostConstruct
    public void initialize() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                System.out.println("Initializing Firebase for project: " + projectId);
                
                // Initialize Firebase with just project ID
                // No credentials needed - frontend handles authentication directly
                FirebaseOptions options = FirebaseOptions.builder()
                        .setProjectId(projectId)
                        .build();

                FirebaseApp.initializeApp(options);
                System.out.println("Firebase initialized successfully for project: " + projectId);
            }
        } catch (Exception e) {
            System.err.println("Failed to initialize Firebase: " + e.getMessage());
            System.err.println("Note: Backend token verification will be disabled");
            System.err.println("Frontend handles email/password authentication directly");
        }
    }

    @Bean
    public FirebaseAuth firebaseAuth() {
        try {
            return FirebaseAuth.getInstance();
        } catch (Exception e) {
            System.err.println("Firebase Auth not available: " + e.getMessage());
            return null;
        }
    }

    @Bean
    public com.google.cloud.firestore.Firestore firestore() {
        try {
            return com.google.firebase.cloud.FirestoreClient.getFirestore();
        } catch (Exception e) {
            System.err.println("Firestore not available: " + e.getMessage());
            return null;
        }
    }
}