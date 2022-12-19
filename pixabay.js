const axios = require('axios');
require('dotenv').config();

exports.query = async (query, page = 1) => {
    const request = {
        url: 'https://pixabay.com/api/',
        method: 'get',
        params: {
            q: query,
            orientation: "horizontal",
            per_page: 100,
            page,
            key: process.env.PIXABAY_KEY
        },
        headers: { "Accept-Encoding": "gzip,deflate,compress" } 
    }

    let data;

    try {
        let response = await axios(request);
        data = response.data;
    } catch (e) {
        console.error(e);
        return false;
    }

    console.log(data);
}