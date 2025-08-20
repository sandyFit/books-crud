const dotenv = require('dotenv');
dotenv.config();
const { app } = require('./src/app');
const { logger } = require('./src/logger');

const port = process.env.PORT || 7500;
const env = process.env.ENVIRONMENT;

app.listen(
    port, () => {
        console.log(`Server listening from port ${port} in mode ${env}`);
    }
)
