/**
 * @file Run the application server
 *
 * @module run
 * */

import { main } from "./server.js";

try {
    await main();
} catch (err) {
    console.error(err);
    process.exit(1);
}
