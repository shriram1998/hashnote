const axios = require('axios').default;

export default axios.create({
    baseURL: process.env.APP_URL || "http://localhost:3000",
    headers: {
        post: {
            'Content-Type':'application/json'
        }
    }
})