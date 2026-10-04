require('dotenv').config();
const fs = require('fs');
const path = require('path');

const token = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
const filePath = process.env.BOT_PROFILE_IMAGE || path.resolve(__dirname, 'assets', 'logo.jpg');

async function setProfilePhoto() {
    if (!token) throw new Error('TELEGRAM_BOT_TOKEN belum disetting.');
    if (!fs.existsSync(filePath)) throw new Error(`Logo tidak ditemukan: ${filePath}`);

    const formData = new FormData();
    formData.append('photo', JSON.stringify({ type: 'static', photo: 'attach://logo' }));
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
    formData.append('logo', blob, 'logo.jpg');

    const response = await fetch(`https://api.telegram.org/bot${token}/setMyProfilePhoto`, {
        method: 'POST',
        body: formData
    });
    const result = await response.json();
    if (!result.ok) throw new Error(result.description || 'Telegram API menolak permintaan.');
    console.log('✅ Foto profil bot berhasil diperbarui.');
}

setProfilePhoto().catch((error) => {
    console.error('❌ Gagal mengubah foto profil:', error.message);
    process.exitCode = 1;
});
