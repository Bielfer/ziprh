/* eslint @typescript-eslint/ban-ts-comment:off */
// @ts-nocheck
"use client";
import { useEffect, type FC } from "react";

const Crisp: FC = () => {
  useEffect(() => {
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "64876a5f-d36a-4f4f-a5ac-e6808668781d";
    (function () {
      const d = document;
      const s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = 1;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();
  }, []);

  return null;
};

export default Crisp;
