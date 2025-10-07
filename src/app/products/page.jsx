import ProductCard from '../../components/ProductCard'
import { getProducts } from '../../lib/catalog'

export const metadata = { title: "Products | Nature's Way Soil" }

export default async function ProductsPage() {
  const products = await getProducts()
  return (
    <div className="grid">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
