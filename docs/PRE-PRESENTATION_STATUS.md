# SBIMS Frontend: Pre-Presentation Status Report

The frontend development of the **SBIMS** has progressed to an **integrated functional prototype stage**. The current frontend already provides role-based interfaces, protected navigation, centralized communication with the backend API, and user interfaces for the major internship management workflows.

The frontend is developed using **React** and is organized into separate feature modules corresponding to the major functional areas of the system. It uses **React Router** for navigation, **React Query** for server-state management, **Axios** for API communication, **Material UI** for interface components, and **React Hook Form/Yup** for form handling and validation.

### Role-Based User Interface

The frontend currently provides different navigation and feature access depending on the authenticated user's role. The implemented roles include:

- **Administrator** – access to user management, companies/HTEs, reports, and audit functions.
- **Internship Coordinator** – access to companies/HTEs, students, internships, evaluations, and reports.
- **Faculty Adviser** – access to internships and evaluations relevant to their role.
- **Student** – access to their student profile, documents, and evaluations.
- **HTE Supervisor** – access to documents and evaluations associated with their assigned interns.

Protected routing and authentication guards are implemented so that users are directed to the appropriate sections of the system based on their authenticated role.

### Backend API Integration

The frontend already has centralized API services for the major SBIMS modules, including:

- Authentication
- Students
- Internships
- HTEs/Companies
- Attendance
- Documents
- Evaluations
- Reports
- Audit
- Users

The frontend communicates with the backend through Axios-based API services. Authentication tokens are automatically attached to API requests, while the authentication layer also handles expired access tokens through token refresh and request retry mechanisms.

This establishes the frontend as an integrated client of the serverless backend rather than an isolated interface or static prototype.

### Internship Management

The frontend provides interfaces for the internship management workflow, including internship-related views and interactions for the appropriate user roles.

The Internship Coordinator has access to internship management functions, while Faculty Advisers and students receive interfaces appropriate to their respective responsibilities.

The frontend therefore already represents the central internship-management workflow of SBIMS and connects those interfaces to the backend services.

### Attendance Management

Attendance is represented as a dedicated frontend feature with multiple components supporting the internship attendance workflow.

The current implementation includes:

- Attendance records and tables
- Attendance forms
- Attendance validation
- Attendance viewing
- Attendance dashboards
- Time-tracking functionality
- Rendered-hour information

The frontend also communicates with the backend attendance API for creating, retrieving, updating, validating, and processing attendance-related information.

### 5. Evaluation Management

The evaluation module is one of the major implemented frontend features.

The current interface supports evaluation information for both:

- **HTE Supervisors**
- **Faculty Advisers**

The evaluation interface displays the eight evaluation criteria using human-readable labels rather than exposing the backend field names directly. The current labels include:

1. Knowledge of Assigned Tasks
2. Quality of Work
3. Productivity
4. Problem-Solving
5. Communication
6. Teamwork
7. Professionalism
8. Adaptability

The evaluation interface also provides information such as the evaluator, student information, internship, evaluation type, individual criteria, comments, status, and submission date.

For students, the frontend includes an evaluation-history interface so that their evaluation records can be viewed as part of their internship records.

### Document Management

The frontend includes a document-management interface for internship-related requirements.

The current document interface provides functionality for:

- Viewing submitted documents
- Displaying document type and file information
- Displaying submission dates
- Displaying document status
- Displaying rejection reasons when applicable
- Performing document approval/rejection actions for authorized users
- Opening uploaded documents through the document service

This provides the user-facing portion of the internship document submission and review workflow.

### User Experience and Interface Structure

The frontend has been organized into reusable components and feature-specific interfaces rather than implementing all functionality in a single application view.

The use of Material UI provides a consistent interface structure, while React Query provides a centralized approach for retrieving and managing server-side data.

Forms are also handled through React Hook Form and Yup, allowing input handling and validation to be incorporated into the different system workflows.

### Frontend Development Infrastructure

The project also has a development and verification setup that includes:

- ESLint for code-quality checking
- Prettier for formatting
- Knip for identifying unused code/dependencies
- Vitest for frontend testing
- Testing Library and JSDOM for interface testing
- Production build configuration

The project includes a combined checking workflow covering code quality, formatting, unused-code analysis, tests, and production build generation.

### Deployment Infrastructure

**URL**: `https://app.sbims.me`

## Current Status

At the current stage, the SBIMS frontend can be characterized as a **functional, role-based prototype integrated with the serverless backend**.

The major user-facing areas of the system are already represented in the frontend, including authentication, role-based navigation, student and internship management, HTE/company management, attendance, documents, evaluations, reports, and administrative functions.

The frontend has therefore moved beyond the initial interface-development stage. It currently serves as the **primary user-facing application of the SBIMS**, communicating with the backend API and presenting the system's major workflows according to the responsibilities of each user role.

The current frontend can be presented as the **working application layer of SBIMS**, demonstrating how the different users interact with the internship management system and how the frontend connects the users to the underlying serverless backend services.
