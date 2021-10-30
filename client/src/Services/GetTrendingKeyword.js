import axios from 'axios';

const URL = 'http://localhost:3000/googleTrend'

export const getTrendingKeyword = async () => {
    try {
        const { data: { data } } = await axios.get(`${URL}`);
        return data;
    }
    catch (err) {
        console.error(err);
    }
} 