import axios from 'axios';
import UserService from './UserService';

const API_URL = '/api';

class IndustryNewsService {
    // 获取行业新闻详情
    async selectById(id) {
        try {
            const response = await axios.get(`${API_URL}/industry-news/${id}`);
            return response.data;
        } catch (error) {
            console.error('获取行业新闻详情失败:', error);
            throw error;
        }
    }

    // 获取所有行业新闻
    async selectAll() {
        try {
            const response = await axios.get(`${API_URL}/industry-news`);
            return response.data;
        } catch (error) {
            console.error('获取行业新闻列表失败:', error);
            throw error;
        }
    }

    // 获取分类下的行业新闻
    async selectByCategoryId(categoryId) {
        try {
            const response = await axios.get(`${API_URL}/industry-news/category/${categoryId}`, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('获取分类行业新闻失败:', error);
            throw error;
        }
    }

    // 获取标签下的行业新闻
    async selectByTagId(tagId) {
        try {
            const response = await axios.get(`${API_URL}/industry-news/tag/${tagId}`, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('获取标签行业新闻失败:', error);
            throw error;
        }
    }

    // 创建行业新闻
    async insert(news) {
        try {
            const response = await axios.post(`${API_URL}/industry-news`, news, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('创建行业新闻失败:', error);
            throw error;
        }
    }

    // 更新行业新闻
    async update(id, news) {
        try {
            const response = await axios.put(`${API_URL}/industry-news/${id}`, news, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('更新行业新闻失败:', error);
            throw error;
        }
    }

    // 删除行业新闻
    async deleteById(id) {
        try {
            await axios.delete(`${API_URL}/industry-news/${id}`, {
                headers: UserService.getAuthHeader()
            });
        } catch (error) {
            console.error('删除行业新闻失败:', error);
            throw error;
        }
    }

    // 增加浏览量
    async incrementViewCount(id) {
        try {
            const response = await axios.put(`${API_URL}/industry-news/${id}/view`, {}, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('增加浏览量失败:', error);
            throw error;
        }
    }

    // 增加点赞数
    async incrementLikeCount(id) {
        try {
            const response = await axios.put(`${API_URL}/industry-news/${id}/like`, {}, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('增加点赞数失败:', error);
            throw error;
        }
    }

    // 获取热门行业新闻
    async getHotNews(limit = 10) {
        try {
            const response = await axios.get(`${API_URL}/industry-news/hot?limit=${limit}`, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('获取热门行业新闻失败:', error);
            throw error;
        }
    }

    // 获取最新行业新闻
    async getLatestNews(limit = 10) {
        try {
            const response = await axios.get(`${API_URL}/industry-news/latest?limit=${limit}`, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('获取最新行业新闻失败:', error);
            throw error;
        }
    }
}

export default new IndustryNewsService(); 