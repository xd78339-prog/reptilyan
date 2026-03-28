const { Client } = require('discord.js-selfbot-v13');
const express = require('express');
const app = express();

// Render'ın uykuya dalmaması için Web Portu açıyoruz
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Lunar Automation Aktif!'));
app.listen(port, () => console.log(`Sunucu ${port} portunda çalışıyor.`));

const client = new Client({ checkUpdate: false });

// Environment Variables'dan verileri çekiyoruz
const TOKEN = process.env.TOKEN;
const MESSAGE = process.env.MESSAGE;
const CHANNELS = process.env.CHANNEL_IDS ? process.env.CHANNEL_IDS.split(',') : [];

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

client.on('ready', async () => {
    console.log(`${client.user.tag} olarak giriş yapıldı!`);
    
    // Sonsuz döngü
    while (true) {
        for (const channelId of CHANNELS) {
            try {
                const channel = await client.channels.fetch(channelId.trim());
                if (channel) {
                    await channel.send(MESSAGE);
                    console.log(`Mesaj gönderildi: ${channelId}`);
                }
            } catch (err) {
                console.error(`Kanal hatası (${channelId}):`, err.message);
            }
            // Her kanal geçişinde 2 saniye bekleme
            await wait(2000);
        }
        // Tüm kanallar bittikten sonra döngünün başa dönmesi için kısa bir nefes payı
        await wait(1000); 
    }
});

client.login(TOKEN).catch(err => {
    console.error("Token hatalı veya giriş yapılamadı:", err);
});
