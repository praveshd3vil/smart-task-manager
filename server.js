// server.js - Complete Backend Server for SmartTask Manager
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smarttask';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Task Schema
const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// ==================== API ENDPOINTS ====================

// 1. Register a new user
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// 2. Login user
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// 3. Add a new task
app.post('/api/addTask', authenticateToken, async (req, res) => {
    try {
        const { title, description, priority } = req.body;

        // Validation
        if (!title) {
            return res.status(400).json({ message: 'Task title is required' });
        }

        const task = new Task({
            userId: req.user.userId,
            title,
            description: description || '',
            priority: priority || 'medium',
            completed: false
        });

        await task.save();

        res.status(201).json({
            message: 'Task added successfully',
            task
        });
    } catch (error) {
        console.error('Add task error:', error);
        res.status(500).json({ message: 'Server error while adding task' });
    }
});

// 4. Get all tasks for logged-in user
app.get('/api/getTasks', authenticateToken, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.userId })
            .sort({ createdAt: -1 });

        res.json({
            message: 'Tasks retrieved successfully',
            tasks,
            count: tasks.length
        });
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ message: 'Server error while fetching tasks' });
    }
});

// 5. Update a task
app.put('/api/updateTask/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, priority, completed } = req.body;

        // Find task and verify ownership
        const task = await Task.findOne({ _id: id, userId: req.user.userId });
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }

        // Update fields
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (priority !== undefined) task.priority = priority;
        if (completed !== undefined) task.completed = completed;
        task.updatedAt = Date.now();

        await task.save();

        res.json({
            message: 'Task updated successfully',
            task
        });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ message: 'Server error while updating task' });
    }
});

// 6. Delete a task
app.delete('/api/deleteTask/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete task (verify ownership)
        const task = await Task.findOneAndDelete({ _id: id, userId: req.user.userId });

        if (!task) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }

        res.json({
            message: 'Task deleted successfully',
            task
        });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ message: 'Server error while deleting task' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'SmartTask Manager API',
        endpoints: {
            register: 'POST /api/register',
            login: 'POST /api/login',
            addTask: 'POST /api/addTask',
            getTasks: 'GET /api/getTasks',
            updateTask: 'PUT /api/updateTask/:id',
            deleteTask: 'DELETE /api/deleteTask/:id'
        }
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}`);
});