import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";

export default function AppointmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // placeholder data; replace with fetch logic
  const [appt, setAppt] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const data = {
      student: "Ethan Harper",
      advisor: "Dr. Smith",
      date: "2024-03-15",
      time: "10:00 AM",
      duration: "60 mins",
      type: "Academic Advising",
      mode: "Virtual",
      location: "Zoom",
      status: "Scheduled",
      notes: "Bring transcript.",
      audit: [
        {
          when: "Mar 10, 2024",
          who: "System",
          field: "Created",
          before: "-",
          after: "Scheduled",
        },
        {
          when: "Mar 12, 2024",
          who: "Admin",
          field: "Status",
          before: "Scheduled",
          after: "Confirmed",
        },
      ],
    };
    setAppt(data);
    setFormData(data);
  }, [id]);

  if (!appt || !formData) return <div>Loading...</div>;

  const saveChanges = () => {
    setAppt(formData);
    setIsEditing(false);
    // TODO: persist changes to backend
  };

  return (
    <div className="bg-white space-y-6">
      {/* Breadcrumb & Header */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard/appointments">Appointments</Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>#{id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="icon"
            onClick={() => navigate(-1)}
            className="bg-black hover:bg-gray-800 text-white cursor-pointer"
          >
            <ChevronLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold">Appointment Details</h1>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(appt);
                }}
              >
                Cancel
              </Button>
              <Button onClick={saveChanges}>Save</Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(
          [
            ["Student", formData.student, "student"],
            ["Advisor", formData.advisor, "advisor"],
            ["Date", formData.date, "date"],
            ["Time", formData.time, "time"],
            ["Duration", formData.duration, "duration"],
            ["Type", formData.type, "type"],
            ["Mode", formData.mode, "mode"],
            ["Location", formData.location, "location"],
            ["Status", formData.status, "status"],
          ] as [string, any, string][]
        ).map(([label, value, key]) => (
          <div key={key} className="flex flex-col">
            <span className="text-sm text-muted-foreground">{label}</span>
            {isEditing ? (
              <Input
                value={formData[key]}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
              />
            ) : (
              <span className="text-base">{value}</span>
            )}
          </div>
        ))}
        <div className="flex flex-col md:col-span-2">
          <span className="text-sm text-muted-foreground">Notes</span>
          {isEditing ? (
            <Textarea
              className="mt-1"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          ) : (
            <Textarea readOnly className="mt-1" value={appt.notes} />
          )}
        </div>
      </div>
    </div>
  );
}
