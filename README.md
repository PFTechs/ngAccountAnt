# ngAccountAnt# ngAccountAnt

## Overview
ngAccountAnt is an Angular application designed to manage expenses and collections. It provides a user-friendly interface for adding, editing, and tracking expenses, as well as managing collections of expenses.

## Features
- Add and manage expenses
- View and edit collections
- Toggle paid status for expenses
- Archive collections
- View totals for paid and outstanding expenses

## Project Structure
```
ngAccountAnt
├── src
│   ├── app
│   │   ├── components
│   │   │   └── new-expenses
│   │   │       ├── new-expenses.component.ts
│   │   │       ├── new-expenses.component.html
│   │   │       └── new-expenses.component.scss
│   │   └── ...
│   ├── assets
│   └── environments
├── Dockerfile
├── .dockerignore
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js and npm installed
- Angular CLI installed

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd ngAccountAnt
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Application
To run the application in development mode, use the following command:
```
ng serve
```
The application will be available at `http://localhost:4200`.

### Building for Production
To build the application for production, use the following command:
```
ng build --prod
```
The output will be available in the `dist/` directory.

## Docker
To build and run the application in a Docker container, follow these steps:

1. Build the Docker image:
   ```
   docker build -t ngaccountant .
   ```
2. Run the Docker container:
   ```
   docker run -p 4200:80 ngaccountant
   ```
The application will be accessible at `http://localhost:4200`.


## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License.

## Known Bugs
1. MacOs Only - Collection view offcanvas - Top table's 'Outstanding' column width has to be adjusted as wraps values on lower window sizes

## Future Ideas
1. Split Expense, Follow Naming Convention
     Pseudo Code:
       if (item.split)
       {
         - Split item.origin on &
         - Get user input on split
         - Update Origin Totals Accordingly
       }
