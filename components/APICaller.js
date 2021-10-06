import axios from 'axios';

const url = 'https://sleepy-plateau-79000.herokuapp.com/api/';

//========== APIS for Login ==========//

export const loginUser = async googleLoginDetails => {
  try {
    const {data} = await axios.post(url + 'users/login', googleLoginDetails);
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

//========== APIS for PDFs ==========//

export const uploadPDF = async PDFobject => {
  const {data} = await axios.post(url + 'upload', PDFobject);
  return data;
  // try {
  //     const { data } = await axios.post(url + "upload", PDFobject);
  //     return data;
  // }
  // catch (error) {
  //     console.log(error.message);
  // }
};

//========== APIS for Audiobooks ==========//

export const getAudiobookTitles = async userID => {
  try {
    const {data} = await axios.get(url + 'audiobooks/titles/?userid=' + userID);
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const getAudiobookText = async bookID => {
  try {
    const {data} = await axios.get(url + 'audiobooks/' + bookID);
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const getAudiobookProgress = async (bookID, userID) => {
  try {
    const {data} = await axios.get(
      url + 'audiobooks/' + bookID + '/progress/?userid=' + userID,
    );
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const updateAudiobookProgress = async (bookID, userID, currentPage) => {
  try {
    const {data} = await axios.put(
      url + 'audiobooks/' + bookID + '/progress/?userid=' + userID,
      {current_page: currentPage},
    );
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteAudiobook = async bookID => {
  try {
    const {data} = await axios.delete(url + 'audiobooks/' + bookID);
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const updateAudiobookName = async (bookID, userID, newName) => {
  try {
    const {data} = await axios.put(url + 'audiobooks/' + bookID, {
      newBookTitle: newName,
      user_id: userID,
    });
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const shareAudiobookFile = async (userID, bookID, emailToShareTo) => {
  try {
    console.log("entering share audiobook");
    const {data} = await axios.post(url + 'users/share', {
      user_id: userID,
      book_id: bookID,
      email: emailToShareTo,
    });
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

//========== APIS for Bookmarks ==========//

export const addBookmark = async (userID, bookID, bookmarkName, page) => {
  try {
    const {data} = await axios.put(url + 'users/bookmark', {
      user_id: userID,
      book_id: bookID,
      name: bookmarkName,
      page: page,
    });
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const removeBookmark = async (userID, bookID, bookmarkID) => {
  try {
    const {data} = await axios.delete(url + 'users/bookmark', {
      data: {user_id: userID, book_id: bookID, bookmark_id: bookmarkID},
    });
    return data;
  } catch (error) {
    console.log(error.message);
  }
};
