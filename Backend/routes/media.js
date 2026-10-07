import express from 'express';
import pool from '../db.js';
import upload from '../middleware/upload.js';


const router = express.Router();

// ============================================
// POST /api/media
// Upload image/GIF and save it to MySQL
// ============================================

router.post('/', upload.single('media'), async (req, res) => {
    try {

        // Check whether a file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please select an image or GIF.'
            });
        }

        const {
            title,
            description
        } = req.body;

        // Title is required
        if (!title || title.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Media title is required.'
            });
        }

        // Determine media type
        const mediaType = req.file.mimetype === 'image/gif'
            ? 'gif'
            : 'image';


        const sql = `
            INSERT INTO media
            (
                title,
                file_name,
                media_type,
                mime_type,
                description,
                file_size,
                file_data
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            title.trim(),
            req.file.originalname,
            mediaType,
            req.file.mimetype,
            description || null,
            req.file.size,
            req.file.buffer
        ];


        const [result] = await pool.execute(sql, values);


        res.status(201).json({
            success: true,
            message: 'Media uploaded successfully.',
            media: {
                id: result.insertId,
                title: title.trim(),
                file_name: req.file.originalname,
                media_type: mediaType,
                mime_type: req.file.mimetype,
                description: description || null,
                file_size: req.file.size
            }
        });

    } catch (error) {

        console.error('Media upload error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to upload media.'
        });
    }
});

// ============================================
// GET /api/media
// Get all media from MySQL
// ============================================

router.get('/', async (req, res) => {
    try {

        const sql = `
            SELECT
                id,
                title,
                file_name,
                media_type,
                mime_type,
                description,
                file_size,
                file_data,
                created_at
            FROM media
            ORDER BY created_at DESC
        `;

        const [rows] = await pool.execute(sql);

        const media = rows.map((item) => {

            const base64Data = item.file_data.toString('base64');

            return {
                id: item.id,
                title: item.title,
                file_name: item.file_name,
                media_type: item.media_type,
                mime_type: item.mime_type,
                description: item.description,
                file_size: item.file_size,
                created_at: item.created_at,

                // Can be directly used as <img src="">
                url: `data:${item.mime_type};base64,${base64Data}`
            };
        });

        res.status(200).json({
            success: true,
            count: media.length,
            media
        });

    } catch (error) {

        console.error('Get media error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to load media.'
        });
    }
});

// ============================================
// Multer / Upload Error Handler
// ============================================

router.use((error, req, res, next) => {

    if (error instanceof Error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    next(error);
});


export default router;

