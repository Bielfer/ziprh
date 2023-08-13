import { authMiddleware } from "@clerk/nextjs";
import { paths } from "~/constants/paths";

export default authMiddleware({
  publicRoutes: ["/(api|trpc)(.*)", paths.home],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
