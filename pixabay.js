const mysql = require('./mysql');
const axios = require('axios');
require('dotenv').config();


const resultIsCached = async (url, query) => {
    let info;

    try {
        info = await mysql.sqlQuery(`SELECT ts, result FROM query_cache WHERE endpoint = ${mysql.mysql.escape(url)} AND query = ${mysql.mysql.escape(query)}`);
    } catch(e) {
        console.error(e);
    }

    if (!info.length) return false;

    const { ts, result } = info[0];

    return JSON.parse(result);
}

exports.imageQuery = async (query, page = 1) => {
    url = 'https://pixabay.com/api/';

    let data = await resultIsCached(url, query);

    if (data === false) {
        const request = {
            url,
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

        try {
            let response = await axios(request);
            data = response.data;
        } catch (e) {
            console.error(e);
            return false;
        }
    
        console.log('adding result to db');
    
        try {
            await mysql.sqlQuery(`INSERT INTO query_cache (endpoint, query, result, ts) VALUES (${mysql.mysql.escape(url)}, ${mysql.mysql.escape(query)}, ${mysql.mysql.escape(JSON.stringify(data))}, ${Date.now()})`);
        } catch (e) {
            console.error(e);
        }
    } else {
        console.log('query is cached');
    }

    const {totalHits, hits} = data;

    //console.log(data, typeof data);

    let result = hits.map(item => {
        let imageURL;

        if (item.fullHDURL) imageURL = item.fullHDURL;
        else if (item.largeImageURL) imageURL = item.largeImageURL;
        else imageURL = item.imageURL;

        let tags = item.tags;

        return { imageURL, tags }
    })

    console.log(result);
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