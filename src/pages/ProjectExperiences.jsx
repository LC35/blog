import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectExperienceApi } from '../services/api';
import { Search, ThumbsUp, Calendar, Eye, Code } from 'lucide-react';

const ProjectExperiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechnology, setSelectedTechnology] = useState('');
  const [itemsPerPage] = useState(9);

  const technologies = [
    '前端开发',
    '后端开发',
    '移动开发',
    '人工智能',
    '大数据',
    '云计算',
    '区块链',
    'DevOps',
    '安全',
    '其他',
  ];

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await projectExperienceApi.getExperiences();
        setExperiences(response);
        setFilteredExperiences(response);
        setTotalPages(Math.ceil(response.length / itemsPerPage));
      } catch (err) {
        setError('获取项目经验失败，请重试');
        console.error('获取项目经验失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [itemsPerPage]);

  // 当选择技术或搜索内容变化时，过滤项目经验
  useEffect(() => {
    let result = experiences;
    
    // 按技术筛选
    if (selectedTechnology) {
      result = result.filter(exp => 
        (exp.technology === selectedTechnology) || 
        (exp.technologies && exp.technologies.includes(selectedTechnology))
      );
    }
    
    // 按搜索词筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(exp => 
        (exp.title && exp.title.toLowerCase().includes(query)) ||
        (exp.summary && exp.summary.toLowerCase().includes(query)) ||
        (exp.content && exp.content.toLowerCase().includes(query)) ||
        (exp.technology && exp.technology.toLowerCase().includes(query)) ||
        (exp.technologies && exp.technologies.toLowerCase().includes(query))
      );
    }
    
    setFilteredExperiences(result);
    setTotalPages(Math.ceil(result.length / itemsPerPage));
    setPage(1); // 重置到第一页
  }, [selectedTechnology, searchQuery, experiences, itemsPerPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    // 搜索逻辑已在useEffect中处理
  };

  const handleTechnologyClick = (technology) => {
    setSelectedTechnology(technology === selectedTechnology ? '' : technology);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleLike = async (id, e) => {
    e.preventDefault(); // 阻止Link跳转
    try {
      await projectExperienceApi.likeExperience(id);
      // 更新本地项目经验列表中的点赞数
      const updatedExperiences = experiences.map(exp => {
        if (exp.id === id) {
          return { ...exp, likes: (exp.likes || 0) + 1 };
        }
        return exp;
      });
      setExperiences(updatedExperiences);
      
      // 同时更新过滤后的列表
      const updatedFiltered = filteredExperiences.map(exp => {
        if (exp.id === id) {
          return { ...exp, likes: (exp.likes || 0) + 1 };
        }
        return exp;
      });
      setFilteredExperiences(updatedFiltered);
    } catch (err) {
      console.error('点赞失败:', err);
      if (err.response?.status === 401) {
        alert('请先登录后再点赞');
      }
    }
  };

  // 获取当前页的项目经验
  const getCurrentPageItems = () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredExperiences.slice(startIndex, endIndex);
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">项目经验</h1>
      
      {/* 搜索和筛选 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="搜索项目经验..."
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
                selectedTechnology === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedTechnology('')}
            >
              全部
            </button>
            {technologies.map((technology) => (
              <button
                type="button"
                key={technology}
                className={`px-4 py-2 rounded-md transition ${
                  selectedTechnology === technology
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleTechnologyClick(technology)}
              >
                {technology}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* 结果统计 */}
      <div className="text-sm text-gray-500">
        共找到 {filteredExperiences.length} 条相关结果
      </div>

      {/* 项目经验列表 */}
      {filteredExperiences.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">暂无相关项目经验</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getCurrentPageItems().map((experience) => (
            <div
              key={experience.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            >
              <Link to={`/project-experiences/${experience.id}`} className="block">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition">
                    {experience.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full inline-flex items-center">
                      <Code className="h-3 w-3 mr-1" />
                      {experience.technology || (experience.technologies && experience.technologies.split(',')[0]) || '其他技术'}
                    </span>
                    {experience.duration && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {experience.duration}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 line-clamp-3 mb-4 text-sm">
                    {experience.summary || (experience.content && experience.content.substring(0, 150) + '...')}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {new Date(experience.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        {experience.viewCount || 0}
                      </span>
                    </div>
                    <button 
                      onClick={(e) => handleLike(experience.id, e)}
                      className="flex items-center text-gray-500 hover:text-blue-600 transition"
                    >
                      <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                      {experience.likes || 0}
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

export default ProjectExperiences; 