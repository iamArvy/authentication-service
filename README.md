
# Authentication Service

A NestJS-based authentication microservice built with Prisma, Passport, and JWT. Designed for secure and scalable authentication in microservice architectures. Currently supports REST API endpoints for user authentication and authorization.

## Features

- User registration and login with JWT authentication
- Integration with Prisma ORM for database operations
- Built with Passport.js for flexible authentication strategies
- Ready to be extended for event-driven architecture and GraphQL support

## Technologies

- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [Passport.js](http://www.passportjs.org/)
- [JWT (JSON Web Tokens)](https://jwt.io/)
- REST API
- MongoDB

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
```

The service will be available at `http://localhost:3000`.

Visit `/api` to see the Swagger API documentation.

## License

MIT License
