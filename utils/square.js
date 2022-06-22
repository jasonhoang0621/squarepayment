const { ApiError, Client, Environment } = require('square');

const client = new Client({
    environment: Environment.Sandbox,
    accessToken: 'EAAAEHy65qxNz4Gv37PH1zEwL93yo0Wq91ssPZhfJ2RetWJOZ5vRZldHtGcnJRyL',
});

module.exports = { ApiError, client };
