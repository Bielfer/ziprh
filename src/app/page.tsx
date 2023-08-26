import { auth } from "@clerk/nextjs";
import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { type FC } from "react";
import { paths } from "~/constants/paths";
import { roles } from "~/constants/roles";
import Header from "./header";
import Hero from "./hero";
import PrimaryFeatures from "./primary-features";
import Pricing from "./pricing";
import CallToAction from "./call-to-action";
import Footer from "./footer";

export const metadata: Metadata = {
  title: "O melhor sistema de gestão de funcionários | ZipRH",
  description:
    "Acompanhe os seus funcionários, a escala e os pontos que foram batidos",
};

const Home: FC = () => {
  const { userId, orgRole } = auth();

  if (userId && orgRole === roles.basicMember)
    return redirect(paths.employeeSchedule);
  if (userId && orgRole === roles.admin)
    return redirect(paths.employerSchedule);

  return (
    <>
      <Header userId={userId} />
      <main>
        <Hero />
        <PrimaryFeatures />
        <Pricing />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
};

export default Home;
