/**
 * @file The input configuration for the server.
 *
 * @module serverConfig
 * */

import * as fs from "fs/promises";
import yaml from "js-yaml";

/**
 * Object holding MongoDB connection information.
 *
 * @typdef {Object} MongoDbConnectionConfig
 * @param {string} user MongoDB user
 * @param {string} password Password for the user
 * @param {string} host MongoDB server hostname / IP
 * @param {number} port MongoDB server port
 * @param {string} authenticationDb authentication database in the MongoDB
 *      server that the user is created under
 */

/**
 * Object hoding the server configuration
 *
 * @typedef {Object} ServerConfig
 * @param {number} port port the server should listen on
 * @param {MongoDbConnectionConfig} mongoDbConnection connection
 *      configuration for the MongoDB server
 */

const SERVER_CONFIG_KEYS = ["port", "mongoDbConnection"];
const MONGODB_CONFIG_KEYS = ["user", "password", "host", "port", "authenticationDb"];

/**
 * Validates the input configuration object. Throws error on missing fields.
 *
 * @param {Object} fileContentsObject parsed file data in object
 */
function validateFileContentObject(fileContentsObject) {
    const missingConfigKeys = SERVER_CONFIG_KEYS.filter(
        (key) => !Object.hasOwn(fileContentsObject, key),
    );
    if (missingConfigKeys.length > 0) {
        throw new Error(`Missing key(s) in config object: ${JSON.stringify(missingConfigKeys)}`);
    }

    const mongoDbConnection = fileContentsObject.mongoDbConnection;
    const missingMongoDbConnectionKeys = MONGODB_CONFIG_KEYS.filter(
        (key) => !Object.hasOwn(mongoDbConnection, key),
    );
    if (missingConfigKeys.length > 0) {
        throw new Error(
            `Missing key(s) in MongoDB connection config: ${JSON.stringify(
                missingMongoDbConnectionKeys,
            )}`,
        );
    }
}

/**
 * Parse the server configuration from a config file.
 *
 * @param {string} filePath path to config file
 * @returns {Promise<ServerConfig>} promise resolving to server
 *      configuration
 */
export async function loadConfigFile(filePath) {
    const fileContents = await fs.readFile(filePath, { encoding: "utf8" });
    const fileContentsObject = yaml.load(fileContents);

    validateFileContentObject(fileContentsObject);

    return fileContentsObject;
}
