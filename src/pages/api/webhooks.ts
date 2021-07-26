import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import { stripe } from "services/stripe";
import Stripe from "stripe";
import { saveSubscriptionToDatabase } from "./_lib/manage-subscription";

type StripeEvent = ReturnType<typeof stripe.webhooks.constructEvent>;

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

async function saveSubscriptionToDatabaseBasedOnStripeEvent(
  stripeEvent: StripeEvent
) {
  switch (stripeEvent.type) {
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      const stripeSubscription = stripeEvent.data.object as Stripe.Subscription;
      await saveSubscriptionToDatabase(
        stripeSubscription.id,
        stripeSubscription.customer.toString()
      );
      break;
    case "checkout.session.completed":
      const stripeCheckoutSession = stripeEvent.data
        .object as Stripe.Checkout.Session;
      await saveSubscriptionToDatabase(
        stripeCheckoutSession.subscription.toString(),
        stripeCheckoutSession.customer.toString(),
        true
      );

      break;
    default:
      throw new Error(`Unhandled Stripe Webhook event: ${stripeEvent.type}`);
  }
}

const relevantStripeEventTypes = new Set([
  "checkout.session.completed",
  "customer.subscriptions.updated",
  "customer.subscriptions.deleted",
]);

export default async function webhooksRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
    return;
  }

  const bufferedReq = await buffer(req);

  const stripeWebhookSecret = req.headers["stripe-signature"];

  let stripeEvent: StripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      bufferedReq,
      stripeWebhookSecret,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (relevantStripeEventTypes.has(stripeEvent.type)) {
    try {
      await saveSubscriptionToDatabaseBasedOnStripeEvent(stripeEvent);
    } catch (error) {
      return res.json({ error: error.message });
    }
  }
}
