import { NextResponse } from "next/server";
import { tg, formatOffer } from "@/lib/telegram";
import { analyzeImages } from "@/lib/ai";

export const runtime="nodejs";

export async function POST(req:Request){
  const secret=process.env.TELEGRAM_WEBHOOK_SECRET;
  if(secret && req.headers.get("x-telegram-bot-api-secret-token")!==secret)
    return NextResponse.json({error:"Unauthorized"},{status:401});

  try{
    const update=await req.json();
    const msg=update.message;
    if(!msg) return NextResponse.json({ok:true});
    const chatId=msg.chat.id;

    if(msg.text==="/start"||msg.text==="/help"){
      await tg("sendMessage",{chat_id:chatId,text:"🤖 OfertaAI\\n\\nWyślij mi zdjęcie produktu. Przeanalizuję je i przygotuję gotową ofertę sprzedażową.\\n\\nMożesz wysłać kilka zdjęć, ale MVP najlepiej działa z jednym zdjęciem na wiadomość."});
      return NextResponse.json({ok:true});
    }

    const photo=msg.photo?.at(-1);
    if(!photo){
      await tg("sendMessage",{chat_id:chatId,text:"📷 Wyślij zdjęcie produktu, np. konsoli, telefonu, mebla lub elektroniki."});
      return NextResponse.json({ok:true});
    }

    await tg("sendMessage",{chat_id:chatId,text:"⏳ Analizuję zdjęcie i przygotowuję ofertę..."});
    const file=await tg("getFile",{file_id:photo.file_id});
    const token=process.env.TELEGRAM_BOT_TOKEN!;
    const r=await fetch(`https://api.telegram.org/file/bot${token}/${file.file_path}`);
    if(!r.ok) throw new Error("Nie udało się pobrać zdjęcia z Telegrama.");
    const buffer=Buffer.from(await r.arrayBuffer());
    const type=file.file_path?.endsWith(".png")?"image/png":"image/jpeg";
    const result=await analyzeImages([{buffer,type}]);
    await tg("sendMessage",{chat_id:chatId,text:formatOffer(result.offer)});
    return NextResponse.json({ok:true});
  }catch(e:any){
    console.error(e);
    try{ const update=await req.clone().json(); const id=update?.message?.chat?.id; if(id) await tg("sendMessage",{chat_id:id,text:`❌ Nie udało się wygenerować oferty.\\n${e?.message||"Nieznany błąd."}`}); }catch{}
    return NextResponse.json({ok:true});
  }
}