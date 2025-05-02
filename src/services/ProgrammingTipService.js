import axios from 'axios';
import UserService from './UserService';

const API_URL = '/api';

class ProgrammingTipService {
    // 获取编程技巧详情
    async selectById(id) {
        try {
            const response = await axios.get(`${API_URL}/programming-tips/${id}`);
            return response.data;
        } catch (error) {
            console.error('获取编程技巧详情失败:', error);
            throw error;
        }
    }

    // 获取所有编程技巧
    async selectAll() {
        try {
            const response = await axios.get(`${API_URL}/programming-tips`);
            return response.data;
        } catch (error) {
            console.error('获取编程技巧列表失败:', error);
            throw error;
        }
    }

    // 获取作者的编程技巧
    async selectByAuthorId(authorId) {
        try {
            const response = await axios.get(`${API_URL}/programming-tips/author/${authorId}`);
            return response.data;
        } catch (error) {
            console.error('获取作者编程技巧失败:', error);
            throw error;
        }
    }

    // 获取特定编程语言的技巧
    async selectByLanguage(language) {
        try {
            const response = await axios.get(`${API_URL}/programming-tips/language/${language}`);
            return response.data;
        } catch (error) {
            console.error('获取特定语言编程技巧失败:', error);
            throw error;
        }
    }

    // 创建编程技巧
    async insert(tip) {
        try {
            const response = await axios.post(`${API_URL}/programming-tips`, tip, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('创建编程技巧失败:', error);
            throw error;
        }
    }

    // 更新编程技巧
    async update(id, tip) {
        try {
            const response = await axios.put(`${API_URL}/programming-tips/${id}`, tip, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('更新编程技巧失败:', error);
            throw error;
        }
    }

    // 删除编程技巧
    async deleteById(id) {
        try {
            await axios.delete(`${API_URL}/programming-tips/${id}`, {
                headers: UserService.getAuthHeader()
            });
        } catch (error) {
            console.error('删除编程技巧失败:', error);
            throw error;
        }
    }

    // 增加浏览量
    async incrementViewCount(id) {
        try {
            const response = await axios.put(`${API_URL}/programming-tips/${id}/view`, {}, {
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
            const response = await axios.put(`${API_URL}/programming-tips/${id}/like`, {}, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('增加点赞数失败:', error);
            throw error;
        }
    }
}

export default new ProgrammingTipService(); 