const {
    getVideoInfo,
    downloadAudio,
    downloadVideo
} = require('hybrid-ytdl');

class YouTube {
    static async search(text) {
        return await getVideoInfo(text);
    }

    static async mp3(url) {
        let result = await downloadAudio(url, "320", "api2");
        return result.downloadUrl;
    }

    static async mp4(url) {
        let result = await downloadVideo(url, "1080", "api2");
        return result.downloadUrl;
    }

    static async getAll(text) {
        try {
            let search = await getVideoInfo(text);
            if (!search || !search.url) {
                throw new Error("video tidak ditemukan");
            }

            let url = search.url;
            let audio = await downloadAudio(url, "320", "api2");
            let video = await downloadVideo(url, "1080", "api2");

            return {
                search,
                audio: audio.downloadUrl,
                video: video.downloadUrl
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = YouTube;