import { httpAxios } from "@/helper/httpHelper";

export async function getUserName(userId) {
    const result = await httpAxios.get(`/api/users/${userId}`).then((res) => {
        return res.data
    })
    return result
}