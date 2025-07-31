import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Trash2, Loader2 } from "lucide-react";
import { useUser } from "@/hooks/useFirestore";
import { updateUser, deleteUser } from "@/firebase/firestore";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: userLoading, error } = useUser(id || null);
  
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    userType: "student" as "student" | "staff" | "lecturer" | "admin",
    studentId: "",
    staffId: "",
    lecturerId: "",
    academicYear: 1,
    batchNo: "",
    course: "",
    department: "",
    position: "",
    modules: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        email: user.email || "",
        userType: user.userType,
        studentId: user.studentId || "",
        staffId: user.staffId || "",
        lecturerId: user.lecturerId || "",
        academicYear: user.academicYear || 1,
        batchNo: user.batchNo || "",
        course: user.course || "",
        department: user.department || "",
        position: user.position || "",
        modules: user.modules || [],
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'academicYear' ? parseInt(value) || 1 : value 
    }));
  };

  const handleModulesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const modules = e.target.value.split(',').map(m => m.trim()).filter(m => m);
    setFormData(prev => ({ ...prev, modules }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !user) return;

    setLoading(true);
    
    try {
      const updateData: Record<string, unknown> = {
        displayName: formData.displayName,
        email: formData.email,
        userType: formData.userType,
      };

      // Add type-specific fields based on current user type
      switch (formData.userType) {
        case 'student':
          updateData.studentId = formData.studentId;
          updateData.academicYear = formData.academicYear;
          updateData.batchNo = formData.batchNo;
          updateData.course = formData.course;
          // Clear other type fields
          updateData.staffId = null;
          updateData.lecturerId = null;
          updateData.department = null;
          updateData.position = null;
          updateData.modules = null;
          break;
        case 'staff':
          updateData.staffId = formData.staffId;
          updateData.department = formData.department;
          updateData.position = formData.position;
          // Clear other type fields
          updateData.studentId = null;
          updateData.lecturerId = null;
          updateData.academicYear = null;
          updateData.batchNo = null;
          updateData.course = null;
          updateData.modules = null;
          break;
        case 'lecturer':
          updateData.lecturerId = formData.lecturerId;
          updateData.department = formData.department;
          updateData.modules = formData.modules;
          // Clear other type fields
          updateData.studentId = null;
          updateData.staffId = null;
          updateData.academicYear = null;
          updateData.batchNo = null;
          updateData.course = null;
          updateData.position = null;
          break;
        case 'admin':
          updateData.department = formData.department;
          updateData.position = formData.position;
          // Clear other type fields
          updateData.studentId = null;
          updateData.staffId = null;
          updateData.lecturerId = null;
          updateData.academicYear = null;
          updateData.batchNo = null;
          updateData.course = null;
          updateData.modules = null;
          break;
      }

      await updateUser(id, updateData);
      toast.success("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !user) return;

    setLoading(true);
    
    try {
      await deleteUser(id);
      toast.success("User deleted successfully!");
      navigate("/dashboard/users");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading user...
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading user</p>
          <p className="text-sm text-muted-foreground">{error || "User not found"}</p>
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard/users")} 
            className="mt-4"
          >
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/dashboard/users")}
            disabled={loading}
          >
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit User</h1>
            <p className="text-muted-foreground">
              User ID: {user.uid}
            </p>
          </div>
        </div>
        
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="flex items-center gap-2">
              <Trash2 size={16} />
              Delete User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {user.displayName}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setDeleteDialogOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border rounded-md p-6 bg-card">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="displayName" className="text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="userType" className="text-sm font-medium">
                User Type <span className="text-red-500">*</span>
              </label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full h-9 rounded-md border bg-transparent px-3 py-1"
                required
                disabled={loading}
              >
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* User status info */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="flex items-center gap-2 h-9 px-3 py-1 border rounded-md bg-muted">
                <div className={`w-2 h-2 rounded-full ${user.online ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span className="text-sm">{user.online ? 'Online' : 'Offline'}</span>
              </div>
            </div>

            {/* Student fields */}
            {formData.userType === 'student' && (
              <>
                <div className="space-y-2">
                  <label htmlFor="studentId" className="text-sm font-medium">Student ID</label>
                  <Input
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="CB012345"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="academicYear" className="text-sm font-medium">Academic Year</label>
                  <Input
                    id="academicYear"
                    name="academicYear"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.academicYear}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="batchNo" className="text-sm font-medium">Batch Number</label>
                  <Input
                    id="batchNo"
                    name="batchNo"
                    value={formData.batchNo}
                    onChange={handleChange}
                    placeholder="Batch 2023"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="course" className="text-sm font-medium">Course</label>
                  <Input
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="Software Engineering"
                    disabled={loading}
                  />
                </div>
              </>
            )}

            {/* Staff fields */}
            {formData.userType === 'staff' && (
              <>
                <div className="space-y-2">
                  <label htmlFor="staffId" className="text-sm font-medium">Staff ID</label>
                  <Input
                    id="staffId"
                    name="staffId"
                    value={formData.staffId}
                    onChange={handleChange}
                    placeholder="STF001"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="department" className="text-sm font-medium">Department</label>
                  <Input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Student Support"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="position" className="text-sm font-medium">Position</label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Academic Advisor"
                    disabled={loading}
                  />
                </div>
              </>
            )}

            {/* Lecturer fields */}
            {formData.userType === 'lecturer' && (
              <>
                <div className="space-y-2">
                  <label htmlFor="lecturerId" className="text-sm font-medium">Lecturer ID</label>
                  <Input
                    id="lecturerId"
                    name="lecturerId"
                    value={formData.lecturerId}
                    onChange={handleChange}
                    placeholder="LEC001"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="department" className="text-sm font-medium">Department</label>
                  <Input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="IT"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="modules" className="text-sm font-medium">
                    Modules (comma-separated)
                  </label>
                  <Input
                    id="modules"
                    name="modules"
                    value={formData.modules.join(', ')}
                    onChange={handleModulesChange}
                    placeholder="Programming, Mobile App Development"
                    disabled={loading}
                  />
                </div>
              </>
            )}

            {/* Admin fields */}
            {formData.userType === 'admin' && (
              <>
                <div className="space-y-2">
                  <label htmlFor="department" className="text-sm font-medium">Department</label>
                  <Input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Administration"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="position" className="text-sm font-medium">Position</label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="System Administrator"
                    disabled={loading}
                  />
                </div>
              </>
            )}
          </div>

          {/* Additional user info */}
          <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
            <div className="space-y-2">
              <label className="text-sm font-medium">Created At</label>
              <div className="h-9 px-3 py-1 border rounded-md bg-muted flex items-center text-sm">
                {user.createdAt.toLocaleDateString()} {user.createdAt.toLocaleTimeString()}
              </div>
            </div>
            {user.lastSeen && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Seen</label>
                <div className="h-9 px-3 py-1 border rounded-md bg-muted flex items-center text-sm">
                  {user.lastSeen.toLocaleDateString()} {user.lastSeen.toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 pt-4">
            <Button 
              type="submit" 
              className="inline-flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Update User
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/users")}
              disabled={loading}
            >
              Back to Users
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}