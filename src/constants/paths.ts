const paths = {
  home: "/",
  pricing: "/#pricing",
  features: "/#features",
  chooseRole: "/choose-role",
  signIn: "/sign-in",
  signUp: "/sign-up",
  employerSchedule: "/employer/schedule",
  employerScheduleByUserId: (userId: string) => `/employer/schedule/${userId}`,
  employerClockIns: "/employer/clock-ins",
  employerClockInsByUserId: (userId: string) => `/employer/clock-ins/${userId}`,
  employerEmployees: "/employer/employees",
  employerEmployeesByUserIdSchedule: (userId: string) =>
    `/employer/employees/${userId}/schedule`,
  employerSubscriptionSuccess: "/employer/subscription-success",
  employeeSchedule: "/employee/schedule",
  employeeClockIns: "/employee/clock-ins",
  employeeClockInsHistory: "/employee/clock-ins/history",
  unauthorized: "/unauthorized",
} as const;

export { paths };
