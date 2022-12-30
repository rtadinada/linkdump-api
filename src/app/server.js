/**
 * @file The application server
 *
 * @module server
 * */

import express from "express";

/**
 * Create the Express application, setting up the application routes.
 *
 * @returns {express.App} Server application object
 */
export function createApp() {
    const app = express();

    app.get("/health", (req, res, next) => {
        console.log("GET /health");
        return res.send("hello world!\n");
    });

    return app;
}

/**
 * Start the server.
 *
 * @returns {Promise<any>} The promise running the server
 */
export async function main() {
    const app = createApp();

    const port = 2000;
    const server = app.listen(port);
    server.on("listening", () => {
        console.log(`Listening on port ${server.address().port}.`);
    });
}
