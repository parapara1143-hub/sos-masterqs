"use client";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUI } from "@/src/store/useUI";
import { hasSession } from "@/src/lib/auth";
import { SafeINThemeProvider } from "@/src/theme/theme";

export default function RootLayout({ children }: { children: React.ReactNode }){
  const [open,setOpen]=useState(true);
  const { dark, toggleDark } = useUI();
  const r=useRouter(); const path=usePathname();
  useEffect(()=>{ if(!hasSession() && path!=="/login"){ r.replace("/login"); } },[path,r]);

  const menu:[string,string][]=[
    ["/dashboard","Dashboard"],
    ["/tenants","Empresas"],
    ["/realtime-map","Planta em tempo real"],
    ["/incidents","Incidentes"],
    ["/evacuation","Evacuação"],
    ["/ohs","Medicina (OHS)"],
    ["/patrimonial","Patrimonial"],
    ["/analytics","Analytics"],
    ["/integrations","Integrações"],
    ["/notifications","Notificações"],
    ["/users","Usuários"],
    ["/logs","Auditoria"],
    ["/settings","Configurações"],
  ];
  const showFrame = path!=="/login";

  return <html lang="pt-BR"><body>
    <SafeINThemeProvider>
      {showFrame?(
        <div style={{display:"flex",minHeight:"100vh"}}>
          <aside style={{width:open?260:80,transition:"width .2s",background:"#1C1C1E",color:"#fff",padding:16}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:24}}>
              <Image src="/logo.svg" width={36} height={36} alt="logo"/>
              {open && <div><div style={{fontWeight:800,letterSpacing:.4}}>SafeIN</div><div style={{fontSize:12,opacity:.8}}>Seguro e Inclusivo</div></div>}
            </div>
            <nav style={{display:"grid",gap:10}}>{menu.map(([href,label])=>(
              <Link key={href} href={href} style={{color:"#fff"}}>{label}</Link>
            ))}</nav>
            <div style={{marginTop:16,display:"grid",gap:8}}>
              <button onClick={()=>setOpen(o=>!o)}>Menu</button>
              <button onClick={toggleDark}>{dark?"Tema Claro":"Tema Escuro"}</button>
            </div>
          </aside>
          <main style={{flex:1,padding:24}}>{children}</main>
        </div>
      ):children}
    </SafeINThemeProvider>
  </body></html>
}
