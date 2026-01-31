"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  X,
  MapPin,
  Building2,
  Users,
  Baby,
  Layers,
  Square,
  Calculator,
  Navigation,
} from "lucide-react";
import type { Shelter, ShelterStatus } from "@/lib/mock-data";
import { calculateCapacity } from "@/lib/mock-data";

interface ShelterDetailPanelProps {
  shelter: Shelter;
  onClose: () => void;
}

const statusConfig: Record<
  ShelterStatus,
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

const typeLabels = {
  school: "School",
  college: "College",
  "community-hall": "Community Hall",
  stadium: "Stadium",
};

export function ShelterDetailPanel({ shelter, onClose }: ShelterDetailPanelProps) {
  const status = statusConfig[shelter.status];
  const availableSpace = shelter.maxCapacity - shelter.currentOccupancy;

  // AI Capacity Calculator State
  const [calcArea, setCalcArea] = useState(shelter.area);
  const [calcFloors, setCalcFloors] = useState(shelter.floors);
  const [safetyBuffer, setSafetyBuffer] = useState(25);
  const [calculatedCapacity, setCalculatedCapacity] = useState<{
    rawCapacity: number;
    adjustedCapacity: number;
  } | null>(null);

  useEffect(() => {
    const result = calculateCapacity(calcArea, calcFloors, safetyBuffer);
    setCalculatedCapacity(result);
  }, [calcArea, calcFloors, safetyBuffer]);

  return (
    <Card className="h-full bg-card border-border flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold text-foreground truncate">
                {shelter.name}
              </CardTitle>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {typeLabels[shelter.type]}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shrink-0 -mr-2 -mt-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto space-y-6">
        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <Badge className={`${status.bgColor} text-primary-foreground px-3 py-1`}>
            {status.label}
          </Badge>
          {shelter.womenChildFriendly && (
            <Badge variant="outline" className="gap-1 border-accent text-accent">
              <Baby className="h-3 w-3" />
              Women & Child Friendly
            </Badge>
          )}
        </div>

        {/* Location Info */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            Location
          </h4>
          <div className="rounded-lg bg-secondary p-3 space-y-1">
            <p className="text-sm text-foreground">{shelter.address}</p>
            <p className="text-xs text-muted-foreground">
              District: {shelter.district}
            </p>
            <p className="text-xs font-mono text-muted-foreground">
              {shelter.latitude.toFixed(4)}°N, {shelter.longitude.toFixed(4)}°E
            </p>
          </div>
        </div>

        {/* Building Details */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            Building Details
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-secondary p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Square className="h-4 w-4" />
                <span className="text-xs">Area</span>
              </div>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {shelter.area.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">sq ft</p>
            </div>
            <div className="rounded-lg bg-secondary p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Layers className="h-4 w-4" />
                <span className="text-xs">Floors</span>
              </div>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {shelter.floors}
              </p>
              <p className="text-xs text-muted-foreground">levels</p>
            </div>
          </div>
        </div>

        {/* Occupancy Stats */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            Occupancy Status
          </h4>
          <div className="rounded-lg bg-secondary p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current</span>
              <span className="text-lg font-semibold text-foreground">
                {shelter.currentOccupancy.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Max Capacity</span>
              <span className="text-lg font-semibold text-foreground">
                {shelter.maxCapacity.toLocaleString()}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Available Space</span>
              <span
                className={`text-lg font-bold ${
                  availableSpace > 100
                    ? "text-status-stable"
                    : availableSpace > 0
                      ? "text-status-warning"
                      : "text-status-critical"
                }`}
              >
                {availableSpace.toLocaleString()}
              </span>
            </div>

            {/* Occupancy Bar */}
            <div className="space-y-1">
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all ${
                    shelter.status === "full"
                      ? "bg-status-critical"
                      : shelter.status === "nearly-full"
                        ? "bg-status-warning"
                        : "bg-status-stable"
                  }`}
                  style={{
                    width: `${Math.min(100, (shelter.currentOccupancy / shelter.maxCapacity) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-center text-muted-foreground">
                {Math.round((shelter.currentOccupancy / shelter.maxCapacity) * 100)}% occupied
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* AI Capacity Calculator */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Calculator className="h-4 w-4 text-muted-foreground" />
            AI-Assisted Capacity Calculator
          </h4>

          <div className="rounded-lg border border-border bg-secondary/50 p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calc-area" className="text-xs">
                  Building Area (sq ft)
                </Label>
                <Input
                  id="calc-area"
                  type="number"
                  value={calcArea}
                  onChange={(e) => setCalcArea(Number(e.target.value))}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calc-floors" className="text-xs">
                  Number of Floors
                </Label>
                <Input
                  id="calc-floors"
                  type="number"
                  value={calcFloors}
                  onChange={(e) => setCalcFloors(Number(e.target.value))}
                  className="bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Safety Buffer</Label>
                <span className="text-sm font-medium text-foreground">{safetyBuffer}%</span>
              </div>
              <Slider
                value={[safetyBuffer]}
                onValueChange={([value]) => setSafetyBuffer(value)}
                min={20}
                max={30}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Recommended: 20-30% buffer for emergency conditions
              </p>
            </div>

            {calculatedCapacity && (
              <div className="rounded-lg bg-primary/10 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Raw Capacity</span>
                  <span className="text-sm text-foreground">
                    {calculatedCapacity.rawCapacity.toLocaleString()} persons
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Adjusted Capacity
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {calculatedCapacity.adjustedCapacity.toLocaleString()} persons
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button className="flex-1 gap-2">
            <Navigation className="h-4 w-4" />
            Navigate
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            Update Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
