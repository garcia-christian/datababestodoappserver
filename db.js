
const Pool = require("pg").Pool;


const pool = new Pool({
   user:"kheuhzlrtuohct",
   password:"32fefb7a29304fa6671bd4337263d41eb9c716a0e2e37143d7dc59faa7370f91",
   host: "ec2-3-212-75-25.compute-1.amazonaws.com",
   port: 5432,
   database: "d8cg5uvlr7fger",
   ssl: {
      rejectUnauthorized: false
   }
});

module.exports = pool;
