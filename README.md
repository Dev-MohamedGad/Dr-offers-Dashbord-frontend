# Welcome to Light Byte Boilerplate

Welcome to the Light Byte Boilerplate! This project is built using Vite, React, and TypeScript. It's designed to provide a robust starting point for developing modern web applications.

## Table of Contents

- [Project Structure](#project-structure)
- [Adding New Pages](#adding-new-pages)
- [Styling Guidelines](#styling-guidelines)
- [Using Reducers](#using-reducers)
- [Common Components](#common-components)
- [Utilities](#utilities)
- [API Client](#api-client)
- [Linting](#linting)

## Project Structure

The project is organized into the following directories:

- **public/**: Contains static assets like the project logo.
- **src/**: The main source code directory.
  - **assets/**: Stores images and other asset files.
  - **components/**: Contains reusable React components.
  - **fonts/**: Custom font files used in the project.
  - **pages/**: Organized by page name. Each page has its own directory.
    - **homePage/**: Example of a page directory.
      - **homePage.page.tsx**: The main React component for the page.
      - **homePage.styles.css**: The styles specific to the page.
  - **redux/**: Manages state using Redux.
    - **slices/**: Contains Redux slices for managing different parts of the state.
  - **utilities/**: Contains shared logic and hooks.
  - **App.tsx**: The main application component.
  - **index.tsx**: The entry point of the application.
  - **vite-env.d.ts**: Vite environment definitions.

# Adding New Pages

To add a new page:

1. Create a new folder under `src/pages/` with the desired page name.
2. Inside the new folder, create two files:
   - `name.page.tsx`: The main React component for the page.
   - `name.styles.css`: The CSS file for styling the page.

For example, to create a new page called "About", you would create:

`src/pages/about/about.page.tsx`
`src/pages/about/about.styles.css`

# Styling Guidelines

Styling in this project follows a structured approach to ensure maintainability and consistency.

## Global Styles

Global styles that apply to the entire application should be placed in the `src/index.css` file. These styles should have class names prefixed with `global-` to indicate their scope.

### Example

```css
.global-container {
  margin: 0 auto;
  padding: 20px;
}
```

## Component Styles
Each component should have its own CSS file located in the same directory as the component file. The class names in these files should be prefixed with the component name to avoid conflicts and improve readability.

### Example
For a component named Button:

```css
.button-container {
  display: flex;
  align-items: center;
}
```

## Page Styles
Each page should have its own CSS file located in the same directory as the page file. The class names in these files should be prefixed with the page name to avoid conflicts and improve readability.

### Example
For a page named homePage:

```css
.homePage-main-div {
  display: flex;
  align-items: center;
}
```


## Colors Styles
A global file called `variable.css` is at the root of the project. It should contain all the colors you will use. 
Any use of a color should be used dynamically. For example to use the blackColor: 
 `var(--black-color)`

 This variables file is imported in the `index.css` so you don't have to worry about using it globally.

## Animation Styles
All and any animations should be in the `root/animations.css` file and can be used globally. 



# Using Reducers

State management is handled using Redux. If you need to store state that does not belong to an existing slice:

1. Create a new slice in the `src/redux/slices/` directory.
2. Define the initial state, reducers, and actions in the new slice file.
3. Combine the new slice into the store.

For example, to create a new slice called "profile":

src/redux/slices/profileSlice.ts


# Common Components

Reusable components that are shared across the application should be placed in the src/components/ directory. This helps maintain a clean and organized codebase.

# Utilities

Shared logic and custom hooks should be placed in the src/utilities/ directory. This includes any helper functions or custom hooks that are used in multiple places throughout the application.

# API Client

All API calls to the backend should be handled using the ApiClient located in the `src/utilities/ApiClient.ts` file. This ensures that all API interactions are centralized and can be easily maintained or modified.

# Linting
This project uses ESLint and Prettier to enforce code quality and formatting standards. Please adhere to the linting rules to maintain a consistent codebase. 
You can run the following commands to check and fix linting issues:

1. Check Linting issues.
  - `npm run lint`
2. Fix Linting issues
  - `npm run lint:fix`

## Final note: 
We're trying very hard to create a maintainable codebase where everything is as centralized as we can, to facilitate maintainability. 
We're also trying to apply the DRY principle. 
Please ensure the code you add is code that follows the guidelines to facilitate a maintainable project. 


Thank you for using the Light Byte Boilerplate! Happy coding!
