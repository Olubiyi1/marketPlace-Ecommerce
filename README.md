# E-commerce API

A TypeScript-based e-commerce backend built with **Node.js, Express, Prisma, and PostgreSQL**.

This project is being developed using a **contract-first API design approach with OpenAPI**, where API endpoints are defined and documented before implementation.

## Tech Stack

* Node.js
* TypeScript
* Express.js
* Prisma ORM
* PostgreSQL
* OpenAPI

## Project Goals

The goal of this project is to build a structured e-commerce backend while learning and applying:

* REST API development
* Authentication and authorization
* Database design with Prisma
* Repository and service patterns
* API contract design with OpenAPI
* Error handling
* Payment integration
* Backend architecture

## API Documentation

The API contract is maintained in:

```text
docs/
└── openapi.yaml
```

The OpenAPI document describes the available endpoints, request data, and possible responses.

## Authentication

The authentication system will include:

* User registration
* User login
* Email verification
* Forgot password
* Password reset
* Authentication middleware

## Project Structure

```text
src/
├── modules/
├── middleware/
├── helpers/
└── ...

docs/
└── openapi.yaml
```

The backend follows the general flow:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Prisma
    ↓
PostgreSQL
```

## Status

🚧 **Currently in development**

The API is being built incrementally, with each feature first defined in the OpenAPI contract before implementation.

## Purpose

This project is primarily a learning and portfolio project focused on understanding how to design and build a backend API in a structured way.
