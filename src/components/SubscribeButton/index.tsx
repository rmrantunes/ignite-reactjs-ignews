import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'

import { makeAPIRoutesRequest } from 'services/axios'
import { getStripeJs } from 'services/stripe-js'

import styles from './SubscribeButton.module.scss'

type SubscribeButtonProps = {
  onSubscribe: () => Promise<void>
}

export function SubscribeButton(props: SubscribeButtonProps) {
  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={props.onSubscribe}
    >
      Subscribe now
    </button>
  )
}

export function SubscribeButtonLogicBoundary() {
  const [session] = useSession()

  const router = useRouter()

  async function handleSubscribe() {
    if (!session) {
      signIn('github')
      return
    }

    if (session.activeSubscription) {
      router.push('/posts')
      return
    }

    try {
      const { data } = await makeAPIRoutesRequest.post('/subscribe')

      const stripeJs = await getStripeJs()
      await stripeJs.redirectToCheckout({
        sessionId: data.sessionId
      })
    } catch (error) {
      alert(error.message)
    }
  }

  return <SubscribeButton onSubscribe={handleSubscribe} />
}
