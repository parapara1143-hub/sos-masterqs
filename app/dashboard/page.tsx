"use client";
import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { getSocket } from "@/src/lib/socket";
import ReactECharts from "echarts-for-react";

type KPI={incidents_open:number;incidents_in_progress:number;incidents_resolved:number;inspections:number};
type Company={id:number;name:string};

export default function Page(){
  const [kpi,setKpi]=useState<KPI|null>(null);
  const [feed,setFeed]=useState<string[]>([]);
  const [chart,setChart]=useState<any>(null);
  const s=getSocket();

  useEffect(()=>{
    api.get("/api/reports/summary").then(r=>{
      const i=r.data.incidents||{};
      setKpi({incidents_open:i.open||0,incidents_in_progress:i.in_progress||0,incidents_resolved:i.resolved||0,inspections:r.data.inspections||0});
    }).catch(()=>{});
    const onAny=(ev:string)=>setFeed(f=>[`${new Date().toLocaleTimeString()} – ${ev}`,...f].slice(0,50));
    s.on("incident.created",()=>onAny("incident.created"));
    s.on("incident.updated",()=>onAny("incident.updated"));
    s.on("camera.event",()=>onAny("camera.event"));
    s.on("alarm.event",()=>onAny("alarm.event"));
    return ()=>{ s.off("incident.created"); s.off("incident.updated"); s.off("camera.event"); s.off("alarm.event"); };
  },[s]);

  useEffect(()=>{
    (async()=>{
      let companies:Company[]=[];
      try{ const r=await api.get("/api/master/companies"); companies=r.data.items||[]; }
      catch{ companies=[{id:1,name:"TechSeed"},{id:2,name:"Stellantis"}]; }
      const rows:{name:string;mtta:number;mttr:number}[]=[];
      for(const c of companies){
        try{ const r=await api.get(`/api/analytics/mtta_mttr?company_id=${c.id}&days=30`); rows.push({name:c.name,mtta:r.data.mtta_sec||0,mttr:r.data.mttr_sec||0}); }
        catch{ rows.push({name:c.name,mtta:0,mttr:0}); }
      }
      setChart({ tooltip:{}, legend:{data:["MTTA","MTTR"]}, xAxis:{type:"category",data:rows.map(r=>r.name)}, yAxis:{type:"value"},
        series:[{name:"MTTA",type:"bar",data:rows.map(r=>r.mtta)},{name:"MTTR",type:"bar",data:rows.map(r=>r.mttr)}] });
    })();
  },[]);

  return <div style={{display:"grid",gap:16}}>
    <h1>Dashboard</h1>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
      {kpi? (<>
        <Card title="Incidentes Abertos" value={kpi.incidents_open} color="#FF3B30"/>
        <Card title="Em Progresso" value={kpi.incidents_in_progress} color="#FFD600"/>
        <Card title="Resolvidos (janela)" value={kpi.incidents_resolved} color="#00C851"/>
        <Card title="Inspeções (janela)" value={kpi.inspections} color="#005DFF"/>
      </>): "Carregando KPIs..."}
    </div>
    <div>
      <h3>Analytics — MTTA/MTTR por empresa (30 dias)</h3>
      {chart? <ReactECharts option={chart} style={{height:320}}/> : "Carregando gráfico..."}
    </div>
    <div>
      <h3>Feed em tempo real</h3>
      <ul>{feed.map((f,i)=>(<li key={i}>{f}</li>))}</ul>
    </div>
  </div>;
}

function Card({ title, value, color }:{title:string; value:number; color:string}){
  return <div style={{background:"var(--card-bg,#fff)",padding:16,borderRadius:12,border:"1px solid #2a2a2a20"}}>
    <div style={{fontSize:13,opacity:.7}}>{title}</div>
    <div style={{fontSize:28,fontWeight:800,color}}>{value}</div>
  </div>;
}
