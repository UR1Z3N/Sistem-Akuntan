require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const token = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
const secretToken = (process.env.TELEGRAM_WEBHOOK_SECRET || '').trim();
const webhookUrl = process.argv[2];
if (!token) { console.error('❌ TELEGRAM_BOT_TOKEN belum disetting.'); process.exit(1); }
if (!secretToken) { console.error('❌ TELEGRAM_WEBHOOK_SECRET belum disetting.'); process.exit(1); }
if (!/^[A-Za-z0-9_-]{1,256}$/.test(secretToken)) { console.error('❌ TELEGRAM_WEBHOOK_SECRET tidak valid.'); process.exit(1); }
if (!webhookUrl) { console.error('❌ Contoh: node set-webhook.js https://namabot.vercel.app'); process.exit(1); }
const bot = new TelegramBot(token);
const fullUrl = webhookUrl.endsWith('/api/bot') ? webhookUrl : `${webhookUrl.replace(/\/$/, '')}/api/bot`;
bot.setWebHook(fullUrl, { secret_token: secretToken }).then(() => {
  console.log(`✅ Webhook berhasil dipasang ke: ${fullUrl}`);
  console.log('🔐 Verifikasi secret token Telegram aktif.');
}).catch(err => { console.error('❌ Gagal memasang webhook:', err.message); process.exitCode = 1; });
