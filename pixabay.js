const axios = require('axios');
require('dotenv').config();

exports.imageQuery = async (query, page = 1) => {
    const request = {
        url: 'https://pixabay.com/api/',
        method: 'get',
        params: {
            q: query,
            orientation: "horizontal",
            per_page: 200,
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

exports.videoQuery = async (query, page = 1) => {
    const request = {
        url: 'https://pixabay.com/api/videos/',
        method: 'get',
        params: {
            q: query,
            per_page: 200,
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