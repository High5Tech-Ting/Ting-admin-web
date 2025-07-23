import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    name: "",
    email: "",
    phone: "",
    role: "",
    status: ""
  });

  // Simulated data fetching
  useEffect(() => {
    // In a real app, you'd fetch user data from your API
    const mockUserData = {
      id: id,
      username: "jennifer.hahn71",
      name: "Jennifer Hahn",
      email: "jennifer_bauch80@gmail.com",
      phone: "+17476514352",
      role: "Admin",
      status: "Active"
    };
    
    setFormData(mockUserData);
    setLoading(false);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically update the user data in your backend
    console.log("Form submitted:", formData);
    // Navigate back to the users list
    navigate("/dashboard/users");
  };

  const handleDelete = () => {
    // Show confirmation dialog
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      // Here you would typically delete the user from your backend
      console.log("Deleting user:", id);
      // Navigate back to the users list
      navigate("/dashboard/users");
    }
  };

  if (loading) {
    return <div className="p-4">Loading user data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/dashboard/users")}
        >
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Edit User</h1>
      </div>
      
      <div className="border rounded-md p-6 bg-card">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">Username</label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Full Name</label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full h-9 rounded-md border bg-transparent px-3 py-1"
                required
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Superadmin">Superadmin</option>
                <option value="Cashier">Cashier</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full h-9 rounded-md border bg-transparent px-3 py-1"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
                <option value="Invited">Invited</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Button 
              type="submit" 
              className="inline-flex items-center gap-2"
            >
              <Save size={16} />
              Update User
            </Button>
            
            <Button
              type="button"
              variant="destructive"
              className="inline-flex items-center gap-2"
              onClick={handleDelete}
            >
              <Trash2 size={16} />
              Delete User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}