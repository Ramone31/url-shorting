const pool = require("../config/db"); // Import your pg-pool instance

// Helper function to execute queries
const executeQuery = async (query, params = []) => {
  const result = await pool.query(query, params);
  return result.rows;
};

// Controller for URL Analytics
exports.getUrlAnalytics = async (req,res) => {

  let alias=req.params.alias

  const totalClicksQuery = `
    SELECT COUNT(*) AS total_clicks FROM analytics WHERE short_url = $1
  `;
  const uniqueUsersQuery = `
    SELECT COUNT(DISTINCT user_id) AS unique_users FROM analytics WHERE short_url = $1
  `;
  const clicksByDateQuery = `
    SELECT DATE("timestamp") AS date, COUNT(*) AS click_count
    FROM analytics
    WHERE short_url = $1 AND "timestamp" >= NOW() - INTERVAL '7 days'
    GROUP BY DATE("timestamp")
    ORDER BY date ASC
  `;
  const osTypeQuery = `
    SELECT os AS os_name, COUNT(*) AS unique_clicks, COUNT(DISTINCT user_id) AS unique_users
    FROM analytics
    WHERE short_url = $1
    GROUP BY os
  `;
  const deviceTypeQuery = `
    SELECT device_type AS device_name, COUNT(*) AS unique_clicks, COUNT(DISTINCT user_id) AS unique_users
    FROM analytics
    WHERE short_url = $1
    GROUP BY device_type
  `;

  const [totalClicks, uniqueUsers, clicksByDate, osType, deviceType] = await Promise.all([
    executeQuery(totalClicksQuery, [alias]),
    executeQuery(uniqueUsersQuery, [alias]),
    executeQuery(clicksByDateQuery, [alias]),
    executeQuery(osTypeQuery, [alias]),
    executeQuery(deviceTypeQuery, [alias]),
  ]);

  res.send( {
    totalClicks: parseInt(totalClicks[0]?.total_clicks || "0"),
    uniqueUsers: parseInt(uniqueUsers[0]?.unique_users || "0"),
    clicksByDate,
    osType,
    deviceType,
  })
};

// // Controller for Topic-Based Analytics
exports.getTopicAnalytics = async (req,res) => {

  let topic=req.params.topic

  const totalClicksQuery = `
    SELECT COUNT(*) AS total_clicks FROM analytics
    WHERE short_url IN (SELECT short_url FROM short_urls WHERE topic = $1)
  `;
  const uniqueUsersQuery = `
    SELECT COUNT(DISTINCT user_id) AS unique_users FROM analytics
    WHERE short_url IN (SELECT short_url FROM short_urls WHERE topic = $1)
  `;
  const clicksByDateQuery = `
    SELECT DATE("timestamp") AS date, COUNT(*) AS click_count
    FROM analytics
    WHERE short_url IN (SELECT short_url FROM short_urls WHERE topic = $1)
    GROUP BY DATE("timestamp")
    ORDER BY date ASC
  `;
  const urlsQuery = `
    SELECT u.short_url, COUNT(a.id) AS total_clicks, COUNT(DISTINCT a.user_id) AS unique_users
    FROM short_urls u
    LEFT JOIN analytics a ON u.short_url = a.short_url
    WHERE u.topic = $1
    GROUP BY u.short_url
  `;

  const [totalClicks, uniqueUsers, clicksByDate, short_urls] = await Promise.all([
    executeQuery(totalClicksQuery, [topic]),
    executeQuery(uniqueUsersQuery, [topic]),
    executeQuery(clicksByDateQuery, [topic]),
    executeQuery(urlsQuery, [topic]),
  ]);

res.send( {
    totalClicks: parseInt(totalClicks[0]?.total_clicks || "0"),
    uniqueUsers: parseInt(uniqueUsers[0]?.unique_users || "0"),
    clicksByDate,
    short_urls,
  })
};

// Controller for Overall Analytics
exports.getOverallAnalytics = async (req,res) => {

  try{

    console.log("hi")
 let userId=req.query.user_id

 console.log(userId,"fff")





  const totalUrlsQuery = `SELECT COUNT(*) AS total_urls FROM short_urls WHERE user_id = $1 `;


  const totalClicksQuery = `SELECT COUNT(*) AS total_clicks FROM analytics WHERE short_url IN (SELECT short_url FROM short_urls WHERE user_id = $1)`;


  const uniqueUsersQuery = `
    SELECT COUNT(DISTINCT user_id) AS unique_users FROM analytics
    WHERE short_url IN (SELECT short_url FROM short_urls WHERE user_id = $1)
  `;
  const clicksByDateQuery = `
    SELECT DATE("timestamp") AS date, COUNT(*) AS click_count
    FROM analytics
    WHERE short_url IN (SELECT short_url FROM short_urls WHERE user_id = $1)
    GROUP BY DATE("timestamp")
    ORDER BY date ASC
  `;
  const osTypeQuery = `
    SELECT os AS os_name, COUNT(*) AS unique_clicks, COUNT(DISTINCT user_id) AS unique_users
    FROM analytics
    WHERE short_url IN (SELECT short_url FROM short_urls WHERE user_id = $1)
    GROUP BY os
  `;
  const deviceTypeQuery = `
    SELECT device_type AS device_name, COUNT(*) AS unique_clicks, COUNT(DISTINCT user_id) AS unique_users
    FROM analytics
    WHERE short_url IN (SELECT short_url FROM short_urls WHERE user_id = $1)
    GROUP BY device_type
  `;

  const [totalUrls, totalClicks, uniqueUsers, clicksByDate, osType, deviceType] = await Promise.all([
    executeQuery(totalUrlsQuery, [userId]),
    executeQuery(totalClicksQuery, [userId]),
    executeQuery(uniqueUsersQuery, [userId]),
    executeQuery(clicksByDateQuery, [userId]),
    executeQuery(osTypeQuery, [userId]),
    executeQuery(deviceTypeQuery, [userId]),
  ]);

  res.send( {
    totalUrls: parseInt(totalUrls[0]?.total_urls || "0"),
    totalClicks: parseInt(totalClicks[0]?.total_clicks || "0"),
    uniqueUsers: parseInt(uniqueUsers[0]?.unique_users || "0"),
    clicksByDate,
    osType,
    deviceType,
  })
  }catch(e){
    console.log(e)
  }


};
