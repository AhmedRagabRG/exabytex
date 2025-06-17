'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  X,
  Search,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { PriceDisplay, DiscountPrice } from '@/components/ui/PriceDisplay'

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  hasDiscount: boolean;
  image?: string;
  category: string;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  createdAt: string;
  createdBy?: {
    name: string;
    email: string;
  };
  emailSubject?: string;
  emailContent?: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  icon: string;
  isActive: boolean;
}

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  discountedPrice: string;
  hasDiscount: boolean;
  image: string;
  category: string;
  features: string[];
  isPopular: boolean;
  emailSubject?: string;
  emailContent?: string;
  downloadUrl?: string;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newFeature, setNewFeature] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: '',
    discountedPrice: '',
    hasDiscount: false,
    image: '',
    category: '',
    features: [],
    isPopular: false,
    emailSubject: '',
    emailContent: '',
    downloadUrl: ''
  });

  // جلب المنتجات
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || response.statusText);
      }
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        console.log('Fetched products:', data);
        
        // معالجة البيانات المستلمة
        const processedProducts = data.map((product: Product) => ({
          ...product,
          features: Array.isArray(product.features) 
            ? product.features 
            : typeof product.features === 'string'
              ? JSON.parse(product.features || '[]')
              : []
        }));
        
        setProducts(processedProducts);
      } else {
        console.error('Products API response is not JSON:', await response.text());
        toast.error('خطأ في تنسيق البيانات المستلمة');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error(error instanceof Error ? error.message : 'خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  // جلب الفئات
  const fetchCategories = async () => {
    try {
      // إضافة timestamp لمنع cache
      const response = await fetch(`/api/categories?_t=${Date.now()}`);
      if (response.ok) {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          console.log('📋 تم جلب الفئات:', data);
          setCategories(data);
        } else {
          console.error('Categories API response is not JSON:', await response.text())
          toast.error('خطأ في تحميل الفئات');
        }
      } else {
        console.error('Error fetching categories:', response.status, response.statusText);
        toast.error('فشل في تحميل الفئات');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('خطأ في الاتصال مع الخادم');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // تصفية المنتجات
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // إضافة ميزة جديدة
  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  // حذف ميزة
  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  // إرسال النموذج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // التحقق من البيانات المطلوبة
      if (!formData.title || !formData.description || !formData.price || !formData.category) {
        toast.error('يرجى ملء جميع الحقول المطلوبة');
        return;
      }

      // تجهيز البيانات للإرسال
      const processedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price) || 0,
        discountedPrice: formData.discountedPrice ? parseFloat(formData.discountedPrice) : null,
        hasDiscount: Boolean(formData.hasDiscount && formData.discountedPrice),
        image: formData.image?.trim() || null,
        category: formData.category.trim(),
        features: formData.features || [],
        isPopular: Boolean(formData.isPopular),
        isActive: true,
        emailSubject: formData.emailSubject?.trim() || null,
        emailContent: formData.emailContent?.trim() || null,
        downloadUrl: formData.downloadUrl?.trim() || null
      };

      console.log('Submitting form data:', processedData);

      const url = editingProduct 
        ? `/api/products/${editingProduct.id}` 
        : '/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      console.log('Making API request:', { url, method });
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(processedData)
      });

      console.log('API Response status:', response.status);
      const responseData = await response.json();
      console.log('API Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || responseData.details || 'Failed to save product');
      }

      await fetchProducts();
      await fetchCategories();
      resetForm();
      toast.success(editingProduct ? 'تم تحديث المنتج بنجاح!' : 'تم إضافة المنتج بنجاح!');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error instanceof Error ? error.message : 'حدث خطأ في حفظ المنتج');
    }
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      discountedPrice: '',
      hasDiscount: false,
      image: '',
      category: '',
      features: [],
      isPopular: false,
      emailSubject: '',
      emailContent: '',
      downloadUrl: ''
    });
    setNewFeature('');
    setShowForm(false);
    setEditingProduct(null);
  };

  // تحرير منتج
  const editProduct = (product: Product) => {
    setFormData({
      title: product.title || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      discountedPrice: product.discountedPrice?.toString() || '',
      hasDiscount: Boolean(product.hasDiscount),
      image: product.image || '',
      category: product.category || '',
      features: Array.isArray(product.features) ? product.features : [],
      isPopular: Boolean(product.isPopular),
      emailSubject: product.emailSubject || '',
      emailContent: product.emailContent || '',
      downloadUrl: product.downloadUrl || ''
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  // حذف منتج
  const deleteProduct = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchProducts();
        toast.success('تم حذف المنتج بنجاح!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'حدث خطأ في الحذف');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('حدث خطأ في الحذف');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل المنتجات...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">إدارة المنتجات</h1>
                <p className="text-gray-600">إضافة وتعديل وحذف المنتجات</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <button
                onClick={fetchProducts}
                className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                تحديث
              </button>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowForm(true);
                }}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                إضافة منتج جديد
              </button>
            </div>
          </div>
        </div>

        {/* Stats & Filters */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 text-sm font-medium">إجمالي المنتجات</div>
              <div className="text-2xl font-bold text-blue-900">{products.length}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600 text-sm font-medium">المنتجات النشطة</div>
              <div className="text-2xl font-bold text-green-900">
                {products.filter(p => p.isActive).length}
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-yellow-600 text-sm font-medium">المنتجات المميزة</div>
              <div className="text-2xl font-bold text-yellow-900">
                {products.filter(p => p.isPopular).length}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-purple-600 text-sm font-medium">المنتجات بخصم</div>
              <div className="text-2xl font-bold text-purple-900">
                {products.filter(p => p.hasDiscount).length}
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="البحث في المنتجات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              {/* <Filter className="h-4 w-4 text-gray-500" /> */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">جميع الفئات</option>
                {[...new Set(products.map(p => p.category))].map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="relative">
              <Image
                src={product.image || '/api/placeholder/300/200'}
                alt={product.title}
                width={300}
                height={192}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                {product.isPopular && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                    مميز
                  </span>
                )}
                {product.hasDiscount && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                    خصم
                  </span>
                )}
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {product.category}
                </span>
                <div className="text-right">
                  {product.hasDiscount ? (
                    <DiscountPrice 
                      amount={product.discountedPrice || 0}
                      originalAmount={product.price}
                      showSavings={false}
                    />
                  ) : (
                    <PriceDisplay amount={product.price} size="sm" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${product.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-xs text-gray-600">
                    {product.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editProduct(product)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم المنتج *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      الفئة *
                    </label>
                    <button
                      type="button"
                      onClick={fetchCategories}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="تحديث الفئات"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">اختر الفئة</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {categories.length === 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      لا توجد فئات متاحة. يرجى إضافة فئات أولاً.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    السعر الأساسي (ج.م) *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    السعر بعد الخصم (ج.م)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discountedPrice}
                    onChange={(e) => setFormData({...formData, discountedPrice: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط الصورة
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المميزات
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="أضف ميزة جديدة..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    إضافة
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Email and Download Section */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">إعدادات التسليم</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عنوان البريد الإلكتروني
                    </label>
                    <input
                      type="text"
                      value={formData.emailSubject}
                      onChange={(e) => setFormData({...formData, emailSubject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="عنوان الرسالة التي سيتم إرسالها للعميل"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      محتوى البريد الإلكتروني
                    </label>
                    <textarea
                      rows={3}
                      value={formData.emailContent}
                      onChange={(e) => setFormData({...formData, emailContent: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="محتوى الرسالة التي سيتم إرسالها للعميل"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رابط التحميل
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formData.downloadUrl}
                        onChange={(e) => setFormData({...formData, downloadUrl: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/download/file.zip"
                      />
                      {formData.downloadUrl && (
                        <a
                          href={formData.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          اختبار
                        </a>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      أدخل رابط التحميل المباشر للمنتج. سيظهر هذا الرابط للعميل بعد الدفع.
                    </p>
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hasDiscount}
                    onChange={(e) => setFormData({...formData, hasDiscount: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="mr-2 text-sm text-gray-700">يوجد خصم</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="mr-2 text-sm text-gray-700">منتج مميز</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingProduct ? 'تحديث المنتج' : 'إضافة المنتج'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || categoryFilter !== 'ALL' 
                ? 'لم نجد أي منتجات تطابق معايير البحث' 
                : 'ابدأ بإضافة منتجات جديدة لعرضها هنا'
              }
            </p>
            {(!searchTerm && categoryFilter === 'ALL') && (
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowForm(true);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                إضافة منتج جديد
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement; 