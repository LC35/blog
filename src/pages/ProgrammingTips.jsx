import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { programmingTipApi } from '../services/api';

const ProgrammingTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const languages = [
    'Python',
    'JavaScript',
    'Java',
    'C++',
    'Go',
    'Rust',
    'TypeScript',
    'PHP',
    'Ruby',
    'Swift',
  ];

  useEffect(() => {
    const fetchTips = async () => {
      try {
        setLoading(true);
        let response;
        if (selectedLanguage) {
          response = await programmingTipApi.getTipsByLanguage(selectedLanguage);
        } else {
          response = await programmingTipApi.getTips();
        }
        setTips(response);
        setTotalPages(Math.ceil(response.length / 9)); // 假设每页显示9条
      } catch (err) {
        setError('获取编程技巧失败，请重试');
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, [selectedLanguage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
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
      {/* 搜索和筛选 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="搜索编程技巧..."
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
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-md ${
                selectedLanguage === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedLanguage('')}
            >
              全部
            </button>
            {languages.map((language) => (
              <button
                key={language}
                className={`px-4 py-2 rounded-md ${
                  selectedLanguage === language
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedLanguage(language)}
              >
                {language}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* 编程技巧列表 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tips.map((tip) => (
          <Link
            key={tip.id}
            to={`/programming-tips/${tip.id}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {tip.title}
              </h3>
              <p className="text-gray-600 line-clamp-2">{tip.content}</p>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <span>{tip.language}</span>
                <span className="mx-2">•</span>
                <span>{new Date(tip.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-4 flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {tip.views} 次阅读
                </span>
                <span className="text-sm text-gray-500">
                  {tip.likes} 点赞
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <span className="px-4 py-2">
            第 {page} 页，共 {totalPages} 页
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
};

export default ProgrammingTips; 