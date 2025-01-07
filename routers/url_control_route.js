// const express = require('express');
// const { shortenUrl, redirectUrl } = require('../controllers/urlController');
// const { createUrlLimiter } = require('../helpers/rate_limit');

// const router = express.Router();
// try{
// router.post('/api/shorten', createUrlLimiter, shortenUrl);
// router.get('/api/shorten/:alias', redirectUrl);
// }catch(e){
//     console.log(e)
// }
// module.exports = router;



const express = require('express');
const { shortenUrl, redirectUrl } = require('../controllers/urlController');
const { createUrlLimiter } = require('../helpers/rate_limit');

const router = express.Router();

/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Shorten a URL
 *     description: This endpoint shortens a long URL and returns a shortened alias.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 example: "https://example.com/some/very/long/url"
 *               customAlias:
 *                 type: string
 *                 example: "example1234"
 *               user_id:
 *                 type: string
 *                 example: "your_mail@gmail.com"
 *               topic:
 *                 type: string
 *                 example: "education"
 *     responses:
 *       201:
 *         description: Successfully shortened URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 alias:
 *                   type: string
 *                   example: "abc123"
 *                 longUrl:
 *                   type: string
 *                   example: "https://example.com/some/very/long/url"
 *                 customAlias:
 *                   type: string
 *                   example: "example1234"
 *                 user_id:
 *                   type: string
 *                   example: "ramkumar311097@gmail.com"
 *                 topic:
 *                   type: string
 *                   example: "education"
 *       400:
 *         description: Invalid URL
 *       429:
 *         description: Too many requests (rate limit exceeded)
 */

router.post('/api/shorten', createUrlLimiter, shortenUrl);

/**
 * @swagger
 * /api/shorten/{alias}:
 *   get:
 *     summary: Redirect to the original URL
 *     description: This endpoint redirects to the original URL based on the shortened alias.
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         description: The shortened alias
 *         schema:
 *           type: string
 *           example: "abc123"
 *     responses:
 *       301:
 *         description: Redirecting to the original URL
 *       404:
 *         description: Alias not found
 */
router.get('/api/shorten/:alias', redirectUrl);

module.exports = router;

