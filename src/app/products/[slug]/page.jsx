import { notFound } from 'next/navigation'
import { getProductBySlug } from '../../../lib/catalog'
import { AddToCart } from './ui'

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug)
  if (!product) return { title: 'Product Not Found' }
  return { title: `${product.name} | Nature's Way Soil` }
}

export default async function ProductDetailPage({ params }) {
  const product = await getProductBySlug(params.slug)
  if (!product) return notFound()
  return (
    <div className="product-detail">
      <img src={product.image} alt={product.name} className="product-image" />
      <div>
        <h1>{product.name}</h1>
        <p className="price">${(product.price / 100).toFixed(2)}</p>
        <p>{product.description}</p>
        <AddToCart id={product.id} />
      </div>
    </div>
  )
}
