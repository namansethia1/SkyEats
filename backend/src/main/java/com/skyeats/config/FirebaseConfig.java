package com.skyeats.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.project-id}")
    private String projectId;

    @Value("${FIREBASE_CREDENTIALS_BASE64:}")
    private String firebaseCredentialsBase64;

    @Value("${firebase.service-account-path:}")
    private String serviceAccountPath;

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            System.out.println("Initializing Firebase for project: " + projectId);
            
            GoogleCredentials credentials = getCredentials();
            
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(credentials)
                    .setProjectId(projectId)
                    .build();

            FirebaseApp app = FirebaseApp.initializeApp(options);
            System.out.println("Firebase initialized successfully for project: " + projectId);
            return app;
        }
        return FirebaseApp.getInstance();
    }

    @Bean
    public FirebaseAuth firebaseAuth(FirebaseApp firebaseApp) {
        return FirebaseAuth.getInstance(firebaseApp);
    }

    @Bean
    public com.google.cloud.firestore.Firestore firestore(FirebaseApp firebaseApp) {
        return com.google.firebase.cloud.FirestoreClient.getFirestore(firebaseApp);
    }

    private GoogleCredentials getCredentials() throws IOException {
        // Priority 1: Base64 encoded service account key from environment variable (for Render)
        if (firebaseCredentialsBase64 != null && !firebaseCredentialsBase64.trim().isEmpty()) {
            System.out.println("Loading Firebase credentials from Base64 environment variable");
            try {
                byte[] decodedCredentials = Base64.getDecoder().decode(firebaseCredentialsBase64);
                try (InputStream serviceAccount = new ByteArrayInputStream(decodedCredentials)) {
                    return GoogleCredentials.fromStream(serviceAccount);
                }
            } catch (Exception e) {
                System.err.println("Failed to decode Base64 credentials: " + e.getMessage());
                throw new IOException("Invalid Base64 Firebase credentials", e);
            }
        }
        
        // Priority 2: Service account file from classpath
        if (serviceAccountPath != null && !serviceAccountPath.trim().isEmpty()) {
            System.out.println("Loading Firebase credentials from file: " + serviceAccountPath);
            try {
                ClassPathResource resource = new ClassPathResource(serviceAccountPath);
                try (InputStream serviceAccount = resource.getInputStream()) {
                    return GoogleCredentials.fromStream(serviceAccount);
                }
            } catch (Exception e) {
                System.err.println("Failed to load service account from classpath: " + e.getMessage());
            }
        }
        
        // Priority 3: Default credentials (for local development with gcloud CLI)
        try {
            System.out.println("Attempting to use default Google credentials");
            return GoogleCredentials.getApplicationDefault();
        } catch (Exception e) {
            System.err.println("Failed to load default credentials: " + e.getMessage());
        }
        
        // Fallback: This will fail, but provides clear error message
        throw new IOException("Firebase credentials not found. Please set FIREBASE_CREDENTIALS_BASE64 environment variable or configure firebase.service-account-path property.");
    }
}