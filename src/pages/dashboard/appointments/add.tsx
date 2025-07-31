import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { createAppointment } from "@/firebase/firestore";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

export default function AddAppointmentPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [student, setStudent] = useState("");
  const [advisor, setAdvisor] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [type, setType] = useState("");
  const [mode, setMode] = useState<"in-person" | "virtual">("in-person");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to create an appointment");
      return;
    }

    if (!date || !time || !type || !advisor) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Create appointment date/time
      const appointmentDateTime = new Date(date);
      const [hours, minutes] = time.split(':');
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

      const appointmentData = {
        title: `${type} - ${advisor}`,
        description: notes || `${type} appointment with ${advisor}`,
        appointmentDate: appointmentDateTime,
        timeSlot: `${time} - ${duration ? `${duration} mins` : '60 mins'}`,
        location: location || (mode === "virtual" ? "Virtual Meeting" : "TBD"),
        status: "pending" as const,
        userId: currentUser.uid,
        lecturerId: advisor,
        lecturerName: advisor,
        messages: [],
      };

      const appointmentId = await createAppointment(appointmentData);
      toast.success("Appointment scheduled successfully!");
      navigate(`/dashboard/appointments/${appointmentId}`);
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Failed to schedule appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
       {/* Breadcrumb navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard/appointments">Appointments</Link>
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>New Appointment</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="icon"
            onClick={() => navigate(-1)}
            className="bg-black hover:bg-gray-800 text-white cursor-pointer"
          >
            <ChevronLeft size={20} />
          </Button>
          <h1 className="text-[32px] font-bold text-[#121416]">New Appointment</h1>
        </div>
      </div>

      <div className="space-y-6 px-4">
        {/* Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col">
            <label className="text-sm font-medium pb-1">Student</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full text-left justify-between">
                {student || "Select Student"}
              </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
              <DropdownMenuRadioGroup
                value={student}
                onValueChange={setStudent}
              >
                <DropdownMenuRadioItem value="">Select Student</DropdownMenuRadioItem>
                {/* Add student options here */}
                <DropdownMenuRadioItem value="student1">Student 1</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="student2">Student 2</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="student3">Student 3</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium pb-1">Advisor</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full text-left justify-between">
                  {advisor || "Select Advisor"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuRadioGroup value={advisor} onValueChange={setAdvisor}>
                  <DropdownMenuRadioItem value="">Select Advisor</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="advisor1">Advisor 1</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="advisor2">Advisor 2</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="advisor3">Advisor 3</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium pb-1">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full text-left">
                  {date ? date.toLocaleDateString() : "Select Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => setDate(d as Date)}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium pb-1">Time</label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium pb-1">Duration</label>
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full text-left justify-between">
                  {duration || "Select Duration"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuRadioGroup value={duration} onValueChange={setDuration}>
                  <DropdownMenuRadioItem value="">Select Duration</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="30">30 mins</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="45">45 mins</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="60">60 mins</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium pb-1">Type</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full text-left justify-between">
                  {type || "Select Type"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuRadioGroup value={type} onValueChange={setType}>
                  <DropdownMenuRadioItem value="">Select Type</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="academic">Academic Advising</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="career">Career Counseling</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="tutoring">Tutoring</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mode */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              value="in-person"
              checked={mode === "in-person"}
              onChange={() => setMode("in-person")}
              className="form-radio"
            />
            In-person
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              value="virtual"
              checked={mode === "virtual"}
              onChange={() => setMode("virtual")}
              className="form-radio"
            />
            Virtual
          </label>
        </div>

        {/* Room/URL */}
        <div className="flex flex-col">
          <label className="text-sm font-medium pb-1">
            Room Number / Meeting URL
          </label>
          <Input
            placeholder="Enter room number or meeting URL"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Notes */}
        <div className="flex flex-col">
          <label className="text-sm font-medium pb-1">Notes</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any relevant notes"
            className="w-full min-h-[150px]"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" asChild disabled={loading}>
            <Link to="/dashboard/appointments">Cancel</Link>
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !date || !time || !type || !advisor}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Scheduling...
              </>
            ) : (
              "Schedule Appointment"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
