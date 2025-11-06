#!/bin/bash

# Set production profile
export SPRING_PROFILES_ACTIVE=prod

# Start the application
java -jar target/skyeats-backend-0.0.1-SNAPSHOT.jar