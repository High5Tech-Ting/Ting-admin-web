import {
  Users,
  Ticket,
  Calendar,
  UserPlus,
  Clock,
  MessageSquare,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDashboardStats, useUsers, useSupportTickets, useAppointments } from "@/hooks/useFirestore";

export default function DashboardPage() {
  const { stats, loading: statsLoading } = useDashboardStats();
  const { users: recentUsers, loading: usersLoading } = useUsers("all", 5);
  const { tickets: recentTickets, loading: ticketsLoading } = useSupportTickets("pending", 5);
  const { appointments: recentAppointments, loading: appointmentsLoading } = useAppointments(undefined, "pending", 5);

  const dashboardStats = [
    {
      title: "Total Users",
      value: statsLoading ? "..." : (stats?.users.total || 0),
      breakdown: statsLoading ? "Loading..." : `${stats?.users.students || 0} Students, ${stats?.users.staff || 0} Staff`,
      icon: <Users className="size-4" />,
      color: "blue"
    },
    {
      title: "Support Tickets",
      value: statsLoading ? "..." : (stats?.tickets.total || 0),
      breakdown: statsLoading ? "Loading..." : `${stats?.tickets.pending || 0} Pending, ${stats?.tickets.open || 0} Open`,
      icon: <Ticket className="size-4" />,
      color: "orange"
    },
    {
      title: "Appointments",
      value: appointmentsLoading ? "..." : recentAppointments.length,
      breakdown: appointmentsLoading ? "Loading..." : "Pending appointments",
      icon: <Calendar className="size-4" />,
      color: "green"
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      orange: "bg-orange-100 text-orange-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600"
    };
    return colors[color as keyof typeof colors] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your academic management system</p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="bg-card p-6 rounded-lg border shadow-sm">
            <div className="flex justify-between">
              <div className={`p-2 rounded-md ${getColorClasses(stat.color)}`}>
                {stat.icon}
              </div>
              <span className="text-xs text-muted-foreground">
                Updated now
              </span>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-muted-foreground text-sm">{stat.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.breakdown}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity and Quick actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Recent Users</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard/users">View All</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {usersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Loading users...
              </div>
            ) : recentUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No users found
              </div>
            ) : (
              recentUsers.slice(0, 4).map((user) => (
                <div key={user.uid} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <UserPlus className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{user.displayName}</p>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <p>{user.userType}</p>
                      <p>•</p>
                      <p>{user.createdAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Pending Tickets</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard/tickets">View All</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {ticketsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Loading tickets...
              </div>
            ) : recentTickets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No pending tickets
              </div>
            ) : (
              recentTickets.slice(0, 3).map((ticket) => (
                <div key={ticket.id} className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{ticket.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{ticket.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <MessageSquare className="size-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {ticket.messages?.length || 0} messages
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {ticket.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        ticket.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                      }`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions and Appointments */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Quick Actions</h2>
          </div>
          <div className="grid gap-3">
            <Link to="/dashboard/users/add" className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer block">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Add New User</h3>
                  <p className="text-sm text-muted-foreground">Create a new student, staff or lecturer account</p>
                </div>
              </div>
            </Link>
            <Link to="/dashboard/appointments/add" className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer block">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Schedule Appointment</h3>
                  <p className="text-sm text-muted-foreground">Book a meeting with lecturers or staff</p>
                </div>
              </div>
            </Link>
            <Link to="/dashboard/tickets" className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer block">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Ticket className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium">Support Tickets</h3>
                  <p className="text-sm text-muted-foreground">Manage help desk and support requests</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Recent Appointments</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard/appointments">View All</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {appointmentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Loading appointments...
              </div>
            ) : recentAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No pending appointments
              </div>
            ) : (
              recentAppointments.slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                    <Clock className="size-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{appointment.title}</p>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <p>{appointment.appointmentDate.toLocaleDateString()}</p>
                      <p>•</p>
                      <p>{appointment.timeSlot}</p>
                      <p>•</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}