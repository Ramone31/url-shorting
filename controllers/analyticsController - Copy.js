const db = require('../config/db');

// Get analytics for a specific URL alias
const getUrlAnalytics = async (req, res) => {
  const { alias } = req.params;

  try {
    // Query for analytics data
    const analyticsQuery = `
      SELECT
        COUNT(*) AS total_clicks,
        COUNT(DISTINCT ip_address) AS unique_users,
        json_agg(
          json_build_object('date', DATE(timestamp), 'clicks', COUNT(*))
        ) AS clicks_by_date
      FROM os_clicks
      WHERE alias = $1
      GROUP BY DATE(timestamp)`;

    const analyticsResult = await db.query(analyticsQuery, [alias]);

    if (analyticsResult.rows.length === 0) {
      return res.status(404).json({ message: 'No analytics found for this alias' });
    }

    res.json(analyticsResult.rows[0]);
  } catch (err) {
    console.error('Error fetching URL analytics:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get topic-based analytics
const getTopicAnalytics = async (req, res) => {
  const { topic } = req.params;

  try {
    const analyticsQuery = `
      SELECT
        COUNT(*) AS total_clicks,
        COUNT(DISTINCT ip_address) AS unique_users,
        json_agg(
          json_build_object('date', DATE(timestamp), 'clicks', COUNT(*))
        ) AS clicks_by_date,
        json_agg(
          json_build_object(
            'short_url', u.short_url,
            'total_clicks', COUNT(*),
            'unique_users', COUNT(DISTINCT ip_address)
          )
        ) AS urls
      FROM os_clicks c
      JOIN urls u ON u.alias = c.alias
      WHERE u.topic = $1
      GROUP BY u.topic`;

    const analyticsResult = await db.query(analyticsQuery, [topic]);

    if (analyticsResult.rows.length === 0) {
      return res.status(404).json({ message: 'No analytics found for this topic' });
    }

    res.json(analyticsResult.rows[0]);
  } catch (err) {
    console.error('Error fetching topic analytics:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get overall analytics for all URLs of a user
const getOverallAnalytics = async (req, res) => {
  const userId = req.params.userid;

  try {
    const analyticsQuery = `
      SELECT
        COUNT(*) AS total_urls,
        COUNT(*) FILTER (WHERE c.alias IS NOT NULL) AS total_clicks,
        COUNT(DISTINCT ip_address) AS unique_users,
        json_agg(
          json_build_object('date', DATE(c.timestamp), 'clicks', COUNT(*))
        ) AS clicks_by_date
      FROM public.analytics  u
      LEFT JOIN public.os_clicks c ON u.short_url = c.short_url
      WHERE u.user_id = $1
      GROUP BY u.user_id`;

    const analyticsResult = await db.query(analyticsQuery, [userId]);

    if (analyticsResult.rows.length === 0) {
      return res.status(404).json({ message: 'No analytics found for this user' });
    }

    res.json(analyticsResult.rows[0]);
  } catch (err) {
    console.error('Error fetching overall analytics:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getUrlAnalytics,
  getTopicAnalytics,
  getOverallAnalytics,
};
