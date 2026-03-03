const sql = require("mssql/msnodesqlv8");

const config = {
  server: "LEKKI",           
  port: 1433,                   
  database: "LibrayDB",        
  options: {
    trustedConnection: true,    
    trustServerCertificate: true,
  },
  driver: "ODBC Driver 17 for SQL Server",
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("✅ Подключение к SQL Server успешно!");
    return pool;
  })
  .catch((err) => {
    console.error("❌ Ошибка подключения:", err.message);
    console.error("Полная ошибка:", err);
    process.exit(1);
  });

async function query(sqlQuery, params = {}) {
  const pool = await poolPromise;
  const request = pool.request();
  
  Object.keys(params).forEach(key => {
    request.input(key, params[key]);
  });
  
  return request.query(sqlQuery);
}

module.exports = { sql, poolPromise, query };