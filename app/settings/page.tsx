"use client";
import { useState } from "react";
import { api } from "@/src/lib/api";
import { SOCKET_PATH } from "@/src/lib/constants";

export default function Page(){
  const [socketPath,setSocketPath]=useState(SOCKET_PATH||"/rt");
  const [plant,setPlant]=useState("");

  async function save(){
    try{ await api.post("/api/master/settings",{ socket_path:socketPath, plant_overlay:plant }); alert("Configurações salvas!"); }
    catch{ alert("Falha ao salvar (verifique backend)"); }
  }

  return <div style={{display:"grid",gap:16}}>
    <h1>Configurações</h1>
    <div style={{display:"grid",gap:12,maxWidth:560}}>
      <label>Socket Path <input value={socketPath} onChange={e=>setSocketPath(e.target.value)}/></label>
      <label>Plant Overlay URL <input value={plant} onChange={e=>setPlant(e.target.value)} placeholder="https://.../plant.png"/></label>
      <button onClick={save}>Salvar</button>
    </div>
  </div>;
}
