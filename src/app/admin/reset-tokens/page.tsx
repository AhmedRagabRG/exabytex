"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Key, Clock, Mail, Copy, ExternalLink, RefreshCw, Trash2 } from "lucide-react"

interface ResetToken {
  id: string
  email: string
  resetToken: string
  resetTokenExpiry: string
  createdAt: string
}

export default function ResetTokensAdminPage() {
  const [tokens, setTokens] = useState<ResetToken[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    fetchTokens()
  }, [])

  const fetchTokens = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/reset-tokens')
      const data = await response.json()
      
      if (response.ok) {
        setTokens(data.tokens || [])
      }
    } catch (error) {
      console.error('Error fetching tokens:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    
    if (diffMins > 0) {
      return `${diffMins} دقيقة متبقية`
    } else {
      return 'منتهي الصلاحية'
    }
  }

  const isExpired = (dateString: string) => {
    return new Date(dateString) < new Date()
  }

  const deleteToken = async (token: string) => {
    try {
      const response = await fetch('/api/admin/reset-tokens', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      
      if (response.ok) {
        await fetchTokens()
      }
    } catch (error) {
      console.error('Error deleting token:', error)
    }
  }

  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-500/20 bg-red-500/10">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">غير متاح في الإنتاج</h3>
            <p className="text-gray-300">هذه الصفحة متاحة فقط في بيئة التطوير لأسباب أمنية.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Key className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">إدارة tokens استعادة كلمة المرور</h1>
          </div>
          <p className="text-gray-300 text-lg">للتطوير والاختبار فقط</p>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-white">
            <span className="text-sm text-gray-400">عدد الـ tokens النشطة: </span>
            <span className="font-bold text-blue-400">{tokens.length}</span>
          </div>
          
          <Button 
            onClick={fetchTokens}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            تحديث
          </Button>
        </div>

        {/* Tokens List */}
        {isLoading ? (
          <Card className="border-white/20 bg-white/10 backdrop-blur-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                <span className="text-white">جاري التحميل...</span>
              </div>
            </CardContent>
          </Card>
        ) : tokens.length === 0 ? (
          <Card className="border-white/20 bg-white/10 backdrop-blur-lg">
            <CardContent className="p-6 text-center">
              <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">لا توجد tokens نشطة</h3>
              <p className="text-gray-300">لم يتم إنشاء أي طلبات استعادة كلمة مرور حتى الآن.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {tokens.map((token) => (
              <Card 
                key={token.id} 
                className={`border-white/20 backdrop-blur-lg transition-all duration-300 ${
                  isExpired(token.resetTokenExpiry)
                    ? 'bg-red-500/10 border-red-500/20'
                    : 'bg-white/10 hover:bg-white/15'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Mail className="w-5 h-5 text-blue-400" />
                      {token.email}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        onClick={() => deleteToken(token.resetToken)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="text-gray-300 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {formatDate(token.resetTokenExpiry)}
                    {isExpired(token.resetTokenExpiry) && (
                      <span className="text-red-400 font-medium">(منتهي الصلاحية)</span>
                    )}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Reset URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      رابط الاستعادة:
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-gray-300 break-all">
                        {`${process.env.NEXT_PUBLIC_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://exabytex.com' : 'http://localhost:3000')}/auth/reset-password?token=${token.resetToken}`}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                        onClick={() => copyToClipboard(
                          `${process.env.NEXT_PUBLIC_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://exabytex.com' : 'http://localhost:3000')}/auth/reset-password?token=${token.resetToken}`,
                          `url-${token.id}`
                        )}
                      >
                        {copied === `url-${token.id}` ? '✓' : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                        onClick={() => window.open(
                          `${process.env.NEXT_PUBLIC_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://exabytex.com' : 'http://localhost:3000')}/auth/reset-password?token=${token.resetToken}`,
                          '_blank'
                        )}
                        disabled={isExpired(token.resetTokenExpiry)}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Token */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Token:
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-gray-300 break-all font-mono">
                        {token.resetToken}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                        onClick={() => copyToClipboard(token.resetToken, `token-${token.id}`)}
                      >
                        {copied === `token-${token.id}` ? '✓' : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">تاريخ الإنشاء:</span>
                      <div className="text-white font-mono">
                        {new Date(token.createdAt).toLocaleString('ar-EG')}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">تاريخ الانتهاء:</span>
                      <div className={`font-mono ${isExpired(token.resetTokenExpiry) ? 'text-red-400' : 'text-white'}`}>
                        {new Date(token.resetTokenExpiry).toLocaleString('ar-EG')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer Info */}
        <Card className="mt-8 border-yellow-500/20 bg-yellow-500/10">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div className="text-sm text-yellow-200">
                <strong>تنبيه أمني:</strong> هذه الصفحة متاحة فقط في بيئة التطوير. 
                في الإنتاج، لن تكون هذه المعلومات متاحة لأسباب أمنية. 
                تأكد من عدم مشاركة هذه الـ tokens مع أي شخص.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 