# Postman Architecture

> **Scope**: `apps/api`
> **Purpose**: API Development, Testing, and Documentation

## 1. Overview

Postman is our primary tool for **API-First Development**. It serves as the executable documentation for the Backend, ensuring that the API contract is respected before Frontend integration begins.

### Core Principles
1.  **Single Source of Truth**: The Postman Collection defines the API Contract.
2.  **Environment Agnostic**: Collections must run against Local, Staging, and Prod via Environments.
3.  **Automated Validation**: Every request must have test scripts to verify status and schema.

---

## 2. Collection Structure

The collection mirrors the Feature-Based API structure.

```text
Innovate 2025 API
├── Auth/
│   ├── Register
│   ├── Login
│   └── Get Me
├── User/
│   ├── Get Profile
│   └── Update Profile
├── Teams/
│   ├── List Teams
│   ├── Create Team
│   └── Join Team
└── ...
```

---

## 3. Environments

We use Environment Variables to manage dynamic values. **Never hardcode URLs or Tokens.**

| Variable | Local Value | Production Value |
| :--- | :--- | :--- |
| `baseUrl` | `http://localhost:3000` | `https://api.innovate2025.com` |
| `authToken` | *(Auto-set by Login test)* | *(Auto-set by Login test)* |

---

## 4. Automated Testing Scripts

Every request includes a `Tests` tab script to validate the response.

### Example: Login Test Script

```javascript
// 1. Status Check
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// 2. Schema Validation
// Note: In a real scenario, we'd sync this with Zod schemas if possible,
// but for Postman we define a lightweight schema check.
const schema = {
    "type": "object",
    "properties": {
        "token": { "type": "string" },
        "user": {
            "type": "object",
            "required": ["id", "email", "role"]
        }
    },
    "required": ["token", "user"]
};

pm.test("Schema is valid", function () {
    pm.response.to.have.jsonSchema(schema);
});

// 3. Environment Update
var jsonData = pm.response.json();
pm.environment.set("authToken", jsonData.token);
```

---

## 5. Workflow

1.  **Design**: Define the Request/Response in Postman.
2.  **Implement**: Build the Endpoint in Fastify (`apps/api`).
3.  **Verify**: Run the Postman Request against `localhost`.
4.  **Automate**: Run the Collection Runner to verify the entire flow.
