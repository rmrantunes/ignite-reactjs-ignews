import Stripe from "stripe";

import { name, version } from "../../package.json";

export const stripe = new Stripe(process.env.STRAPI_API_SECRET_KEY, {
  apiVersion: "2020-08-27",
  appInfo: {
    name,
    version,
  },
});
