import { httpAxios } from "@/helper/httpHelper";

export async function signUp(user) {
    const result = await httpAxios.post("/api/users", user).then((res) => {
        res.data
    })
    return result;
}

import axios from "axios";

export async function logIn(credentials) {
    try {
        const response = await axios.post("/api/login", credentials);
        return response.data; // Success case
    } catch (error) {
        if (error.response) {
            // Return backend error message instead of throwing
            return error.response.data; 
        }
        throw error; // For network or unknown errors
    }
}

export async function curentUser() {
    const result = await httpAxios.get("/api/current").then((res) => {
        return res.data
    })
    return result;
}

export async function logOut() {
    const result = await httpAxios.post("/api/logout").then((res) => {
        return res.data
    })
    return result;
}