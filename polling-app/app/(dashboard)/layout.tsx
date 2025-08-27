import { DashboardLayout } from "@/components/layout/dashboard-layout";

// TODO: Replace with actual user session data
const mockUser = {
  id: "user_123",
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://github.com/shadcn.png",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout user={mockUser}>{children}</DashboardLayout>;
}
