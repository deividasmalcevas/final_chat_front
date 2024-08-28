
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
            credentials: 'include',
        };
        return new Promise((resolve) => {
            fetch(rootUrl + url, options)
                .then((res) => res.json())
                .then((res) => {
                    resolve(res);
                });
        });
    },
    get: (url, includeCredentials = false) => {
        const options = {
            method: 'GET',
        };

        if (includeCredentials) {
            options.credentials = 'include'; // Include credentials if requested
        }

        return new Promise((resolve, reject) => {
            fetch(rootUrl + url, options)
                .then((res) => {
                    if (!res.ok) {
                        return reject(new Error(`HTTP error! status: ${res.status}`));
                    }
                    return res.json();
                })
                .then((res) => {
                    resolve(res);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
};

export default http;
