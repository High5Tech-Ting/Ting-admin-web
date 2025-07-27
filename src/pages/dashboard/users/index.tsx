import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft,
  ChevronRight,
  ChevronsLeft, 
  ChevronsRight, 
  Mail,
  MoreHorizontal,
  Filter,
  SortDesc
} from "lucide-react";

// Simulated user data (this would normally come from a backend)
const initialUsers = [
  { id: 1, username: "moshe.hermiston37", name: "Moshe Hermiston", email: "moshe61@hotmail.com", phone: "+13092427046", status: "Invited", role: "Manager" },
  { id: 2, username: "kayla_pfeffer", name: "Kayla Pfeffer", email: "kayla.crooks@hotmail.com", phone: "+17634166117", status: "Inactive", role: "Cashier" },
  { id: 3, username: "gabe_okon33", name: "Gabe O'Kon", email: "gabe_goyette@hotmail.com", phone: "+15413804059", status: "Suspended", role: "Superadmin" },
  { id: 4, username: "eveline_welch", name: "Eveline Welch", email: "eveline_greenholt48@gmail.com", phone: "+16219551097", status: "Inactive", role: "Admin" },
  { id: 5, username: "annette.cruickshank", name: "Annette Cruickshank", email: "annette.schmitt66@hotmail.com", phone: "+17619005800", status: "Suspended", role: "Cashier" },
  { id: 6, username: "aurore.jacobson", name: "Aurore Jacobson", email: "aurore_bashirian-nitzsche@gmail.com", phone: "+17914933319", status: "Invited", role: "Admin" },
  { id: 7, username: "cora.schuster33", name: "Cora Schuster", email: "cora98@yahoo.com", phone: "+14162820335", status: "Inactive", role: "Superadmin" },
  { id: 8, username: "jennifer.hahn71", name: "Jennifer Hahn", email: "jennifer_bauch80@gmail.com", phone: "+17476514352", status: "Active", role: "Admin" },
  { id: 9, username: "ernesto_trantow", name: "Ernesto Trantow", email: "ernesto15@gmail.com", phone: "+13868266912", status: "Suspended", role: "Admin" },
  { id: 10, username: "penelope_schulist18", name: "Penelope Schulist", email: "penelope_padberg17@hotmail.com", phone: "+12686745676", status: "Invited", role: "Manager" },
];

export default function UsersPage() {
  const [users] = useState(initialUsers);
  const [currentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  
  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusClass = () => {
      switch (status) {
        case "Active":
          return "bg-green-100 text-green-800";
        case "Inactive":
          return "bg-gray-100 text-gray-800";
        case "Suspended":
          return "bg-red-100 text-red-800";
        case "Invited":
          return "bg-blue-100 text-blue-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass()}`}>
        {status}
      </span>
    );
  };

  // Role badge component
  const RoleBadge = ({ role }: { role: string }) => {
    const getIcon = () => {
      switch (role) {
        case "Manager":
          return "⚙️";
        case "Admin":
          return "🛡️";
        case "Superadmin":
          return "⚡";
        case "Cashier":
          return "💰";
        default:
          return "👤";
      }
    };
    
    return (
      <div className="flex items-center gap-1.5">
        <span>{getIcon()}</span>
        <span>{role}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User List</h1>
          <p className="text-muted-foreground">Manage your users and their roles here.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
          >
            <Mail className="size-4" />
            Invite User
          </Button>
          <Button asChild>
  <Link to="/dashboard/users/add">
    Add User
  </Link>
</Button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex gap-2">
        <div className="relative w-full max-w-sm">
          <input 
            type="text" 
            placeholder="Filter users..." 
            className="w-full h-9 rounded-md border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring/30" 
          />
        </div>
        
        <Button variant="outline" size="icon">
          <Filter size={16} />
          <span className="sr-only">Filter</span>
        </Button>
        
        <Button variant="outline" size="icon">
          <SortDesc size={16} />
          <span className="sr-only">Sort</span>
        </Button>
      </div>
      
      {/* Users table */}
      <div className="border rounded-md">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">
                  Username
                </th>
                <th className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">
                  Name
                </th>
                <th className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">
                  Email
                </th>
                <th className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">
                  Phone Number
                </th>
                <th className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">
                  Role
                </th>
                <th className="relative px-4 py-3.5">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    {user.username}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    {user.phone}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/dashboard/users/${user.id}`}>
                        <MoreHorizontal size={16} />
                        <span className="sr-only">Open menu</span>
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="flex items-center text-sm text-muted-foreground">
            <span>
              Showing page {currentPage} of 2 pages ({users.length} total items)
            </span>
            <div className="ml-2">
              <select 
                className="h-8 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                value={rowsPerPage}
                onChange={() => {}}
              >
                <option value="10">10 rows</option>
                <option value="20">20 rows</option>
                <option value="30">30 rows</option>
                <option value="40">40 rows</option>
                <option value="50">50 rows</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="icon" disabled={currentPage === 1}>
              <ChevronsLeft size={16} />
              <span className="sr-only">First page</span>
            </Button>
            <Button variant="outline" size="icon" disabled={currentPage === 1}>
              <ChevronLeft size={16} />
              <span className="sr-only">Previous page</span>
            </Button>
            <Button variant="outline" size="sm" className="w-10">
              {currentPage}
            </Button>
            <Button variant="outline" size="icon" disabled={currentPage === 2}>
              <ChevronRight size={16} />
              <span className="sr-only">Next page</span>
            </Button>
            <Button variant="outline" size="icon" disabled={currentPage === 2}>
              <ChevronsRight size={16} />
              <span className="sr-only">Last page</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}