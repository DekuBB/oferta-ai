import { NextResponse } from "next/server";
export async function GET(){return NextResponse.json({offers:[],message:"MVP bez bazy. Dodaj Supabase w kolejnym kroku, aby włączyć historię ofert."});}
export async function POST(req:Request){const offer=await req.json();return NextResponse.json({ok:true,offer});}