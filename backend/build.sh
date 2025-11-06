#!/bin/bash

# Make mvnw executable
chmod +x ./mvnw

# Build the application
./mvnw clean package -DskipTests -Pprod