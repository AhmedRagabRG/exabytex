'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  History, 
  FileText, 
  Search,
  Clock,
  Copy,
  Download,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

export default function AIContentHistoryPage() {
  const { data: session } = useSession();
  
  const [contents, setContents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContent, setSelectedContent] = useState<any>(null);

  useEffect(() => {
    if (session?.user) {
      fetchContents();
    }
  }, [session]);

  const fetchContents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/ai/history?limit=50');
      if (response.ok) {
        const data = await response.json();
        setContents(data.contents || []);
      }
    } catch (error) {
      console.error('Error fetching contents:', error);
      toast.error('حدث خطأ في جلب المحتوى');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContents = contents.filter(content =>
    content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('تم نسخ المحتوى');
    } catch (error) {
      toast.error('فشل في نسخ المحتوى');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <History className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            تاريخ المحتوى المولد
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          استعرض وإدارة جميع المحتوى الذي قمت بإنشاؤه
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث في المحتوى..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري تحميل المحتوى...</p>
        </div>
      ) : filteredContents.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredContents.map((content) => (
            <Card key={content.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{content.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">{content.type}</Badge>
                  <Badge variant="secondary">{content.coinsCost} كوين</Badge>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(content.createdAt).toLocaleDateString('ar')}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm line-clamp-3 leading-relaxed">
                    {content.content}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{content.wordCount} كلمة</span>
                  <span>اللغة: {content.language === 'ar' ? 'العربية' : 'الإنجليزية'}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedContent(content)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    عرض
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(content.content)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <History className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">لا يوجد محتوى</h3>
          <p>لم تقم بإنشاء أي محتوى بعد</p>
        </div>
      )}

      {/* Content Viewer Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {selectedContent.title}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedContent(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {selectedContent.content}
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(selectedContent.content)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  نسخ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 