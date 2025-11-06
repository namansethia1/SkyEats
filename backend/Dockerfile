# Use OpenJDK 17 as base image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY .mvn/ .mvn/
COPY mvnw mvnw.cmd pom.xml ./

# Make mvnw executable (for Unix systems)
RUN chmod +x ./mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests -Pprod

# Expose port
EXPOSE 8080

# Set active profile to production
ENV SPRING_PROFILES_ACTIVE=prod

# Run the application
CMD ["java", "-jar", "target/skyeats-backend-0.0.1-SNAPSHOT.jar"]