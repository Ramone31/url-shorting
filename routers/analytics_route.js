// const express = require('express');

// const analyticsController = require('../controllers/analyticsController');
// const { createUrlLimiter, analyticsLimiter } = require('../helpers/rate_limit');

// const router = express.Router();



// router.get('/api/analytics/:alias', analyticsLimiter, analyticsController.getUrlAnalytics);
// router.get('/api/analytics/topic/:topic', analyticsLimiter, analyticsController.getTopicAnalytics);
// router.get('/api/analytics/overall', analyticsLimiter, analyticsController.getOverallAnalytics);

// module.exports = router;


const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { createUrlLimiter, analyticsLimiter } = require('../helpers/rate_limit');

const router = express.Router();

/**
 * @swagger
 * /api/analytics/{alias}:
 *   get:
 *     summary: Get URL analytics for a specific alias
 *     description: This endpoint retrieves analytics data (such as clicks, etc.) for a specific shortened URL alias.
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         description: The shortened URL alias
 *         schema:
 *           type: string
 *           example: "abc123"
 *     responses:
 *       200:
 *         description: Successful retrieval of URL analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 alias:
 *                   type: string
 *                   example: "abc123"
 *                 clicks:
 *                   type: integer
 *                   example: 150
 *       404:
 *         description: Alias not found
 *       429:
 *         description: Too many requests (rate limit exceeded)
 */
router.get('/api/analytics/:alias', analyticsLimiter, analyticsController.getUrlAnalytics);

/**
 * @swagger
 * /api/analytics/topic/{topic}:
 *   get:
 *     summary: Get analytics for a specific topic
 *     description: This endpoint retrieves analytics data for a specific topic related to shortened URLs.
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         description: The topic for which analytics are requested
 *         schema:
 *           type: string
 *           example: "marketing"
 *     responses:
 *       200:
 *         description: Successful retrieval of topic analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 topic:
 *                   type: string
 *                   example: "marketing"
 *                 totalClicks:
 *                   type: integer
 *                   example: 500
 *       404:
 *         description: Topic not found
 *       429:
 *         description: Too many requests (rate limit exceeded)
 */
router.get('/api/analytics/topic/:topic', analyticsLimiter, analyticsController.getTopicAnalytics);

/**
 * @swagger
 * /api/analytics/overall:
 *   get:
 *     summary: Get overall analytics
 *     description: This endpoint retrieves overall analytics for all shortened URLs.
 *     responses:
 *       200:
 *         description: Successful retrieval of overall analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUrls:
 *                   type: integer
 *                   example: 1000
 *                 totalClicks:
 *                   type: integer
 *                   example: 10000
 *       429:
 *         description: Too many requests (rate limit exceeded)
 */
router.get('/api/analytics/overall', analyticsLimiter, analyticsController.getOverallAnalytics);

module.exports = router;
