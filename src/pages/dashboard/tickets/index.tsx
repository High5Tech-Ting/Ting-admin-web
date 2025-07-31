import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Ticket, Loader2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardStats, useSupportTickets } from "@/hooks/useFirestore";

export default function TicketsPage() {
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats();
  const { tickets: recentTickets, loading: ticketsLoading } = useSupportTickets(undefined, 5);

  if (statsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Error loading dashboard</p>
          <p className="text-sm text-muted-foreground">{statsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <header className="flex items-center justify-between border-b border-b-[#f0f2f5] py-3">
        <div className="items-center gap-4 text-[#111418]">
          <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight">
            Ticket Dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Ticket size={16} />
            <Link to="/dashboard/tickets/add">New Ticket</Link>
          </Button>
          <Button asChild className="text-white cursor-pointer">
            <Link to="/dashboard/tickets/list">View All Tickets</Link>
          </Button>
        </div>
      </header>

      <div className="flex h-full grow flex-col">
        <div className="flex flex-1 flex-col py-5">
          <div className="flex flex-col max-w-[960px] w-full space-y-6">
            {statsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="p-6 border-[#dbe0e6]">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                <Link to="/dashboard/tickets/list?tab=pending" className="block">
                  <Card className="p-6 border-[#dbe0e6] hover:shadow cursor-pointer">
                    <p className="text-[#111418] text-base font-medium leading-normal">
                      Pending Tickets
                    </p>
                    <p className="text-[#111418] text-2xl font-bold leading-tight">
                      {stats?.tickets.pending || 0}
                    </p>
                    <p className="text-[#e73908] text-base font-medium leading-normal">
                      Needs attention
                    </p>
                  </Card>
                </Link>

                <Link to="/dashboard/tickets/list?tab=assigned" className="block">
                  <Card className="p-6 border-[#dbe0e6] hover:shadow cursor-pointer">
                    <p className="text-[#111418] text-base font-medium leading-normal">
                      Assigned Tickets
                    </p>
                    <p className="text-[#111418] text-2xl font-bold leading-tight">
                      {stats?.tickets.assigned || 0}
                    </p>
                    <p className="text-[#078838] text-base font-medium leading-normal">
                      In progress
                    </p>
                  </Card>
                </Link>

                <Card className="p-6 border-[#dbe0e6]">
                  <p className="text-[#111418] text-base font-medium leading-normal">
                    Total Open
                  </p>
                  <p className="text-[#111418] text-2xl font-bold leading-tight">
                    {stats?.tickets.open || 0}
                  </p>
                  <p className="text-[#078838] text-base font-medium leading-normal">
                    Active tickets
                  </p>
                </Card>

                <Card className="p-6 border-[#dbe0e6]">
                  <p className="text-[#111418] text-base font-medium leading-normal">
                    Closed Today
                  </p>
                  <p className="text-[#111418] text-2xl font-bold leading-tight">
                    {stats?.tickets.closed || 0}
                  </p>
                  <p className="text-[#078838] text-base font-medium leading-normal">
                    Resolved
                  </p>
                </Card>

                <Card className="p-6 border-[#dbe0e6]">
                  <p className="text-[#111418] text-base font-medium leading-normal">
                    Total Tickets
                  </p>
                  <p className="text-[#111418] text-2xl font-bold leading-tight">
                    {stats?.tickets.total || 0}
                  </p>
                  <p className="text-[#078838] text-base font-medium leading-normal">
                    All time
                  </p>
                </Card>
              </div>
            )}

            <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Recent Activity
            </h2>

            {ticketsLoading ? (
              <div className="px-4">
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Loading recent tickets...
                </div>
              </div>
            ) : recentTickets.length === 0 ? (
              <div className="px-4">
                <div className="text-center py-8 text-muted-foreground">
                  No recent tickets
                </div>
              </div>
            ) : (
              <div className="space-y-4 px-4">
                {recentTickets.map((ticket) => (
                  <div key={ticket.id} className="grid grid-cols-[40px_1fr] gap-x-2">
                    <div className="flex flex-col items-center gap-1 pt-3">
                      <Ticket className="text-[#111418]" size={24} />
                      <div className="w-[1.5px] bg-[#dbe0e6] h-2 grow" />
                    </div>
                    <div className="flex flex-1 flex-col py-3">
                      <Link
                        to={`/dashboard/tickets/${ticket.id}`}
                        className="hover:underline"
                      >
                        <p className="text-[#111418] text-base font-medium leading-normal">
                          {ticket.title}
                        </p>
                      </Link>
                      <p className="text-[#60758a] text-sm font-normal leading-normal">
                        {ticket.createdAt.toLocaleDateString()} • Status: {ticket.status}
                      </p>
                      <p className="text-[#60758a] text-sm leading-normal mt-1">
                        {ticket.description.substring(0, 100)}
                        {ticket.description.length > 100 ? '...' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
