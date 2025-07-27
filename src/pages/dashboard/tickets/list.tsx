import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  MoreHorizontal,
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

interface Ticket {
  id: string;
  subject: string;
  student: string;
  category: string;
  priority: string;
  status: string;
  assignee: string;
  created: string;
  updated: string;
  slaDue: string;
  replies: number;
  attachments: number;
}

const initialTickets: Ticket[] = [
  {
    id: "TKT-1234",
    subject: "Issue with course registration",
    student: "Liam Harper",
    category: "Registration",
    priority: "High",
    status: "Open",
    assignee: "Sarah Chen",
    created: "2023-09-15",
    updated: "2023-09-15",
    slaDue: "2023-09-18",
    replies: 2,
    attachments: 1,
  },
];

export default function TicketsListPage() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const initialTab =
    (params.get("tab") as "All" | "Open" | "Pending" | "Closed") ?? "All";

  const navigate = useNavigate();
  const [searchTerm, setSearch] = useState("");
  const [tab, setTab] = useState<"All" | "Open" | "Pending" | "Closed">(
    initialTab
  );
  const [priorityFilter, setPriorityFilter] = useState<string>("");

  // date range state
  const [dateRange, setDateRange] = useState<
    [Date | undefined, Date | undefined]
  >([undefined, undefined]);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalPages = Math.ceil(initialTickets.length / rowsPerPage);

  // slice tickets for current page
  const paginatedTickets = initialTickets.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div
      className="relative flex min-h-screen flex-col bg-white overflow-hidden"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <main className="flex-1 space-y-6">
        {/* Breadcrumb navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard/tickets">Tickets</Link>
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>List</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

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
            <h1 className="text-[32px] font-bold text-[#121416]">
              Ticket List
            </h1>
          </div>
          <Button variant="outline" size="sm">
            New Ticket
          </Button>
        </div>

        {/* Top filter bar */}
        <div className="flex flex-wrap items-center gap-2 px-4 py-4 mb-6">
          <Input
            placeholder="Search ID, subject, student..."
            value={searchTerm}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-sm"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-9 px-3">
                {dateRange[0] && dateRange[1]
                  ? `${format(dateRange[0], "MMM dd, yyyy")} - ${format(
                      dateRange[1],
                      "MMM dd, yyyy"
                    )}`
                  : dateRange[0]
                  ? `${format(dateRange[0], "MMM dd, yyyy")} - Select end date`
                  : "Select date range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                selected={{
                  from: dateRange[0],
                  to: dateRange[1],
                }}
                onSelect={(range) => setDateRange([range?.from, range?.to])}
                numberOfMonths={2}
                className="border-0"
              />
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 px-3">
                {priorityFilter || "All Priorities"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={priorityFilter}
                onValueChange={setPriorityFilter}
              >
                <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Low">Low</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Medium">
                  Medium
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="High">High</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Urgent">
                  Urgent
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tabs */}
        <Tabs
          value={tab}
          onValueChange={setTab}
          className="border-b border-[#dde1e3] px-4 pb-2"
        >
          <TabsList className="flex gap-8">
            <TabsTrigger
              value="All"
              className="data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="Open"
              className="data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
            >
              Open
            </TabsTrigger>
            <TabsTrigger
              value="Pending"
              className="data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
            >
              Pending
            </TabsTrigger>
            <TabsTrigger
              value="Closed"
              className="data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
            >
              Closed
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="px-4 py-6">
          <div className="overflow-auto rounded-xl border border-[#dde1e3] bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-6" />
                  <TableHead className="w-[400px]">ID</TableHead>
                  <TableHead className="w-[400px]">Subject</TableHead>
                  <TableHead className="w-[400px]">Student</TableHead>
                  <TableHead className="w-60">Category</TableHead>
                  <TableHead className="w-60">Priority</TableHead>
                  <TableHead className="w-60">Status</TableHead>
                  <TableHead className="w-[400px]">Assignee</TableHead>
                  <TableHead className="w-[400px]">Created</TableHead>
                  <TableHead className="w-[400px]">Updated</TableHead>
                  <TableHead className="w-[400px]">SLA Due</TableHead>
                  <TableHead className="w-[400px]">Replies</TableHead>
                  <TableHead className="w-[400px]">Attachments</TableHead>
                  <TableHead className="w-60">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTickets.map((ticket) => (
                  <TableRow
                    onClick={() => navigate(`/dashboard/tickets/:id`)}
                    className="cursor-pointer"
                  >
                    <TableCell />
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>{ticket.student}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        {ticket.category}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        {ticket.priority}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        {ticket.status}
                      </Button>
                    </TableCell>
                    <TableCell>{ticket.assignee}</TableCell>
                    <TableCell>{ticket.created}</TableCell>
                    <TableCell>{ticket.updated}</TableCell>
                    <TableCell>{ticket.slaDue}</TableCell>
                    <TableCell>{ticket.replies}</TableCell>
                    <TableCell>{ticket.attachments}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
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
      </main>
    </div>
  );
}
