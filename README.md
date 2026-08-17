# testbed-fe

Proof-of-concept frontend prototype for the SBIMS project.
Provides the user interface for authentication, role-based access, dashboard navigation, and internship workflow management.

---

## Features

- JWT-based authentication
- Access and refresh token handling
- Protected routes
- Temporary password change workflow
- Role-based dashboards and navigation
- REST API integration
- Responsive UI components

---

## Technology Stack

### Core

- **React 19** — UI library
- **Vite** — Build tool
- **React Router** — Routing
- **Material UI (MUI)** — UI framework

### State & Forms

- **TanStack React Query** — Server state management
- **React Hook Form** — Form handling
- **Zod** — Validation

### API & Utilities

- **Axios** — HTTP client
- **React Hot Toast** — Notifications

---

## Project Structure

```text
src/
├── api/            # API communication layer
│   ├── auth.js
│   └── axios.js
├── auth/           # Authentication storage
├── components/     # Reusable UI components
├── config/         # Environment configuration
├── guards/         # Route protection
├── hooks/          # Custom React hooks
├── layouts/        # Application layouts
├── pages/          # Application pages
├── providers/      # Global providers
├── router/         # Route definitions
├── theme/          # MUI theme configuration
└── utils/          # Utility functions
```

---

## Authentication Flow

### Login

1. User submits credentials.
2. Frontend sends authentication request.
3. Backend returns:
   - Access token
   - Refresh token
   - User information
4. Session data is stored locally.
5. User is redirected to the dashboard.

### Temporary Password

Users created with temporary passwords must update their password during first login before accessing the system.

### Session Management

- Access tokens authenticate API requests.
- Refresh tokens renew expired sessions.
- Invalid sessions are cleared automatically.
- Protected routes require authentication.

---

## Route Guards

| Guard                 | Purpose                                                  |
| --------------------- | -------------------------------------------------------- |
| `AuthGuard`           | Protects private routes                                  |
| `GuestGuard`          | Prevents authenticated users from accessing public pages |
| `PasswordChangeGuard` | Requires temporary password updates                      |

---

## Role-Based Access

Supported roles:

- Administrator
- Internship Coordinator
- Faculty Adviser
- Student
- HTE Supervisor

Roles control:

- Dashboard content
- Navigation visibility
- Future feature permissions

---

## Environment Setup

Create:

```bash
.env.development
```

Example:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Configuration is managed through a centralized config module.

---

## Installation

Install dependencies:

```bash
npm install
```

---

## Development

Run the development server:

```bash
npm run dev
```

---

## Production Build

Create production files:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Development Principles

### API Separation

API calls are separated from UI components.

```
Components → Hooks → API Layer → Backend
```



