import axios from 'axios';

const URL = 'http://localhost:3000/googleTrend'

export const getTrendingKeyword = async () => {
    try {
        const { data: { data } } = await axios.get(`${URL}`);
        console.log(data)
        return data;
    }
    catch (err) {
        console.error(err);
    }
} 