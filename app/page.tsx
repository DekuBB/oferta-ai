 "use client";
import { useState } from "react";

type Offer = {
  title:string; category:string; brand:string; model:string; condition:string;
  color:string; material:string; included_items:string[]; specifications:string[];
  visible_issues:string[]; description:string; suggested_price:number|null;
  price_min:number|null; price_max:number|null; confidence:number;
  unknown_fields:string[];
};

const demo: Offer = {
  title:"Sony PlayStation 5 — konsola do gier",
  category:"Konsole do gier",
  brand:"Sony",
  model:"PlayStation 5",
  condition:"Używany — dobry",
  color:"Biały / czarny",
  material:"Tworzywo sztuczne",
  included_items:["Konsola","kontroler — jeśli widoczny na zdjęciach"],
  specifications:["Parametry wymagają potwierdzenia na podstawie oznaczeń urządzenia."],
  visible_issues:["Brak jednoznacznie potwierdzonych poważnych uszkodzeń na zdjęciach."],
  description:"Konsola Sony PlayStation 5. Oferta została przygotowana na podstawie przesłanych zdjęć. Przed zakupem warto potwierdzić kompletność zestawu, stan techniczny oraz dokładny wariant urządzenia.",
  suggested_price:1599, price_min:1300, price_max:1800, confidence:0.72,
  unknown_fields:["dokładny model CFI","pojemność dysku","kompletność wszystkich akcesoriów"]
};

export default function Home(){
  const [files,setFiles]=useState<File[]>([]);
  const [offer,setOffer]=useState<Offer|null>(null);
  const [busy,setBusy]=useState(false);
  const [status,setStatus]=useState("Gotowe. Dodaj zdjęcia produktu.");
  const [demoMode,setDemoMode]=useState(false);

  function onFiles(list:FileList|null){
    if(!list)return;
    setFiles(Array.from(list).filter(f=>f.type.startsWith("image/")).slice(0,8));
    setOffer(null); setStatus("Zdjęcia dodane. Kliknij „Wygeneruj ofertę”.");
  }

  async function analyze(){
    if(!files.length){setStatus("Najpierw dodaj co najmniej jedno zdjęcie.");return}
    setBusy(true); setStatus("AI analizuje zdjęcia i przygotowuje ofertę...");
    try{
      const fd=new FormData(); files.forEach(f=>fd.append("images",f));
      const r=await fetch("/api/analyze",{method:"POST",body:fd});
      const data=await r.json();
      if(!r.ok) throw new Error(data.error||"Błąd analizy");
      setOffer(data.offer); setDemoMode(Boolean(data.demo));
      setStatus(data.demo?"Tryb DEMO — brak OPENAI_API_KEY.":"Oferta wygenerowana przez AI.");
    }catch(e:any){setStatus(e.message||"Wystąpił błąd.");}
    finally{setBusy(false)}
  }

  function update<K extends keyof Offer>(key:K,value:Offer[K]){ if(offer)setOffer({...offer,[key]:value}) }
  function download(){
    if(!offer)return;
    const text=`${offer.title}\n\nKategoria: ${offer.category}\nMarka: ${offer.brand}\nModel: ${offer.model}\nStan: ${offer.condition}\nKolor: ${offer.color}\nMateriał: ${offer.material}\nCena sugerowana: ${offer.suggested_price ?? "brak"} zł\nZakres: ${offer.price_min ?? "?"}–${offer.price_max ?? "?"} zł\n\nOPIS\n${offer.description}\n\nW ZESTAWIE\n${offer.included_items.join("\\n")}\n\nWIDOCZNE WADY\n${offer.visible_issues.join("\\n")}\n\nSPECYFIKACJA\n${offer.specifications.join("\\n")}`;
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:"text/plain;charset=utf-8"}));a.download="oferta.txt";a.click();URL.revokeObjectURL(a.href);
  }

  return <main className="wrap">
    <div className="hero"><div><span className="badge">OFERTAAI • WEB + TELEGRAM</span><h1 className="title">Zdjęcie produktu → gotowa oferta</h1><div className="muted">Wrzuć zdjęcia. AI rozpozna produkt, uzupełni dane i przygotuje tekst sprzedażowy.</div></div><div className="badge">MVP 1.0</div></div>

    <div className="grid">
      <section className="card">
        <h2>1. Zdjęcia produktu</h2>
        <div className="drop">
          <input id="files" type="file" accept="image/*" multiple hidden onChange={e=>onFiles(e.target.files)}/>
          <label htmlFor="files"><button className="btn secondary" type="button" onClick={()=>document.getElementById("files")?.click()}>📷 Wybierz zdjęcia</button></label>
          <p className="muted">Możesz dodać do 8 zdjęć.</p>
        </div>
        <div className="thumbs">{files.map((f,i)=><img className="thumb" key={i} src={URL.createObjectURL(f)} alt="" />)}</div>
        <div className="actions"><button className="btn" disabled={busy||!files.length} onClick={analyze}>{busy?"⏳ Analizuję...":"🤖 Wygeneruj ofertę"}</button></div>
        <div className="status">{status}</div>
      </section>

      <section className="card">
        <h2>2. Gotowa oferta</h2>
        {!offer?<p className="muted">Tutaj pojawi się tytuł, opis, marka, model, stan, cena i pozostałe dane.</p>:
        <div>
          {demoMode&&<div className="status warn">Tryb DEMO: podłącz OPENAI_API_KEY, aby analizować prawdziwe zdjęcia.</div>}
          <div className="field"><label>Tytuł</label><input value={offer.title} onChange={e=>update("title",e.target.value)}/></div>
          <div className="row">
            <div className="field"><label>Kategoria</label><input value={offer.category} onChange={e=>update("category",e.target.value)}/></div>
            <div className="field"><label>Marka</label><input value={offer.brand} onChange={e=>update("brand",e.target.value)}/></div>
          </div>
          <div className="row">
            <div className="field"><label>Model</label><input value={offer.model} onChange={e=>update("model",e.target.value)}/></div>
            <div className="field"><label>Stan</label><input value={offer.condition} onChange={e=>update("condition",e.target.value)}/></div>
          </div>
          <div className="row">
            <div className="field"><label>Cena sugerowana (zł)</label><input type="number" value={offer.suggested_price??""} onChange={e=>update("suggested_price",e.target.value===""?null:Number(e.target.value))}/></div>
            <div className="field"><label>Pewność AI</label><input value={`${Math.round(offer.confidence*100)}%`} readOnly/></div>
          </div>
          <div className="field"><label>Opis</label><textarea value={offer.description} onChange={e=>update("description",e.target.value)}/></div>
          <div className="actions"><button className="btn" onClick={download}>⬇️ Pobierz TXT</button><button className="btn secondary" onClick={()=>navigator.clipboard?.writeText(offer.description)}>📋 Kopiuj opis</button></div>
        </div>}
      </section>
    </div>

    <section className="card" style={{marginTop:18}}>
      <div className="telegram"><div><h2>🤖 Bot Telegram</h2><div className="muted">Wyślij zdjęcie produktu do bota, a dostaniesz tę samą ofertę w odpowiedzi.</div></div><span className="badge">/start • zdjęcie • gotowa oferta</span></div>
      <p className="small">Konfiguracja bota jest opisana w README. Na Vercel ustaw TELEGRAM_BOT_TOKEN i webhook.</p>
    </section>
  </main>
}