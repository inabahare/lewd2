import dnode from "dnode";

/**
 * Scans a file with sophos and gets a file report from VirusTotal
 */
const scan = (fileName, fileHash) => {
    const external = dnode.connect(parseInt(process.env.MESSAGE_SERVER_PORT));

    external.on("remote", remote => {
        remote.scan(fileName, fileHash);
        external.end();
    });

    external.on("error", function (err) {
        console.error(err);
        external.end();
    }); 
};

export default scan;