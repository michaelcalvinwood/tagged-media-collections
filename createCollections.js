let pixabay = require('./pixabay');
let mysql = require('./mysql');







async function doIt () {
    let query = `CREATE TABLE IF NOT EXISTS query_cache (
        endpoint VARCHAR(512) NOT NULL,
        query VARCHAR(256) NOT NULL,
        result MEDIUMTEXT NOT NULL,
        ts BIGINT(11) NOT NULL,
        PRIMARY KEY (endpoint, query)
    ) ENGINE=InnoDB`;

    await mysql.sqlQuery(query);

    await pixabay.imageQuery('cars');
}

doIt();