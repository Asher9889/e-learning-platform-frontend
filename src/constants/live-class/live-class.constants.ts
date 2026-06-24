export const CLASS_STATUS = {
  SCHEDULED: "SCHEDULED",
  LIVE: "LIVE",
  ENDED: "ENDED",
  CANCELLED: "CANCELLED",
  RECORDED: "RECORDED",
} as const;

export type TClassStatus = typeof CLASS_STATUS[keyof typeof CLASS_STATUS];