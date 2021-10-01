import axios from 'axios';

const url = "https://sleepy-plateau-79000.herokuapp.com/api/";

export const getAudiobookTitles = async (userID) => {
    try {
        const { data } = await axios.get(url + "audiobooks/titles/?userid=" + userID);
        return data;
    }
    catch (error) {
        console.log(error.message);
    }
}

export const getAudiobookText = async (bookID) => {
    try {
        const { data } = await axios.get(url + "audiobooks/" + bookID);
        return data;
    }
    catch (error) {
        console.log(error.message);
    }
}