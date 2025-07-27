import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Ticket } from "lucide-react";
import { Link } from "react-router-dom";

export default function TicketsPage() {
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
            <span>New Ticket</span>
          </Button>
          <Button asChild className="text-white cursor-pointer">
            <Link to="/dashboard/tickets/list">View All Tickets</Link>
          </Button>
        </div>
      </header>

      <div className="flex h-full grow flex-col">
        <div className="flex flex-1sent into same row py-5">
          <div className="flex flex-col max-w-[960px] w-full space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              <Link to="/dashboard/tickets/list?tab=Open" className="block">
                <Card className="p-6 border-[#dbe0e6] hover:shadow cursor-pointer">
                  <p className="text-[#111418] text-base font-medium leading-normal">
                    Open Tickets
                  </p>
                  <p className="text-[#111418] text-2xl font-bold leading-tight">
                    120
                  </p>
                  <p className="text-[#078838] text-base font-medium leading-normal">
                    +5%
                  </p>
                </Card>
              </Link>
              <Card className="p-6 border-[#dbe0e6]">
                <p className="text-[#111418] text-base font-medium leading-normal">
                  Unassigned Tickets
                </p>
                <p className="text-[#111418] text-2xl font-bold leading-tight">
                  35
                </p>
                <p className="text-[#e73908] text-base font-medium leading-normal">
                  -2%
                </p>
              </Card>
              <Card className="p-6 border-[#dbe0e6]">
                <p className="text-[#111418] text-base font-medium leading-normal">
                  Overdue Tickets
                </p>
                <p className="text-[#111418] text-2xl font-bold leading-tight">
                  15
                </p>
                <p className="text-[#078838] text-base font-medium leading-normal">
                  +10%
                </p>
              </Card>
              <Card className="p-6 border-[#dbe0e6]">
                <p className="text-[#111418] text-base font-medium leading-normal">
                  Today's New Tickets
                </p>
                <p className="text-[#111418] text-2xl font-bold leading-tight">
                  10
                </p>
                <p className="text-[#078838] text-base font-medium leading-normal">
                  +3%
                </p>
              </Card>
              <Card className="p-6 border-[#dbe0e6]">
                <p className="text-[#111418] text-base font-medium leading-normal">
                  Avg. Response Time
                </p>
                <p className="text-[#111418] text-2xl font-bold leading-tight">
                  2h 30m
                </p>
                <p className="text-[#e73908] text-base font-medium leading-normal">
                  -1%
                </p>
              </Card>
            </div>

            <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Ticket Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-6">
              <Card className="p-6 border-[#dbe0e6]">
                <p className="text-[#111418] text-base font-medium leading-normal">
                  Tickets by Status
                </p>
                <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
                  <div
                    className="border-[#60758a] bg-[#f0f2f5] border-t-2 w-full"
                    style={{ height: "10%" }}
                  />
                  <p className="text-[#60758a] text-[13px] font-bold leading-normal tracking-[0.015em]">
                    Open
                  </p>
                  <div
                    className="border-[#60758a] bg-[#f0f2f5] border-t-2 w-full"
                    style={{ height: "30%" }}
                  />
                  <p className="text-[#60758a] text-[13px] font-bold leading-normal tracking-[0.015em]">
                    In Progress
                  </p>
                  <div
                    className="border-[#60758a] bg-[#f0f2f5] border-t-2 w-full"
                    style={{ height: "20%" }}
                  />
                  <p className="text-[#60758a] text-[13px] font-bold leading-normal tracking-[0.015em]">
                    Resolved
                  </p>
                  <div
                    className="border-[#60758a] bg-[#f0f2f5] border-t-2 w-full"
                    style={{ height: "20%" }}
                  />
                  <p className="text-[#60758a] text-[13px] font-bold leading-normal tracking-[0.015em]">
                    Closed
                  </p>
                </div>
              </Card>
              <Card className="p-6 border-[#dbe0e6]">
                <p className="text-[#111418] text-base font-medium leading-normal">
                  Tickets by Category
                </p>
                <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
                  <div
                    className="border-[#60758a] bg-[#f0f2f5] border-t-2 w-full"
                    style={{ height: "60%" }}
                  />
                  <p className="text-[#60758a] text-[13px] font-bold leading-normal tracking-[0.015em]">
                    Feature Request
                  </p>
                  <div
                    className="border-[#60758a] bg-[#f0f2f5] border-t-2 w-full"
                    style={{ height: "40%" }}
                  />
                  <p className="text-[#60758a] text-[13px] font-bold leading-normal tracking-[0.015em]">
                    Bug Report
                  </p>
                  <div
                    className="border-[#60758a] bg-[#f0f2f5] border-t-2 w-full"
                    style={{ height: "100%" }}
                  />
                  <p className="text-[#60758a] text-[13px] font-bold leading-normal tracking-[0.015em]">
                    Question
                  </p>
                  <div
                    className="border-[#60758a] bg-[#f0f2f5] border-t-2 w-full"
                    style={{ height: "90%" }}
                  />
                  <p className="text-[#60758a] text-[13px] font-bold leading-normal tracking-[0.015em]">
                    Feedback
                  </p>
                  <div
                    className="border-[#60758a] bg-[#f0f2f5] border-t-2 w-full"
                    style={{ height: "10%" }}
                  />
                  <p className="text-[#60758a] text-[13px] font-bold leading-normal tracking-[0.015em]">
                    Other
                  </p>
                </div>
              </Card>
            </div>

            <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Recent Activity
            </h2>
            <div className="grid grid-cols-[40px_1fr] gap-x-2 px-4">
              {/* Timeline Item */}
              <div className="flex flex-col items-center gap-1 pt-3">
                <Ticket className="text-[#111418]" size={24} />
                <div className="w-[1.5px] bg-[#dbe0e6] h-2 grow" />
              </div>
              <div className="flex flex-1 flex-col py-3">
                <p className="text-[#111418] text-base font-medium leading-normal">
                  Ticket #1234: New feature request
                </p>
                <p className="text-[#60758a] text-base font-normal leading-normal">
                  2 hours ago
                </p>
              </div>
              {/* ...repeat timeline items as needed... */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
