This project is built on the NextJs/ReactJs and Typescript for building the frontend of the TaskFlow.
For better icons and layouts used the cards and the shadcn library becuase it is the more friendly with the tailwind css.

## Prerequisites

- Node.js (version recommended by Next.js, e.g., 18.x or later)
- npm or yarn

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd taskflow-app 
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root of your project (copy from `.env.example` if it exists, or create a new one).
    You will need a Gemini API Key from Google AI Studio for the AI features.
    Add your API key to the `.env.local` file:
    ```env
    GOOGLE_API_KEY=your_gemini_api_key_here
    ```
    This key is used by the Genkit Google AI plugin.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the Next.js development server, typically on `http://localhost:9002`.

5.  **Run the Genkit development server (for AI features):**
    In a separate terminal, run:
    ```bash
    npm run genkit:dev
    ```
    Or for auto-reloading on changes:
    ```bash
    npm run genkit:watch
    ```
    This starts the Genkit development server, which is necessary for the AI task assignment feature.

## Project Description

TaskFlow is a task/bug tracking application designed for software development teams. It allows managers and developers to create, assign, track, and manage tasks and bug reports. The application features role-based dashboards, AI-driven task assignment suggestions, and reporting capabilities.

Mock user data is used for login purposes to simulate different user roles (Developer/Manager).

## Deployment (e.g., Vercel)

When deploying to a platform like Vercel:

1.  **Build Command**: `next build` (usually auto-detected)
2.  **Output Directory**: `.next` (usually auto-detected)
3.  **Environment Variables**:
    *   You **MUST** set the `GOOGLE_API_KEY` environment variable in your Vercel project settings. This is the same API key you used in your `.env.local` file for local development. Without this, AI features will not work in the deployed environment.

## Available Scripts

-   `npm run dev`: Starts the Next.js development server with Turbopack.
-   `npm run genkit:dev`: Starts the Genkit development server.
-   `npm run genkit:watch`: Starts the Genkit development server with auto-reloading.
-   `npm run build`: Builds the application for production.
-   `npm run start`: Starts a Next.js production server (after building).
-   `npm run lint`: Runs Next.js's built-in linter.
-   `npm run typecheck`: Runs TypeScript type checking.
