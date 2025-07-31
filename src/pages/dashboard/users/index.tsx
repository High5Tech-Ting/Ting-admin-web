import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Filter,
  SortDesc,
  Loader2
} from "lucide-react";
import { useUsers } from "@/hooks/useFirestore";
import type { User } from "@/firebase/firestore";

export default function UsersPage() {
  const [userTypeFilter, setUserTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { users, loading, error, hasMore, loadMore } = useUsers(userTypeFilter === 'all' ? undefined : userTypeFilter);

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.staffId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lecturerId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Status badge component
  const StatusBadge = ({ user }: { user: User }) => {
    const isOnline = user.online;
    const getStatusClass = () => {
      if (isOnline) {
        return "bg-green-100 text-green-800";
      }
      return "bg-gray-100 text-gray-800";
    };

    const status = isOnline ? "Online" : "Offline";

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass()}`}>
        {status}
      </span>
    );
  };

  // Role badge component
  const RoleBadge = ({ userType }: { userType: string }) => {
    const getIcon = () => {
      switch (userType) {
        case "admin":
          return "⚡";
        case "lecturer":
          return "🎓";
        case "staff":
          return "🛡️";
        case "student":
          return "�";
        default:
          return "👤";
      }
    };

    return (
      <div className="flex items-center gap-1.5">
        <span>{getIcon()}</span>
        <span className="capitalize">{userType}</span>
      </div>
    );
  };

  const formatUserIdentifier = (user: User) => {
    switch (user.userType) {
      case 'student':
        return user.studentId || '-';
      case 'staff':
        return user.staffId || '-';
      case 'lecturer':
        return user.lecturerId || '-';
      default:
        return '-';
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading users</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User List</h1>
          <p className="text-muted-foreground">Manage your users and their roles here.</p>
        </div>
        <div className="flex items-center gap-3">
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 rounded-md border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>

        <select
          value={userTypeFilter}
          onChange={(e) => setUserTypeFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
        >
          <option value="all">All Users</option>
          <option value="student">Students</option>
          <option value="lecturer">Lecturers</option>
          <option value="staff">Staff</option>
          <option value="admin">Admins</option>
        </select>

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
                  Name
                </th>
                <th className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">
                  Email
                </th>
                <th className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">
                  ID
                </th>
                <th className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">
                  User Type
                </th>
                <th className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">
                  Course/Department
                </th>
                <th className="relative px-4 py-3.5">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-muted/50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        {user.profilePictureUrl ? (
                          <img
                            src={user.profilePictureUrl}
                            alt={user.displayName}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                            {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                        )}
                        <span>{user.displayName}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      {formatUserIdentifier(user)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <RoleBadge userType={user.userType} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <StatusBadge user={user} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      {user.course || user.department || user.batchNo || '-'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/dashboard/users/${user.uid}`}>
                          <MoreHorizontal size={16} />
                          <span className="sr-only">Open menu</span>
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Load More / Pagination */}
        {hasMore && (
          <div className="flex items-center justify-center px-4 py-3 border-t">
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

        {!hasMore && filteredUsers.length > 0 && (
          <div className="flex items-center justify-center px-4 py-3 border-t text-sm text-muted-foreground">
            All users loaded ({filteredUsers.length} total)
          </div>
        )}
      </div>
    </div>
  );
}