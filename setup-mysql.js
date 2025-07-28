#!/usr/bin/env node

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

async function setupMySQL() {
  console.log(" MySQL Setup Starting...\n");

  // Check if .env exists
  const envPath = path.join(__dirname, "backend", ".env");
  if (!fs.existsSync(envPath)) {
    console.log("Creating .env file from template...");
    const envExamplePath = path.join(__dirname, "backend", ".env.example");
    fs.copyFileSync(envExamplePath, envPath);
    console.log("Created backend/.env");
    console.log(
      " Please update the DATABASE_URL in backend/.env with your MySQL credentials\n",
    );
  }

  // Read current .env
  const envContent = fs.readFileSync(envPath, "utf8");
  const dbUrl = envContent.match(/DATABASE_URL=(.+)/)?.[1];

  if (!dbUrl) {
    console.log(" DATABASE_URL not found in .env file");
    return false;
  }

  console.log(" Testing MySQL connection...");
  console.log(`   Using: ${dbUrl.replace(/\/\/.*@/, "//***:***@")}\n`);

  try {
    // Parse the database URL
    const url = new URL(dbUrl);
    const connectionConfig = {
      host: url.hostname,
      port: url.port || 3306,
      user: url.username,
      password: url.password,
    };

    // Test connection without database first
    const connection = await mysql.createConnection(connectionConfig);
    console.log(" MySQL connection successful");

    // Check if database exists
    const dbName = url.pathname.slice(1); // Remove leading slash
    const [rows] = await connection.execute(
      "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?",
      [dbName],
    );

    if (rows.length === 0) {
      console.log(` Creating database '${dbName}'...`);
      await connection.execute(`CREATE DATABASE \`${dbName}\``);
      console.log(" Database created successfully");
    } else {
      console.log(` Database '${dbName}' already exists`);
    }

    await connection.end();
    return true;
  } catch (error) {
    console.log("ERROR: MySQL connection failed:");

    if (error.code === "ECONNREFUSED") {
      console.log("   MySQL server is not running or not accessible");
      console.log("   Please start MySQL with one of these commands:");
      console.log("   • sudo systemctl start mysql (Linux)");
      console.log("   • brew services start mysql (Mac)");
      console.log("   • Start MySQL from XAMPP/WAMP (Windows)");
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.log("   Invalid username or password");
      console.log("   Please update DATABASE_URL in backend/.env");
    } else {
      console.log(`   ${error.message}`);
    }

    console.log("\n Common DATABASE_URL formats:");
    console.log("   mysql://username:password@localhost:3306/database_name");
    console.log("   mysql://root:@localhost:3306/watchlist (no password)");
    console.log("   mysql://root:password@localhost:3306/watchlist");

    return false;
  }
}

if (require.main === module) {
  setupMySQL().then((success) => {
    if (success) {
      console.log("\n MySQL setup completed successfully!");
      console.log("   You can now run: npm run dev");
    } else {
      console.log("\n MySQL setup failed. Please fix the issues above.");
      process.exit(1);
    }
  });
}

module.exports = { setupMySQL };

