# Ting Admin Dashboard

This is the administrative dashboard for Ting, built with React, TypeScript, and Vite. The dashboard provides comprehensive management capabilities for the Ting platform, including user management, appointment scheduling, ticket handling, and system administration.

## Features

- **User Management**: Manage user accounts, profiles, and permissions
- **Appointment System**: Schedule, view, and manage appointments
- **Ticket Management**: Handle support tickets and customer inquiries
- **Authentication**: Secure login/signup with Firebase authentication
- **Dashboard Analytics**: Overview of key metrics and system status
- **Responsive Design**: Optimized for desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: Custom component library with Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **State Management**: React Context API
- **Routing**: React Router DOM

## Project Structure

The application follows a modular structure with:
- `src/components/` - Reusable UI components
- `src/pages/` - Application pages and routes
- `src/context/` - Global state management
- `src/firebase/` - Firebase configuration and utilities
- `src/hooks/` - Custom React hooks

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Firebase project with Firestore and Authentication enabled

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ting-admin-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a `.env` file in the root directory
   - Add your Firebase configuration variables:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) to view the application in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Development Guidelines

### Code Style

The project uses ESLint and TypeScript for code quality and consistency. 

### ESLint Configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

### Component Development

- Use TypeScript interfaces for all component props
- Follow the existing component structure in `src/components/`
- Utilize the custom UI components from `src/components/ui/`
- Implement proper error handling and loading states

### Firebase Integration

- All Firebase operations should go through the utilities in `src/firebase/`
- Use the `useFirestore` hook for database operations
- Implement proper authentication checks using the auth context

## License

This project is proprietary software for Ting platform administration.
