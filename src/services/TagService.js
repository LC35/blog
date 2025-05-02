import axios from 'axios';
import UserService from './UserService';

const API_URL = '/api';

class TagService {
    // 获取标签详情
    async selectById(id) {
        try {
            const response = await axios.get(`${API_URL}/tags/${id}`, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('获取标签详情失败:', error);
            throw error;
        }
    }

    // 获取所有标签
    async selectAll() {
        try {
            const response = await axios.get(`${API_URL}/tags`, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('获取标签列表失败:', error);
            throw error;
        }
    }

    // 获取文章标签
    async selectByArticleId(articleId) {
        try {
            const response = await axios.get(`${API_URL}/tags/article/${articleId}`, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('获取文章标签失败:', error);
            throw error;
        }
    }

    // 创建标签
    async insert(tag) {
        try {
            const response = await axios.post(`${API_URL}/tags`, tag, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('创建标签失败:', error);
            throw error;
        }
    }

    // 更新标签
    async update(id, tag) {
        try {
            const response = await axios.put(`${API_URL}/tags/${id}`, tag, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('更新标签失败:', error);
            throw error;
        }
    }

    // 删除标签
    async deleteById(id) {
        try {
            await axios.delete(`${API_URL}/tags/${id}`, {
                headers: UserService.getAuthHeader()
            });
        } catch (error) {
            console.error('删除标签失败:', error);
            throw error;
        }
    }
}

export default new TagService(); 