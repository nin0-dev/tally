import Fastify from "fastify";
import { Yapper } from "./utils/Yapper";

const server = Fastify({
	loggerInstance: new Yapper()
});

server.get("/", (req, res) => {
	return { hello: "world" };
});

server.listen({
	port: parseInt(process.env.PORT ?? "6969")
});
