'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageCircle, 
  Reply, 
  Edit, 
  Trash2, 
  Send,
  User,
  Clock
} from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: string;
  };
  replies: Comment[];
}

interface CommentsProps {
  blogPostId: string;
}

export function Comments({ blogPostId }: CommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [blogPostId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?blogPostId=${blogPostId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          blogPostId
        }),
      });

      if (response.ok) {
        setNewComment('');
        fetchComments();
      } else {
        const error = await response.json();
        alert(error.error || 'فشل في إضافة التعليق');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('خطأ في الاتصال بالسيرفر');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!session || !replyContent.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: replyContent,
          blogPostId,
          parentId
        }),
      });

      if (response.ok) {
        setReplyContent('');
        setReplyTo(null);
        fetchComments();
      } else {
        const error = await response.json();
        alert(error.error || 'فشل في إضافة الرد');
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('خطأ في الاتصال بالسيرفر');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editContent
        }),
      });

      if (response.ok) {
        setEditingComment(null);
        setEditContent('');
        fetchComments();
      } else {
        const error = await response.json();
        alert(error.error || 'فشل في تعديل التعليق');
      }
    } catch (error) {
      console.error('Error editing comment:', error);
      alert('خطأ في الاتصال بالسيرفر');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التعليق؟')) return;

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchComments();
      } else {
        const error = await response.json();
        alert(error.error || 'فشل في حذف التعليق');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('خطأ في الاتصال بالسيرفر');
    }
  };

  const canEditComment = (comment: Comment) => {
    return session?.user?.email === comment.author.email || 
           session?.user?.role === 'ADMIN' || 
           session?.user?.role === 'MANAGER';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <Card key={comment.id} className={`${isReply ? 'mr-8 mt-4' : 'mb-6'} bg-white shadow-sm border border-gray-200`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* صورة المستخدم */}
          <div className="flex-shrink-0">
            {comment.author.image ? (
              <Image
                src={comment.author.image}
                alt={comment.authorName}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-gray-600" />
              </div>
            )}
          </div>

          {/* محتوى التعليق */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium text-gray-900">{comment.authorName}</h4>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(comment.createdAt)}
              </span>
              {comment.author.role === 'ADMIN' && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  مدير
                </span>
              )}
            </div>

            {editingComment === comment.id ? (
              <div className="space-y-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleEditComment(comment.id)}
                    disabled={submitting}
                  >
                    حفظ
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingComment(null);
                      setEditContent('');
                    }}
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-700 leading-relaxed mb-3">{comment.content}</p>
                
                {/* أزرار الإجراءات */}
                <div className="flex items-center gap-3">
                  {session && !isReply && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyTo(comment.id)}
                      className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                    >
                      <Reply className="h-4 w-4 ml-1" />
                      رد
                    </Button>
                  )}
                  
                  {canEditComment(comment) && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingComment(comment.id);
                          setEditContent(comment.content);
                        }}
                        className="text-gray-600 hover:text-gray-700 p-0 h-auto"
                      >
                        <Edit className="h-4 w-4 ml-1" />
                        تعديل
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-600 hover:text-red-700 p-0 h-auto"
                      >
                        <Trash2 className="h-4 w-4 ml-1" />
                        حذف
                      </Button>
                    </>
                  )}
                </div>
              </>
            )}

            {/* نموذج الرد */}
            {replyTo === comment.id && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="اكتب ردك هنا..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={submitting || !replyContent.trim()}
                  >
                    {submitting ? 'جاري الإرسال...' : 'إرسال الرد'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReplyTo(null);
                      setReplyContent('');
                    }}
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* الردود */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
            {comment.replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل التعليقات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-5 w-5 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">
          التعليقات ({comments.length})
        </h3>
      </div>

      {/* نموذج إضافة تعليق جديد */}
      {session ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'المستخدم'}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="شارك رأيك حول هذا المقال..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />
              <div className="flex justify-end mt-3">
                <Button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {submitting ? (
                    'جاري الإرسال...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 ml-2" />
                      إرسال التعليق
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
          <p className="text-gray-600 mb-4">
            يجب تسجيل الدخول للمشاركة في التعليقات
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            تسجيل الدخول
          </Button>
        </div>
      )}

      {/* قائمة التعليقات */}
      {comments.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            لا توجد تعليقات بعد
          </h4>
          <p className="text-gray-600">
            كن أول من يعلق على هذا المقال
          </p>
        </div>
      ) : (
        <div>
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}
    </div>
  );
} 