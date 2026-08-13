# Job Application Tracker

A full-stack web application for managing and tracking job applications throughout the hiring process.

The application allows users to record job opportunities, update application progress, manage follow-up dates, and quickly review the overall status of their job search through an interactive dashboard.

## Features

- Add, edit, and delete job applications
- Track application status: Applied, Interview, Offer, and Rejected
- View application statistics through an interactive dashboard
- Click dashboard statistics to filter applications by status
- Search applications by company or role
- Filter applications by status
- Sort applications by application date
- Store job posting links and notes
- Track application and follow-up dates
- Highlight overdue and due-today follow-ups
- Clear active search, filter, and sorting selections
- Validate required form fields
- Display loading and error states
- Persist application data using PostgreSQL
- Responsive user interface

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- CSS

### Backend
- Node.js
- Express.js
- REST API

### Database
- PostgreSQL

### Development Tools
- Git
- GitHub
- VS Code

## Architecture

The application follows a full-stack architecture:

**React + TypeScript frontend → Express REST API → PostgreSQL database**

The React frontend manages the user interface, form state, filtering, sorting, and interactions. The Express backend exposes REST API endpoints for application data, while PostgreSQL provides persistent data storage.

## Key Functionality

The application supports full CRUD operations:

- **Create** new job applications
- **Read** stored applications from PostgreSQL
- **Update** existing application details and status
- **Delete** applications that are no longer needed

The interface also provides derived statistics, search, filtering, sorting, follow-up tracking, loading states, and error handling.

## What I Learned

Building this project gave me practical experience connecting the frontend, backend, and database layers of a full-stack application.

Key areas I worked with include:

- React state management and controlled forms
- TypeScript in a React application
- CRUD operations
- REST API integration
- Asynchronous API requests using `fetch`
- Express routing
- PostgreSQL database integration
- Search, filtering, and sorting
- Derived dashboard statistics
- Date-based follow-up logic
- Loading and error states
- Form validation
- Responsive UI development
- Git and GitHub workflow

## Running Locally

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- PostgreSQL

A PostgreSQL database must also be configured for the backend before running the application.

### 1. Clone the repository

```bash
git clone https://github.com/komalramani/job-tracker.git
cd job-tracker
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

### 4. Configure PostgreSQL

Create the PostgreSQL database and application table required by the backend, and update the database connection settings in the server configuration as needed.

### 5. Start the backend

From the `server` directory:

```bash
node index.js
```

The API runs locally on:

```text
http://localhost:3001
```

### 6. Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Screenshots

Screenshots of the completed application will be added after final UI and deployment checks.

## Project Status

Core application development is complete.

Current finalization work includes deployment, documentation polish, and final portfolio presentation.