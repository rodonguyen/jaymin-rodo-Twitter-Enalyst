import axios from 'axios';

const URL = 'http://localhost:3000/twitter'

export const getSearchTwitter = async (keyword) => {
    try {
        const data = await axios.get(`${URL}`, { params: { keyword: keyword } });
        return data;
    }
    catch (err) {
        console.error(err);
    }
} 