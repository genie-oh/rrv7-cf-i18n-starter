export type LogLevel = "debug" | "info" | "warn" | "error";
export interface I_Logger extends Pick<Console, LogLevel> {}
