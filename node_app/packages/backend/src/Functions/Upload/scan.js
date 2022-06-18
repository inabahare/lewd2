import http from "http";

const post = async (endpoint, data) =>
  new Promise((resolve, reject) => {
    const postDataJson = JSON.stringify(data);
    const port = parseInt(MESSAGE_SERVER_PORT);

    const options = {
      host: `localhost`, // Why can't
      port: port,        // you
      protocol: "http:", // just 
      path: "/scan",     // be normal
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": postDataJson.length
      },
    };
    
    const request = http.request(options, result => {
      result.on("end", () => {
        resolve();
      });
    });

    request.on("error", error => {
      reject(`Error posting ${postDataJson}, ${error.message}`);
    });

    request.write(postDataJson);

    request.end();
  });

const {
  MESSAGE_SERVER_PORT
} = process.env;

/**
 * Scans a file with sophos and gets a file report from VirusTotal
 */
const scan = async (fileName, fileHash) => {
  const body = {
    fileName, fileHash
  };

  const servicesUrl = `localhost:${MESSAGE_SERVER_PORT}`;

  try {
    await post(servicesUrl, body);
  } catch (e) {
    console.error("Could not connect to services server");
    console.error(e);
  }
};

export default scan;