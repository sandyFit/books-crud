const express = require('express');
const { logger } = require('./logger');
const pinoHttp = require('pino-http');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
// Parse request body to JSON
app.use(express.json());

// Apply logger middleware
app.use(
    pinoHttp({
        logger,
        customLogLevel: (res, err) => {
            if (res.statusCode >= 500 || err) return 'error';
            if (res.statusCode >= 400) return 'warn';
            return 'info';
        },
        serilizers: {
            req(req) {
                return {
                    method: req.method,
                    url: req.url
                };
            },
        },

    })
);

app.use('/api/v1/books', bookRoutes);

module.exports = { app };
