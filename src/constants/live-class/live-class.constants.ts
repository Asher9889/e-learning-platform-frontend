export const CLASS_STATUS = {
  SCHEDULED: "SCHEDULED",
  LIVE: "LIVE",
  ENDED: "ENDED",
  CANCELLED: "CANCELLED",
  RECORDED: "RECORDED",
} as const;

export const DELIVERY_MODE = {
  LIVE: "LIVE",
  REPLAY: "REPLAY",
} as const;

export const PRESENTER_TYPE = {
  TEACHER: "TEACHER",
  STUDENT_SCREEN: "STUDENT_SCREEN",
  REPLAY: "REPLAY",
} as const;

export type TPresenterType = typeof PRESENTER_TYPE[keyof typeof PRESENTER_TYPE];
export type TDeliveryMode = typeof DELIVERY_MODE[keyof typeof DELIVERY_MODE];
export type TClassStatus = typeof CLASS_STATUS[keyof typeof CLASS_STATUS];