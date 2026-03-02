# StayEase Auth Service

Authentication microservice for the StayEase microservice system (SE4010 Cloud Computing Assignment).

## 1) Microservice Scope and Role

This service manages user identity and access for the StayEase platform.

### Core responsibilities
- Register users
- Authenticate users
- Issue JWT tokens
- Verify JWT tokens for downstream services

This service is designed to be consumed by at least one other group member's microservice (for example, booking, payment, or profile service) via token verification.

## 2) Endpoints

Base URL: `http://localhost:3000`

- `GET /health` - service health check
- `POST /auth/register` - register a user
- `POST /auth/login` - login and receive JWT
- `GET /auth/verify` - verify JWT (`Authorization: Bearer <token>`)

Full API contract: [openapi.yaml](openapi.yaml)

Interactive Swagger UI: `GET /docs`

## 3) Local Development

### Prerequisites
- Node.js 20+
- MongoDB Atlas (or local MongoDB)

### Environment
Create `.env` from `.env.example`:

```env
PORT=3000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<strong-secret>
```

### Run
```bash
npm install
npm run dev
```

## 4) Docker

Build image:
```bash
docker build -t stayease-auth-service .
```

Run container:
```bash
docker run -p 3000:3000 --env-file .env stayease-auth-service
```

Containerization files:
- [Dockerfile](Dockerfile)
- [.dockerignore](.dockerignore)

## 5) DevOps and CI/CD

GitHub Actions workflows:
- CI/CD pipeline: [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml)
	- Install dependencies
	- Run checks/tests
	- Build and push Docker image to GHCR on `main`
	- Optional Azure Container Apps deploy when required variables/secrets are configured
- DevSecOps SAST pipeline: [.github/workflows/codeql.yml](.github/workflows/codeql.yml)
	- Managed static security analysis with CodeQL

## 6) Security Measures

Implemented baseline security controls:
- Password hashing with `bcryptjs`
- JWT-based authentication (`1h` token expiry)
- Security headers via `helmet`
- Basic rate limiting with `express-rate-limit`
- Input validation in auth endpoints (required fields, email format, minimum password length)
- Environment-based secrets (`JWT_SECRET`, `MONGO_URI`)

## 7) Inter-service Communication (for Demo)

### Integration point
Other microservices call `GET /auth/verify` to validate user tokens before handling protected requests.

### Example verification request
```bash
curl -X GET http://localhost:3000/auth/verify \
	-H "Authorization: Bearer <jwt-token>"
```

Expected successful response:
```json
{
	"valid": true,
	"user": {
		"id": "<user-id>",
		"role": "guest",
		"iat": 0,
		"exp": 0
	}
}
```

## 8) Assignment Deliverable Mapping

- Source code in public Git repository: yes
- API contract (OpenAPI/Swagger): yes ([openapi.yaml](openapi.yaml))
- CI/CD configuration files: yes ([.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml))
- Container configuration: yes ([Dockerfile](Dockerfile))
- DevSecOps/SAST integration: yes ([.github/workflows/codeql.yml](.github/workflows/codeql.yml))

## 9) Known Runtime Requirement

MongoDB credentials in `MONGO_URI` must be valid. If Atlas reports `bad auth : Authentication failed`, reset DB user password and update `.env`.
