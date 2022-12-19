let pixabay = require('./pixabay');








async function doIt () {
    await pixabay.query('cars');
}

doIt();