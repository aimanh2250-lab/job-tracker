FROM eclipse-temurin:21 AS build
WORKDIR /app
COPY . .
RUN ./mvnw -B package -DskipTests

FROM eclipse-temurin:21-jre
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]