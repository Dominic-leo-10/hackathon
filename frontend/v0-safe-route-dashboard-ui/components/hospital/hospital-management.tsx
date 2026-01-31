"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Hospital,
  Bed,
  Heart,
  Wind,
  Ambulance,
  MapPin,
  Phone,
  AlertTriangle,
  LayoutGrid,
  List,
} from "lucide-react";
import type { Hospital as HospitalType } from "@/lib/mock-data";

interface HospitalManagementProps {
  hospitals: HospitalType[];
}

export function HospitalManagement({ hospitals }: HospitalManagementProps) {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [selectedHospital, setSelectedHospital] = useState<HospitalType | null>(null);

  const totalBeds = hospitals.reduce((sum, h) => sum + h.totalBeds, 0);
  const availableBeds = hospitals.reduce((sum, h) => sum + h.availableBeds, 0);
  const totalICU = hospitals.reduce((sum, h) => sum + h.icuTotal, 0);
  const availableICU = hospitals.reduce((sum, h) => sum + h.icuAvailable, 0);
  const totalCritical = hospitals.reduce((sum, h) => sum + h.criticalPatients, 0);
  const totalAmbulances = hospitals.reduce((sum, h) => sum + h.ambulancesAvailable, 0);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-status-info/10 p-2">
                <Hospital className="h-5 w-5 text-status-info" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Hospitals</p>
                <p className="text-2xl font-bold text-foreground">{hospitals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-status-stable/10 p-2">
                <Bed className="h-5 w-5 text-status-stable" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Available Beds</p>
                <p className="text-2xl font-bold text-foreground">
                  {availableBeds}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{totalBeds}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-status-warning/10 p-2">
                <Heart className="h-5 w-5 text-status-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ICU Available</p>
                <p className="text-2xl font-bold text-foreground">
                  {availableICU}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{totalICU}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-status-critical/10 p-2">
                <AlertTriangle className="h-5 w-5 text-status-critical" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Critical Patients</p>
                <p className="text-2xl font-bold text-status-critical">{totalCritical}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-2">
                <Wind className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">O2 Available</p>
                <p className="text-2xl font-bold text-foreground">
                  {hospitals.filter((h) => h.oxygenAvailable).length}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{hospitals.length}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Ambulance className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ambulances</p>
                <p className="text-2xl font-bold text-foreground">{totalAmbulances}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hospital List */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              Hospital Status
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("cards")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "table" ? (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary hover:bg-secondary">
                    <TableHead className="text-foreground">Hospital</TableHead>
                    <TableHead className="text-foreground text-center">
                      Beds Available
                    </TableHead>
                    <TableHead className="text-foreground text-center">
                      ICU Available
                    </TableHead>
                    <TableHead className="text-foreground text-center">O2</TableHead>
                    <TableHead className="text-foreground text-center">
                      Critical
                    </TableHead>
                    <TableHead className="text-foreground text-center">
                      Ambulances
                    </TableHead>
                    <TableHead className="text-foreground text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hospitals.map((hospital) => {
                    const bedPercent = Math.round(
                      ((hospital.totalBeds - hospital.availableBeds) / hospital.totalBeds) * 100
                    );
                    const icuPercent = Math.round(
                      ((hospital.icuTotal - hospital.icuAvailable) / hospital.icuTotal) * 100
                    );

                    return (
                      <TableRow key={hospital.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{hospital.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {hospital.location}, {hospital.district}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="space-y-1">
                            <span
                              className={`font-semibold ${
                                hospital.availableBeds < 50
                                  ? "text-status-critical"
                                  : hospital.availableBeds < 100
                                    ? "text-status-warning"
                                    : "text-status-stable"
                              }`}
                            >
                              {hospital.availableBeds}
                            </span>
                            <span className="text-muted-foreground">
                              /{hospital.totalBeds}
                            </span>
                            <div className="mx-auto h-1 w-16 rounded-full bg-muted">
                              <div
                                className={`h-1 rounded-full ${
                                  bedPercent > 90
                                    ? "bg-status-critical"
                                    : bedPercent > 70
                                      ? "bg-status-warning"
                                      : "bg-status-stable"
                                }`}
                                style={{ width: `${bedPercent}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="space-y-1">
                            <span
                              className={`font-semibold ${
                                hospital.icuAvailable < 5
                                  ? "text-status-critical"
                                  : hospital.icuAvailable < 10
                                    ? "text-status-warning"
                                    : "text-status-stable"
                              }`}
                            >
                              {hospital.icuAvailable}
                            </span>
                            <span className="text-muted-foreground">
                              /{hospital.icuTotal}
                            </span>
                            <div className="mx-auto h-1 w-16 rounded-full bg-muted">
                              <div
                                className={`h-1 rounded-full ${
                                  icuPercent > 90
                                    ? "bg-status-critical"
                                    : icuPercent > 70
                                      ? "bg-status-warning"
                                      : "bg-status-stable"
                                }`}
                                style={{ width: `${icuPercent}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {hospital.oxygenAvailable ? (
                            <Badge className="bg-status-stable text-primary-foreground">
                              Available
                            </Badge>
                          ) : (
                            <Badge className="bg-status-critical text-destructive-foreground">
                              Low
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold text-status-critical">
                            {hospital.criticalPatients}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold text-foreground">
                            {hospital.ambulancesAvailable}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedHospital(hospital)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {hospitals.map((hospital) => (
                <Card
                  key={hospital.id}
                  className="bg-secondary border-border cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setSelectedHospital(hospital)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{hospital.name}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {hospital.location}, {hospital.district}
                        </p>
                      </div>
                      {!hospital.oxygenAvailable && (
                        <Badge className="bg-status-critical text-destructive-foreground shrink-0">
                          Low O2
                        </Badge>
                      )}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded bg-background p-2 text-center">
                        <p className="text-lg font-bold text-foreground">
                          {hospital.availableBeds}
                        </p>
                        <p className="text-xs text-muted-foreground">Beds</p>
                      </div>
                      <div className="rounded bg-background p-2 text-center">
                        <p className="text-lg font-bold text-foreground">
                          {hospital.icuAvailable}
                        </p>
                        <p className="text-xs text-muted-foreground">ICU</p>
                      </div>
                      <div className="rounded bg-background p-2 text-center">
                        <p className="text-lg font-bold text-status-critical">
                          {hospital.criticalPatients}
                        </p>
                        <p className="text-xs text-muted-foreground">Critical</p>
                      </div>
                      <div className="rounded bg-background p-2 text-center">
                        <p className="text-lg font-bold text-foreground">
                          {hospital.ambulancesAvailable}
                        </p>
                        <p className="text-xs text-muted-foreground">Ambulances</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medical Evacuation Dialog */}
      <Dialog open={!!selectedHospital} onOpenChange={() => setSelectedHospital(null)}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Medical Evacuation Panel</DialogTitle>
          </DialogHeader>
          {selectedHospital && (
            <div className="space-y-4">
              <div className="rounded-lg bg-secondary p-4">
                <h4 className="font-semibold text-foreground">{selectedHospital.name}</h4>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {selectedHospital.location}, {selectedHospital.district}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Phone className="h-3 w-3" />
                  {selectedHospital.contactNumber}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Available Beds</p>
                  <p className="text-2xl font-bold text-foreground">
                    {selectedHospital.availableBeds}
                  </p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">ICU Available</p>
                  <p className="text-2xl font-bold text-foreground">
                    {selectedHospital.icuAvailable}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-status-critical/10 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Critical Patients</span>
                  <span className="text-xl font-bold text-status-critical">
                    {selectedHospital.criticalPatients}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                <div className="flex items-center gap-2">
                  <Ambulance className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-foreground">Ambulances Ready</span>
                </div>
                <span className="text-xl font-bold text-foreground">
                  {selectedHospital.ambulancesAvailable}
                </span>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">Request Evacuation</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Transfer Patient
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
