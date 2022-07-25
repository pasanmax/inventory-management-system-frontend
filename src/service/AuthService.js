import http from '../http-common';

class AuthService {
    async login(data) {
        return await http.post('/auth/login', data);
    }

    async userInfo() {
        return await http.get('/auth/userinfo', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('user')
            }
        });
    }
}

export default new AuthService();