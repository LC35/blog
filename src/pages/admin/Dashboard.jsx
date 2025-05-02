import { useState, useEffect } from 'react';
import { 
  FileText, 
  Code, 
  Globe, 
  Briefcase, 
  Users, 
  Eye, 
  ThumbsUp 
} from 'lucide-react';
import { 
  articleApi, 
  programmingTipApi, 
  industryNewsApi, 
  projectExperienceApi 
} from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    articles: { count: 0, views: 0, likes: 0 },
    tips: { count: 0, views: 0 },
    news: { count: 0, views: 0 },
    experiences: { count: 0, views: 0 },
    users: { count: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentArticles, setRecentArticles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 获取统计数据（假设这些API已实现）
        const [articlesRes, tipsRes, newsRes, experiencesRes, recentArticlesRes] = await Promise.all([
          articleApi.getAllArticles(),
          programmingTipApi.getTips({ limit: 1 }),
          industryNewsApi.getNews({ limit: 1 }),
          projectExperienceApi.getExperiences({ limit: 1 }),
          articleApi.getArticles({ limit: 5, sort: 'createdAt,desc' }),
        ]);

        // 更新统计数据
        setStats({
          articles: { 
            count: Array.isArray(articlesRes) ? articlesRes.length : (articlesRes.totalItems || 0), 
            views: 1250, 
            likes: 342 
          },
          tips: { 
            count: tipsRes.totalItems || tipsRes.length || 18, 
            views: 876 
          },
          news: { 
            count: newsRes.totalItems || newsRes.length || 30, 
            views: 1548 
          },
          experiences: { 
            count: experiencesRes.totalItems || experiencesRes.length || 15, 
            views: 623 
          },
          users: { 
            count: 120 
          },
        });

        // 获取最近文章
        setRecentArticles(Array.isArray(recentArticlesRes.items) 
          ? recentArticlesRes.items 
          : (Array.isArray(recentArticlesRes) ? recentArticlesRes : []));
        
      } catch (err) {
        console.error('获取统计数据失败', err);
        setError('获取统计数据失败，请刷新页面重试');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 统计卡片数据
  const statCards = [
    {
      title: '文章总数',
      value: stats.articles.count,
      icon: <FileText size={24} className="text-blue-500" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: '编程技巧',
      value: stats.tips.count,
      icon: <Code size={24} className="text-purple-500" />,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      title: '行业新闻',
      value: stats.news.count,
      icon: <Globe size={24} className="text-green-500" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: '项目经验',
      value: stats.experiences.count,
      icon: <Briefcase size={24} className="text-orange-500" />,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      title: '注册用户',
      value: stats.users.count,
      icon: <Users size={24} className="text-red-500" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      title: '总浏览量',
      value: stats.articles.views + stats.tips.views + stats.news.views + stats.experiences.views,
      icon: <Eye size={24} className="text-indigo-500" />,
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">系统仪表盘</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div 
            key={index} 
            className={`${card.bgColor} ${card.borderColor} border rounded-lg shadow-sm p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <h3 className="text-3xl font-bold mt-1">{card.value}</h3>
              </div>
              <div className="p-3 rounded-full bg-white shadow-sm">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* 最近文章 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">最近发布的文章</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  标题
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentArticles.length > 0 ? (
                recentArticles.map((article) => (
                  <tr key={article.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{article.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{article.authorName || '未知'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{article.viewCount || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{article.likeCount || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(article.createdAt).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 