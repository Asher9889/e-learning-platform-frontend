import React from 'react';
import { 
   X, LayoutDashboard, BookOpen, Video, Settings, 
  Users, BarChart3, Award, User 
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { UserRole } from '@/types/user';
// Menu item structure
interface MenuItem {
  title: string;
  icon: LucideIcon;
  href: string;
}
// Menu configuration based on roles
const MENU_CONFIG: Record<UserRole, MenuItem[]> = {
  teacher: [
    { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { title: "My Courses", icon: BookOpen, href: "/courses" },
    { title: "Live Classes", icon: Video, href: "/live-classes" },
    { title: "Students", icon: Users, href: "/students" },
    { title: "Analytics", icon: BarChart3, href: "/analytics" },
    { title: "Settings", icon: Settings, href: "/settings" },
  ],
  student: [
    { title: "Dashboard", icon: LayoutDashboard, href: "/student/dashboard" },
    { title: "My Courses", icon: BookOpen, href: "/student/courses" },
    { title: "Live Classes", icon: Video, href: "/student/live-classes" },
    { title: "Progress", icon: BarChart3, href: "/student/progress" },
    { title: "Certificates", icon: Award, href: "/student/certificates" },
    { title: "Profile", icon: User, href: "/student/profile" },
  ],
  admin: [
    { title: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { title: "Users", icon: Users, href: "/admin/users" },
    { title: "Settings", icon: Settings, href: "/admin/settings" },
  ]
};

interface SidebarProps {
  role: UserRole;
  setIsMobileOpen: (isOpen: boolean) => void;
  isMobileOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ role ,setIsMobileOpen ,isMobileOpen}) => {
 
  const menuItems = MENU_CONFIG[role] || MENU_CONFIG.student;

  return (
    <>
      {/* Mobile Topbar with Hamburger Menu */}
      {/* <div className="md:hidden p-4 bg-slate-900 text-white flex justify-between items-center shadow-md">
        <span className="font-bold text-lg">Patshala Platform</span>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} aria-label="Toggle Menu">
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div> */}

      {/* Sidebar Drawer (Mobile) & Fixed Sidebar (Desktop) */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 bg-white border-b text-gray-700 p-4 z-50 transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:block
      `}>
        <div className="flex justify-end md:hidden mb-4">
          <button onClick={() => setIsMobileOpen(false)} className="p-2">
            <X size={24} />
          </button>
        </div>
        <h1 className="text-xl font-bold text-center mb-8 px-2 hidden md:block border-b py-2 ">Welcome</h1>
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <a 
              key={`${item.title}-${index}`} 
              href={item.href} 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              <item.icon size={20} />
              {item.title}
            </a>
          ))}
        </nav>
      </aside>
      
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}
    </>
  );
};

export default Sidebar;