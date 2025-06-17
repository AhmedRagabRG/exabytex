'use client';

import { useRef, useEffect, useState } from 'react';
import { Button } from './button';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Image, 
  Link, 
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  MessageSquare
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "اكتب محتوى مقالك هنا...",
  height = 400 
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  // تحديث المحتوى عند تغيير القيمة من الخارج
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // معالجة تغيير المحتوى
  const handleContentChange = () => {
    if (editorRef.current) {
      // الحصول على المحتوى الخام
      let content = editorRef.current.innerHTML;
      
      // تنظيف class names غير المرغوب فيها التي قد تظهر كنص
      content = content
        .replace(/\bclass="content-quote"\s*/g, 'class="content-quote" ')
        .replace(/\bclass="content-heading"\s*/g, 'class="content-heading" ')
        .replace(/\bclass="content-image"\s*/g, 'class="content-image" ')
        .replace(/\bclass="content-link"\s*/g, 'class="content-link" ')
        .replace(/\bclass="quote-highlight"\s*/g, 'class="quote-highlight" ')
        .replace(/\bclass="image-container"\s*/g, 'class="image-container" ')
      
      // تحويل line breaks إلى فقرات إذا لزم الأمر
      content = content.replace(/<div>/g, '<p>').replace(/<\/div>/g, '</p>');
      
      // عدم تغيير المحتوى إذا كان يحتوي على HTML صحيح
      if (content && !content.includes('<p>') && !content.includes('<h') && !content.includes('<a') && !content.includes('<img')) {
        content = `<p>${content}</p>`;
      }
      
      onChange(content);
    }
  };

  // تحديث المحرر
  const refreshEditor = () => {
    if (editorRef.current) {
      // حفظ المحتوى الحالي
      const currentContent = editorRef.current.innerHTML;
      
      // حفظ موضع المؤشر
      const selection = window.getSelection();
      let range = null;
      let cursorOffset = 0;
      
      if (selection && selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
        cursorOffset = range.startOffset;
      }
      
      // تحديث المحتوى
      editorRef.current.innerHTML = currentContent;
      
      // استعادة المؤشر
      if (range && editorRef.current.firstChild) {
        try {
          range.setStart(editorRef.current.firstChild, Math.min(cursorOffset, editorRef.current.textContent?.length || 0));
          range.collapse(true);
          selection?.removeAllRanges();
          selection?.addRange(range);
        } catch (error) {
          // تجاهل أخطاء المؤشر
        }
      }
      
      // تحديث المحتوى في الوالد فقط إذا كان مختلفاً
      if (currentContent !== value) {
        onChange(currentContent);
      }
    }
  };

  // تنفيذ أوامر التنسيق
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleContentChange();
    // تحديث العرض بعد التنسيق
    setTimeout(refreshEditor, 100);
  };

  // إضافة صورة
  const insertImage = () => {
    if (imageUrl.trim()) {
      const imageHTML = `<div style="text-align: center; margin: 20px 0;"><img src="${imageUrl}" alt="صورة" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); display: block; margin: 0 auto;" /></div>`;
      execCommand('insertHTML', imageHTML);
      setImageUrl('');
      setShowImageDialog(false);
      // إضافة فترة انتظار قصيرة لضمان التحديث
      setTimeout(() => {
        handleContentChange();
        refreshEditor();
      }, 100);
    }
  };

  // إضافة رابط
  const insertLink = () => {
    if (linkUrl.trim() && linkText.trim()) {
      // تنظيف URL وضمان أنه يبدأ بـ http/https
      let cleanUrl = linkUrl.trim();
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
      }
      
      const linkHTML = `<a href="${cleanUrl}" target="_blank" style="color: #3b82f6; text-decoration: underline; font-weight: 500;">${linkText.trim()}</a>`;
      
      // التأكد من وجود المحرر والتركيز عليه
      if (editorRef.current) {
        editorRef.current.focus();
        
        // حفظ موضع المؤشر
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          
          // إنشاء عنصر مؤقت لإدراج HTML
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = linkHTML;
          const linkElement = tempDiv.firstChild;
          
          if (linkElement) {
            range.insertNode(linkElement);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        } else {
          // إذا لم يكن هناك تحديد، أدرج في النهاية
          document.execCommand('insertHTML', false, linkHTML);
        }
        
        // إعادة تعيين القيم
        setLinkUrl('');
        setLinkText('');
        setShowLinkDialog(false);
        
        // تحديث المحتوى
        setTimeout(() => {
          handleContentChange();
          refreshEditor();
        }, 100);
      }
    }
  };

  // دالة لفتح حوار الرابط
  const handleLinkButtonClick = () => {
    console.log('Link button clicked'); // للتصحيح
    setShowLinkDialog(true);
  };

  // دالة لفتح حوار الصورة
  const handleImageButtonClick = () => {
    console.log('Image button clicked'); // للتصحيح
    setShowImageDialog(true);
  };

  // إضافة عنوان
  const insertHeading = (level: number) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const text = range.toString() || 'عنوان جديد';
      const headingStyle = level === 1 ? 'font-size: 2rem;' : level === 2 ? 'font-size: 1.75rem;' : 'font-size: 1.5rem;';
      execCommand('insertHTML', `<h${level} style="font-weight: bold; margin: 20px 0 10px 0; color: #1f2937; ${headingStyle}">${text}</h${level}>`);
      setTimeout(refreshEditor, 100);
    }
  };

  // إضافة اقتباس
  const insertQuote = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const text = range.toString() || 'اكتب الاقتباس هنا';
      execCommand('insertHTML', `<blockquote style="border-right: 4px solid #3b82f6; background: #f0f9ff; padding: 15px; margin: 15px 0; border-radius: 8px; font-style: italic; color: #1e40af;">${text}</blockquote>`);
      setTimeout(refreshEditor, 100);
    }
  };

  // إضافة علامات تنصيص
  const insertQuotationMark = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const text = range.toString() || 'النص المقتبس';
      execCommand('insertHTML', `<mark style="background: #fef3c7; padding: 0.125rem 0.375rem; border-radius: 0.375rem; color: #92400e; font-weight: 500;">"${text}"</mark>`);
      setTimeout(refreshEditor, 100);
    }
  };

  return (
    <div className="rich-text-editor border border-gray-300 rounded-lg overflow-hidden">
      {/* شريط الأدوات */}
      <div className="toolbar bg-gray-50 border-b border-gray-300 p-3 flex flex-wrap gap-2">
        {/* العناوين */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertHeading(1)}
            className="text-xs"
          >
            H1
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertHeading(2)}
            className="text-xs"
          >
            H2
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertHeading(3)}
            className="text-xs"
          >
            H3
          </Button>
        </div>

        <div className="border-r border-gray-300 mx-1"></div>

        {/* تنسيق النص */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => execCommand('bold')}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => execCommand('italic')}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => execCommand('underline')}
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        <div className="border-r border-gray-300 mx-1"></div>

        {/* القوائم */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => execCommand('insertUnorderedList')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => execCommand('insertOrderedList')}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        <div className="border-r border-gray-300 mx-1"></div>

        {/* المحاذاة */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => execCommand('justifyRight')}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => execCommand('justifyCenter')}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => execCommand('justifyLeft')}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="border-r border-gray-300 mx-1"></div>

        {/* العناصر الخاصة */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={insertQuote}
            title="اقتباس"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={insertQuotationMark}
            title="علامات تنصيص"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleImageButtonClick}
            title="إضافة صورة"
          >
            <Image className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLinkButtonClick}
            title="إضافة رابط"
          >
            <Link className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* منطقة التحرير */}
      <div
        ref={editorRef}
        contentEditable
        className="editor-content p-4 min-h-[300px] focus:outline-none"
        style={{ 
          height: height - 60, 
          overflow: 'auto',
          direction: 'rtl',
          textAlign: 'right',
          fontFamily: 'Cairo, sans-serif',
          lineHeight: '1.6',
          backgroundColor: 'white',
          color: '#1f2937'
        }}
        onInput={handleContentChange}
        onPaste={handleContentChange}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />

      {/* حوار إضافة صورة */}
      {showImageDialog && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowImageDialog(false);
              setImageUrl('');
            }
          }}
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">إضافة صورة</h3>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="أدخل رابط الصورة... (مثال: https://example.com/image.jpg)"
              className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter' && imageUrl.trim()) {
                  insertImage();
                }
              }}
            />
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowImageDialog(false);
                  setImageUrl('');
                }}
                className="text-gray-700 hover:bg-gray-50"
              >
                إلغاء
              </Button>
              <Button
                type="button"
                onClick={insertImage}
                disabled={!imageUrl.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
              >
                إضافة الصورة
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* حوار إضافة رابط */}
      {showLinkDialog && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowLinkDialog(false);
              setLinkUrl('');
              setLinkText('');
            }
          }}
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">إضافة رابط</h3>
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="نص الرابط..."
              className="w-full p-2 border border-gray-300 rounded-lg mb-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter' && linkText.trim() && linkUrl.trim()) {
                  insertLink();
                }
              }}
            />
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="رابط URL... (مثال: https://example.com)"
              className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && linkText.trim() && linkUrl.trim()) {
                  insertLink();
                }
              }}
            />
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowLinkDialog(false);
                  setLinkUrl('');
                  setLinkText('');
                }}
                className="text-gray-700 hover:bg-gray-50"
              >
                إلغاء
              </Button>
              <Button
                type="button"
                onClick={insertLink}
                disabled={!linkUrl.trim() || !linkText.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
              >
                إضافة الرابط
              </Button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .editor-content[data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          font-style: italic;
        }
        
        .editor-content p {
          margin-bottom: 10px;
          color: #1f2937 !important;
        }
        
        .editor-content h1, .editor-content h2, .editor-content h3 {
          font-weight: bold;
          margin: 20px 0 10px 0;
          color: #1f2937 !important;
        }
        
        .editor-content h1 { font-size: 2rem !important; }
        .editor-content h2 { font-size: 1.75rem !important; }
        .editor-content h3 { font-size: 1.5rem !important; }
        
        .editor-content ul, .editor-content ol {
          margin: 15px 0;
          padding-right: 30px;
          color: #1f2937 !important;
        }

        .editor-content li {
          color: #1f2937 !important;
          margin-bottom: 5px;
        }
        
        .editor-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 10px 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .editor-content blockquote {
          border-right: 4px solid #3b82f6 !important;
          background: #f0f9ff !important;
          padding: 15px !important;
          margin: 15px 0 !important;
          border-radius: 8px !important;
          font-style: italic !important;
          color: #1e40af !important;
        }
        
        .editor-content a {
          color: #3b82f6 !important;
          text-decoration: underline !important;
        }

        .editor-content mark {
          background: #fef3c7 !important;
          padding: 0.125rem 0.375rem !important;
          border-radius: 0.375rem !important;
          color: #92400e !important;
          font-weight: 500 !important;
        }

        .editor-content strong {
          font-weight: bold !important;
          color: #1f2937 !important;
        }

        .editor-content em {
          font-style: italic !important;
          color: #4b5563 !important;
        }

        .editor-content u {
          text-decoration: underline !important;
          color: #1f2937 !important;
        }

        /* تحسين contrast للنصوص */
        .editor-content * {
          color: inherit;
        }
      `}</style>
    </div>
  );
} 