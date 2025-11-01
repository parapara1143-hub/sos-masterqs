"use client";
import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";

type User={ id:number; name:string; email?:string; role?:string; status?:string };

export default function Page(){
  const [rows,setRows]=useState<User[]>([]);
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [role,setRole]=useState("viewer");
  const [loading,setLoading]=useState(true);

  async function load(){
    try{ setLoading(true); const r=await api.get("/api/users?limit=50"); setRows(r.data.items||[]); }
    catch{ setRows([{id:1,name:"Luiz",email:"luiz@qs.com",role:"owner"}]); }
    finally{ setLoading(false); }
  }
  useEffect(()=>{ load(); },[]);

  async function create(){
    try{ await api.post("/api/users",{ name,email,role }); setName(""); setEmail(""); await load(); }
    catch{ alert("Falha ao criar usuário"); }
  }
  async function deactivate(id:number){
    try{ await api.patch(`/api/users/${id}`,{ status:"inactive" }); await load(); } catch{ alert("Falha"); }
  }

  return <div style={{display:"grid",gap:16}}>
    <h1>Usuários</h1>
    <div style={{display:"flex",gap:8}}>
      <input placeholder="Nome" value={name} onChange={e=>setName(e.target.value)}/>
      <input placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)}/>
      <select value={role} onChange={e=>setRole(e.target.value)}>
        <option>viewer</option><option>supervisor</option><option>admin</option><option>owner</option>
      </select>
      <button onClick={create}>Criar</button>
    </div>
    {loading? <p>Carregando...</p> :
    <div style={{background:"var(--card-bg,#fff)",padding:16,borderRadius:12,border:"1px solid #2a2a2a20"}}>
      <table><thead><tr><th>ID</th><th>Nome</th><th>E-mail</th><th>Papel</th><th>Status</th><th>Ações</th></tr></thead>
      <tbody>{rows.map(r=>(<tr key={r.id}><td>{r.id}</td><td>{r.name}</td><td>{r.email||"-"}</td><td>{r.role||"-"}</td><td>{r.status||"-"}</td>
      <td><button onClick={()=>deactivate(r.id)}>Desativar</button></td></tr>))}</tbody></table>
    </div>}
  </div>;
}
