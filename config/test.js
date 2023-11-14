module.exports = {
  log: {
    level: "silly",
    disabled: false,
  },
  cors: {
    origins: ["http://localhost:5173"],
    maxAge: 3 * 60 * 60, // 3 hours in ms
  },
  database: {
    client: "mysql2",
    host: "localhost",
    port: 3306,
    name: "Webservices_test",
    username: "root",
    password: "Lakalo/30",
  },
};
