
import currentHost from "@/plugins/hostSettings";
const rootUrl = "http://"+currentHost

const http = {

    post: (url, data) => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
        return new Promise((resolve) => {
            fetch(rootUrl + url, options)
                .then((res) => res.json())
                .then((res) => {
                    resolve(res);
                });
        });
    },
    postAuth: (url, data, token) => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(data),
        };
        return new Promise((resolve) => {
            fetch(rootUrl + url, options)
                .then((res) => res.json())
                .then((res) => {
                    resolve(res);
                });
        });
    },

    deleteAuth: (url, token) => {
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        };
        return new Promise((resolve) => {
            fetch(rootUrl + url, options)
                .then((res) => res.json())
                .then((res) => {
                    resolve(res);
                });
        });
    },

    postFormData: (url, data, token) => {
        const options = {
            method: "POST",
            headers: {
                Authorization: token,  // Include token in the headers
            },
            body: data,
        };
        return new Promise((resolve, reject) => {
            fetch(rootUrl + url, options)
                .then(async (res) => {
                    if (!res.ok) {
                        const errorText = await res.text();
                        reject(new Error(errorText));
                    } else {
                        return res.json();
                    }
                })
                .then((res) => {
                    resolve(res);
                })
                .catch((error) => reject(error));
        });
    },
    get: (url) => {
        return new Promise((resolve) => {
            fetch(rootUrl + url)
                .then((res) => res.json())
                .then((res) => {
                    resolve(res);
                });
        });
    },
    getAuth: (url, token, userId) => {
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
                "userId": userId,
            },
        };
        return new Promise((resolve) => {
            fetch(rootUrl + url, options)
                .then((res) => res.json())
                .then((res) => {
                    resolve(res);
                });
        });
    },
};

export default http;
