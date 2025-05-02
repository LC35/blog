import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { industryNewsApi } from '../services/api';
import { Search, ThumbsUp, Calendar, Eye } from 'lucide-react';

const IndustryNews = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [itemsPerPage] = useState(9);

  const categories = [
    '人工智能',
    '云计算',
    '大数据',
    '区块链',
    '物联网',
    '移动开发',
    'Web开发',
    'DevOps',
    '安全',
    '其他',
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await industryNewsApi.getNews();
        setNews(response);
        setFilteredNews(response);
        setTotalPages(Math.ceil(response.length / itemsPerPage));
      } catch (err) {
        setError('获取行业新闻失败，请重试');
        console.error('获取新闻失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [itemsPerPage]);

  // 当选择分类或搜索内容变化时，过滤新闻
  useEffect(() => {
    let result = news;
    
    // 按分类筛选
    if (selectedCategory) {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    // 按搜索词筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.summary && item.summary.toLowerCase().includes(query)) ||
        (item.content && item.content.toLowerCase().includes(query))
      );
    }
    
    setFilteredNews(result);
    setTotalPages(Math.ceil(result.length / itemsPerPage));
    setPage(1); // 重置到第一页
  }, [selectedCategory, searchQuery, news, itemsPerPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    // 搜索逻辑已在useEffect中处理
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleLike = async (id, e) => {
    e.preventDefault(); // 阻止Link跳转
    try {
      await industryNewsApi.likeNews(id);
      // 更新本地新闻列表中的点赞数
      const updatedNews = news.map(item => {
        if (item.id === id) {
          return { ...item, likes: (item.likes || 0) + 1 };
        }
        return item;
      });
      setNews(updatedNews);
      
      // 同时更新过滤后的列表
      const updatedFiltered = filteredNews.map(item => {
        if (item.id === id) {
          return { ...item, likes: (item.likes || 0) + 1 };
        }
        return item;
      });
      setFilteredNews(updatedFiltered);
    } catch (err) {
      console.error('点赞失败:', err);
      if (err.response?.status === 401) {
        alert('请先登录后再点赞');
      }
    }
  };

  // 获取当前页的新闻
  const getCurrentPageItems = () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredNews.slice(startIndex, endIndex);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">行业新闻</h1>
      
      {/* 搜索和筛选 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="搜索行业新闻..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              搜索
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`px-4 py-2 rounded-md transition ${
                selectedCategory === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory('')}
            >
              全部
            </button>
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={`px-4 py-2 rounded-md transition ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* 结果统计 */}
      <div className="text-sm text-gray-500">
        共找到 {filteredNews.length} 条相关结果
      </div>

      {/* 新闻列表 */}
      {filteredNews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">暂无相关新闻</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getCurrentPageItems().map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            >
              <Link to={`${item.sourceUrl}`} className="block">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition">
                    {item.title}
                  </h3>
                  <div className="mb-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full inline-block">
                    {item.category || '未分类'}
                  </div>
                  <p className="text-gray-600 line-clamp-3 mb-4 text-sm">
                    {item.summary || (item.content && item.content.substring(0, 150) + '...')}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        {item.viewCount || 0}
                      </span>
                    </div>
                    <button 
                      onClick={(e) => handleLike(item.id, e)}
                      className="flex items-center text-gray-500 hover:text-blue-600 transition"
                    >
                      <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                      {item.likes || 0}
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            上一页
          </button>
          <span className="px-4 py-2 bg-white border border-gray-300 rounded-md">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
};

export default IndustryNews; 