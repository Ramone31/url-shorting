const pool = require("../config/db");
const { redisClient } = require("../config/redis");
const shortid = require("shortid");
const uaParser = require("ua-parser-js");
const axios = require("axios");

const { getGeoDataFromIP } = require("../helpers/geo_data");

exports.shortenUrl = async (req, res) => {
  console.log(req.body, "fffffff");

  let longUrl = req.body.longUrl;
  let customAlias = req.body.customAlias;
  let topic = req.body.topic;
  let  user_id=req.body.user_id;

  let token=req.body.token

  const shortUrl = req.body.customAlias || shortid.generate();

  let result;
  try {
    try {
      result = await pool.query(
        `INSERT INTO short_urls (user_id, long_url, short_url, custom_alias, topic)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING short_url, created_at`,
        [user_id, longUrl, shortUrl, customAlias, topic]
      );
    } catch (e) {
      console.log(e);
    }

    const { short_url, created_at } = result.rows[0];

    const cacheKey = short_url;
    const cacheValue = JSON.stringify({
      long_url: longUrl,
      user_id: user_id,
      created_at: created_at,
    });

    await redisClient.set(cacheKey, cacheValue, "EX", 3600);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err });
  }


};

exports.redirectUrl = async (req, res) => {
  const { alias } = req.params;

  try {
    // Get IP address, User Agent, and other data
    const ipAddress = req.ip; // Get the IP address (from headers in production)
    const userAgent = req.get("User-Agent");

    // Parse the User-Agent string for detailed info
    const parser = new uaParser();
    const uaResult = parser.setUA(userAgent).getResult();
    const os = uaResult.os.name; // Operating System
    const deviceType = uaResult.device.type || "desktop"; // Device type (e.g., mobile, tablet)
    const geoData = await getGeoDataFromIP(ipAddress);

    const timestamp = new Date().toISOString();

    let userId;

    // Check Redis cache first
    let longUrl = await redisClient.get(alias);

    let long_url, user_id, created_at;

    if (!longUrl) {
      console.log("jhgjegjfgj");
      // Fallback to Postgres if not found in Redis
      const result = await pool.query(
        "SELECT long_url, user_id FROM short_urls WHERE (short_url = $1 OR custom_alias = $1 )",
        [alias]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Short URL not found" });
      }

      // Cache the result in Redis
      // await redisClient.set(alias, result.rows[0].long_url);
      // longUrl = result.rows[0].long_url;
      userId = result.rows[0].user_id; // Get the user_id (email) for analytics

      long_url = result.rows[0].long_url;
      user_id = result.rows[0].user_id;
      created_at = result.rows[0].created_at;

      const cacheValue = JSON.stringify({ long_url, user_id, created_at });

      await redisClient.set(alias, cacheValue, "EX", 3600); // Cache with an expiration of 1 hour

      // Respond with the long URL
      return res.redirect(long_url);
    }

    const data = JSON.parse(longUrl);

    if (data) {
      userId = data.user_id;
    }

    // Check if this IP has already clicked for this OS
    const uniqueClickResult = await pool.query(
      `SELECT * FROM analytics WHERE short_url = $1 AND ip_address = $2 AND os = $3`,
      [alias, ipAddress, os]
    );

    if (uniqueClickResult.rows.length === 0) {
      // New unique click: Insert the analytics data
      await pool.query(
        `INSERT INTO analytics (short_url, ip_address, user_agent, os, device_type, timestamp, geo_data, user_id)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          alias,
          ipAddress,
          userAgent,
          os,
          deviceType,
          timestamp,
          geoData,
          userId,
        ]
      );
    }

    // Update the unique click count and user count for each OS
    await pool.query(
      `INSERT INTO os_clicks (os, short_url, unique_clicks, unique_users,user_id)
             VALUES ($1, $2, 1, 1,$4)
             ON CONFLICT (os, short_url) 
             DO UPDATE SET 
                unique_clicks = os_clicks.unique_clicks + 1,
                unique_users = os_clicks.unique_users + CASE WHEN NOT EXISTS (SELECT 1 FROM analytics WHERE os = $1 AND short_url = $2 AND ip_address = $3 AND user_id=$4) THEN 1 ELSE 0 END`,
      [os, alias, ipAddress, userId]
    );

    // Redirect to the original long URL
    res.redirect(data.long_url);
    // Redirect to the original long URL
  } catch (err) {
    console.error("Error in redirecting URL:", err);
    res.status(500).json({ error: err.message });
  }
};

// exports.redirectUrl = async (req, res) => {
//     const { alias } = req.params;

//     try {
//         // Get IP address, User Agent, and other data
//         const ipAddress = req.ip; // Get the IP address (from headers in production)
//         const userAgent = req.get('User-Agent');

//         // Parse the User-Agent string for detailed info
//         const parser = new uaParser();
//         const uaResult = parser.setUA(userAgent).getResult();
//         const os = uaResult.os.name; // Operating System
//         const deviceType = uaResult.device.type || 'desktop'; // Device type (e.g., mobile, tablet)

//         // Fetch geolocation data from the IP address
//         const geoData = await getGeoDataFromIP(ipAddress);

//         // Check Redis cache first
//         let longUrl = await redisClient.get(alias);

//         if (!longUrl) {
//             // Fallback to Postgres if not found in Redis
//             const result = await pool.query('SELECT long_url FROM short_urls WHERE (short_url = $1 OR custom_alias = $1 )', [alias]);

//             if (result.rows.length === 0) {
//                 return res.status(404).json({ error: 'Short URL not found' });
//             }

//             // Cache the result in Redis
//             await redisClient.set(alias, result.rows[0].long_url);
//             longUrl = result.rows[0].long_url;
//         }

//         // Save analytics data in the database for unique clicks
//         const timestamp = new Date().toISOString();

//         // Check if this IP has already clicked for this OS
//         const uniqueClickResult = await pool.query(
//             `SELECT * FROM analytics WHERE short_url = $1 AND ip_address = $2 AND os = $3`,
//             [alias, ipAddress, os]
//         );

//         if (uniqueClickResult.rows.length === 0) {
//             // New unique click: Insert the analytics data
//             await pool.query(
//                 `INSERT INTO analytics (short_url, ip_address, user_agent, os, device_type, timestamp, geo_data)
//                  VALUES ($1, $2, $3, $4, $5, $6, $7)`,
//                 [alias, ipAddress, userAgent, os, deviceType, timestamp, geoData]
//             );
//         }

//         // Update the unique click count and user count for each OS
//         await pool.query(
//             `INSERT INTO os_clicks (os, short_url, unique_clicks, unique_users)
//              VALUES ($1, $2, 1, 1)
//              ON CONFLICT (os, short_url)
//              DO UPDATE SET
//                 unique_clicks = os_clicks.unique_clicks + 1,
//                 unique_users = os_clicks.unique_users + CASE WHEN NOT EXISTS (SELECT 1 FROM analytics WHERE os = $1 AND short_url = $2 AND ip_address = $3) THEN 1 ELSE 0 END`,
//             [os, alias, ipAddress]
//         );

//         // Redirect to the original long URL
//         res.redirect(longUrl);
//     } catch (err) {
//         console.error("Error in redirecting URL:", err);
//         res.status(500).json({ error: err.message });
//     }
// };
