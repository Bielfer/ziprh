const paths = {
  home: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  employerAvailabilities: "/employer/availabilities",
  employerAvailabilitiesByUserId: (userId: string) =>
    `/employer/availabilities/${userId}`,
  employerClockIns: "/employer/clock-ins",
  employerClockInsByUserId: (userId: string) => `/employer/clock-ins/${userId}`,
  employeeAvailabilities: "/employee/availabilities",
  employeeClockIns: "/employee/clock-ins",
  employeeClockInsHistory: "/employee/clock-ins/history",
} as const;

export { paths };
