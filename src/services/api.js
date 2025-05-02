import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL:  'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 添加token到请求头
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理常见错误
api.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    // 处理401未授权错误 - 清除token并跳转到登录页
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 文章相关API
export const articleApi = {
  // 获取文章列表
  getArticles: async (params = {}) => {
    try {
      return await api.get('/articles', { params });
    } catch (error) {
      console.error('获取文章列表失败:', error);
      throw error;
    }
  },

  // 获取所有文章（不分页）
  getAllArticles: async () => {
    try {
      return await api.get('/articles/all');
    } catch (error) {
      console.error('获取所有文章失败:', error);
      throw error;
    }
  },

  // 获取单篇文章
  getArticleById: async (id) => {
    try {
      return await api.get(`/articles/${id}`);
    } catch (error) {
      console.error(`获取文章(ID:${id})失败:`, error);
      throw error;
    }
  },

  // 创建文章
  createArticle: async (articleData) => {
    try {
      return await api.post('/articles', articleData);
    } catch (error) {
      console.error('创建文章失败:', error);
      throw error;
    }
  },

  // 更新文章
  updateArticle: async (id, articleData) => {
    try {
      return await api.put(`/articles/${id}`, articleData);
    } catch (error) {
      console.error(`更新文章(ID:${id})失败:`, error);
      throw error;
    }
  },

  // 删除文章
  deleteArticle: async (id) => {
    try {
      return await api.delete(`/articles/${id}`);
    } catch (error) {
      console.error(`删除文章(ID:${id})失败:`, error);
      throw error;
    }
  },
  
  // 获取文章分类
  getCategories: async () => {
    try {
      return await api.get('/categories');
    } catch (error) {
      console.error('获取分类列表失败:', error);
      throw error;
    }
  }
};

// 用户相关API
export const userApi = {
  // 用户登录
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      return response;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },

  // 用户登出
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve(true);
  },

  // 获取当前用户信息
  getCurrentUser: async () => {
    try {
      return await api.get('/users/me');
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  }
};

// 分类相关API
export const categoryApi = {
    getCategories: () => api.get('/categories'),
    getCategory: (id) => api.get(`/categories/${id}`), 
    getCategoriesByParent: (parentId) => api.get(`/categories/parent/${parentId}`),
    createCategory: (data) => api.post('/categories', data),
    updateCategory: (id, data) => api.put(`/categories/${id}`, data),
    deleteCategory: (id) => api.delete(`/categories/${id}`),
};

// 标签相关API
export const tagApi = {
    getTags: () => api.get('/tags'),
    getTag: (id) => api.get(`/tags/${id}`),
    getTagsByArticle: (articleId) => api.get(`/tags/article/${articleId}`),
    createTag: (data) => api.post('/tags', data),
    updateTag: (id, data) => api.put(`/tags/${id}`, data),
    deleteTag: (id) => api.delete(`/tags/${id}`),
};

// 编程技巧相关API
export const programmingTipApi = {
    getTips: () => api.get('/programming-tips'),
    getTip: (id) => api.get(`/programming-tips/${id}`),
    getTipsByAuthor: (authorId) => api.get(`/programming-tips/author/${authorId}`),
    getTipsByLanguage: (language) => api.get(`/programming-tips/language/${language}`),
    createTip: (data) => api.post('/programming-tips', data),
    updateTip: (id, data) => api.put(`/programming-tips/${id}`, data),
    deleteTip: (id) => api.delete(`/programming-tips/${id}`),
};

// 行业新闻相关API
export const industryNewsApi = {
    getNews: () => api.get('/industry-news'),
    getNewsItem: (id) => api.get(`/industry-news/${id}`),
    getNewsByCategory: (category) => api.get(`/industry-news/category/${category}`),
    searchNews: (keyword) => api.get(`/industry-news/search`, { params: { keyword } }),
    createNews: (data) => api.post('/industry-news', data),
    updateNews: (id, data) => api.put(`/industry-news/${id}`, data),
    deleteNews: (id) => api.delete(`/industry-news/${id}`),
    likeNews: (id) => api.post(`/industry-news/${id}/like`),
};

// 项目经验相关API
export const projectExperienceApi = {
    getExperiences: () => api.get('/project-experiences'),
    getExperience: (id) => api.get(`/project-experiences/${id}`),
    getExperiencesByUser: (userId) => api.get(`/project-experiences/user/${userId}`),
    getExperiencesByTechnology: (technology) => api.get(`/project-experiences/technology/${technology}`),
    searchExperiences: (keyword) => api.get(`/project-experiences/search`, { params: { keyword } }),
    createExperience: (data) => api.post('/project-experiences', data),
    updateExperience: (id, data) => api.put(`/project-experiences/${id}`, data),
    deleteExperience: (id) => api.delete(`/project-experiences/${id}`),
    likeExperience: (id) => api.post(`/project-experiences/${id}/like`),
};

export default api; 