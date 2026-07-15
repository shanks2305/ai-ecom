import authService from "./auth.service.js";

const login = async (email:string) => {
    try {
        const user = await authService.login(email);
    }
    catch (error) {
        throw error;
    }
}

export default {
    login
}