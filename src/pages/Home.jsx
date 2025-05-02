import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleApi, programmingTipApi, industryNewsApi, projectExperienceApi } from '../services/api';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [tips, setTips] = useState([]);
  const [news, setNews] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 检查用户是否是管理员
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        setIsAdmin(user.role === 'ADMIN');
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }

    const fetchData = async () => {
      try {
        const [articlesRes, tipsRes, newsRes, experiencesRes] = await Promise.all([
          articleApi.getArticles({ limit: 5 }),
          programmingTipApi.getTips({ limit: 5 }),
          industryNewsApi.getNews({ limit: 5 }),
          projectExperienceApi.getExperiences({ limit: 5 }),
        ]);

        setArticles(articlesRes?.items || []);
        setTips(tipsRes || []);
        setNews(newsRes || []);
        setExperiences(experiencesRes || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 管理员入口按钮 */}
      {isAdmin && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-blue-700">管理员入口</h3>
            <p className="text-blue-600">欢迎回来，{currentUser?.username}。您可以管理博客内容。</p>
          </div>
          <Link
            to="/admin"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            进入后台
          </Link>
        </div>
      )}

      {/* 最新文章 */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">最新文章</h2>
          <Link
            to="/articles"
            className="text-blue-600 hover:text-blue-500"
          >
            查看全部
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles?.map((article) => (
            <Link
              key={article.id}
              to={`/articles/${article.id}`}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 line-clamp-2">{article.summary}</p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{article.author}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 编程技巧 */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">编程技巧</h2>
          <Link
            to="/programming-tips"
            className="text-blue-600 hover:text-blue-500"
          >
            查看全部
          </Link>
        </div>
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
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 行业新闻 */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">行业新闻</h2>
          <Link
            to="/industry-news"
            className="text-blue-600 hover:text-blue-500"
          >
            查看全部
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <Link
              key={item.id}
              to={`${item.source}`}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 line-clamp-2">{item.summary}</p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{item.source}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 项目经验 */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">项目经验</h2>
          <Link
            to="/project-experiences"
            className="text-blue-600 hover:text-blue-500"
          >
            查看全部
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {experiences.map((experience) => (
            <Link
              key={experience.id}
              to={`/project-experiences/${experience.id}`}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {experience.title}
                </h3>
                <p className="text-gray-600 line-clamp-2">{experience.summary}</p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span>{experience.technology}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(experience.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home; 