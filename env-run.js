const fs = require('fs');
const path = require('path');

// Define the paths
const envFilePath = path.resolve(__dirname, '.env');
const configFilePath = path.resolve(__dirname, 'env-config.js');

// Recreate the config file
fs.writeFileSync(configFilePath, 'window._env_ = {\n');

// Read the .env file line by line
const envFileContent = fs.readFileSync(envFilePath, 'utf-8');
const lines = envFileContent.split('\n');

lines.forEach((line) => {
  // Process only lines that contain `=` (key=value pairs)
  if (line.includes('=')) {
    const [varname, ...varvalueParts] = line.split('=');
    const varvalue = varvalueParts.join('=').trim();

    // Get the value from the environment or fall back to the .env file value
    const value = process.env[varname] || varvalue;

    // Append the key-value pair to the JS file
    fs.appendFileSync(configFilePath, `  ${varname}: "${value}",\n`);
  }
});

// Close the object in the JS file
fs.appendFileSync(configFilePath, '};\n');

console.log('Environment configuration file has been created successfully.');
