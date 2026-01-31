"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  Car,
  CheckCircle2,
  Plane,
  Route,
  Ship,
  Target,
  Users,
  Waves,
  XCircle,
} from "lucide-react";
import type { RescueTeam, AccessType } from "@/lib/mock-data";
import { mockZones } from "@/lib/mock-data";

interface MissionPlanningProps {
  rescueTeams: RescueTeam[];
}

interface MissionPlan {
  zone: (typeof mockZones)[0] | null;
  selectedTeams: string[];
  accessType: AccessType;
  feasibility: "feasible" | "risky" | "not-recommended";
  riskLevel: "low" | "medium" | "high";
  estimatedLives: number;
}

const accessTypeConfig: Record<
  AccessType,
  { label: string; icon: typeof Car; description: string }
> = {
  road: {
    label: "Road Access",
    icon: Car,
    description: "Ground vehicles and personnel",
  },
  boat: {
    label: "Boat Access",
    icon: Ship,
    description: "Water vessels for flooded areas",
  },
  air: {
    label: "Air Support",
    icon: Plane,
    description: "Helicopters for critical evacuations",
  },
};

const teamTypeLabels: Record<string, string> = {
  ndrf: "NDRF",
  sdrf: "SDRF",
  army: "Army",
  navy: "Navy",
  "coast-guard": "Coast Guard",
};

export function MissionPlanning({ rescueTeams }: MissionPlanningProps) {
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [accessType, setAccessType] = useState<AccessType>("road");
  const [missionPlan, setMissionPlan] = useState<MissionPlan | null>(null);

  const zone = mockZones.find((z) => z.id === selectedZone);

  const handleTeamToggle = (teamId: string) => {
    setSelectedTeams((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]
    );
  };

  const calculateFeasibility = (): MissionPlan["feasibility"] => {
    if (!zone) return "not-recommended";

    const teamCount = selectedTeams.length;
    const severity = zone.severity;

    // Simple feasibility logic based on teams and severity
    if (severity === "severe" && teamCount < 2) return "not-recommended";
    if (severity === "severe" && accessType === "road") return "risky";
    if (severity === "moderate" && teamCount < 1) return "not-recommended";
    if (accessType === "air" && teamCount >= 1) return "feasible";
    if (teamCount >= 2) return "feasible";
    return "risky";
  };

  const calculateRisk = (): MissionPlan["riskLevel"] => {
    if (!zone) return "high";

    const severity = zone.severity;
    if (severity === "severe" && accessType === "road") return "high";
    if (severity === "severe") return "medium";
    if (severity === "moderate" && accessType !== "air") return "medium";
    return "low";
  };

  const handleCreatePlan = () => {
    if (!zone || selectedTeams.length === 0) return;

    const plan: MissionPlan = {
      zone,
      selectedTeams,
      accessType,
      feasibility: calculateFeasibility(),
      riskLevel: calculateRisk(),
      estimatedLives: Math.round(zone.affectedPopulation * 0.15), // Estimate 15% can be rescued per mission
    };

    setMissionPlan(plan);
  };

  const deployedTeams = rescueTeams.filter((t) => t.status === "deployed");
  const availableTeams = rescueTeams.filter((t) => t.status !== "deployed");

  return (
    <div className="space-y-6">
      {/* Current Deployments */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Missions</p>
                <p className="text-3xl font-bold text-foreground">{deployedTeams.length}</p>
              </div>
              <div className="rounded-full bg-status-warning/20 p-3">
                <Route className="h-6 w-6 text-status-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Teams Available</p>
                <p className="text-3xl font-bold text-status-stable">{availableTeams.length}</p>
              </div>
              <div className="rounded-full bg-status-stable/20 p-3">
                <Users className="h-6 w-6 text-status-stable" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Priority Zones</p>
                <p className="text-3xl font-bold text-status-critical">
                  {mockZones.filter((z) => z.severity === "severe").length}
                </p>
              </div>
              <div className="rounded-full bg-status-critical/20 p-3">
                <Target className="h-6 w-6 text-status-critical" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Mission Configuration */}
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Route className="h-5 w-5 text-primary" />
              Plan New Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Zone Selection */}
            <div className="space-y-3">
              <Label className="text-foreground font-medium">Select Priority Zone</Label>
              <div className="grid gap-2 md:grid-cols-2">
                {mockZones.map((z) => (
                  <button
                    key={z.id}
                    onClick={() => setSelectedZone(z.id)}
                    className={`rounded-lg border p-3 text-left transition-colors ${
                      selectedZone === z.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-secondary hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{z.name}</span>
                      <Badge
                        className={
                          z.severity === "severe"
                            ? "bg-status-critical text-destructive-foreground"
                            : z.severity === "moderate"
                              ? "bg-status-warning text-primary-foreground"
                              : "bg-status-stable text-primary-foreground"
                        }
                      >
                        {z.severity}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {z.affectedPopulation.toLocaleString()} affected
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Team Assignment */}
            <div className="space-y-3">
              <Label className="text-foreground font-medium">Assign Rescue Teams</Label>
              <ScrollArea className="h-48">
                <div className="space-y-2 pr-4">
                  {availableTeams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-secondary p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={team.id}
                          checked={selectedTeams.includes(team.id)}
                          onCheckedChange={() => handleTeamToggle(team.id)}
                        />
                        <div>
                          <label
                            htmlFor={team.id}
                            className="font-medium text-foreground cursor-pointer"
                          >
                            {team.name}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {teamTypeLabels[team.type]} - {team.members} members - {team.location}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          team.status === "available"
                            ? "border-status-stable text-status-stable"
                            : "border-status-warning text-status-warning"
                        }
                      >
                        {team.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <Separator />

            {/* Access Type */}
            <div className="space-y-3">
              <Label className="text-foreground font-medium">Access Type</Label>
              <div className="grid grid-cols-3 gap-3">
                {(Object.keys(accessTypeConfig) as AccessType[]).map((type) => {
                  const config = accessTypeConfig[type];
                  const Icon = config.icon;

                  return (
                    <button
                      key={type}
                      onClick={() => setAccessType(type)}
                      className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors ${
                        accessType === type
                          ? "border-primary bg-primary/10"
                          : "border-border bg-secondary hover:bg-muted"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          accessType === type ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                      <span className="text-sm font-medium text-foreground">{config.label}</span>
                      <span className="text-xs text-center text-muted-foreground">
                        {config.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={handleCreatePlan}
              disabled={!selectedZone || selectedTeams.length === 0}
              className="w-full"
              size="lg"
            >
              Generate Mission Plan
            </Button>
          </CardContent>
        </Card>

        {/* Mission Plan Result */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Mission Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            {missionPlan ? (
              <div className="space-y-4">
                {/* Zone Info */}
                <div className="rounded-lg bg-secondary p-3">
                  <p className="text-xs text-muted-foreground">Target Zone</p>
                  <p className="font-semibold text-foreground">{missionPlan.zone?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {missionPlan.zone?.affectedPopulation.toLocaleString()} affected
                  </p>
                </div>

                {/* Feasibility Status */}
                <div
                  className={`rounded-lg p-4 ${
                    missionPlan.feasibility === "feasible"
                      ? "bg-status-stable/10"
                      : missionPlan.feasibility === "risky"
                        ? "bg-status-warning/10"
                        : "bg-status-critical/10"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {missionPlan.feasibility === "feasible" ? (
                      <CheckCircle2 className="h-5 w-5 text-status-stable" />
                    ) : missionPlan.feasibility === "risky" ? (
                      <AlertTriangle className="h-5 w-5 text-status-warning" />
                    ) : (
                      <XCircle className="h-5 w-5 text-status-critical" />
                    )}
                    <span
                      className={`font-semibold ${
                        missionPlan.feasibility === "feasible"
                          ? "text-status-stable"
                          : missionPlan.feasibility === "risky"
                            ? "text-status-warning"
                            : "text-status-critical"
                      }`}
                    >
                      {missionPlan.feasibility === "feasible"
                        ? "Mission Feasible"
                        : missionPlan.feasibility === "risky"
                          ? "Proceed with Caution"
                          : "Not Recommended"}
                    </span>
                  </div>
                </div>

                {/* Risk Indicator */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Risk Level</p>
                  <div className="flex gap-1">
                    <div
                      className={`h-2 flex-1 rounded-l ${
                        missionPlan.riskLevel === "low"
                          ? "bg-status-stable"
                          : missionPlan.riskLevel === "medium"
                            ? "bg-status-warning"
                            : "bg-status-critical"
                      }`}
                    />
                    <div
                      className={`h-2 flex-1 ${
                        missionPlan.riskLevel === "medium" || missionPlan.riskLevel === "high"
                          ? missionPlan.riskLevel === "medium"
                            ? "bg-status-warning"
                            : "bg-status-critical"
                          : "bg-muted"
                      }`}
                    />
                    <div
                      className={`h-2 flex-1 rounded-r ${
                        missionPlan.riskLevel === "high" ? "bg-status-critical" : "bg-muted"
                      }`}
                    />
                  </div>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {missionPlan.riskLevel} Risk
                  </p>
                </div>

                {/* Teams Assigned */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Teams Assigned</p>
                  <div className="space-y-1">
                    {rescueTeams
                      .filter((t) => missionPlan.selectedTeams.includes(t.id))
                      .map((team) => (
                        <div
                          key={team.id}
                          className="flex items-center justify-between rounded bg-background p-2 text-sm"
                        >
                          <span className="text-foreground">{team.name}</span>
                          <span className="text-muted-foreground">{team.members} members</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Access Method */}
                <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                  <span className="text-sm text-muted-foreground">Access Method</span>
                  <div className="flex items-center gap-2">
                    {accessType === "road" && <Car className="h-4 w-4 text-foreground" />}
                    {accessType === "boat" && <Ship className="h-4 w-4 text-foreground" />}
                    {accessType === "air" && <Plane className="h-4 w-4 text-foreground" />}
                    <span className="font-medium text-foreground">
                      {accessTypeConfig[missionPlan.accessType].label}
                    </span>
                  </div>
                </div>

                {/* Estimated Impact */}
                <div className="rounded-lg border border-primary bg-primary/5 p-4">
                  <p className="text-sm text-muted-foreground">Estimated Lives Impacted</p>
                  <p className="text-3xl font-bold text-primary">
                    {missionPlan.estimatedLives.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on zone population and rescue capacity
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button className="flex-1" disabled={missionPlan.feasibility === "not-recommended"}>
                    Deploy Mission
                  </Button>
                  <Button variant="outline" onClick={() => setMissionPlan(null)}>
                    Clear
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Waves className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  Select a zone and assign teams to generate a mission assessment
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
