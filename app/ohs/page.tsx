"use client";
import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";

type Exam={ id:number; worker:string; type:string; date?:string; status?:string };

export default function Page(){
  const [rows,setRows]=useState<Exam[]>([]);
  const [loading,setLoading]=useState(true);
  const [worker,setWorker]=useState("");
  const [type,setType]=useState("ASO");

  async function load(){
    try{
      setLoading(true);
      const r=await api.get("/api/ohs/exams?limit=50");
      setRows(r.data.items||[]);
    }catch{
      setRows([
        {id:1,worker:"João Silva",type:"ASO",status:"scheduled"},
        {id:2,worker:"Maria Souza",type:"Retorno ao trabalho",status:"done"},
      ]);
    }finally{ setLoading(false); }
  }
  useEffect(()=>{ load(); },[]);

  async function schedule(){
    try{ await api.post("/api/ohs/exams",{ worker, type }); setWorker(""); await load(); }
    catch{ alert("Falha ao agendar exame"); }
  }

  return <div style={{display:"grid",gap:16}}>
    <h1>Medicina do Trabalho (OHS)</h1>
    <div style={{display:"flex",gap:8}}>
      <input placeholder="Colaborador" value={worker} onChange={e=>setWorker(e.target.value)} />
      <select value={type} onChange={e=>setType(e.target.value)}>
        <option>ASO</option>
        <option>Admissional</option>
        <option>Periódico</option>
        <option>Retorno ao trabalho</option>
      </select>
      <button onClick={schedule}>Agendar</button>
    </div>
    {loading? <p>Carregando...</p> :
    <div style={{background:"var(--card-bg,#fff)",padding:16,borderRadius:12,border:"1px solid #2a2a2a20"}}>
      <table><thead><tr><th>ID</th><th>Colaborador</th><th>Exame</th><th>Status</th></tr></thead>
      <tbody>{rows.map(r=>(<tr key={r.id}><td>{r.id}</td><td>{r.worker}</td><td>{r.type}</td><td>{r.status||"-"}</td></tr>))}</tbody></table>
    </div>}
  </div>;
}
