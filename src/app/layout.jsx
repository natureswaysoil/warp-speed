import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { CartProvider } from '../components/CartProvider'

export const metadata = {
  title: "Nature's Way Soil",
  description: 'Organic, microbe-rich soil products'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main className="container">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
