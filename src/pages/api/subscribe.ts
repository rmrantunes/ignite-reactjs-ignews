import { NextApiHandler } from "next";
import { query as q } from "faunadb";
import { fauna } from "services/faunadb";
import { getSession } from "next-auth/client";
import { stripe } from "services/stripe";

type FaunaUser = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

const subscribeRoute: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json("Method not allowed");
    return;
  }

  const { user } = await getSession({ req });

  const faunaUser = await getFaunaUserByEmail(user.email);

  let faunaUserStripeCustomerId = faunaUser.data.stripe_customer_id;

  if (!faunaUserStripeCustomerId) {
    const stripeCustomer = await createStripeCustomer(user.email);

    await assignStripeCustomerIdToFaunaUser(
      faunaUser.ref.id,
      stripeCustomer.id
    );

    faunaUserStripeCustomerId = stripeCustomer.id;
  }

  const stripeCheckoutSession = await createStripeCheckoutSession(
    faunaUserStripeCustomerId
  );

  res.status(200).json({ sessionId: stripeCheckoutSession.id });
};

async function getFaunaUserByEmail(email: string) {
  return await fauna.query<FaunaUser>(
    q.Get(q.Match(q.Index("user_by_email"), q.Casefold(email)))
  );
}

async function createStripeCustomer(email: string) {
  return await stripe.customers.create({
    email,
  });
}

async function assignStripeCustomerIdToFaunaUser(
  faunaUserRefId: string,
  stripeCustomerId: string
) {
  await fauna.query(
    q.Update(q.Ref(q.Collection("users", faunaUserRefId)), {
      data: { stripe_customer_id: stripeCustomerId },
    })
  );
}

async function createStripeCheckoutSession(stripeCustomerId: string) {
  return stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    payment_method_types: ["card"],
    billing_address_collection: "required",
    line_items: [{ price: process.env.STRAPI_PRODUCT_PRICE_ID, quantity: 1 }],
    mode: "subscription",
    allow_promotion_codes: true,
    success_url: process.env.STRIPE_SUCCESS_URL,
    cancel_url: process.env.STRIPE_CANCEL_URL,
  });
}

export default subscribeRoute;
