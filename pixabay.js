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

    let data = await resultIsCached(url, `${query}:${page}`);

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

        return { url: imageURL, tags }
    })

    return result;
}

exports.videoQuery = async (query, page = 1) => {
    let url = 'https://pixabay.com/api/videos/';

    let data = await resultIsCached(url, `${query}:${page}`);

    if (data === false) {
        const request = {
            url,
            method: 'get',
            params: {
                q: query,
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

    let result = hits.map(item => {
        let size = item.videos.large.width;
        let url = item.videos.large.url;

        if (size > 1920 && item.videos.medium.width >= 1920) {
            size = item.videos.medium.width;
            url = item.videos.medium.url;
        }

        if (size > 1920 && item.videos.small.width >= 1920) {
            size = item.videos.small.width;
            url = item.videos.small.url;
        }

        if (size > 1920 && item.videos.tiny.width >= 1920) {
            size = item.videos.tiny.width;
            url = item.videos.tiny.url;
        }

        let tags = item.tags;

        return { url, tags}
    })

    console.log(result);

    return result;
}