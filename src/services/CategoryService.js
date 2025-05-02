import axios from 'axios';
import UserService from './UserService';

const API_URL = '/api';

class CategoryService {
    // 获取分类详情
    async selectById(id) {
        try {
            const response = await axios.get(`${API_URL}/categories/${id}`, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('获取分类详情失败:', error);
            throw error;
        }
    }

    // 获取所有分类
    async selectAll() {
        try {
            const response = await axios.get(`${API_URL}/categories`, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('获取分类列表失败:', error);
            throw error;
        }
    }

    // 获取子分类
    async selectByParentId(parentId) {
        try {
            const response = await axios.get(`${API_URL}/categories/parent/${parentId}`, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('获取子分类失败:', error);
            throw error;
        }
    }

    // 创建分类
    async insert(category) {
        try {
            const response = await axios.post(`${API_URL}/categories`, category, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('创建分类失败:', error);
            throw error;
        }
    }

    // 更新分类
    async update(id, category) {
        try {
            const response = await axios.put(`${API_URL}/categories/${id}`, category, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('更新分类失败:', error);
            throw error;
        }
    }

    // 删除分类
    async deleteById(id) {
        try {
            await axios.delete(`${API_URL}/categories/${id}`, {
                headers: UserService.getAuthHeader()
            });
        } catch (error) {
            console.error('删除分类失败:', error);
            throw error;
        }
    }
}

export default new CategoryService(); 