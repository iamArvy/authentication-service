# 🔐 Authentication Service

A secure and scalable authentication microservice built with **NestJS**, **Passport**, and **JWT**, supporting gRPC transport for efficient internal communication in microservice architectures.

---

## 🚀 Features

* ✅ User registration and login with JWT (access + refresh tokens)
* ✅ Session-based refresh token storage with expiration and revocation
* ✅ gRPC endpoints for communication with other services
* ✅ Password hashing with Argon2
* ✅ Built-in email verification & logout functionality
* ✅ Extensible with support for token rotation and auditing

---

## ⚙️ Technologies

| Category          | Stack                                                                |
| ----------------- | -------------------------------------------------------------------- |
| **Framework**     | [NestJS](https://nestjs.com/)                                        |
| **Transport**     | [gRPC](https://grpc.io/)                                             |
| **Auth Strategy** | [Passport.js](https://www.passportjs.org/)<br>[JWT](https://jwt.io/) |
| **ORM**           | [Prisma](https://prisma.com/)                                  |
| **Database**      | [PostgreSQL](https://postgresql.com/)                                      |

---

## 📦 Getting Started

### ✅ Prerequisites

* Node.js `v20+`
* pnpm (recommended) / npm / yarn
* PostgreSQL DB instance (local or cloud)

---

### 🛠 Installation

```bash
git clone https://github.com/iamArvy/authentication-service.git
cd authentication-service
pnpm install
```

---

### 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL= your_db_url
JWT_SECRET= your_jwt_secret
GRPC_URL= desired_grpc_url
```

---

### 🚧 Running the Service

```bash
# Development
pnpm run start:dev

# Or with Docker
docker-compose up --build
```

---

## 🗓️ Folder Structure (Simplified)

```
authentication-service/
├── proto/
│   └── auth.proto            # gRPC definitions
├── src/
│   ├── controller/          # Grpc Controllers
│   ├── controller/          # DB Setup and Repositories
│   ├── dto/                 # Data transfer objects
│   ├── service/             # API Logic
│   ├── app.module.ts        # Nest module setup
│   ├── main.ts              # Entry point
├── docker-compose.yml
└── README.md
```

---

## 📊 Roadmap Ideas

* ☑️ Add rate limiting to login route 
* ☑️ Add Redis caching for session lookups
* ☑️ Add unit and integration tests
* ☑️ Audit logging for sessions and auth attempts

---

Feel free to contribute, open issues, or fork the project!
