
import currentHost from "@/plugins/hostSettings";
const rootUrl = "http://"+currentHost

const http = {

    post: (url, data, file) => {
        const options = {
            method: "POST",
            headers: {},
            body: file ? data : JSON.stringify(data), // Use FormData if file is true, otherwise stringify data
            credentials: 'include',
        };

        if (!file) {
            options.headers['Content-Type'] = 'application/json';
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
