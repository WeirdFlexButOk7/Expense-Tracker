# Expense Tracker

An expense tracking application that helps users manage income and expenses, track recurring transactions, and observe spending patterns through dashboards.

---

## Features

### Functionality
- User auth with JWT-based security
- Add, update, delete, and view income/expense transactions
- Category based transaction management
- Recurring transactions with automatic scheduling
- Expenses breakdown dashboard
- Filtering with various parameters

### Highlights
- Modular backend architecture
- Well separated frontend, backend, and database layers

---

## Tech Stack

### Backend
Java, Spring Boot, Spring Security, JPA/Hibernate, PostgreSQL

### Frontend
React, TypeScript, Vite, Tailwind CSS, Radix UI

---

## Setup Instructions

### Prerequisites
Java 17+, Node.js 18+, PostgreSQL, npm

---

### Backend Setup

1. Go to backend
    ```sh
    cd backend
    ```

2. Configure db in `application.properties`

3. Run the backend and create db:

    ```sh
    createdb expense_tracker
    ./mvnw spring-boot:run
    ```

    Backend runs at `http://localhost:8080`.

---

### Frontend Setup

1. Go to frontend and install dependencies.
    ```bash
    cd frontend && npm i
    ```

2. Start the server:
    ```bash
    npm run dev
    ```

    Frontend runs at `http://localhost:3000`

---

## Environment Variables

### Backend
Set db creds and JWT secret in backend config:
```
spring.datasource.url
spring.datasource.username
spring.datasource.password
jwt.secret
```
