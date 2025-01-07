const axios = require('axios');

const getGeoDataFromIP = async (ip) => {
    try {
        // Use ipinfo.io or ipstack to get the geolocation
        const response = await axios.get(`https://ipinfo.io/${ip}/json?token=${process.env.IPINFO_TOKEN}`);
        return response.data; // Contains geolocation data (city, country, etc.)
    } catch (error) {
        console.error("Error fetching geolocation data:", error);
        return null;
    }
};

module.exports = { getGeoDataFromIP };
