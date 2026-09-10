import { NextResponse } from "next/server";
import { analyzeImages } from "@/lib/ai";

export const runtime="nodejs";
export async function POST(req:Request){
  try{
    const form=await req.formData();
    const files=form.getAll("images").filter((x):x is File=>x instanceof File);
    if(!files.length) return NextResponse.json({error:"Brak zdjęć."},{status:400});
    if(files.length>8) return NextResponse.json({error:"Maksymalnie 8 zdjęć."},{status:400});
    const images=[];
    for(const file of files){
      if(!file.type.startsWith("image/")) continue;
      const buffer=Buffer.from(await file.arrayBuffer());
      if(buffer.length>8*1024*1024) return NextResponse.json({error:"Pojedyncze zdjęcie jest za duże (maks. 8 MB)."}, {status:413});
      images.push({buffer,type:file.type});
    }
    const result=await analyzeImages(images);
    return NextResponse.json(result);
  }catch(e:any){
    console.error(e);
    return NextResponse.json({error:e?.message||"Błąd serwera."},{status:500});
  }
}