import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save } from "lucide-react";

export default function AddUserPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    role: "User"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData);
    // Navigate back to the users list
    navigate("/dashboard/users");
  };

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
        <h1 className="text-2xl font-bold tracking-tight">Add New User</h1>
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
                placeholder="johndoe123"
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
                placeholder="John Doe"
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
                placeholder="john.doe@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1234567890"
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
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              type="submit" 
              className="inline-flex items-center gap-2"
            >
              <Save size={16} />
              Save User
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/users")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}