import dnode from "dnode";

/**
 * Scans a file with sophos and gets a file report from VirusTotal
 */
const scan = (fileName, fileHash) => {
    const external = dnode.connect(parseInt(process.env.MESSAGE_SERVER_PORT));
    external.on("remote", remote => {
        remote.sophosScan(fileName, fileHash);
        remote.virusTotalScan(fileHash, fileName, 1);
        external.end();
    });

    external.on("error", function (err) {
        console.error(err);
    }); 
};

export default scan;