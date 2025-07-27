import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

const sampleAppointments = [
  {
    id: 1,
    date: "2024-03-15",
    time: "10:00 AM",
    student: "Ethan Harper",
    type: "Academic Advising",
    duration: "60 mins",
    status: "Scheduled",
    location: "Virtual",
  },
  {
    id: 2,
    date: "2024-03-15",
    time: "11:30 AM",
    student: "Olivia Bennett",
    type: "Career Counseling",
    duration: "45 mins",
    status: "Completed",
    location: "In-Person",
  },
];

export default function AppointmentsPage() {
  const [tab, setTab] = useState<"list" | "calendar">("list");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: undefined,
    to: undefined,
  });
  const [statusFilter, setStatusFilter] = useState("");
  const [studentFilter, setStudentFilter] = useState("");
  const [advisorFilter, setAdvisorFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [onlyMine, setOnlyMine] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openStudent, setOpenStudent] = useState(false);
  const [openAdvisor, setOpenAdvisor] = useState(false);

  const totalPages = Math.ceil(sampleAppointments.length / rowsPerPage);
  const paginatedAppointments = sampleAppointments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const navigate = useNavigate();
  const studentOptions = sampleAppointments.map((a) => a.student);
  const advisorOptions = sampleAppointments.map((a) => a.advisor);

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-4">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <Button className="bg-black text-white cursor-pointer"
          variant="outline"
          onClick={() => navigate("/dashboard/appointments/add")}
        >
          New Appointment
        </Button>
      </div>

      <div>
        {/* Filters */}
        <Card className="p-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  {dateRange.from && dateRange.to
                    ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                    : "Select Date Range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(r) => setDateRange(r || { from: undefined, to: undefined })}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full text-left">
                  {statusFilter || "Select Status"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <DropdownMenuRadioItem value="">All Statuses</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Scheduled">Scheduled</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Completed">Completed</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Cancelled">Cancelled</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Student Filter */}
            <Popover open={openStudent} onOpenChange={setOpenStudent}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openStudent}
                  className="w-full justify-between"
                >
                  {studentFilter || "Select Student"}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search student..." />
                  <CommandList>
                    <CommandEmpty>No student found.</CommandEmpty>
                    <CommandGroup>
                      {studentOptions.map((st) => (
                        <CommandItem
                          key={st}
                          value={st}
                          onSelect={(value) => {
                            setStudentFilter(value)
                            setOpenStudent(false)
                          }}
                        >
                          <CheckIcon
                            className={
                              studentFilter === st
                                ? "mr-2 h-4 w-4 opacity-100"
                                : "mr-2 h-4 w-4 opacity-0"
                            }
                          />
                          {st}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Advisor Filter */}
            <Popover open={openAdvisor} onOpenChange={setOpenAdvisor}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openAdvisor}
                  className="w-full justify-between"
                >
                  {advisorFilter || "Select Advisor"}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search advisor..." />
                  <CommandList>
                    <CommandEmpty>No advisor found.</CommandEmpty>
                    <CommandGroup>
                      {advisorOptions.map((adv) => (
                        <CommandItem
                          key={adv}
                          value={adv}
                          onSelect={(value) => {
                            setAdvisorFilter(value)
                            setOpenAdvisor(false)
                          }}
                        >
                          <CheckIcon
                            className={
                              advisorFilter === adv
                                ? "mr-2 h-4 w-4 opacity-100"
                                : "mr-2 h-4 w-4 opacity-0"
                            }
                          />
                          {adv}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Type Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full text-left">
                  {typeFilter || "Select Type"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={typeFilter}
                  onValueChange={setTypeFilter}
                >
                  <DropdownMenuRadioItem value="">All Types</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Academic Advising">
                    Academic Advising
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Career Counseling">
                    Career Counseling
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Tutoring">Tutoring</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex gap-2 cursor-pointer">
            <Button
              className="cursor-pointer"
              variant={onlyMine ? "default" : "outline"}
              onClick={() => setOnlyMine(!onlyMine)}
            >
              My Appointments Only
            </Button>
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={() => {
                setDateRange([undefined, undefined]);
                setStatusFilter("");
                setStudentFilter("");
                setAdvisorFilter("");
                setTypeFilter("");
                setOnlyMine(false);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* Table */}
        <div>
          <div className="overflow-auto rounded-xl border border-[#dde1e3] bg-white mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAppointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell>{appt.date}</TableCell>
                    <TableCell>{appt.time}</TableCell>
                    <TableCell>{appt.student}</TableCell>
                    <TableCell>{appt.type}</TableCell>
                    <TableCell>{appt.duration}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        {appt.status}
                      </Button>
                    </TableCell>
                    <TableCell>{appt.location}</TableCell>
                    <TableCell>
                      <Button asChild variant="link" size="sm">
                        <Link to={`/dashboard/appointments/${appt.id}`}>
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination footer */}
        <div className="flex items-center justify-between px-4 py-4 border-t mt-6">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            >
              <ChevronsLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button variant="outline" size="sm" className="w-10">
              {currentPage}
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              <ChevronRight size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            >
              <ChevronsRight size={16} />
            </Button>
            <select
              className="h-8 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[10, 20, 30, 40, 50].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
