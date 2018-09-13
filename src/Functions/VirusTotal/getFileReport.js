import https from "https";
import queryString from "querystring";

const options = {
    hostname: "virustotal.com",
    port: "443",
    path: "/vtapi/v2/file/report",
    method: "POST",
    headers: {
        "Accept-Encoding": "gzip deflate",
        "User-Agent": "gzip inabaa"
    }
}

/**
 * https://www.virustotal.com/en/documentation/public-api/#getting-file-scans
 * @param {string} hash 
 * @param {string} APIKey 
 * @returns {JSON} File Report from virustotal
 */
const getFileReport = (hash, APIKey) => {
    return new Promise((resolve, reject) => {
        const postData = queryString.stringify({
            "resource": hash,
            "apikey": APIKey
        });
    
        const req = https.request(options, res => {
            let end = "";
            res.on("data", d => {
                end += d;
            });

            res.on("end", () => {
                const result = end.length === 0 ? null 
                                                : json.parse(end);

                resolve(result);
            });

            res.on("error", e => {
                console.log(e);
            });
        });
    
        req.on("error", e => {
            reject(e);
        })
        req.write(postData);
        req.end();
    });
};

export default getFileReport;