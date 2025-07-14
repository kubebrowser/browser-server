import { json } from "express";

export function checkEvironment() {
  const requiredVars: string[] = [];
  for (const varName of requiredVars) {
    if (process.env[varName]) continue;
    console.log(`ERROR: Missing required environment variable '${varName}'`);
    process.exit(1);
  }

  const optionalVars = [
    "PORT",
    "ALLOWED_CORS_ORIGINS",
    "BROWSER_WIDTH",
    "BROWSER_HEIGHT",
    "BROWSER_DEPTH",
    "BROWSER_EXECUTABLE_PATH",
    "MODE",
  ];
  for (const varName of optionalVars) {
    if (process.env[varName]) continue;
    console.log(`Warning: Missing optional environment variable '${varName}'`);
  }
}

export function getEnv(name: string, defaultValue: string) {
  return process.env[name] ?? defaultValue;
}

export function parseIntorFail(string: string, valueName: string) {
  const number = parseInt(string);
  if (!isNaN(number)) return number;
  console.log(`ERROR '${valueName}' is not a valid number`);
  process.exit(1);
}

export function safeJson() {
  try {
    json();
  } catch (err) {}
}
