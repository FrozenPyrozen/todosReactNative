# Overview

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

This project is a ToDo application built using React, TypeScript, and Expo. It offers functionalities like adding, deleting, and toggling the completion status of tasks, going to details page, saving tasks between app launches. The app communicates with a dummy API that simulates task management, but the API does not persist changes (e.g., adding, deleting, or toggling tasks) so it manage Task (local structure) and Todo (API structure) and doesn't send local created task to API, to avoid 5xx error. App use react hooks, styled-components and Context to manage state

## Features

- Task Management: Add, delete, and toggle completion status of tasks.
- State Management: Uses React context to manage app state and tasks globally. All state and tasks managing logic lives in TaskContext
- Custom Hooks: Reusable hooks like useTasksLogic for task management, and usePersistState for persistence.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Project structure

todosReactNative/
├── .expo # Expo configuration
├── .vscode # VSCode settings
├── api/ # API functions and data fetching
│   └── todosApi.ts # Handles API calls related to todos
├── app/ # Main application code
│   ├── screens/ # React Native Screens
│   │   ├── TaskDetailsScreen/
│   │   │   └── TaskDetailsScreen.tsx # Screen for displaying task details
│   │   ├── TaskListScreen/
│   │   │   ├── TaskListScreen.tsx # Screen for displaying task list
│   │   │   └── TaskItem.tsx # Displays individual task item in list
│   └── index.tsx # Entry point for the app
├── assets/ # App assets (e.g., images, fonts)
├── components/ # Reusable components
│   ├── ThemedText.tsx # Custom themed text component
│   ├── ThemedView.tsx # Custom themed view component
│   └── **tests**/ # Unit tests for components
├── constants/ # App constants (e.g., colors, screen names)
│   ├── colors.ts # Color definitions for the app
│   └── screenNames.ts # Names of app screens
├── context/ # Context for managing global state
│   └── TaskContext.tsx # Provides task-related state
├── hooks/ # Custom hooks for app functionality
│   ├── useColorScheme.ts # Manages the app's color scheme
│   ├── useColorScheme.web.ts # Web-specific color scheme hook
│   ├── usePersistState.ts # Custom hook for persistent state
│   ├── useTasksLogic.ts # Logic for managing tasks
│   └── useThemeColor.ts # Custom hook for theme color management
├── ios/ # iOS-specific code (if any)
├── node_modules/ # Project dependencies
├── scripts/ # Utility and build scripts
├── types/ # TypeScript types
│   ├── navigation.ts # Navigation-related types
│   └── taskLogicTypes.ts # Task-related logic types
├── utils/ # Utility functions
│   ├── asyncStorage.ts # Functions for managing async storage
│   └── mappers.ts # Functions for mapping data (tasks, todos)
├── .eslintrc # ESLint configuration
├── .gitignore # Git ignore configuration
├── .prettierrc # Prettier configuration
├── app.json # Expo configuration file
└── eslint.config.js # Additional ESLint configuration

![alt text](image-1.png)