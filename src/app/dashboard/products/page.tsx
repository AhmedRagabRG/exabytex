'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image?: string
  emailSubject?: string
  emailContent?: string
}

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)

  // تحميل المنتجات
  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  // حفظ المنتج
  const saveProduct = async (product: Product) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })

      if (!response.ok) {
        throw new Error('Failed to save product')
      }

      await loadProducts()
      setEditingProduct(null)
    } catch (error) {
      console.error('Error saving product:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">إدارة المنتجات</h1>

      <div className="grid gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>السعر</Label>
                  <Input
                    type="number"
                    value={product.price}
                    onChange={(e) => {
                      const updatedProduct = {
                        ...product,
                        price: parseFloat(e.target.value),
                      }
                      setProducts(products.map((p) => 
                        p.id === product.id ? updatedProduct : p
                      ))
                    }}
                  />
                </div>

                <div>
                  <Label>عنوان البريد الإلكتروني</Label>
                  <Input
                    value={product.emailSubject || ''}
                    onChange={(e) => {
                      const updatedProduct = {
                        ...product,
                        emailSubject: e.target.value,
                      }
                      setProducts(products.map((p) => 
                        p.id === product.id ? updatedProduct : p
                      ))
                    }}
                    placeholder="مثال: تم شراء المنتج بنجاح"
                  />
                </div>

                <div>
                  <Label>محتوى البريد الإلكتروني</Label>
                  <Textarea
                    value={product.emailContent || ''}
                    onChange={(e) => {
                      const updatedProduct = {
                        ...product,
                        emailContent: e.target.value,
                      }
                      setProducts(products.map((p) => 
                        p.id === product.id ? updatedProduct : p
                      ))
                    }}
                    placeholder="يمكنك استخدام المتغيرات التالية: {productName}, {orderId}, {downloadUrl}"
                    rows={6}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingProduct(null)}
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={() => saveProduct(product)}
                    disabled={loading}
                  >
                    {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 