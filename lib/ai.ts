import { offerJsonSchema } from "./offer-schema";

function dataUrl(buffer:Buffer,type:string){return `data:${type};base64,${buffer.toString("base64")}`}

export async function analyzeImages(images:{buffer:Buffer,type:string}[]){
  const key=process.env.OPENAI_API_KEY;
  if(!key) return {demo:true, offer:(await import("./demo")).demoOffer};

  const model=process.env.OPENAI_MODEL || "gpt-5.6-luna";
  const content:any[]=[{
    type:"input_text",
    text:`Jesteś ekspertem od tworzenia ofert sprzedażowych w Polsce. Przeanalizuj WSZYSTKIE zdjęcia produktu.
ZASADY:
- Podawaj tylko informacje widoczne na zdjęciach lub bardzo pewne.
- Nie wymyślaj marki, modelu, parametrów ani akcesoriów.
- Jeśli czegoś nie da się ustalić, wpisz "Nie ustalono" albo dodaj do unknown_fields.
- Stan oceniaj wyłącznie na podstawie widocznych śladów.
- Opis ma być konkretny i gotowy do publikacji na OLX/Allegro/Facebook Marketplace.
- Cena jest tylko orientacyjną sugestią; jeśli nie masz wystarczających danych, ustaw null.
- confidence to liczba 0–1 określająca pewność całej analizy.
Zwróć wyłącznie JSON zgodny ze schematem.`
  }];
  for(const img of images) content.push({type:"input_image",image_url:dataUrl(img.buffer,img.type),detail:"high"});

  const body={
    model,
    input:[{role:"user",content}],
    text:{format:{type:"json_schema",name:"offer",strict:true,schema:offerJsonSchema}}
  };

  const res=await fetch("https://api.openai.com/v1/responses",{
    method:"POST",
    headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},
    body:JSON.stringify(body)
  });
  if(!res.ok) throw new Error(`OpenAI API: ${res.status} ${await res.text()}`);
  const json=await res.json();
  const text=json.output_text;
  if(!text) throw new Error("OpenAI nie zwróciło wyniku tekstowego.");
  return {demo:false,offer:JSON.parse(text)};
}