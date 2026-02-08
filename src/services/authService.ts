import api from '@/lib/axios';

export interface LoginResponse {
    access_token: string;
    token_type: string;
}

export const authService = {
    async login(email: string, password: string): Promise<LoginResponse> {
        // The API requires email and password as query parameters based on the description
        const response = await api.post<LoginResponse>(`/auth/login`, null, {
            params: {
                email,
                password,
            },
        });
        return response.data;
    },
};
