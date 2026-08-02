<h1 align="center">NODEJS-HW-04</h1>

<p align="center">REST API for Contact Management with Advanced Validation, Pagination & Filtering</p>

<p align="center">
  <img src="https://img.shields.io/github/last-commit/emrealtnts0/nodejs-hw-04?color=blue&label=last%20commit" alt="Last Commit">
  <img src="https://img.shields.io/github/languages/top/emrealtnts0/nodejs-hw-04?color=orange&label=JavaScript" alt="JavaScript Percentage">
  <img src="https://img.shields.io/github/languages/count/emrealtnts0/nodejs-hw-04?color=green&label=languages" alt="Languages Count">
</p>

<p align="center">Built with:</p>
<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Joi-E43B3D?style=for-the-badge&logo=joi&logoColor=white" alt="Joi">
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint">
  <img src="https://img.shields.io/badge/.env-ECD53F?style=for-the-badge&logo=dot-env&logoColor=black" alt=".env">
</p>

## Project Overview

A comprehensive REST API for managing a contact book with advanced features including data validation, pagination, sorting, and filtering capabilities. This project demonstrates robust backend development practices using Node.js, Express, and MongoDB with Joi validation.

## Features

- **CRUD Operations**: Complete Create, Read, Update, Delete functionality for contacts
- **Advanced Validation**: Request body validation using Joi schemas with custom rules
- **ID Validation**: Middleware for validating MongoDB ObjectId format
- **Pagination**: Configurable page-based navigation with metadata
- **Sorting**: Flexible sorting by any contact field with ascending/descending order
- **Filtering**: Filter contacts by type and favorite status
- **Error Handling**: Centralized error management with appropriate HTTP status codes

## Installation

1. **Clone the project:**
    ```bash
    git clone <repository-url>
    cd nodejs-hw-04
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Configure environment variables:**
    - Copy `.env.example` to `.env` and set your MongoDB URI and other settings.
4. **Start the application:**
    ```bash
    npm start
    ```

## API Endpoints

### Contact Management

- `GET /contacts` — List all contacts with pagination, sorting, and filtering
- `GET /contacts/:contactId` — Get a contact by ID (with ID validation)
- `POST /contacts` — Add a new contact (with comprehensive validation)
- `PATCH /contacts/:contactId` — Update a contact (with validation and ID validation)
- `DELETE /contacts/:contactId` — Remove a contact (with ID validation)

## Query Parameters

### Pagination
- `page` (default: 1) — Page number
- `perPage` (default: 10) — Items per page

### Sorting
- `sortBy` (default: 'name') — Field to sort by
- `sortOrder` (default: 'asc') — Sort direction ('asc' or 'desc')

### Filtering
- `type` — Filter by contact type ('work', 'home', 'personal')
- `isFavourite` — Filter by favorite status (true/false)

## Response Format

### Paginated Response
```json
{
  "status": 200,
  "message": "Successfully found contacts!",
  "data": {
    "data": [/* contacts array */],
    "page": 2,
    "perPage": 4,
    "totalItems": 6,
    "totalPages": 2,
    "hasPreviousPage": true,
    "hasNextPage": false
  }
}
```

## Validation Rules

- **Name**: Required, 3-20 characters
- **Phone Number**: Required, 3-20 characters
- **Email**: Optional, valid email format
- **Contact Type**: Required, enum: ['work', 'home', 'personal']
- **Is Favourite**: Optional, boolean value

## Error Handling

- `200` — Success
- `201` — Created
- `400` — Bad Request (validation errors, invalid ID format)
- `404` — Not Found
- `500` — Internal Server Error

## License

This project is licensed under the MIT License. See the LICENSE file for details. 