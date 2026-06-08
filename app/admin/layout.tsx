import type { Metadata } from 'next';
import AdminLayoutClient from './AdminLayoutClient';

// Admin section layout — metadata and client shell wrapper
export const metadata: Metadata = {
  title: 'Admin Dashboard - Dukan Machinery',
  description: 'Dukan Machinery administration portal for order tracking and management.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
