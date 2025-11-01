"use client";
import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";

type Incident={ id:number; title:string; status:string; severity?:string; created_at?:string };

export default function Page(){
  const [rows,setRows]=useState<Incident[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState<string|null>(null);
  const [newTitle,setNewTitle]=useState("");

  async function load(){
    try{
      setLoading(true);
      const r=await api.get("/api/incidents?limit=50");
      setRows(r.data.items||[]);
    }catch(e){
      setError("Falha ao carregar incidentes");
      setRows([
        {id:1,title:"Queda de energia setor A",status:"open",severity:"high"},
        {id:2,title:"Acidente leve na oficina",status:"in_progress",severity:"medium"},
      ]);
    }finally{ setLoading(false); }
  }
  useEffect(()=>{ load(); },[]);

  async function createIncident(){
    try{
      await api.post("/api/incidents",{ title:newTitle||"Incidente sem título" });
      setNewTitle("");
      await load();
      alert("Incidente criado!");
    }catch{ alert("Falha ao criar incidente"); }
  }
  async function updateStatus(id:number,status:string){
    try{ await api.patch(`/api/incidents/${id}`,{ status }); await load(); }
    catch{ alert("Falha ao atualizar status"); }
  }

  return <div style={{display:"grid",gap:16}}>
    <h1>Incidentes</h1>
    <div style={{display:"flex",gap:8}}>
      <input placeholder="Título do incidente" value={newTitle} onChange={e=>setNewTitle(e.target.value)} />
      <button onClick={createIncident}>Criar</button>
    </div>
    {loading? <p>Carregando...</p> : error? <p>{error}</p> :
    <div style={{background:"var(--card-bg,#fff)",padding:16,borderRadius:12,border:"1px solid #2a2a2a20"}}>
      <table>
        <thead><tr><th>ID</th><th>Título</th><th>Status</th><th>Severidade</th><th>Ações</th></tr></thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.id}>
              <td>{r.id}</td><td>{r.title}</td><td>{r.status}</td><td>{r.severity||"-"}</td>
              <td>
                <button onClick={()=>updateStatus(r.id,"open")}>Abrir</button>{" "}
                <button onClick={()=>updateStatus(r.id,"in_progress")}>Progredir</button>{" "}
                <button onClick={()=>updateStatus(r.id,"resolved")}>Resolver</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>}
  </div>;
}
