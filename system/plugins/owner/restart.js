module.exports = {
    command: "restart",
    alias: [],
    category: ["owner"],
    settings: {
        owner: true,
        loading: true,
    },
    description: "Fitur restart bot",
    async run(m, {
        text,
        sock
    }) {
        let loadd = [
            '𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑑𝑎𝑡𝑎...',
            '▒▒▒▒▒▒▒▒▒▒ 0%',
            '█▒▒▒▒▒▒▒▒▒ 10%',
            '███▒▒▒▒▒▒▒ 30%',
            '█████▒▒▒▒▒ 50%',
            '███████▒▒▒ 70%',
            '█████████▒ 90%',
            '██████████ 100%',
            '_R E S T A R T I N G. . ._'
        ];
        let {
            key
        } = await sock.sendMessage(m.cht, {
            text: '_Loading_'
        });
        for (let i = 0; i < loadd.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 500));
            await sock.sendMessage(m.cht, {
                text: loadd[i],
                edit: key
            });
        }
        if (!process.send) {
            throw 'Error'
        }
        process.send('reset')
    }
};