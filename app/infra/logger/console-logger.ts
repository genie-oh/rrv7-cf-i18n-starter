import type { I_Logger, LogLevel } from "./types";

const LOG_LEVELS: LogLevel[] = ["debug", "info", "warn", "error"];

export default class ConsoleLogger implements I_Logger {
  private currentLevel: LogLevel;

  constructor(config: { level: LogLevel }) {
    this.currentLevel = config.level;
  }

  private shouldLog(method: LogLevel): boolean {
    return LOG_LEVELS.indexOf(method) >= LOG_LEVELS.indexOf(this.currentLevel);
  }

  debug(message?: any, ...optionalParams: any[]): void {
    if (this.shouldLog("debug")) {
      console.debug(`[DEBUG] ${message}`, ...optionalParams);
    }
  }

  info(message?: any, ...optionalParams: any[]): void {
    if (this.shouldLog("info")) {
      console.info(`[INFO] ${message}`, ...optionalParams);
    }
  }

  warn(message?: any, ...optionalParams: any[]): void {
    if (this.shouldLog("warn")) {
      console.warn(`[WARN] ${message}`, ...optionalParams);
    }
  }

  error(message?: any, ...optionalParams: any[]): void {
    if (this.shouldLog("error")) {
      console.error(`[ERROR] ${message}`, ...optionalParams);
    }
  }
}
