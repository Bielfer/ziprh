const paths = {
  home: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  employerSchedule: "/employer/schedule",
  employerScheduleByUserId: (userId: string) => `/employer/schedule/${userId}`,
  employerClockIns: "/employer/clock-ins",
  employerClockInsByUserId: (userId: string) => `/employer/clock-ins/${userId}`,
  employeeSchedule: "/employee/schedule",
  employeeClockIns: "/employee/clock-ins",
  employeeClockInsHistory: "/employee/clock-ins/history",
} as const;

export { paths };
