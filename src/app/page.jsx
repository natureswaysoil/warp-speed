import Link from 'next/link'
import EmailCapture from '../components/EmailCapture'

export default function HomePage() {
  return (
    <section className="hero">
      <div className="container">
        <h1>From Our Farm to Your Garden</h1>
        <p>At Nature’s Way Soil, our mission is simple: to bring life back to the soil, naturally. We restore the earth through biology—earthworms, fungi, and microbes—not harsh chemicals.</p>
        <div className="hero-actions">
          <Link className="btn" href="/products">Shop Now</Link>
          <Link className="btn btn-outline" href="/products">Learn</Link>
        </div>
        <div className="video-note">▶ Learn How Soil Ecosystems Work — a look at the hidden world beneath your feet.</div>
        <div style={{ marginTop: '1.5rem' }}>
          <EmailCapture />
        </div>
      </div>
    </section>
  )
}
