import axios from 'axios';

const API_URL = '/api';

class UserService {
    // 获取用户信息
    async selectById(id) {
        try {
            const response = await axios.get(`${API_URL}/users/${id}`, {
                headers: this.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('获取用户信息失败:', error);
            throw error;
        }
    }

    // 获取所有用户
    async selectAll() {
        try {
            const response = await axios.get(`${API_URL}/users`, {
                headers: this.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('获取用户列表失败:', error);
            throw error;
        }
    }

    // 创建用户
    async insert(user) {
        try {
            const response = await axios.post(`${API_URL}/users`, user, {
                headers: this.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('创建用户失败:', error);
            throw error;
        }
    }

    // 更新用户
    async update(id, user) {
        try {
            const response = await axios.put(`${API_URL}/users/${id}`, user, {
                headers: this.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('更新用户失败:', error);
            throw error;
        }
    }

    // 删除用户
    async deleteById(id) {
        try {
            await axios.delete(`${API_URL}/users/${id}`, {
                headers: this.getAuthHeader()
            });
        } catch (error) {
            console.error('删除用户失败:', error);
            throw error;
        }
    }

    // 用户登录
    async login(username, password) {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { username, password });
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            console.error('登录失败:', error);
            throw error;
        }
    }

    // 用户注册
    async register(user) {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, user);
            return response.data;
        } catch (error) {
            console.error('注册失败:', error);
            throw error;
        }
    }

    // 用户登出
    logout() {
        localStorage.removeItem('user');
    }

    // 获取当前用户
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    }

    // 获取认证头
    getAuthHeader() {
        const user = this.getCurrentUser();
        if (user && user.token) {
            return { Authorization: `Bearer ${user.token}` };
        }
        return {};
    }
}

export default new UserService(); 