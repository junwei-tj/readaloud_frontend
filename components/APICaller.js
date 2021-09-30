const getAudiobookTitles = (userID) => {
    const apiURL = "https://localhost:8081/api/audiobook/titles/?userid=" + userID;
    fetch(apiURL)
    .then((response) => response.json())
    .then((responseJson) => {
        return responseJson;
    }).catch((error) => {
        console.error(error);
    })
}

export default APICaller;