import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { articleApi, categoryApi, tagApi } from '../services/api';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9); // 每页9篇文章，适合3列布局
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  
  const location = useLocation();
  const navigate = useNavigate();

  // 从URL获取查询参数
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pageParam = searchParams.get('page');
    const categoryParam = searchParams.get('category');
    const tagParam = searchParams.get('tag');
    const searchParam = searchParams.get('search');
    
    if (pageParam) setPage(parseInt(pageParam));
    if (categoryParam) setSelectedCategory(categoryParam);
    if (tagParam) setSelectedTag(tagParam);
    if (searchParam) setSearchQuery(searchParam);
  }, [location.search]);

  // 获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 获取分类和标签
        const [categoriesRes, tagsRes] = await Promise.all([
          categoryApi.getCategories(),
          tagApi.getTags(),
        ]);
        setCategories(categoriesRes);
        setTags(tagsRes);
        
        // 获取文章列表
        const articlesRes = await articleApi.getArticles({
          page: page,
          size: pageSize,
          search: searchQuery,
          categoryId: selectedCategory,
          tagId: selectedTag,
        });
        
        setArticles(articlesRes.items);
        setTotalPages(articlesRes.totalPages);
        setTotalItems(articlesRes.totalItems);
      } catch (err) {
        console.error('获取文章列表失败', err);
        setError('获取文章列表失败，请重试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [page, pageSize, searchQuery, selectedCategory, selectedTag]);

  // 更新URL查询参数
  const updateUrlParams = (params) => {
    const searchParams = new URLSearchParams(location.search);
    
    // 更新参数
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value);
      } else {
        searchParams.delete(key);
      }
    });
    
    // 如果页码是1，不显示页码参数
    if (params.page === 1 && searchParams.has('page')) {
      searchParams.delete('page');
    }
    
    // 更新URL，不重新加载页面
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    updateUrlParams({ search: searchQuery, page: 1 });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    setPage(1);
    updateUrlParams({ category: value, page: 1 });
  };

  const handleTagChange = (e) => {
    const value = e.target.value;
    setSelectedTag(value);
    setPage(1);
    updateUrlParams({ tag: value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    updateUrlParams({ page: newPage });
    window.scrollTo(0, 0);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTag('');
    setPage(1);
    navigate(location.pathname, { replace: true });
  };

  if (loading && articles.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 标题和搜索栏 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">文章列表</h1>
        <p className="mt-2 text-gray-600">探索我们的最新文章和技术分享</p>
      </div>
      
      {/* 搜索和筛选 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="搜索文章..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              搜索
            </button>
          </div>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分类
              </label>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">全部分类</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签
              </label>
              <select
                value={selectedTag}
                onChange={handleTagChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">全部标签</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>
            {(selectedCategory || selectedTag || searchQuery) && (
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                  清除所有筛选条件
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* 过滤条件提示 */}
      {(selectedCategory || selectedTag || searchQuery) && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-blue-700">
                当前筛选条件: 
                {searchQuery && <span className="font-medium ml-1">关键词 "{searchQuery}"</span>}
                {selectedCategory && categories.length > 0 && (
                  <span className="font-medium ml-1">
                    分类 "{categories.find(c => c.id.toString() === selectedCategory.toString())?.name || selectedCategory}"
                  </span>
                )}
                {selectedTag && tags.length > 0 && (
                  <span className="font-medium ml-1">
                    标签 "{tags.find(t => t.id.toString() === selectedTag.toString())?.name || selectedTag}"
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 文章列表 */}
      {error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">没有找到符合条件的文章</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/articles/${article.id}`}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 line-clamp-3 mb-4 text-sm">{article.summary}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{article.authorName || '未知作者'}</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {article.viewCount || 0}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      {article.likeCount || 0}
                    </span>
                  </div>
                  <span className="text-sm text-blue-600">{article.categoryName || ''}</span>
                </div>
                {article.tags && article.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.id}
                        className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full"
                      >
                        {tag.name}
                      </span>
                    ))}
                    {article.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs text-gray-500">
                        +{article.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              上一页
            </button>
            
            {/* 页码按钮 */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // 计算显示哪些页码
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (page <= 3) {
                pageNumber = i + 1;
              } else if (page >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = page - 2 + i;
              }
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-2 rounded-md border ${
                    page === pageNumber
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              下一页
            </button>
          </nav>
        </div>
      )}
      
      {/* 显示总条数 */}
      <div className="text-center text-sm text-gray-500">
        共 {totalItems} 篇文章，第 {page} 页 / 共 {totalPages} 页
      </div>
    </div>
  );
};

export default ArticleList; 