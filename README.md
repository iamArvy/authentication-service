
# Authentication Service

Authentication Service is an authentication microservice built with **NestJS**, **Passport**, and **JWT**. Designed for secure and scalable authentication in microservice architectures. Currently supports REST API endpoints for user authentication and authorization.

## Features

* User registration and login with JWT authentication
* Integration with Prisma ORM for database operations
* Built with Passport.js for flexible authentication strategies
* Ready to be extended for event-driven architecture and GraphQL support

## Technologies

* **Framework**: [NestJS](https://nestjs.com/)
* **Authentication**: [Passport.js](https://www.passportjs.org/) & [JWT (JSON Web Tokens)](https://jwt.io/)
* **API**: REST
* **ORM**: [Mongoose](https://www.mongoose.org/)
* **Databases**: [MongoDB](https://www.mongodb.org/)
* **API Docs**: [Swagger](https://swagger.org)

## Getting Started

### Prerequisites

- Node.js (v20+)
- npm, yarn, or pnpm (pnpm is recommended)

### Installation

```bash
git clone https://github.com/iamArvy/authentication-service.git
cd authentication-service
pnpm install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DB_URL="your_mongodb_connection_string"
JWT_SECRET="your_jwt_secret"
REFRESH_SECRET="your_refresh_secret"
PORT=3000
```

### Running the service

```bash
pnpm run start:dev

# Or with Docker
docker-compose up --build
```

---

## 📚 API Documentation

* **Swagger UI** (REST): [http://localhost:3000/api](http://localhost:3000/api)

---

## 🗃️ Folder Structure (Simplified)

```
chat-service/
├── src/
│   ├── gateway/         # WebSocket Gateway
│   ├── message/         # Message logic
│   ├── conversation/    # Conversations
│   ├── graphql/         # GraphQL resolvers & schema
│   ├── rest/            # REST controllers
│   ├── prisma/          # Prisma setup (Postgres)
│   ├── mongoose/        # Mongoose models (MongoDB)
│   └── app.module.ts
├── docker-compose.yml
└── README.md
```