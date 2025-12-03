# 📝 SmartTask Manager

A modern, full-stack task management application with user authentication, built with Node.js, Express, MongoDB, and Vanilla JavaScript. Features a beautiful, responsive UI powered by Tailwind CSS.

## ✨ Features

### User Management
- 🔐 Secure user registration and login
- 🔑 JWT-based authentication
- 🛡️ Password hashing with bcrypt
- 👤 Personalized user sessions

### Task Management
- ➕ Create tasks with title, description, and priority levels
- ✏️ Edit existing tasks
- ✅ Mark tasks as complete/incomplete
- 🗑️ Delete tasks
- 🎯 Priority levels: Low, Medium, High
- 🔍 Filter tasks by status and priority

### User Interface
- 🎨 Modern, clean design with Tailwind CSS
- 📱 Fully responsive (mobile, tablet, desktop)
- 🌈 Color-coded priority badges
- 💫 Smooth animations and transitions
- 🎭 Empty state illustrations
- ⚡ Real-time updates

### Additional Features
- 💾 Demo mode (works offline with localStorage)
- 🔄 Automatic fallback to demo mode if server is unavailable
- 🚀 Fast and lightweight
- ⚙️ RESTful API architecture

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling
- **JavaScript (ES6+)** - Client-side logic
- **Tailwind CSS** - Utility-first CSS framework

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **MongoDB** (v4.0 or higher)
- A modern web browser

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd smarttask-manager
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb://localhost:27017/smarttask
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
```

**Important:** Change `JWT_SECRET` to a strong, random string in production!

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
sudo service mongod start
```

### 5. Start the Server

**Development mode** (with auto-restart):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start at `http://localhost:5000`

### 6. Open the Application

Open your browser and navigate to:
- **Login**: `login.html`
- **Sign Up**: `signup.html`
- **Dashboard**: `dashboard.html` (requires login)

Or simply open `login.html` directly in your browser.

## 📁 Project Structure

```
smarttask-manager/
├── server.js              # Main server file
├── package.json           # Node.js dependencies
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── login.html            # Login page
├── signup.html           # Registration page
├── dashboard.html        # Main task dashboard
└── README.md             # This file
```

## 🔌 API Endpoints

### Authentication

#### Register User
```
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Task Management (Requires Authentication)

#### Add Task
```
POST /api/addTask
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task manager project",
  "priority": "high"
}
```

#### Get All Tasks
```
GET /api/getTasks
Authorization: Bearer <token>
```

#### Update Task
```
PUT /api/updateTask/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "medium",
  "completed": true
}
```

#### Delete Task
```
DELETE /api/deleteTask/:id
Authorization: Bearer <token>
```

### Health Check
```
GET /api/health
```

## 💡 Usage Guide

### Creating an Account

1. Open `signup.html` in your browser
2. Fill in your name, email, and password
3. Click "Create Account"
4. You'll be redirected to the login page

### Logging In

1. Open `login.html`
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to the dashboard

### Managing Tasks

#### Adding a Task
1. Enter task title (required)
2. Add description (optional)
3. Select priority level
4. Click "Add Task"

#### Editing a Task
1. Click "Edit" on any task card
2. Modify the details in the modal
3. Click "Save Changes"

#### Completing a Task
1. Click "Complete" on any task
2. Task will be marked with strikethrough
3. Click "Undo" to mark as incomplete

#### Deleting a Task
1. Click "Delete" on any task card
2. Confirm deletion in the dialog

#### Filtering Tasks
Use the filter buttons to view:
- All Tasks
- Pending tasks only
- Completed tasks only
- High priority tasks only

## 🎨 Customization

### Changing Colors

Edit the gradient backgrounds in the HTML files:

```css
.gradient-bg {
    background: linear-gradient(135deg, #2d3b7a 0%, #132799 100%);
}
```

### Modifying Priority Colors

In `dashboard.html`, update the `getPriorityColor()` and `getPriorityBadge()` functions:

```javascript
function getPriorityColor(priority) {
    const colors = {
        low: 'border-green-500',
        medium: 'border-yellow-500',
        high: 'border-red-500'
    };
    return colors[priority];
}
```

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT token-based authentication
- ✅ Token expiration (7 days)
- ✅ Protected API routes
- ✅ Input validation
- ✅ CORS configuration
- ✅ Secure password requirements (minimum 6 characters)

## 🌐 Demo Mode

The application includes a built-in demo mode that activates when the backend server is unavailable:

- All data stored in browser's localStorage
- Full task CRUD functionality
- Automatic fallback from server mode
- No backend required for testing

**Note:** Demo mode data is not synced across devices or browsers.

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Problem:** `MongoDB Connection Error`

**Solution:**
1. Ensure MongoDB is installed and running
2. Check the `MONGO_URI` in `.env`
3. Verify MongoDB service status:
   ```bash
   # Check status
   sudo systemctl status mongod
   
   # Start if not running
   sudo systemctl start mongod
   ```

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
1. Change the PORT in `.env` to a different number (e.g., 5001)
2. Or kill the process using port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -i :5000
   kill -9 <PID>
   ```

### CORS Errors

**Problem:** CORS policy blocking requests

**Solution:**
1. Ensure the backend server is running
2. Check that CORS is properly configured in `server.js`
3. Update the `API_URL` in HTML files to match your server address

### Tasks Not Saving

**Problem:** Tasks disappear after refresh

**Solution:**
1. Check if you're logged in
2. Verify the authentication token is valid
3. Check browser console for errors
4. Ensure MongoDB is running

### Demo Mode Not Working

**Problem:** Demo mode data not persisting

**Solution:**
1. Check if browser's localStorage is enabled
2. Ensure you're not in incognito/private mode
3. Clear browser cache and try again

## 📦 Deployment

### Deploying Backend

#### Heroku
```bash
heroku create smarttask-api
heroku config:set MONGO_URI=<your-mongodb-atlas-uri>
heroku config:set JWT_SECRET=<your-secret>
git push heroku main
```

#### Railway
1. Connect your GitHub repository
2. Add environment variables in dashboard
3. Deploy automatically on push

#### DigitalOcean/AWS/Azure
1. Set up a Node.js droplet/instance
2. Install dependencies
3. Configure environment variables
4. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js
   pm2 save
   pm2 startup
   ```

### Deploying Frontend

#### GitHub Pages
1. Update `API_URL` in HTML files to your backend URL
2. Push to GitHub repository
3. Enable GitHub Pages in repository settings

#### Netlify/Vercel
1. Connect your repository
2. Configure build settings
3. Deploy automatically

#### Traditional Web Hosting
1. Upload HTML files via FTP
2. Update API endpoints
3. Configure CORS on backend

## 🔐 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/smarttask` | Yes |
| `JWT_SECRET` | Secret key for JWT signing | - | Yes |
| `PORT` | Server port number | `5000` | No |
| `NODE_ENV` | Environment mode | `development` | No |

## 🧪 Testing

### Manual Testing Checklist

- [x] User registration with valid data  
- [x] User registration with duplicate email (should fail)  
- [x] User login with correct credentials  
- [x] User login with incorrect credentials (should fail)  
- [x] Create task with all fields  
- [x] Create task with only title  
- [x] Edit task details  
- [x] Toggle task completion status  
- [x] Delete task  
- [x] Filter tasks by status  
- [x] Filter tasks by priority  
- [x] Logout and verify session cleared

### API Testing with cURL

```bash
# Register user
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Add task (replace <TOKEN> with actual token)
curl -X POST http://localhost:5000/api/addTask \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Test Task","priority":"high"}'
```

## 🚧 Roadmap

Future enhancements planned:

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Task due dates and reminders
- [ ] Task categories/tags
- [ ] Collaborative tasks (sharing)
- [ ] Dark mode toggle
- [ ] Task search functionality
- [ ] Data export (CSV, JSON)
- [ ] Mobile app (React Native)
- [ ] Calendar view
- [ ] Task statistics dashboard
- [ ] Drag-and-drop task reordering
- [ ] File attachments
- [ ] Task comments
- [ ] Recurring tasks

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

**TechNova Solutions**

## 🙏 Acknowledgments

- Tailwind CSS for the amazing utility-first CSS framework
- MongoDB for the flexible NoSQL database
- Express.js community for the robust web framework
- JWT for secure authentication
- All open-source contributors

## 📞 Support

For support, questions, or feedback:
- Create an issue on GitHub
- Contact the development team
- Check the troubleshooting section above

---

**Made with ❤️ by Pravesh Burathoki**

**Version:** 1.0.0  
**Last Updated:** 2025
