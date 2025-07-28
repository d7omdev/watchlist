#!/usr/bin/env node

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

async function testConnection() {
  console.log(" Testing MySQL Connection...\n");

  // Read .env file
  const envPath = path.join(__dirname, "backend", ".env");
  if (!fs.existsSync(envPath)) {
    console.log(" backend/.env file not found");
    console.log("   Run: cp backend/.env.example backend/.env");
    return;
  }

  const envContent = fs.readFileSync(envPath, "utf8");
  const dbUrl = envContent.match(/DATABASE_URL=(.+)/)?.[1];

  if (!dbUrl) {
    console.log(" DATABASE_URL not found in .env file");
    return;
  }

  console.log(
    `Connection string: ${dbUrl.replace(/\/\/.*@/, "//***:***@")}`,
  );

  try {
    const url = new URL(dbUrl);
    const connection = await mysql.createConnection({
      host: url.hostname,
      port: url.port || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
    });

    console.log("Connection successful!");

    // Test a simple query
    await connection.execute("SELECT 1 as test");
    console.log("Query test passed");

    await connection.end();
    console.log("\n MySQL is ready for the application!");
  } catch (error) {
    console.log("ERROR: Connection failed:");
    console.log(`   ${error.message}`);

    if (error.code === "ECONNREFUSED") {
      console.log("\n MySQL server is not running. Start it with:");
      console.log("   • Linux: sudo systemctl start mysql");
      console.log("   • Mac: brew services start mysql");
      console.log("   • Windows: Start MySQL from XAMPP/WAMP");
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.log("\n Invalid credentials. Update backend/.env with correct:");
      console.log(
        "   DATABASE_URL=mysql://username:password@localhost:3306/watchlist",
      );
    } else if (error.code === "ER_BAD_DB_ERROR") {
      console.log("\n Database does not exist. Create it with:");
      console.log('   mysql -u root -p -e "CREATE DATABASE watchlist;"');
    }
  }
}

testConnection();

