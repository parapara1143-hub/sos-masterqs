"use client";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getSocket } from "@/src/lib/socket";
import { TILE_URL, PLANT_OVERLAY } from "@/src/lib/constants";

// ✅ Importa componentes do React-Leaflet apenas no cliente (sem SSR)
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then(m => m.CircleMarker), { ssr: false });
const Tooltip = dynamic(() => import("react-leaflet").then(m => m.Tooltip), { ssr: false });
const ImageOverlay = dynamic(() => import("react-leaflet").then(m => m.ImageOverlay), { ssr: false });

// Tipagem para os pontos de localização
type Loc = {
  user_id: number;
  x?: number;
  y?: number;
  lat?: number;
  lon?: number;
  role?: string;
  name?: string;
  ts?: string;
};

export default function RealtimeMapPage() {
  const [points, setPoints] = useState<Loc[]>([]);
  const [usePlant, setUsePlant] = useState(true);
  const [bounds, setBounds] = useState<any>(null);

  // ✅ Cria os limites do mapa apenas no cliente (evita erro de "window is not defined")
  useEffect(() => {
    (async () => {
      // @ts-ignore → ignora tipagem ausente de Leaflet
      const L = await import("leaflet");
      setBounds(L.latLngBounds([[-19.968, -44.202], [-19.966, -44.200]]));
    })();
  }, []);

  // ✅ Atualiza o mapa em tempo real via WebSocket
  useEffect(() => {
    const s = getSocket();
    const handler = (payload: any) => {
      setPoints(prev => {
        const p = [...prev];
        const i = p.findIndex(v => v.user_id === payload.user_id);
        const item = { ...(p[i] || {}), ...payload, ts: new Date().toISOString() };
        if (i >= 0) p[i] = item; else p.unshift(item);
        return p.slice(0, 1000);
      });
    };
    s.on("location.update", handler);
    return () => {
      s.off("location.update", handler);
    };
  }, []);

  // Enquanto o mapa ainda não tem os bounds
  if (!bounds) return <p>Carregando mapa...</p>;

  // ✅ Renderização principal do mapa
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1>Planta em tempo real</h1>

      <label>
        <input
          type="checkbox"
          checked={usePlant}
          onChange={e => setUsePlant(e.target.checked)}
        />{" "}
        Usar planta interna (overlay)
      </label>

      <MapContainer
        bounds={bounds}
        zoom={17}
        style={{ height: "70vh", width: "100%", borderRadius: 12 }}
      >
        {!usePlant ? (
          <TileLayer url={TILE_URL} />
        ) : (
          <ImageOverlay url={PLANT_OVERLAY} bounds={bounds} />
        )}

        {points.map((p, i) => {
          const lat =
            p.lat ??
            (bounds.getSouth() +
              ((p.y ?? Math.random()) * (bounds.getNorth() - bounds.getSouth())));
          const lon =
            p.lon ??
            (bounds.getWest() +
              ((p.x ?? Math.random()) * (bounds.getEast() - bounds.getWest())));
          const color =
            p.role === "brigadista"
              ? "#00C851"
              : p.role === "socorrista"
              ? "#005DFF"
              : "#FFD600";
          return (
            <CircleMarker key={i} center={[lat, lon]} radius={5} pathOptions={{ color }}>
              <Tooltip>
                {(p.name || `user ${p.user_id}`)} • {(p.role || "colab")} • {p.ts}
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <small>
        Envie <code>location.update</code> com <code>x,y</code> (0..1) para sobrepor na planta interna,
        ou <code>lat,lon</code> para usar o mapa OSM.
      </small>
    </div>
  );
}
