const axios = require('axios').default;

export default axios.create({
    headers: {
        post: {
            'Content-Type':'application/json'
        }
    }
})
