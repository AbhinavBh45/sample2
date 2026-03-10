document.addEventListener("DOMContentLoaded", function () {

    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }

        const regex = /^[a-zA-Z0-9_-]{1,30}$/;
        const isMatching = regex.test(username);

        if (!isMatching) {
            alert("Invalid Username");
        }

        return isMatching;
    }

    async function fetchUserDetails(username) {

        try {

            searchButton.textContent = "Searching..";
            searchButton.disabled = true;
            statsContainer.innerHTML = "";

            const proxyUrl = "https://cors-anywhere.herokuapp.com/";
            const targetUrl = "https://leetcode.com/graphql/";

            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/json");

            const graphql = JSON.stringify({
                query: `
                query userSessionProgress($username: String!) {
                    allQuestionsCount {
                        difficulty
                        count
                    }
                    matchedUser(username: $username) {
                        submitStats {
                            acSubmissionNum {
                                difficulty
                                count
                                submissions
                            }
                        }
                    }
                }`,
                variables: {
                    username: username
                }
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
                redirect: "follow"
            };

            const response = await fetch(proxyUrl + targetUrl, requestOptions);

            if (!response.ok) {
                throw new Error("Unable to fetch user details");
            }

            const parseData = await response.json();

            console.log("API Response:", parseData);

            if (parseData.errors) {
                statsContainer.innerHTML = "<p>Error fetching user data</p>";
                return;
            }

            if (!parseData.parseData.matchedUser) {
                statsContainer.innerHTML = "<p>User not found</p>";
                return;
            }

        }
        catch (error) {
            statsContainer.innerHTML = "<p>No data Found</p>";
            console.error(error);
        }
        finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }


    function displayUserData(parseData) {
        const totalQues = parseData.data.allQuestionsCount[0].count;
        const totalEasyQues = parseData.data.allQuestionsCount[1].count;
        const totalMediumQues = parseData.data.allQuestionsCount[2].count;
        const totalHardQues = parseData.data.allQuestionsCount[3].count;

        const solvedTotalQues = parseData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedTotalEasyQues = parseData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedTotalMediumQues = parseData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedTotalHardQues = parseData.data.matchedUser.submitStats.acSubmissionNum[3].count;

    }

    searchButton.addEventListener('click', () => {
        const username = usernameInput.value;
        console.log("logging username:", username);

        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });

});