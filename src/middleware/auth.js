let currentKeyIndex = 0;

export const validateToken = (req, res, next) => {
    try {
        let authToken = req.headers.authorization?.replace('Bearer ', '');
        
        if (!authToken) {
            return res.status(401).json({ error: 'Authorization token required' });
        }

        // Handle comma-separated keys
        const keys = authToken.split(',').map(key => key.trim());
        if (keys.length > 0) {
            if (currentKeyIndex >= keys.length) {
                currentKeyIndex = 0;
            }
            authToken = keys[currentKeyIndex];
            currentKeyIndex = (currentKeyIndex + 1) % keys.length;
        }

        if (authToken.includes('%3A%3A')) {
            authToken = authToken.split('%3A%3A')[1];
        }

        req.authToken = authToken;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid authorization token' });
    }
}; 