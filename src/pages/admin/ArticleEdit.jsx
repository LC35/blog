import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { articleApi } from '../../services/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ArticleEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [article, setArticle] = useState({
    title: '',
    content: '',
    category: '',
    summary: '',
    coverImage: '',
    tags: []
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    // 获取分类列表
    const fetchCategories = async () => {
      try {
        const response = await articleApi.getCategories();
        setCategories(Array.isArray(response) ? response : []);
      } catch (err) {
        console.error('获取分类列表失败', err);
      }
    };

    fetchCategories();

    // 如果是编辑模式，获取文章详情
    if (isEditMode) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const data = await articleApi.getArticleById(id);
      setArticle({
        title: data.title || '',
        content: data.content || '',
        category: data.category || '',
        summary: data.summary || '',
        coverImage: data.coverImage || '',
        tags: Array.isArray(data.tags) ? data.tags : []
      });
    } catch (err) {
      console.error('获取文章详情失败', err);
      setError('获取文章详情失败，请刷新页面重试');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticle(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content) => {
    setArticle(prev => ({ ...prev, content }));
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (!article.tags.includes(tagInput.trim())) {
      setArticle(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setArticle(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!article.title.trim()) {
      setError('文章标题不能为空');
      return;
    }
    
    if (!article.content.trim()) {
      setError('文章内容不能为空');
      return;
    }

    try {
      setSaving(true);
      
      // 自动生成摘要（如果未提供）
      if (!article.summary.trim() && article.content) {
        // 去除HTML标签，保留文本内容
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = article.content;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        
        // 取前100个字作为摘要
        const autoSummary = textContent.substring(0, 100);
        article.summary = autoSummary;
      }
      
      if (isEditMode) {
        await articleApi.updateArticle(id, article);
      } else {
        await articleApi.createArticle(article);
      }
      
      navigate('/admin/articles');
    } catch (err) {
      console.error('保存文章失败', err);
      setError('保存文章失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  // 编辑器配置
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'code-block'],
      ['clean']
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/admin/articles')}
          className="mr-3 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditMode ? '编辑文章' : '新增文章'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 左侧表单 */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                文章标题
              </label>
              <input
                type="text"
                name="title"
                value={article.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入文章标题"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                文章内容
              </label>
              <ReactQuill
                theme="snow"
                value={article.content}
                onChange={handleContentChange}
                modules={modules}
                className="bg-white rounded-md h-96 mb-12"
              />
            </div>
          </div>

          {/* 右侧表单 */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                文章分类
              </label>
              <select
                name="category"
                value={article.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">选择分类</option>
                {categories.map((category) => (
                  <option key={category.id || category.value || category} value={category.id || category.value || category}>
                    {category.name || category.label || category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                封面图片
              </label>
              <input
                type="text"
                name="coverImage"
                value={article.coverImage}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="输入图片URL"
              />
              {article.coverImage && (
                <div className="mt-2 border rounded-md overflow-hidden w-full h-40 bg-gray-100">
                  <img 
                    src={article.coverImage} 
                    alt="封面预览" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=图片加载失败';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                文章摘要
              </label>
              <textarea
                name="summary"
                value={article.summary}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="文章摘要（不填将自动生成）"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                标签
              </label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="添加标签"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                >
                  添加
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {article.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/admin/articles')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
          >
            {saving ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                保存中...
              </>
            ) : (
              <>
                <Save size={18} className="mr-1" />
                保存文章
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleEdit; 