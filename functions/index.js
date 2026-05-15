const { onRequest } = require("firebase-functions/v2/https");
const axios = require("axios");

exports.createDailyRoom = onRequest({ 
    cors: true, 
    region: "us-central1",
    timeoutSeconds: 15 
}, async (req, res) => {
    
    // Explicit CORS handshakes
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(204).send('');
    }

    try {
        const dailyKey = process.env.DAILY_API_KEY;
        
        const response = await axios.post("https://api.daily.co/v1/rooms", 
            { properties: { exp: Math.round(Date.now() / 1000) + 3600 } },
            { 
                headers: { Authorization: `Bearer ${dailyKey}` },
                timeout: 5000 
            }
        );

        return res.status(200).send({ data: { url: response.data.url } });

    } catch (error) {
        console.error("Daily Error:", error.response?.data || error.message);
        return res.status(200).send({ data: { error: error.message } });
    }
});
