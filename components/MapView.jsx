"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const levelColor = {
  "Dữ liệu một phần": "#2563eb",
  "Cần khảo sát": "#d97706",
  "Cần xác minh": "#7c3aed",
  "Cần hỗ trợ": "#ea580c",
};

// Marker tròn màu theo mức tiếp cận (divIcon → không cần asset ảnh của Leaflet)
function dot(color) {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:20px;height:20px;border-radius:9999px;background:${color};border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></span>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

function MapFocus({ center, zoom }) {
  const map = useMap();
  const [lat, lng] = center;
  useEffect(() => { map.setView([lat, lng], zoom); }, [map, lat, lng, zoom]);
  return null;
}

export default function MapView({ points = [], route = [], center = [21.0287, 105.8524], zoom = 14 }) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
      <MapFocus center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {route.length > 1 && <Polyline positions={route} pathOptions={{ color: "#e0692c", weight: 5, dashArray: "2 10" }} />}
      {points.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={dot(levelColor[p.level] || "#e0692c")}>
          <Popup>
            <strong>{p.name}</strong>
            <br />
            <span>Trạng thái accessibility: {p.level}</span>
            {p.href && (
              <>
                <br />
                <a href={p.href} style={{ color: "#1d68a7" }}>Xem chi tiết</a>
              </>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
