import { MongoClient } from "mongodb";

/**
 * Creates a MongoDB client given the server parameters
 *
 * @param {Object} params
 * @param {string} params.user              MongoDB user
 * @param {string} params.password          MongoDB password
 * @param {number} params.port              MongoDB host
 * @param {number} params.port              MongoDB port
 * @param {string} params.authenticationDb  MongoDB authentication database name
 * @returns {Promise<mongodb.MongoClient>} Client to interact with MongoDB server
 */
export async function getConnection({ user, password, host, port, authenticationDb }) {
    const uri = `mongodb://${user}:${password}@${host}:${port}/${authenticationDb}`;
    const client = new MongoClient(uri);
    await client.connect();

    await timePing(client); // test connection

    return client;
}

/**
 * Resolves with the number of milliseconds it takes for a ping to execute on
 * the supplied MongoDB client.
 *
 * @param {mongodb.MongoClient} client  MongoDB client
 * @returns {Promise<number>} Ping latency
 */
export async function timePing(client) {
    const start = Date.now();

    return client
        .db("admin")
        .command({ ping: 1 })
        .then(() => Date.now() - start);
}
