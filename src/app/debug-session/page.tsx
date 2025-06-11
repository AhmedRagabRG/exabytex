'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function DebugSessionPage() {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('خطأ في جلب البيانات:', error);
      }
    };

    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">فحص بيانات الجلسة</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Session Data */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">بيانات الجلسة (Session)</h2>
            <div className="space-y-2">
              <p><strong>حالة الجلسة:</strong> {status}</p>
              {session && (
                <>
                  <p><strong>ID:</strong> {(session.user as any)?.id || 'غير محدد'}</p>
                  <p><strong>الاسم:</strong> {session.user?.name || 'غير محدد'}</p>
                  <p><strong>البريد:</strong> {session.user?.email || 'غير محدد'}</p>
                  <p><strong>الدور:</strong> {(session.user as any)?.role || 'غير محدد'}</p>
                  <p><strong>الصورة:</strong> {session.user?.image || 'غير محدد'}</p>
                </>
              )}
            </div>
            
            <h3 className="text-lg font-semibold mt-6 mb-3">كامل بيانات الجلسة:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>

          {/* Profile API Data */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">بيانات API البروفايل</h2>
            {profileData ? (
              <>
                <div className="space-y-2">
                  <p><strong>ID:</strong> {profileData.id}</p>
                  <p><strong>الاسم:</strong> {profileData.name || 'غير محدد'}</p>
                  <p><strong>البريد:</strong> {profileData.email}</p>
                  <p><strong>الدور:</strong> {profileData.role}</p>
                  <p><strong>الهاتف:</strong> {profileData.phone || 'غير محدد'}</p>
                </div>
                
                <h3 className="text-lg font-semibold mt-6 mb-3">كامل بيانات البروفايل:</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(profileData, null, 2)}
                </pre>
              </>
            ) : (
              <p>جاري تحميل بيانات البروفايل...</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-x-4">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            إعادة تحميل الصفحة
          </button>
          
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => {
              fetch('/api/user/profile')
                .then(res => res.json())
                .then(data => setProfileData(data))
                .catch(console.error);
            }}
          >
            إعادة جلب بيانات البروفايل
          </button>
        </div>
      </div>
    </div>
  );
} 