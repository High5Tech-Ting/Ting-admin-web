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
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useSupportTickets } from "@/hooks/useFirestore";

export default function TicketsListPage() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const initialTab =
    (params.get("tab") as "all" | "pending" | "assigned" | "closed") ?? "all";

  const navigate = useNavigate();
  const [searchTerm, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "pending" | "assigned" | "closed">(
    initialTab
  );
  const [priorityFilter, setPriorityFilter] = useState<string>("");

  // date range state
  const [dateRange, setDateRange] = useState<
    [Date | undefined, Date | undefined]
  >([undefined, undefined]);

  // Get tickets with Firebase
  const { tickets, loading, error, hasMore, loadMore } = useSupportTickets(
    tab === "all" ? undefined : tab
  );

  // Filter tickets based on search term and date range
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = !searchTerm || 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDateRange = !dateRange[0] || !dateRange[1] || (
      ticket.createdAt >= dateRange[0] && ticket.createdAt <= dateRange[1]
    );

    return matchesSearch && matchesDateRange;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'assigned':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading tickets</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

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
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard/tickets/add">New Ticket</Link>
          </Button>
        </div>

        {/* Top filter bar */}
        <div className="flex flex-wrap items-center gap-2 px-4 py-4 mb-6">
          <Input
            placeholder="Search ID, subject, description..."
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
          onValueChange={(value) => setTab(value as typeof tab)}
          className="border-b border-[#dde1e3] px-4 pb-2"
        >
          <TabsList className="flex gap-8">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
            >
              Pending
            </TabsTrigger>
            <TabsTrigger
              value="assigned"
              className="data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
            >
              Assigned
            </TabsTrigger>
            <TabsTrigger
              value="closed"
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
                  <TableHead className="w-[150px]">ID</TableHead>
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead className="w-[200px]">Status</TableHead>
                  <TableHead className="w-[200px]">Assignee</TableHead>
                  <TableHead className="w-[150px]">Created</TableHead>
                  <TableHead className="w-[150px]">Updated</TableHead>
                  <TableHead className="w-[100px]">Messages</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Loading tickets...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No tickets found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      onClick={() => navigate(`/dashboard/tickets/${ticket.id}`)}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell className="font-mono text-sm">
                        {ticket.id?.slice(-8).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ticket.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[280px]">
                            {ticket.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                          {ticket.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        {ticket.assignedToName || (
                          <span className="text-muted-foreground">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {ticket.createdAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        {ticket.updatedAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {ticket.messages?.length || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle action menu
                          }}
                        >
                          <MoreHorizontal size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="flex items-center justify-center px-4 py-4">
            <Button 
              variant="outline" 
              onClick={loadMore}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </Button>
          </div>
        )}

        {!hasMore && filteredTickets.length > 0 && (
          <div className="flex items-center justify-center px-4 py-4 text-sm text-muted-foreground">
            All tickets loaded ({filteredTickets.length} total)
          </div>
        )}
      </main>
    </div>
  );
}
