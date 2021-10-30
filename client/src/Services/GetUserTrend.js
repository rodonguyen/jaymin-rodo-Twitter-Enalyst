import axios from 'axios';

const URL = 'http://localhost:3000/myTrend'

export const getUserTrendingKeyword = async () => {
    try {
        const { data: { data } } = await axios.get(`${URL}`);
        console.log(data)
        return data;
    }
    catch (err) {
        console.error(err);
    }
} 