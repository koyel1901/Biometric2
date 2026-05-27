const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'admin123';

// Database connection
const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_9zHMZ3WAvpFP@ep-billowing-hall-a8ma5mt0-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: { rejectUnauthorized: false }
});

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// ─── DATABASE INIT ────────────────────────────────────────────────────────────
async function initializeDatabase() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS wastes (
                id SERIAL PRIMARY KEY,
                image_id VARCHAR(255) NOT NULL,
                image_url TEXT NOT NULL,
                location TEXT NOT NULL,
                city VARCHAR(255) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                cleared_image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Database initialized');
    } catch (error) {
        console.error('❌ Database error:', error.message);
    }
}

// ─── TEST ROUTE (to verify server is working) ─────────────────────────────────
app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'Server is working!' });
});

// ─── AUTH ROUTES ──────────────────────────────────────────────────────────────
app.post('/api/auth/admin', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.json({ success: true, message: 'Authenticated' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

// ─── WASTE ROUTES ─────────────────────────────────────────────────────────────

// Get all waste reports
app.get('/api/waste', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM wastes ORDER BY created_at DESC');
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get waste reports by phone
app.get('/api/waste/user/:phone', async (req, res) => {
    const { phone } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM wastes WHERE phone = $1 ORDER BY created_at DESC',
            [phone]
        );
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get distinct cities
app.get('/api/cities', async (req, res) => {
    try {
        const result = await pool.query('SELECT DISTINCT city FROM wastes ORDER BY city ASC');
        res.json({ success: true, data: result.rows.map(r => r.city) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create new waste report
app.post('/api/waste', async (req, res) => {
    const { image_id, image_url, location, city, phone, status } = req.body;
    
    console.log('Received waste report:', { image_id, location, city, phone }); // Debug log

    if (!image_id || !image_url || !location || !city || !phone) {
        return res.status(400).json({ 
            success: false, 
            message: 'Missing required fields' 
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO wastes (image_id, image_url, location, city, phone, status)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [image_id, image_url, location, city, phone, status || 'pending']
        );
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error creating waste:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update waste status
app.put('/api/waste/:id', async (req, res) => {
    const { id } = req.params;
    const { status, cleared_image_url } = req.body;

    try {
        const result = await pool.query(
            `UPDATE wastes
             SET status = $1,
                 cleared_image_url = COALESCE($2, cleared_image_url),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $3
             RETURNING *`,
            [status, cleared_image_url || null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Not found' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error updating waste:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── SERVE HTML ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
async function startServer() {
    await initializeDatabase();
    app.listen(PORT, () => {
        console.log(`\n🚀 Server running on http://localhost:${PORT}`);
        console.log(`🔧 Test API: http://localhost:${PORT}/api/test`);
        console.log(`👑 Admin password: ${ADMIN_PASSWORD}\n`);
    });
}

startServer().catch(console.error);