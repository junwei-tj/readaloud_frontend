import axios from 'axios';

const url = "https://sleepy-plateau-79000.herokuapp.com/api/";

//========== APIS for Login ==========//

export const loginUser = async (googleLoginDetails) => {
    try {
        const { res } = await axios.post(url + "users/login", googleLoginDetails);
        return res;
    }
    catch (error) {
        console.log(error.message);
    }
} 

//========== APIS for PDFs ==========//

export const uploadPDF = async (PDFobject) => {
    try {
        const { res } = await axios.post(url + "upload", PDFobject);
        return res;
    }
    catch (error) {
        console.log(error.message);
    }
}

//========== APIS for Audiobooks ==========//

export const getAudiobookTitles = async (userID) => {
    try {
        const { res } = await axios.get(url + "audiobooks/titles/?userid=" + userID);
        return res;
    }
    catch (error) {
        console.log(error.message);
    }
}

export const getAudiobookText = async (bookID) => {
    try {
        const { res } = await axios.get(url + "audiobooks/" + bookID);
        return res;
    }
    catch (error) {
        console.log(error.message);
    }
}

export const getAudiobookProgress = async (bookID, userID) => {
    try {
        const { res } = await axios.get(url + "audiobooks/" + bookID + "/progress/?userid=" + userID);
        return res;
    }
    catch (error) {
        console.log(error.message);
    }
}

export const updateAudiobookProgress = async (bookID, userID, currentPage) => {
    try {
        const { res } = await axios.put(url + "audiobooks/" + bookID + "/progress/?userid=" + userID, 
                        { "current_page": currentPage});
        return res;
    }
    catch (error) {
        console.log(error.message);
    }
}

export const deleteAudiobook = async (bookID) => {
    try {
        const { res } = await axios.delete(url + "audiobooks/" + bookID);
        return res;
    }
    catch (error) {
        console.log(error.message);
    }
}

export const shareAudiobook = async (userToShareTo, bookID, emailToShareTo) => {
    try {
        const { res } = await axios.post(url + "users/share", 
                        { "user_id": userToShareTo,
                          "book_id": bookID,
                          "email": emailToShareTo });
        return res;
    }
    catch (error) {
        console.log(error.message);
    } 
}

//========== APIS for Bookmarks ==========//

export const addBookmark = async (userID, bookID, bookmarkName, page) => {
    try {
        const { res } = await axios.put(url + "users/bookmark", 
                      { "user_id": userID,
                        "book_id": bookID,
                        "name": bookmarkName,
                        "page": page });
        return res;
    }
    catch (error) {
        console.log(error.message);
    }
}

export const removeBookmark = async (userID, bookID, bookmarkID) => {
    try {
        const { res } = await axios.delete(url + "users/bookmark", 
                      { data : { "user_id": userID,
                                 "book_id": bookID,
                                 "bookmark_id": bookmarkID }});
        return res;
    }
    catch (error) {
        console.log(error.message);
    }
}