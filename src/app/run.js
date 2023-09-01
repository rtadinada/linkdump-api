/**
 * @file Run the application server
 *
 * @module run
 * */

import { loadConfigFile } from "../lib/util/config/serverConfig.js";
import { main } from "./server.js";

try {
    const config = await loadConfigFile("config/config.dev.yaml");
    console.log(config);
    // await main();
} catch (err) {
    console.error(err);
    process.exit(1);
}
