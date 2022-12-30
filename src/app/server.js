/**
 * @file The application server
 *
 * @module server
 * */

import express from "express";

import * as mongoConnectionUtils from "../lib/util/mongodb/mongoConnectionUtils.js";

// TODO: REMOVE SENSITIVE INFORMATION
const MONGO_CONFIG = {
    user: "linkdumpApi",
    password: "<your-password-here>",
    host: "localhost",
    port: 27017,
    authenticationDb: "admin",
};

/**
 * Create the Express application, setting up the application routes.
 *
 * @param {mongodb.MongoClient} client  MongoDB client
 * @returns {express.App} Server application object
 */
export function createApp({ mongoClient }) {
    const app = express();

    app.get("/health", async (req, res, next) => {
        const mongodbPingTimeMs = await mongoConnectionUtils.timePing(mongoClient);
        return res.send({ mongodbPingTimeMs });
    });

    return app;
}

/**
 * Start the server.
 *
 * @returns {Promise<any>} The promise running the server
 */
export async function main() {
    const mongoClient = await mongoConnectionUtils.getConnection(MONGO_CONFIG);
    const app = createApp({ mongoClient });

    const port = 2000;
    const server = app.listen(port);
    server.on("listening", () => {
        console.log(`Listening on port ${server.address().port}.`);
    });
}
