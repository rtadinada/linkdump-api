/**
 * @file The application server
 *
 * @module server
 * */

import express from "express";
import yargs from "yargs";

import { loadConfigFile } from "../lib/util/config/serverConfig.js";
import * as mongoConnectionUtils from "../lib/util/mongodb/mongoConnectionUtils.js";

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
 * Create the server and listen to incoming HTTP reqeusts.
 *
 * @param {string} configFilePath file path to the server configuration
 * @returns {Promise<express.App>} Server application object
 */
export async function start(configFilePath) {
    const config = await loadConfigFile(configFilePath);

    const mongoClient = await mongoConnectionUtils.getConnection(config.mongoDbConnection);
    const app = createApp({ mongoClient });

    const server = app.listen(config.port);
    server.on("listening", () => {
        console.log(`Listening on port ${server.address().port}.`);
    });
}

/**
 * Start the server.
 *
 * @returns {Promise<express.App>} The promise running the server
 */
export async function main() {
    const argv = yargs(process.argv.slice(2))
        .usage("Usage: $0 -c <config-file>")
        .alias("c", "config-file")
        .nargs("c", 1)
        .describe("c", "server config file")
        .demandOption(["c"])
        .help("h")
        .alias("h", "help").argv;

    return start(argv.c);
}
