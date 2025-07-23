import { ArrowUpRight, Users, CheckSquare, ArrowDownRight, Activity, TrendingUp, UserPlus } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Users",
      value: "2,543",
      change: "+12.5%",
      isPositive: true,
      icon: <Users className="size-4" />
    },
    {
      title: "Active Tasks",
      value: "45",
      change: "-3.4%",
      isPositive: false,
      icon: <CheckSquare className="size-4" />
    },
    {
      title: "Monthly Growth",
      value: "23%",
      change: "+8.2%",
      isPositive: true,
      icon: <TrendingUp className="size-4" />
    },
    {
      title: "System Activity",
      value: "92%",
      change: "+2.1%",
      isPositive: true,
      icon: <Activity className="size-4" />
    }
  ];
  
  // Demo recent users data
  const recentUsers = [
    { id: 1, name: "Jennifer Hahn", email: "jennifer_bauch80@gmail.com", timestamp: "5 minutes ago", action: "Account updated" },
    { id: 2, name: "Moshe Hermiston", email: "moshe61@hotmail.com", timestamp: "1 hour ago", action: "Account created" },
    { id: 3, name: "Aurore Jacobson", email: "aurore_bashirian-nitzsche@gmail.com", timestamp: "3 hours ago", action: "Role changed" },
    { id: 4, name: "Penelope Schulist", email: "penelope_padberg17@hotmail.com", timestamp: "5 hours ago", action: "Account created" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your application</p>
      </div>
      
      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card p-6 rounded-lg border shadow-sm">
            <div className="flex justify-between">
              <div className="p-2 rounded-md bg-primary/10">
                {stat.icon}
              </div>
              <span className={`flex items-center gap-1 text-xs ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
                {stat.isPositive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              </span>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-muted-foreground text-sm">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <UserPlus className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <p>{user.action}</p>
                    <p>•</p>
                    <p>{user.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Quick Actions</h2>
          </div>
          <div className="grid gap-3">
            <div className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer">
              <h3 className="font-medium">Add New User</h3>
              <p className="text-sm text-muted-foreground">Create a new user account</p>
            </div>
            <div className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer">
              <h3 className="font-medium">Create New Task</h3>
              <p className="text-sm text-muted-foreground">Add a new task to the system</p>
            </div>
            <div className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer">
              <h3 className="font-medium">View Reports</h3>
              <p className="text-sm text-muted-foreground">Access system analytics and reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}