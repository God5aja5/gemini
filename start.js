import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { createServer } = require("http");
const app = require("./dist/index.js");

const server = createServer(app);
server.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
