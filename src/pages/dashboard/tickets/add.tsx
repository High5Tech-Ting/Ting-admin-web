import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { createSupportTicket } from "@/firebase/firestore";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";

export default function AddTicketPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "technical",
    priority: "medium"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error("You must be logged in to create a ticket");
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const ticketData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category as "technical" | "billing" | "general",
        priority: formData.priority as "low" | "medium" | "high",
        status: "pending" as const,
        userId: currentUser.uid,
        userEmail: currentUser.email || "",
        userName: currentUser.displayName || currentUser.email || "Unknown User",
        imageUrl: "", // Can be extended to support file uploads
        messages: [],
      };

      const ticketId = await createSupportTicket(ticketData);
      toast.success("Ticket created successfully!");
      navigate(`/dashboard/tickets/${ticketId}`);
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Failed to create ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard/tickets">Tickets</Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard/tickets/list">List</Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>Create New</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/dashboard/tickets/list")}
        >
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Create New Ticket</h1>
      </div>

      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Brief description of the issue"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full h-9 rounded-md border bg-transparent px-3 py-1"
                disabled={loading}
              >
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium mb-2">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full h-9 rounded-md border bg-transparent px-3 py-1"
                disabled={loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Please provide detailed information about your issue..."
                rows={6}
                required
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Provide as much detail as possible to help us resolve your issue quickly
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              type="submit" 
              disabled={loading || !formData.title.trim() || !formData.description.trim()}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Create Ticket
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/tickets/list")}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>

      {/* Help Section */}
      <Card className="p-6 max-w-2xl">
        <h3 className="text-lg font-semibold mb-3">Need Help?</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Be specific about the issue you're experiencing</p>
          <p>• Include steps to reproduce the problem if applicable</p>
          <p>• Mention any error messages you've seen</p>
          <p>• Response times: High priority (2 hours), Medium priority (8 hours), Low priority (24 hours)</p>
        </div>
      </Card>
    </div>
  );
}
