# Proof of Concept: OAuth 2.0 and FAPI 2.0 Features with Keycloak

This project demonstrates the implementation of OAuth 2.0 and FAPI 2.0 features, including DPoP, using Keycloak.

## Prerequisites

Before you begin, ensure you have the following installed:

- Docker and Docker Compose
- Node.js (local runtime)

## How to Start

Follow these steps to set up and run the project:

1. **Configure Docker Compose**

   Open the `docker-compose.yaml` file and adjust the settings as required for your environment.

2. **Start Keycloak**

   Navigate to the Keycloak directory and start the service with Docker Compose:

   ```bash
   cd keycloak
   docker-compose up -d
   ```

3. **Configure Keycloak**

   Access the Keycloak web interface in your browser. Once there, configure the client settings and enable the DPoP mechanism as needed for your use case.

4. **Run Sample Client Code**

   Execute the sample client code to test the OAuth 2.0 and FAPI 2.0 functionalities.