module.exports = {
  log: {
    level: "info",
    disabled: false,
  },
  database: {
    client: "mysql2",
    host: "localhost",
    port: 3306,
    name: "Webservices",
  },
  cors: {
    origins: ["http://localhost:5173"],
    maxAge: 3 * 60 * 60, // 3 hours in ms
  },
};
