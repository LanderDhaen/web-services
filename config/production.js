module.exports = {
  port: 9000,
  log: {
    level: "info",
    disabled: false,
  },
  cors: {
    origins: ["http://localhost:5173"],
    maxAge: 3 * 60 * 60, // 3 hours in ms
  },
};
