export async function tg(method:string, body:any){
  const token=process.env.TELEGRAM_BOT_TOKEN;
  if(!token) throw new Error("Brak TELEGRAM_BOT_TOKEN");
  const r=await fetch(`https://api.telegram.org/bot${token}/${method}`,{
    method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)
  });
  const j=await r.json(); if(!r.ok||!j.ok) throw new Error(j.description||"Telegram API error"); return j.result;
}

export function formatOffer(o:any){
 return `🛒 ${o.title}

📁 Kategoria: ${o.category}
🏷️ Marka: ${o.brand}
🔖 Model: ${o.model}
📦 Stan: ${o.condition}
🎨 Kolor: ${o.color}
💰 Cena sugerowana: ${o.suggested_price ?? "Nie ustalono"} zł

📝 OPIS
${o.description}

📋 W ZESTAWIE
${o.included_items.join("\n")}

⚠️ WIDOCZNE WADY
${o.visible_issues.join("\n")}

🔍 Pewność analizy: ${Math.round(o.confidence*100)}%`;
}