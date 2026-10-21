import { createLogger,format,transports,addColors } from "winston";


addColors({
  error: "red",
  warn: "yellow",
  info: "blue",
  debug: "gray",
});

const consoleFormat = format.combine(
  format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  format.colorize({ level: true }),
  format.errors({ stack: true }),
  format.printf(({ timestamp, level, label, message, stack }) => {
    const source = label ?? "MarketPlace API";

    if (stack) {
      return `${timestamp} [${level}] [${source}] ${message}\n${stack}`;
    }

    return `${timestamp} [${level}] [${source}] ${message}`;
  })
);

const logger = createLogger({
    level:"debug",
    format:consoleFormat,
    transports:[
        new transports.Console()
    ]
})

export default logger;