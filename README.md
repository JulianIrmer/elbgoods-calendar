# How to install
- clone repo
- npm install
- npm start (when using nodemon)
- ndoe app.js

# Credentials
- Port and connection string for the mongoDB are configured in the .env file:
  - PORT
  - DB_URL

# Project Structure
- ./routes contains all files for the routes. In this case it is only the entry.js
- ./schema contains the schema needed for mongoose
- ./util contains all files for different helper functions. In this case it is only the helper file for the entry.js
