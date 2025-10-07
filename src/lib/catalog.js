export async function getProducts() {
  const src = process.env.PRODUCTS_SOURCE_URL
  if (src) {
    try {
      const res = await fetch(src, { next: { revalidate: 60 } })
      if (res.ok) {
        const data = await res.json()
        // Support either array or { products: [] }
        return Array.isArray(data) ? data : data.products || []
      }
    } catch {}
  }
  const { products } = await import('./products')
  return products
}

export async function getProductBySlug(slug) {
  const list = await getProducts()
  return list.find(p => p.slug === slug)
}

export async function getProductById(id) {
  const list = await getProducts()
  return list.find(p => p.id === id)
}
