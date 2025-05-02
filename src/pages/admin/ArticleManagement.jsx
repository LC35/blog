import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { articleApi } from '../../services/api';

const ArticleManagement = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    pageSize: 10
  });

  const fetchArticles = async (page = 0) => {
    try {
      setLoading(true);
      const response = await articleApi.getArticles({
        page,
        size: pagination.pageSize,
        search: search || undefined
      });
      
      if (!response) {
        setArticles([]);
        setError('返回数据异常，请重试');
        return;
      }
      
      setArticles(Array.isArray(response.items) ? response.items : (Array.isArray(response) ? response : []));
      setPagination({
        currentPage: page,
        totalPages: response.totalPages || Math.ceil((response.totalItems || response.length || 0) / pagination.pageSize) || 1,
        totalItems: response.totalItems || response.length || 0,
        pageSize: pagination.pageSize
      });
    } catch (err) {
      console.error('获取文章列表失败', err);
      setError('获取文章列表失败，请刷新页面重试');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchArticles(0);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchArticles(newPage);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除这篇文章吗？')) return;
    
    try {
      await articleApi.deleteArticle(id);
      // 重新获取当前页数据
      fetchArticles(pagination.currentPage);
    } catch (err) {
      console.error('删除文章失败', err);
      alert('删除文章失败，请重试');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">文章管理</h1>
        <Link
          to="/admin/articles/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md inline-flex items-center"
        >
          <Plus size={20} className="mr-1" /> 新增文章
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* 搜索栏 */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索文章标题或内容..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search size={20} className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            搜索
          </button>
        </form>
      </div>

      {/* 文章列表 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            暂无文章数据
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    标题
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    分类
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    作者
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    浏览量
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    点赞数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    发布时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.map((article) => (
                  <tr key={article.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {article.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {article.category || '未分类'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {article.authorName || '未知'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {article.viewCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {article.likeCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(article.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/articles/edit/${article.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 分页 */}
        {!loading && articles.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              显示第 <span className="font-medium">{pagination.currentPage * pagination.pageSize + 1}</span> 至 
              <span className="font-medium">
                {Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalItems)}
              </span> 条，
              共 <span className="font-medium">{pagination.totalItems}</span> 条
            </div>
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 0}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                  pagination.currentPage === 0
                    ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft size={18} />
              </button>
              <div className="hidden md:flex">
                {[...Array(Math.min(5, pagination.totalPages)).keys()].map((i) => {
                  // 计算页码，确保当前页在中间
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i;
                  } else if (pagination.currentPage < 2) {
                    pageNum = i;
                  } else if (pagination.currentPage > pagination.totalPages - 3) {
                    pageNum = pagination.totalPages - 5 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`-ml-px relative inline-flex items-center px-4 py-2 border ${
                        pagination.currentPage === pageNum
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages - 1}
                className={`-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                  pagination.currentPage === pagination.totalPages - 1
                    ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleManagement; 