export default {
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost'
    },
    cursor: {
        apiUrl: 'https://api2.cursor.sh/aiserver.v1.AiService/StreamChat',
        checksum: 'zo6Qjequ9b9734d1f13c3438ba25ea31ac93d9287248b9d30434934e9fcbfa6b3b22029e/7e4af391f67188693b722eff0090e8e6608bca8fa320ef20a0ccb5d7d62dfdef',
        clientVersion: '0.42.3'
    },
    models: [
        {
            id: "claude-3.5-sonnet",
            object: "model",
            created: 1706745938,
            owned_by: "cursor"
        },
        // ... other models
    ]
}; 