import Script from "next/script";
import type { FC } from "react";

const GoogleTag: FC = () => {
  return (
    <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=AW-414039423" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag("js", new Date());

          gtag("config", "AW-414039423");
        `}
      </Script>
    </>
  );
};

export default GoogleTag;
