const token=process.env.TELEGRAM_BOT_TOKEN;
const url=process.env.TELEGRAM_WEBHOOK_URL;
const secret=process.env.TELEGRAM_WEBHOOK_SECRET;
if(!token||!url){console.error("Ustaw TELEGRAM_BOT_TOKEN i TELEGRAM_WEBHOOK_URL");process.exit(1)}
const r=await fetch(`https://api.telegram.org/bot${token}/setWebhook`,{
 method:"POST",headers:{"content-type":"application/json"},
 body:JSON.stringify({url,secret_token:secret||undefined,drop_pending_updates:true})
});
console.log(await r.text());