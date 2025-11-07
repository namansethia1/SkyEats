# Multi-stage build for smaller final image
FROM eclipse-temurin:17-jdk-jammy AS builder

# Set working directory
WORKDIR /app

# Copy Maven wrapper and pom.xml first for better caching
COPY backend/.mvn/ .mvn/
COPY backend/mvnw backend/mvnw.cmd backend/pom.xml ./

# Make mvnw executable
RUN chmod +x ./mvnw

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY backend/src ./src

# Build the application
RUN ./mvnw clean package -DskipTests -Pprod

# Runtime stage with smaller JRE image
FROM eclipse-temurin:17-jre-jammy

# Set working directory
WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /app/target/skyeats-backend-0.0.1-SNAPSHOT.jar app.jar

# Create non-root user for security
RUN groupadd -r spring && useradd -r -g spring spring
RUN chown spring:spring app.jar
USER spring

# Expose port
EXPOSE 8080

# Set active profile to production
ENV SPRING_PROFILES_ACTIVE=prod

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]