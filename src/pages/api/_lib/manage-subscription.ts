import { fauna } from "services/faunadb";
import { query as q } from "faunadb";
import { stripe } from "services/stripe";

export async function saveSubscriptionToDatabase(
  subscriptionId: string,
  stripeCustomerId: string,
  isCreateAction = false
) {
  const faunaUserRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(q.Match(q.Index("user_by_stripe_customer_id"), stripeCustomerId))
    )
  );

  const stripeSubscription = await stripe.subscriptions.retrieve(
    subscriptionId
  );

  const subscriptionToSave = {
    id: stripeSubscription.id,
    user_id: faunaUserRef,
    status: stripeSubscription.status,
    price_id: stripeSubscription.items.data[0].price.id,
  };

  if (isCreateAction) {
    await fauna.query(
      q.Create(q.Collection("subscriptions"), { data: subscriptionToSave })
    );
    return;
  }

  await fauna.query(
    q.Replace(
      q.Select(
        "ref",
        q.Get(q.Match(q.Index("subscription_by_id"), subscriptionId))
      ),
      { data: subscriptionToSave }
    )
  );
}
