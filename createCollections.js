let pixabay = require('./pixabay');
let mysql = require('./mysql');

async function createTables () {
    let query = `CREATE TABLE IF NOT EXISTS query_cache (
        endpoint VARCHAR(512) NOT NULL,
        query VARCHAR(256) NOT NULL,
        result MEDIUMTEXT NOT NULL,
        ts BIGINT(11) NOT NULL,
        PRIMARY KEY (endpoint, query)
    ) ENGINE=InnoDB`;

    await mysql.sqlQuery(query);

    query = `CREATE TABLE IF NOT EXISTS media_id (
        uuid VARCHAR(128) NOT NULL,
        url VARCHAR(512) NOT NULL,
        type VARCHAR(64) NOT NULL,
        tags VARCHAR(2048) DEFAULT '',
        status VARCHAR(64) NOT NULL,
        PRIMARY KEY(uuid),
        UNIQUE INDEX(url)
    )`;

    await mysql.sqlQuery(query);

    query = `CREATE TABLE IF NOT EXISTS media_tags (
        tag VARCHAR(128) NOT NULL,
        uuid VARCHAR(128) NOT NULL,
        PRIMARY KEY (tag, uuid),
        INDEX(tag)
    )`

    await mysql.sqlQuery(query);

    query = `CREATE TABLE IF NOT EXISTS media_collections (
        name VARCHAR(128) NOT NULL,
        ids MEDIUMTEXT NOT NULL,
        tags VARCHAR(2048),
        PRIMARY KEY(name)
    )`

    await mysql.sqlQuery(query);
}

async function processResults (results) {
    for (let i = 0; i < results.length; ++i) {
        let {url, tags} = results[i];

        let test = await mysql.sqlQuery(`SELECT uuid FROM media_id WHERE url = ${mysql.mysql.escape(url)}`);

        if (test.length) continue;

        console.log(url);
    }
}

async function doIt () {
    
    await createTables();

    let results = await pixabay.videoQuery('cars');

    processResults(results);
}

doIt();