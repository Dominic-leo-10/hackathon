"use client";

import { useEffect, useRef, useState } from "react";
import type { Shelter, Hospital, RescueTeam, ShelterStatus } from "@/lib/mock-data";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface DisasterMapProps {
  shelters?: Shelter[];
  hospitals?: Hospital[];
  rescueTeams?: RescueTeam[];
  selectedShelterId?: string | null;
  selectedHospitalId?: string | null;
  onShelterSelect?: (shelter: Shelter) => void;
  onHospitalSelect?: (hospital: Hospital) => void;
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  showLegend?: boolean;
}

/* ---------------- ICON UTILS ---------------- */

const createMarkerIcon = (color: string, size: number = 32) => {
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">
      <path fill="${color}" stroke="#1a1d2e" stroke-width="1.5"
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="3" fill="#1a1d2e"/>
    </svg>
  `;
  return L.divIcon({
    html: svgIcon,
    className: "custom-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

const shelterStatusColors: Record<ShelterStatus, string> = {
  open: "#22c55e",
  "nearly-full": "#eab308",
  full: "#ef4444",
  closed: "#6b7280",
};

const hospitalIcon = createMarkerIcon("#3b82f6", 32);
const rescueTeamIcon = createMarkerIcon("#8b5cf6", 28);

/* ---------------- COMPONENT ---------------- */

export function DisasterMap({
  shelters = [],
  hospitals = [],
  rescueTeams = [],
  selectedShelterId,
  selectedHospitalId,
  onShelterSelect,
  onHospitalSelect,
  centerLat = 25.6,
  centerLng = 85.3,
  zoom = 9,
  showLegend = true,
}: DisasterMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const [mapReady, setMapReady] = useState(false);

  /* -------- MAP INIT -------- */
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [centerLat, centerLng],
      zoom,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [centerLat, centerLng, zoom]);

  /* -------- MARKERS -------- */
  useEffect(() => {
    if (!mapReady || !markersRef.current || !mapInstanceRef.current) return;

    markersRef.current.clearLayers();

    /* ---- SHELTERS ---- */
    shelters.forEach((shelter) => {
      if (
        shelter.location?.latitude == null ||
        shelter.location?.longitude == null
      ) {
        return;
      }

      /* 🔑 NORMALIZE STATUS */
      const normalizedStatus =
        shelter.status?.toLowerCase() as ShelterStatus || "closed";

      const icon = createMarkerIcon(
        shelterStatusColors[normalizedStatus] ?? shelterStatusColors.closed,
        selectedShelterId === shelter.id ? 40 : 32
      );

      const marker = L.marker(
        [shelter.location.latitude, shelter.location.longitude],
        { icon }
      )
        .bindPopup(`
          <div style="min-width:200px;font-family:system-ui">
            <h3 style="margin:0 0 6px;font-size:14px;font-weight:600">
              ${shelter.name}
            </h3>
            <p style="font-size:12px"><b>Status:</b> ${shelter.status}</p>
            <p style="font-size:12px">
              <b>Capacity:</b> ${shelter.capacity_current} / ${shelter.capacity_total}
            </p>
          </div>
        `)
        .on("click", () => onShelterSelect?.(shelter));

      markersRef.current.addLayer(marker);
    });

    /* ---- HOSPITALS ---- */
    hospitals.forEach((hospital) => {
      const marker = L.marker(
        [
          25.6 + (Math.random() - 0.5) * 0.8,
          85.3 + (Math.random() - 0.5) * 0.8,
        ],
        { icon: hospitalIcon }
      ).bindPopup(`<b>${hospital.name}</b>`);

      markersRef.current?.addLayer(marker);
    });

    /* ---- RESCUE TEAMS ---- */
    rescueTeams.forEach((team) => {
      const coords: Record<string, [number, number]> = {
        Patna: [25.6093, 85.1376],
        Muzaffarpur: [26.1209, 85.3647],
        Darbhanga: [26.1542, 85.8918],
      };

      const marker = L.marker(coords[team.location] ?? [25.6, 85.3], {
        icon: rescueTeamIcon,
      }).bindPopup(`<b>${team.name}</b>`);

      markersRef.current?.addLayer(marker);
    });

    /* ---- FIT MAP ---- */
    const validCoords = shelters
      .filter(s => s.location?.latitude && s.location?.longitude)
      .map(s => [s.location.latitude, s.location.longitude] as [number, number]);

    if (validCoords.length > 1) {
      mapInstanceRef.current.fitBounds(validCoords, { padding: [50, 50] });
    }
  }, [
    mapReady,
    shelters,
    hospitals,
    rescueTeams,
    selectedShelterId,
    selectedHospitalId,
    onShelterSelect,
    onHospitalSelect,
  ]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full rounded-lg" />

      {showLegend && (
        <div className="absolute bottom-4 left-4 rounded-lg bg-card p-3 text-xs">
          <div className="flex gap-2"><span className="w-3 h-3 bg-green-500 rounded-full" /> Open</div>
          <div className="flex gap-2"><span className="w-3 h-3 bg-yellow-500 rounded-full" /> Nearly Full</div>
          <div className="flex gap-2"><span className="w-3 h-3 bg-red-500 rounded-full" /> Full</div>
        </div>
      )}
    </div>
  );
}
