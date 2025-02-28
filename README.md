# Social Media App

## Overview
This project implements a **Social Media Application** where users can **share posts**, **like**, **comment (with likes)**, **follow other users**, and **tag users in posts**. The system uses **JWT-based authentication** to secure endpoints. The application ensures security, scalability, and a responsive user experience.

## Features
- Secure user authentication with **JWT (JSON Web Tokens)**
- User functionalities to **create, like, comment, and tag users in posts**
- Comment likes functionality
- Follow and unfollow users
- Protected routes for authorized users only
- Responsive UI with **Tailwind CSS**
- Backend API built with **Node.js and Express**

## Screenshots

## Technologies Used
- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express
- **Authentication:** JSON Web Tokens (JWT)
- **Database:** MongoDB

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/OnkarKale1405/PRODIGY_FS_05.git
   cd PRODIGY_FS_05
   ```

2. Install dependencies:
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd backend
   npm install
   ```

3. Environment Variables:
   - Create a `.env` file in the `backend` directory with the following content:
     ```env
      PORT = 8000
      MONGO_URL = 
      CLOUDINARY_API_SECRET = ""
      CLOUDINARY_API_KEY = ""
      CLOUDINARY_CLOUD_NAME = ""
      CORS_ORIGIN = 
      ACCESS_TOKEN_SECRET =
      REFRESH_TOKEN_SECRET =
      ACCESS_EXPIRY =
      REFRESH_EXPIRY =
     ```

4. Run the application:
   ```bash
   # Backend
   cd backend
   npm run dev

   # Frontend
   cd frontend
   npm run dev
   ```

5. Visit the app at `http://localhost:5173`

## Contributing
Contributions are welcome! Feel free to submit a pull request or report issues.

## Contact
- Email: onkarkale0007@gmail.com
- GitHub: [OnkarKale1405](https://github.com/OnkarKale1405)

