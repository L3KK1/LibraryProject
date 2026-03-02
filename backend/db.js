//Создаёт "pool" подключений к SQL Server. Подключается один раз при старте и держит соединение открытым для всех запросов.

const sql = require("mssql/msnodesqlv8");

const config = {
  server: "AP-SBU08-\\SQLEXPRESS", // твой SQL Server instance ИЗМЕНИТЬ!!!!!!!!!!
  database: "LibraryDB", // имя бд
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
  },
  driver: "msnodesqlv8",
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("✅ Подключение успешно!");
    return pool;
  })
  .catch((err) => {
    console.error("❌ Ошибка:", err.message);
    process.exit(1);
  });

module.exports = { sql, poolPromise };
