const paths = {
  home: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  employerAvailabilities: "/employer/availabilities",
  employerClockIns: "/employer/clock-ins",
  employerClockInsByUserId: (userId: string) => `/employer/clock-ins/${userId}`,
} as const;

export { paths };
