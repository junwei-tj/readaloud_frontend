import axios from 'axios';

const url = 'https://sleepy-plateau-79000.herokuapp.com/api/'; //Base URL to append to

//========== APIS for Login ==========//

/*
* POST request for logging in a user
* Called after logging in through Google Services
* For a new user, also registers the user into the server's database
* Also retrieves any new notifications for the user to be displayed
*/
export const loginUser = async googleLoginDetails => {
  try {
    const {data} = await axios.post(url + 'users/login', googleLoginDetails);
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

//========== APIS for PDFs ==========//

// POST request for uploading a PDF to the server for conversion to text
export const uploadPDF = async PDFobject => {
  try {
      const {data} = await axios.post(url + "upload", PDFobject);
      return data;
  }
  catch (error) {
      console.log(error.message);
  }
};

//========== APIS for Audiobooks ==========//

/* 
* GET request for list of audiobook titles under the current user
* Includes audiobooks uploaded by the user and audiobooks that other users have shared with him/her
*/
export const getAudiobookTitles = async (userID) => {
  try {
    const {data} = await axios.get(url + 'audiobooks/titles/?userid=' + userID);
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

// GET request for downloading of audiobook text from converting its correpsonding PDF in the server
export const getAudiobookText = async bookID => {
  try {
    const {data} = await axios.get(url + 'audiobooks/' + bookID);
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

// GET request for retreiving user's last progress (the page and sentence last read) across all devices for the user's audiobook
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

// PUT request for updating of user's last progress (the page and sentence last read) for the user's audiobook
export const updateAudiobookProgress = async (bookID, userID, currentPage, currentSentence) => {
  try {
    const {data} = await axios.put(
      url + 'audiobooks/' + bookID + '/progress/?userid=' + userID,
      {current_page: currentPage, current_sentence: currentSentence},
    );
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

/*
* DELETE request for deletion of previously saved audiobook text for a user on the server
* If called by the original owner of an audiobook, deletion will be done for all users that audiobook is shared with
* Otherwise, deletion will only be done for the specific user that requested it
*/
export const deleteAudiobookFile = async (bookID, userID) => {
  try {
    const {status} = await axios.delete(url + 'audiobooks/' + bookID + "?user_id=" + userID);
    return status;
  } catch (error) {
    console.log(error.message);
  }
};

// PUT request for updating of audiobook's title for the user
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

// POST request for sharing of audiobook with another user via his/her email address
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

// PUT request for addition of newly saved bookmark (page number) for a user's audiobook
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

// DELETE request for removal of previously saved bookmark for a user's audiobook
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
