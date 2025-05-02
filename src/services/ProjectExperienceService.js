import axios from 'axios';
import UserService from './UserService';

const API_URL = '/api';

class ProjectExperienceService {
    // 获取项目经验详情
    async selectById(id) {
        try {
            const response = await axios.get(`${API_URL}/project-experiences/${id}`);
            return response.data;
        } catch (error) {
            console.error('获取项目经验详情失败:', error);
            throw error;
        }
    }

    // 获取所有项目经验
    async selectAll() {
        try {
            const response = await axios.get(`${API_URL}/project-experiences`);
            return response.data;
        } catch (error) {
            console.error('获取项目经验列表失败:', error);
            throw error;
        }
    }

    // 获取用户的项目经验
    async selectByUserId(userId) {
        try {
            const response = await axios.get(`${API_URL}/project-experiences/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('获取用户项目经验失败:', error);
            throw error;
        }
    }

    // 获取作者的项目经验
    async selectByAuthorId(authorId) {
        try {
            const response = await axios.get(`${API_URL}/project-experiences/author/${authorId}`, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('获取作者项目经验失败:', error);
            throw error;
        }
    }

    // 获取分类下的项目经验
    async selectByCategoryId(categoryId) {
        try {
            const response = await axios.get(`${API_URL}/project-experiences/category/${categoryId}`, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('获取分类项目经验失败:', error);
            throw error;
        }
    }

    // 获取标签下的项目经验
    async selectByTagId(tagId) {
        try {
            const response = await axios.get(`${API_URL}/project-experiences/tag/${tagId}`, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('获取标签项目经验失败:', error);
            throw error;
        }
    }

    // 创建项目经验
    async insert(project) {
        try {
            const response = await axios.post(`${API_URL}/project-experiences`, project, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('创建项目经验失败:', error);
            throw error;
        }
    }

    // 更新项目经验
    async update(id, project) {
        try {
            const response = await axios.put(`${API_URL}/project-experiences/${id}`, project, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('更新项目经验失败:', error);
            throw error;
        }
    }

    // 删除项目经验
    async deleteById(id) {
        try {
            await axios.delete(`${API_URL}/project-experiences/${id}`, {
                headers: UserService.getAuthHeader()
            });
        } catch (error) {
            console.error('删除项目经验失败:', error);
            throw error;
        }
    }

    // 增加浏览量
    async incrementViewCount(id) {
        try {
            const response = await axios.put(`${API_URL}/project-experiences/${id}/view`, {}, {
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
            const response = await axios.put(`${API_URL}/project-experiences/${id}/like`, {}, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('增加点赞数失败:', error);
            throw error;
        }
    }

    // 获取热门项目经验
    async getHotProjects(limit = 10) {
        try {
            const response = await axios.get(`${API_URL}/project-experiences/hot?limit=${limit}`, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('获取热门项目经验失败:', error);
            throw error;
        }
    }

    // 获取最新项目经验
    async getLatestProjects(limit = 10) {
        try {
            const response = await axios.get(`${API_URL}/project-experiences/latest?limit=${limit}`, {
                headers: UserService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('获取最新项目经验失败:', error);
            throw error;
        }
    }
}

export default new ProjectExperienceService(); 