import * as express from "express";

import { Server } from "http";
import { initialiseRoutes } from "./routes/routes";
import { printNewLine } from "./helpers/helpers";
import { validateConfig } from "./config/validate_config";
import { getConfig } from "./config/config";

try {
	printNewLine();

	const config = getConfig();

	if (!validateConfig(config)) {
		console.log("β Config not setup!");
		process.exit(1); // exit with a non-zero error code
	}

	console.log("β Valid configuration found.");

	printNewLine();

	console.log("π« Initialising Server...");
	const app = express();

	console.log("π Enabling JSON middleware...");
	app.use(express.json());

	console.log("π Enabling URL-Encoded middleware...");
	app.use(express.urlencoded({ extended: true }));

	initialiseRoutes(app);

	const server = app
		.listen(config.port, () => {
			console.log(`β­ Server is now listening on port: β ${config.port} β­`);
			printNewLine();
			console.log(`β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­`);
			console.log(
				`β­    Health check at "http://localhost:${config.port}/"      β­`
			);
			console.log(
				`β­    Or try "http://localhost:${config.port}/api/posts/all"  β­`
			);
			console.log(`β­    πΊοΈ  Explore to find other routes too!          β­`);
			console.log(`β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­β­`);
		})
		.on("error", (error) => {
			console.error("π¨ Express Error Handler π¨ ");
			console.error(error);
		});

	process.on("SIGINT", () => handleShutdown(server));
	process.on("SIGTERM", () => handleShutdown(server));
	process.on("SIGHUP", () => handleShutdown(server));
} catch (e: unknown) {
	console.error("π¨ Top level Error caught π¨ ");
	console.error((e as Error).message);
}

function handleShutdown(server: Server) {
	console.log("πͺ Closing Server...");
	server.close(() => {
		console.log("π₯ Express server closed β");
		process.exit(0);
	});
}
