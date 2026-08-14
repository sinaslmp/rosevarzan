import { defineRailway, github, postgres, project, service } from "railway/iac";

export default defineRailway(() => {
  const db = postgres("postgres");

  const api = service("api", {
    source: github("sinaslmp/rosevarzan", { branch: "main" }),
    build: { builder: "DOCKERFILE", dockerfilePath: "apps/api/Dockerfile" },
    env: {
      DATABASE_URL: db.env.DATABASE_URL,
      NODE_ENV: "production",
      ZARINPAL_BASE_URL: "https://sandbox.zarinpal.com/pg/v4/payment",
      ZARINPAL_GATEWAY_URL: "https://sandbox.zarinpal.com/pg/StartPay",
    },
  });

  const web = service("web", {
    source: github("sinaslmp/rosevarzan", { branch: "main" }),
    build: { builder: "DOCKERFILE", dockerfilePath: "apps/web/Dockerfile" },
    env: {
      NODE_ENV: "production",
    },
  });

  return project("rosevarzan", {
    resources: [db, api, web],
  });
});
