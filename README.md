<h1 align="center">NODEJS-HW-07</h1>

<p align="center">Comprehensive API Documentation with Swagger/OpenAPI</p>

<p align="center">
  <!-- Dynamic badges - You may need to customize these for your specific GitHub repository -->
  <img src="https://img.shields.io/github/last-commit/emrealtnts0/nodejs-hw-07?color=blue&label=last%20commit" alt="Last Commit">
  <img src="https://img.shields.io/github/languages/top/emrealtnts0/nodejs-hw-07?color=orange&label=JavaScript" alt="JavaScript Percentage">
  <img src="https://img.shields.io/github/languages/count/emrealtnts0/nodejs-hw-07?color=green&label=languages" alt="Languages Count">
</p>

<p align="center">Built with the tools and technologies for API Documentation:</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm">
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger">
  <img src="https://img.shields.io/badge/OpenAPI-6BA53B?style=for-the-badge&logo=openapi&logoColor=white" alt="OpenAPI">
  <img src="https://img.shields.io/badge/ReDocly-FF5252?style=for-the-badge&logo=redocly&logoColor=white" alt="ReDocly">
  <img src="https://img.shields.io/badge/YAML-CB171E?style=for-the-badge&logo=yaml&logoColor=white" alt="YAML">
</p>

## Project Overview

This repository demonstrates the implementation of comprehensive API documentation for a Node.js Express application using Swagger/OpenAPI. The primary goal is to provide well-structured, interactive, and informative documentation to enhance API clarity and usability.

## Key Features & Implementations

This project includes the following key aspects of API documentation:

*   **Basic Swagger/OpenAPI Configuration**: Essential settings for API documentation.
*   **Documentation Generation with `@redocly/cli`**: Tools for building and previewing API docs.
*   **Organized Documentation Structure**: A systematic approach to organizing API endpoint definitions and components.
*   **Endpoint Documentation**: Detailed documentation for various API endpoints, including parameters, responses, and security.
*   **Swagger UI Integration**: Serving interactive API documentation via a dedicated route (`/api-docs`).
*   **Error-Free Documentation Scripts**: Ensuring smooth execution of documentation-related commands.
*   **Adherence to File Structure**: Following a well-defined application file structure for documentation.

## Getting Started: API Documentation

To work with or generate the API documentation, follow these steps:

### 1. Setup the Documentation Environment

1.  **Install `@redocly/cli`**: Install as a development dependency.
    ```bash
    npm install @redocly/cli --save-dev
    ```
2.  **Configure `package.json` Scripts**: Add the following commands to your `package.json` file.
    ```json
    {
      "scripts": {
        "build": "npm run build-docs",
        "build-docs": "redocly bundle --ext json -o docs/swagger.json",
        "preview-docs": "redocly preview-docs"
      }
    }
    ```
3.  **Create `redocly.yaml`**: Create this file in your project root with the following configuration.
    ```yaml
    # See <https://redocly.com/docs/cli/configuration/> for more information.
    apis:
      sample@v1:
        root: docs/openapi.yaml
    extends:
      - recommended
    rules:
      no-unused-components: error
    theme:
      htmlTemplate: ./docs/index.html
      colors:
        primary:
          main: '#32329f'
      generateCodeSamples:
        languages:
          - lang: curl
          - lang: Node.js
          - lang: JavaScript
    ```
4.  **Setup `docs` Folder**: Create a `docs` folder in the project root, and inside it, create `index.html`.
    ```html
    <!DOCTYPE html>
    <html>

    <head>
      <meta charset="utf-8">
      <title>API Reference | ReDoc</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="icon" type="image/png" href="favicon.png">
      <style>
        body {
          margin: 0;
          padding: 0;
        }
      </style>
      {{{redocHead}}}
    </head>

    <body>
      {{{redocHTML}}}
    </body>

    </html>
    ```
5.  **Initialize `docs/openapi.yaml`**: Create this file with the base OpenAPI specification.
    ```yaml
    openapi: 3.1.0
    info:
      version: 1.0.0
      title: <your_application_name>
      license:
        name: Apache 2.0
        url: http://www.apache.org/licenses/LICENSE-2.0.html
      description: >
        <your_application_description>
    tags:
      # tags you will use
    servers:
      - url: http://localhost:3000
      - url: #link_to_deployed_site
    paths:
      # endpoint links will be here
    components:
      securitySchemes:
        bearerAuth:
          type: http
          scheme: bearer
    ```
    You can preview your documentation locally by running: `npm run preview-docs`

### 2. Documentation Structure

API endpoint and component definitions are organized within a `swagger` folder:

```
swagger/
├── components/           # Reusable components (schemas, responses)
└── paths/               # API endpoint definitions
    ├── contacts/           # Example: Contact related endpoints
    │   ├── get.yaml     # GET /contacts
    │   ├── post.yaml    # POST /contacts
    │   └── {id}/
    │       ├── get.yaml # GET /contacts/:id
    │       ├── patch.yaml # PATCH /contacts/:id
    │       └── delete.yaml # DELETE /contacts/:id
    └── auth/               # Example: Authentication related endpoints
        ├── register.yaml # POST /auth/register
        ├── login.yaml    # POST /auth/login
        └── logout.yaml   # POST /auth/logout
```

### 3. Documenting API Endpoints

To add documentation for an API endpoint, create a corresponding YAML file in the `swagger/paths/` directory based on the path structure. For example, for the `GET /contacts/:contactId` route, the file would be `/swagger/paths/contacts/{id}/get.yaml`.

Each endpoint documentation should include:

*   `tags` — The tag this endpoint belongs to (e.g., `Contacts`).
*   `summary` — A brief description of the endpoint.
*   `operationId` — A unique identifier for the operation.
*   `description` — A more detailed explanation.
*   `security` — Authentication details (e.g., `Bearer token` for `bearerAuth`).
*   `parameters` — Request parameters (path, query, header, cookie).
*   `responses` — Possible responses (e.g., 200 Successful, 404 Not Found).

**Example Endpoint Definition:**

```yaml
tags:
  - Contacts
summary: Get contact by ID
operationId: getContactById
description: Retrieve a specific contact by its unique identifier
security:
  - bearerAuth: []
parameters:
  - name: contactId
    in: path
    required: true
    schema:
      type: string
    description: Contact unique identifier
responses:
  '200':
    description: Contact found successfully
    content:
      application/json:
        schema:
          $ref: '../components/schemas/Contact'
  '404':
    description: Contact not found
    content:
      application/json:
        schema:
          $ref: '../components/schemas/Error'
```

Document the following endpoints using this principle:

*   `GET /contacts` (including query parameters for pagination, limit, and favorite status)
*   `PATCH /contacts/:contactId`
*   `DELETE /contacts/:contactId`
*   `POST /contacts` (including body descriptions for requests)
*   **(Optional)** Authentication endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/send-reset-email`, `POST /api/auth/reset-pwd`, `POST /api/auth/logout`.

### 4. Accessing Interactive Documentation

Integrate Swagger UI to display the documentation. A dedicated route `/api-docs` should be added to your application to serve the interactive documentation.


