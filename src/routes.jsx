import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ArticleList from './pages/ArticleList';
import ArticleDetail from './pages/ArticleDetail';
import ProgrammingTips from './pages/ProgrammingTips';
import IndustryNews from './pages/IndustryNews';
import ProjectExperiences from './pages/ProjectExperiences';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { lazy, Suspense } from 'react';

// 懒加载管理后台页面
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ArticleManagement = lazy(() => import('./pages/admin/ArticleManagement'));
const ArticleEdit = lazy(() => import('./pages/admin/ArticleEdit'));
const CategoryManagement = lazy(() => import('./pages/admin/CategoryManagement'));
const TagManagement = lazy(() => import('./pages/admin/TagManagement'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));

// 加载指示器
const AdminPageLoader = () => (
  <div className="flex justify-center items-center min-h-[80vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'articles',
        element: <ArticleList />,
      },
      {
        path: 'articles/:id',
        element: <ArticleDetail />,
      },
      {
        path: 'programming-tips',
        element: <ProgrammingTips />,
      },
      {
        path: 'industry-news',
        element: <IndustryNews />,
      },
      {
        path: 'project-experiences',
        element: <ProjectExperiences />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<AdminPageLoader />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'articles',
        element: (
          <Suspense fallback={<AdminPageLoader />}>
            <ArticleManagement />
          </Suspense>
        ),
      },
      {
        path: 'articles/new',
        element: (
          <Suspense fallback={<AdminPageLoader />}>
            <ArticleEdit />
          </Suspense>
        ),
      },
      {
        path: 'articles/edit/:id',
        element: (
          <Suspense fallback={<AdminPageLoader />}>
            <ArticleEdit />
          </Suspense>
        ),
      },
      {
        path: 'categories',
        element: (
          <Suspense fallback={<AdminPageLoader />}>
            <CategoryManagement />
          </Suspense>
        ),
      },
      {
        path: 'tags',
        element: (
          <Suspense fallback={<AdminPageLoader />}>
            <TagManagement />
          </Suspense>
        ),
      },
      {
        path: 'users',
        element: (
          <Suspense fallback={<AdminPageLoader />}>
            <UserManagement />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router; 