import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Code, 
  Globe, 
  Briefcase, 
  Tag, 
  FolderTree, 
  Users, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

const AdminLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      // 如果没有登录，重定向到登录页面
      navigate('/login');
      return;
    }
    
    try {
      const user = JSON.parse(userStr);
      // 检查用户是否有管理员权限
      if (user.role !== 'ADMIN') {
        navigate('/');
        return;
      }
      setCurrentUser(user);
    } catch (e) {
      console.error('Failed to parse user data:', e);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // 导航菜单项
  const menuItems = [
    { name: '仪表盘', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: '文章管理', path: '/admin/articles', icon: <FileText size={20} /> },
    { name: '编程技巧', path: '/admin/programming-tips', icon: <Code size={20} /> },
    { name: '行业新闻', path: '/admin/industry-news', icon: <Globe size={20} /> },
    { name: '项目经验', path: '/admin/project-experiences', icon: <Briefcase size={20} /> },
    { name: '分类管理', path: '/admin/categories', icon: <FolderTree size={20} /> },
    { name: '标签管理', path: '/admin/tags', icon: <Tag size={20} /> },
    { name: '用户管理', path: '/admin/users', icon: <Users size={20} /> },
  ];

  // 检查导航项是否激活
  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    if (path !== '/admin' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 侧边栏 */}
      <div 
        className={`${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 transform md:relative md:translate-x-0 z-30 transition duration-200 ease-in-out md:flex-shrink-0 w-64 bg-gray-800 md:flex flex-col overflow-y-auto`}
      >
        {/* 侧边栏头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <Link to="/admin" className="text-xl font-bold text-white flex items-center space-x-2">
            <LayoutDashboard />
            <span>博客后台管理</span>
          </Link>
          <button 
            className="md:hidden text-white" 
            onClick={() => setIsMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* 导航菜单 */}
        <nav className="mt-5 flex-1 px-2">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-2 py-2 rounded-md group ${
                  isActive(item.path)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <div className="mr-3">{item.icon}</div>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* 底部导航 */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center px-2 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md w-full"
          >
            <LogOut size={20} className="mr-3" />
            <span>退出登录</span>
          </button>
          <Link
            to="/"
            className="flex items-center px-2 py-2 mt-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
          >
            <span>返回前台</span>
          </Link>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航栏 */}
        <header className="bg-white shadow-sm">
          <div className="px-4 py-3 flex justify-between items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu size={24} />
            </button>
            
            <div className="text-lg font-semibold hidden md:block">
              {currentUser && `欢迎, ${currentUser.username || '管理员'}`}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {currentUser && currentUser.username}
              </div>
            </div>
          </div>
        </header>

        {/* 内容区域 */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 