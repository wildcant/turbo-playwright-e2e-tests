import '@picocss/pico'
import { AppProps } from 'next/app'
import Navigation from '../components/Navigation'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main>
      <div className="container">
        <Navigation />
      </div>
      <Component {...pageProps} />
    </main>
  )
}
