import axios from 'axios';

const URL = 'http://localhost:3000/myTrend'

export const getUserTrendingKeyword = async () => {
    try {
        const { data: { data } } = await axios.get(`${URL}`);
        return data;
    }
    catch (err) {
        console.error(err);
    }
} 