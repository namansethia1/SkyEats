package com.skyeats.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.firestore.Firestore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Base64;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.credentials-path:}")
    private String credentialsPath;

    @Value("${firebase.credentials-json:}")
    private String credentialsJson;

    @Value("${firebase.project-id}")
    private String projectId;

    @PostConstruct
    public void initialize() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                GoogleCredentials credentials;
                
                // Check if we have base64 encoded JSON (for Render deployment)
                if (credentialsJson != null && !credentialsJson.trim().isEmpty()) {
                    System.out.println("Using base64 encoded Firebase credentials");
                    byte[] decodedBytes = Base64.getDecoder().decode(credentialsJson);
                    ByteArrayInputStream credentialsStream = new ByteArrayInputStream(decodedBytes);
                    credentials = GoogleCredentials.fromStream(credentialsStream);
                } 
                // Otherwise use file path (for local development)
                else if (credentialsPath != null && !credentialsPath.trim().isEmpty()) {
                    System.out.println("Using Firebase credentials from file: " + credentialsPath);
                    FileInputStream serviceAccount = new FileInputStream(credentialsPath);
                    credentials = GoogleCredentials.fromStream(serviceAccount);
                } 
                // Try to use default credentials (for Google Cloud deployment)
                else {
                    System.out.println("Using default Firebase credentials");
                    credentials = GoogleCredentials.getApplicationDefault();
                }
                
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(credentials)
                        .setProjectId(projectId)
                        .build();

                FirebaseApp.initializeApp(options);
                System.out.println("Firebase initialized successfully for project: " + projectId);
            }
        } catch (Exception e) {
            System.err.println("Failed to initialize Firebase: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to initialize Firebase", e);
        }
    }

    @Bean
    public FirebaseAuth firebaseAuth() {
        return FirebaseAuth.getInstance();
    }

    @Bean
    public Firestore firestore() {
        return FirestoreClient.getFirestore();
    }
}