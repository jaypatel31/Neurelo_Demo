const { legacyCreateProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    legacyCreateProxyMiddleware(
      [
        "/api/users/login",
        "/api/users/tasks",
        "/api/category/new",
        "/api/category/all",
        "/api/users/newtask",
        "/api/users/updatetask",
        "/api/users/deletetask"
      ],
      {
        target: "http://localhost:4000",
      }
    )
  );
};
