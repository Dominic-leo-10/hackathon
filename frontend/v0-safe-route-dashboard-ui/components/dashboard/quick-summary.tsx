"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Building2, Hospital, Users, Truck } from "lucide-react";
import type { Shelter, Hospital as HospitalType, RescueTeam } from "@/lib/mock-data";

interface QuickSummaryProps {
  shelters: Shelter[];
  hospitals: HospitalType[];
  rescueTeams: RescueTeam[];
}

export function QuickSummary({ shelters, hospitals, rescueTeams }: QuickSummaryProps) {
  const totalShelterCapacity = shelters.reduce((sum, s) => sum + s.maxCapacity, 0);
  const totalShelterOccupancy = shelters.reduce((sum, s) => sum + s.currentOccupancy, 0);
  const shelterUtilization = Math.round((totalShelterOccupancy / totalShelterCapacity) * 100);

  const totalBeds = hospitals.reduce((sum, h) => sum + h.totalBeds, 0);
  const availableBeds = hospitals.reduce((sum, h) => sum + h.availableBeds, 0);
  const bedUtilization = Math.round(((totalBeds - availableBeds) / totalBeds) * 100);

  const totalICU = hospitals.reduce((sum, h) => sum + h.icuTotal, 0);
  const availableICU = hospitals.reduce((sum, h) => sum + h.icuAvailable, 0);
  const icuUtilization = Math.round(((totalICU - availableICU) / totalICU) * 100);

  const deployedTeams = rescueTeams.filter((t) => t.status === "deployed").length;
  const availableTeams = rescueTeams.filter((t) => t.status === "available").length;

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">
          Resource Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Shelter Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-status-info" />
              <span className="text-sm font-medium text-foreground">Shelters</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {totalShelterOccupancy.toLocaleString()} / {totalShelterCapacity.toLocaleString()}
            </span>
          </div>
          <Progress
            value={shelterUtilization}
            className="h-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{shelters.length} facilities</span>
            <span className={shelterUtilization > 80 ? "text-status-warning" : "text-status-stable"}>
              {shelterUtilization}% utilized
            </span>
          </div>
        </div>

        {/* Hospital Beds Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hospital className="h-4 w-4 text-status-critical" />
              <span className="text-sm font-medium text-foreground">Hospital Beds</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {availableBeds} available
            </span>
          </div>
          <Progress
            value={bedUtilization}
            className="h-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{hospitals.length} hospitals</span>
            <span className={bedUtilization > 85 ? "text-status-critical" : "text-status-warning"}>
              {bedUtilization}% occupied
            </span>
          </div>
        </div>

        {/* ICU Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hospital className="h-4 w-4 text-status-warning" />
              <span className="text-sm font-medium text-foreground">ICU Beds</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {availableICU} available
            </span>
          </div>
          <Progress
            value={icuUtilization}
            className="h-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{totalICU} total ICU</span>
            <span className={icuUtilization > 90 ? "text-status-critical" : "text-status-warning"}>
              {icuUtilization}% occupied
            </span>
          </div>
        </div>

        {/* Rescue Teams Status */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-status-stable" />
            <span className="text-sm font-medium text-foreground">Rescue Teams</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-status-stable/10 p-2 text-center">
              <p className="text-lg font-bold text-status-stable">{deployedTeams}</p>
              <p className="text-xs text-muted-foreground">Deployed</p>
            </div>
            <div className="rounded-lg bg-status-info/10 p-2 text-center">
              <p className="text-lg font-bold text-status-info">{availableTeams}</p>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
            <div className="rounded-lg bg-secondary p-2 text-center">
              <p className="text-lg font-bold text-foreground">
                {rescueTeams.length - deployedTeams - availableTeams}
              </p>
              <p className="text-xs text-muted-foreground">Standby</p>
            </div>
          </div>
        </div>

        {/* Ambulances */}
        <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Total Ambulances</span>
          </div>
          <span className="text-xl font-bold text-foreground">
            {hospitals.reduce((sum, h) => sum + h.ambulancesAvailable, 0)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
