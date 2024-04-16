# Simple Todo App

This is a Simple Todo App created using Neurelo for Database, React for Frontend, and Node.js with Express.js for Backend.

## Features

- **User Authentication**: Normal users can log in to the todo app securely.
- **Task Management**: Tasks are categorized into four sections: new, in progress, completed, and due.
- **Task Operations**:
  - **Create**: Users can create new tasks.
  - **Edit**: Tasks can be edited, including updating task details and category.
  - **Delete**: Users can delete tasks.
- **Search Functionality**: Users can search for specific tasks by name.
- **Custom Categories**: Users have the ability to create custom categories for tasks.

## Technologies Used

- **Frontend**:
  - React
  
- **Backend**:
  - Node.js
  - Express.js
  
- **Database**:
  - Neurelo 

## Screenshots

<img width="1728" alt="image" src="https://github.com/jaypatel31/Neurelo_Demo/assets/59785863/1e541a6c-5af3-494b-94c6-334b46b8abe4">
<img width="1728" alt="Screenshot 2024-04-16 at 6 02 35 PM" src="https://github.com/jaypatel31/Neurelo_Demo/assets/59785863/1c5fce67-b6e2-4212-aec0-4cbd38759712">
<img width="1728" alt="Screenshot 2024-04-16 at 6 02 20 PM" src="https://github.com/jaypatel31/Neurelo_Demo/assets/59785863/df7e7950-4a1d-4ea9-8248-fc2fdfd40772">
<img width="1728" alt="Screenshot 2024-04-16 at 6 02 07 PM" src="https://github.com/jaypatel31/Neurelo_Demo/assets/59785863/09026323-0c14-4c89-841a-d28ab6ad66a0">
<img width="1728" alt="Screenshot 2024-04-16 at 6 03 15 PM" src="https://github.com/jaypatel31/Neurelo_Demo/assets/59785863/b76b90db-6c29-4161-b3d2-10dbaa70df55">
<img width="1728" alt="Screenshot 2024-04-16 at 6 03 10 PM" src="https://github.com/jaypatel31/Neurelo_Demo/assets/59785863/5c6e7c77-1d73-4c64-97d0-b14bd347cd39">


## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:

2. Change to the project directory:
cd Neurelo_Demo


3. Install dependencies for the server:
```
cd server
npm install
```


5. Install dependencies for the client:
```
cd ../frontend
npm install
```

### Configuration

1. Create a `.env` file in the `server` directory and add the following environment variables:
```
NEURELO_API_KEY = <API-KEY>
NEURELO_API_BASE_PATH=<your-neurelo-database-uri>
JWT_SECRET=<your-jwt-secret>
```


Replace `<your-neurelo-database-uri>` with the connection URI for your Neurelo database, and `<your-jwt-secret>` with a secret key for JSON Web Token (JWT) authentication.

### Running the Application

1. Start the server:
```
cd server
npm start
```

2. Start the client (in a separate terminal):
```
cd frontend
npm start
```

The client application should now be accessible at `http://localhost:3000`.

## Contributing

Contributions are welcome! Please follow the [contribution guidelines](CONTRIBUTING.md) when submitting pull requests or issues.

## License

This project is licensed under the [MIT License](LICENSE).
