"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { DashboardHeader } from "@/components/dashboard/header";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { ShelterManagement } from "@/components/shelter/shelter-management";
import { HospitalManagement } from "@/components/hospital/hospital-management";
import { RescueTriage } from "@/components/triage/rescue-triage";
import { MissionPlanning } from "@/components/mission/mission-planning";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  type DisasterType,
  type SeverityLevel,
  type Shelter,
} from "@/lib/mock-data";

import { API_BASE_URL } from "@/lib/api";

// Leaflet map (client-only)
const DisasterMap = dynamic(
  () => import("@/components/map/disaster-map").then((mod) => mod.DisasterMap),
  { ssr: false }
);

type ViewType = "dashboard" | "shelters" | "hospitals" | "triage" | "missions";

export default function Home() {
  /* ---------------- STATE ---------------- */

  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [disasterType, setDisasterType] = useState<DisasterType>("flood");
  const [severity, setSeverity] = useState<SeverityLevel>("severe");

  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  const [hospitals, setHospitals] = useState<any[]>([]);
  const [hospitalStats, setHospitalStats] = useState<any>(null);

  /* ---------------- FETCH SHELTERS ---------------- */

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/dashboard/map`);
        const json = await res.json();
        setShelters(json.data || []);
      } catch (err) {
        console.error("Failed to load shelters", err);
      }
    };

    fetchShelters();
    const interval = setInterval(fetchShelters, 5000);
    return () => clearInterval(interval);
  }, []);

  /* ---------------- FETCH DASHBOARD STATS ---------------- */

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/dashboard/stats`);
        const json = await res.json();
        setDashboardStats(json.stats);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    };

    fetchStats();
  }, []);

  /* ---------------- FETCH HOSPITALS ---------------- */

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/hospitals`);
        const json = await res.json();
        setHospitals(json.data || []);
      } catch (err) {
        console.error("Failed to load hospitals", err);
      }
    };

    fetchHospitals();
  }, []);

  /* ---------------- FETCH HOSPITAL STATS ---------------- */

  useEffect(() => {
    const fetchHospitalStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/hospitals/stats`);
        const json = await res.json();
        setHospitalStats(json.stats);
      } catch (err) {
        console.error("Failed to load hospital stats", err);
      }
    };

    fetchHospitalStats();
  }, []);

  /* ---------------- MAP BACKEND STATS → UI ---------------- */

  const mappedStats = dashboardStats
    ? {
        totalAffected: dashboardStats.usedCapacity,
        womenCount: Math.floor(dashboardStats.usedCapacity * 0.4),
        childrenCount: Math.floor(dashboardStats.usedCapacity * 0.3),
        injuredCount: Math.floor(dashboardStats.usedCapacity * 0.1),
        criticalPatients: Math.floor(dashboardStats.usedCapacity * 0.05),
        availableShelterCapacity: dashboardStats.availableCapacity,
        totalShelters: dashboardStats.totalShelters,
      }
    : null;

  /* ---------------- UI ---------------- */

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DashboardHeader
        disasterType={disasterType}
        severity={severity}
        onDisasterChange={setDisasterType}
        onSeverityChange={setSeverity}
      />

      <div className="flex flex-1 overflow-hidden">
        <SidebarNav currentView={currentView} onViewChange={setCurrentView} />

        <main className="flex-1 overflow-auto bg-background p-6">
          {currentView === "dashboard" && (
            <div className="space-y-6">
              {mappedStats && <StatsCards stats={mappedStats} />}

              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle>
                    Operations Map – Bihar Flood Response
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <DisasterMap
                    shelters={shelters}
                    hospitals={hospitals}
                    centerLat={25.8}
                    centerLng={85.5}
                    zoom={8}
                    showLegend
                  />
                </CardContent>
              </Card>

              <AlertsPanel alerts={[]} />
            </div>
          )}

          {currentView === "shelters" && (
            <ShelterManagement shelters={shelters} />
          )}

          {currentView === "hospitals" && (
            <HospitalManagement
              hospitals={hospitals}
              stats={hospitalStats}
            />
          )}

          {currentView === "triage" && <RescueTriage />}

          {currentView === "missions" && (
            <MissionPlanning rescueTeams={[]} />
          )}
        </main>
      </div>
    </div>
  );
}
