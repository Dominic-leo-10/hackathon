"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";
import dynamic from "next/dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MapPin,
  Users,
  Layers,
  Square,
  ChevronRight,
  Baby,
} from "lucide-react";

import type { Shelter } from "@/lib/mock-data";
import { ShelterDetailPanel } from "./shelter-detail-panel";

// Leaflet map (client-only)
const DisasterMap = dynamic(
  () => import("@/components/map/disaster-map").then((mod) => mod.DisasterMap),
  { ssr: false }
);

/* ✅ STATUS CONFIG */
const statusConfig: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  open: {
    label: "Open",
    color: "text-status-stable",
    bgColor: "bg-status-stable",
  },
  "nearly-full": {
    label: "Nearly Full",
    color: "text-status-warning",
    bgColor: "bg-status-warning",
  },
  full: {
    label: "Full",
    color: "text-status-critical",
    bgColor: "bg-status-critical",
  },
  closed: {
    label: "Closed",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
};

export function ShelterManagement() {
  /* ✅ STATE INSIDE COMPONENT */
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);

  /* ✅ FETCH FROM BACKEND */
  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/shelters`);
        const json = await res.json();
        setShelters(json.data || []);
      } catch (err) {
        console.error("Failed to load shelters", err);
      }
    };

    fetchShelters();
  }, []);

  const totalCapacity = shelters.reduce(
    (sum, s) => sum + (s.maxCapacity ?? 0),
    0
  );

  const totalOccupancy = shelters.reduce(
    (sum, s) => sum + (s.currentOccupancy ?? 0),
    0
  );

  return (
    <div className="flex h-full gap-6">
      {/* Map Panel */}
      <div className="flex-1">
        <Card className="h-full bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">
              Shelter Locations Map
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-64px)]">
            <DisasterMap
              shelters={shelters}
              selectedShelterId={selectedShelter?.id}
              onShelterSelect={setSelectedShelter}
              centerLat={25.8}
              centerLng={85.5}
              zoom={8}
              showLegend={false}
            />
          </CardContent>
        </Card>
      </div>

      {/* List / Detail Panel */}
      <div className="w-96 flex-shrink-0">
        {selectedShelter ? (
          <ShelterDetailPanel
            shelter={selectedShelter}
            onClose={() => setSelectedShelter(null)}
          />
        ) : (
          <Card className="h-full bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-foreground">
                  All Shelters
                </CardTitle>
                <Badge variant="secondary">
                  {totalOccupancy.toLocaleString()} /{" "}
                  {totalCapacity.toLocaleString()}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="space-y-2 p-4 pt-0">
                  {shelters.map((shelter) => {
                    const normalizedStatus =
                      shelter.status?.toLowerCase() ?? "closed";

                    const status =
                      statusConfig[normalizedStatus] ?? statusConfig.closed;

                    const maxCap = shelter.maxCapacity ?? 1;
                    const currOcc = shelter.currentOccupancy ?? 0;

                    const occupancyPercent = Math.round(
                      (currOcc / maxCap) * 100
                    );

                    return (
                      <button
                        key={shelter.id}
                        onClick={() => setSelectedShelter(shelter)}
                        className="w-full rounded-lg border border-border bg-secondary p-3 text-left hover:bg-muted"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-foreground truncate">
                                {shelter.name}
                              </h4>
                              <Badge
                                className={`${status.bgColor} text-primary-foreground shrink-0`}
                              >
                                {status.label}
                              </Badge>
                            </div>

                            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {shelter.district ?? "Unknown district"}
                            </p>
                          </div>

                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {currOcc}/{maxCap}
                          </span>

                          {typeof shelter.floors === "number" && (
                            <span className="flex items-center gap-1">
                              <Layers className="h-3 w-3" />
                              {shelter.floors} floors
                            </span>
                          )}

                          {typeof shelter.area === "number" && (
                            <span className="flex items-center gap-1">
                              <Square className="h-3 w-3" />
                              {shelter.area.toLocaleString()} sq ft
                            </span>
                          )}

                          {shelter.womenChildFriendly && (
                            <span className="flex items-center gap-1 text-accent">
                              <Baby className="h-3 w-3" />
                              W&C
                            </span>
                          )}
                        </div>

                        <div className="mt-2">
                          <div className="h-1.5 w-full rounded-full bg-muted">
                            <div
                              className={`h-1.5 rounded-full ${
                                occupancyPercent >= 90
                                  ? "bg-status-critical"
                                  : occupancyPercent >= 70
                                  ? "bg-status-warning"
                                  : "bg-status-stable"
                              }`}
                              style={{ width: `${occupancyPercent}%` }}
                            />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
