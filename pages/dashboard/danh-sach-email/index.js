import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/layout/AdminLayout';
import EmailListComponent from '../../../components/admin/EmailListComponent';

const SubscriptionManagement = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'admin') {
      router.push('/dang-nhap');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Đang tải...</div>;
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <AdminLayout title="Danh sách đăng ký tư vấn khóa học">
      <EmailListComponent />
    </AdminLayout>
  );
};

export default SubscriptionManagement;
