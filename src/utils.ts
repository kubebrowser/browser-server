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
  } catch (err) {
    console.log(`failed to parse json: ${err}`);
  }
}

export function getEmptyPageContent() {
  return `<div style='position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;display:flex;justify-content:center;align-items:center;flex-direction:column;row-gap:12px;'>
      <p style='opacity: 0.8;font-size:25px;font-family:sans-serif;margin:0;'>Browser Ready</p>
      <p style='opacity: 0.6;font-size:18px;font-family:sans-serif;margin:0;'>Start navigating by entering a url</p>
    </div>
`;
}

export function getNavigatingPageContent(url: string) {
  return `<div style='position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;display:flex;justify-content:center;align-items:center;flex-direction:column;row-gap:12px;'>
      <p style='opacity: 0.8;font-size:25px;font-family:sans-serif;margin:0;'>Navigating...</p>
      <p style='opacity: 0.6;font-size:18px;font-family:sans-serif;margin:0;'> => <code>${url}</code></p>
    </div>
`;
}
