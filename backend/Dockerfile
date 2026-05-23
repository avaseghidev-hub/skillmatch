# Use official Java 21 runtime image
FROM eclipse-temurin:21-jdk

# Set working directory inside container
WORKDIR /app

# Copy Maven wrapper and project files
COPY . .

# Make Maven wrapper executable
RUN chmod +x mvnw

# Build application without running tests
RUN ./mvnw clean package -DskipTests

# Expose backend port
EXPOSE 8080

# Run Spring Boot jar
CMD ["java", "-jar", "target/skillmatch-0.0.1-SNAPSHOT.jar"]