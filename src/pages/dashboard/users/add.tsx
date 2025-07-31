import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { createUser } from "@/firebase/firestore";
import { toast } from "sonner";

export default function AddUserPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
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
    
    if (!formData.displayName || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    
    try {
      // Prepare user data based on user type
      const baseUserData = {
        displayName: formData.displayName,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
      };

      let userData;

      // Add type-specific fields
      switch (formData.userType) {
        case 'student':
          userData = {
            ...baseUserData,
            studentId: formData.studentId,
            academicYear: formData.academicYear,
            batchNo: formData.batchNo,
            course: formData.course,
          };
          break;
        case 'staff':
          userData = {
            ...baseUserData,
            staffId: formData.staffId,
            department: formData.department,
            position: formData.position,
          };
          break;
        case 'lecturer':
          userData = {
            ...baseUserData,
            lecturerId: formData.lecturerId,
            department: formData.department,
            modules: formData.modules,
          };
          break;
        case 'admin':
          userData = {
            ...baseUserData,
            department: formData.department,
            position: formData.position,
          };
          break;
        default:
          userData = baseUserData;
      }

      await createUser(userData);
      toast.success("User created successfully!");
      navigate("/dashboard/users");
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/dashboard/users")}
          disabled={loading}
        >
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Add New User</h1>
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
                placeholder="John Doe"
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
                placeholder="john.doe@example.com"
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password <span className="text-red-500">*</span>
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                disabled={loading}
                minLength={6}
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
          
          <div className="flex items-center gap-4">
            <Button 
              type="submit" 
              className="inline-flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save User
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/users")}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}