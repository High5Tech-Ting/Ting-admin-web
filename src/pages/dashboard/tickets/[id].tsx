import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Send, 
  Loader2, 
  User, 
  MessageSquare,
  Settings
} from "lucide-react";
import { useSupportTicket, useUser } from "@/hooks/useFirestore";
import { updateSupportTicket, addTicketMessage } from "@/firebase/firestore";
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

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { ticket, loading: ticketLoading, error } = useSupportTicket(id || null);
  const { user: ticketCreator } = useUser(ticket?.userId || null);
  
  // Debug logging
  console.log("Ticket Detail Debug:", { id, ticket, ticketLoading, error });
  
  const [newMessage, setNewMessage] = useState("");
  const [newStatus, setNewStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [assignedTo, setAssignedTo] = useState("");

  useEffect(() => {
    if (ticket) {
      setNewStatus(ticket.status);
      setAssignedTo(ticket.assignedTo || "");
    }
  }, [ticket]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !id || !currentUser) return;

    setLoading(true);
    try {
      await addTicketMessage(id, {
        ticketId: id,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email || "Unknown User",
        message: newMessage.trim(),
        isFromAdmin: true, // Assuming dashboard users are admins/staff
      });
      
      setNewMessage("");
      toast.success("Message sent successfully");
      
      // Refresh page to show new message
      window.location.reload();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!id || !ticket || newStatus === ticket.status) return;

    setLoading(true);
    try {
      const updateData: Record<string, unknown> = {
        status: newStatus,
      };

      if (assignedTo && assignedTo !== ticket.assignedTo) {
        updateData.assignedTo = assignedTo;
        updateData.assignedAt = new Date();
        updateData.assignedToName = assignedTo; // You might want to get actual name
      }

      await updateSupportTicket(id, updateData);
      toast.success("Ticket updated successfully");
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast.error("Failed to update ticket");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'assigned':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (ticketLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading ticket...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading ticket</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <p className="text-xs text-muted-foreground mt-2">Ticket ID: {id}</p>
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard/tickets/list")} 
            className="mt-4"
          >
            Back to Tickets
          </Button>
        </div>
      </div>
    );
  }

  if (!ticket && !ticketLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Ticket not found</p>
          <p className="text-sm text-muted-foreground">The ticket with ID "{id}" does not exist.</p>
          <p className="text-xs text-muted-foreground mt-2">Please check the URL or contact support.</p>
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard/tickets/list")} 
            className="mt-4"
          >
            Back to Tickets
          </Button>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Ticket not found</p>
          <p className="text-sm text-muted-foreground">The ticket with ID "{id}" does not exist.</p>
          <p className="text-xs text-muted-foreground mt-2">Please check the URL or contact support.</p>
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard/tickets/list")} 
            className="mt-4"
          >
            Back to Tickets
          </Button>
        </div>
      </div>
    );
  }

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
            <BreadcrumbPage>{ticket.id?.slice(-8).toUpperCase()}</BreadcrumbPage>
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
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{ticket.title}</h1>
          <p className="text-muted-foreground">
            Ticket #{ticket.id?.slice(-8).toUpperCase()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Description */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {ticket.description}
            </p>
            {ticket.imageUrl && (
              <div className="mt-4">
                <img 
                  src={ticket.imageUrl} 
                  alt="Ticket attachment" 
                  className="max-w-full h-auto rounded-md border"
                />
              </div>
            )}
          </Card>

          {/* Messages */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageSquare size={20} />
              Messages ({ticket.messages?.length || 0})
            </h3>
            
            <div className="space-y-4 mb-6">
              {ticket.messages && ticket.messages.length > 0 ? (
                ticket.messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`p-4 rounded-lg ${
                      message.isFromAdmin ? 'bg-blue-50 ml-8' : 'bg-gray-50 mr-8'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        message.isFromAdmin ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-800'
                      }`}>
                        {message.senderName?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {message.senderName || 'Unknown User'}
                          {message.isFromAdmin && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              Staff
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {message.createdAt.toLocaleDateString()} {message.createdAt.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No messages yet
                </p>
              )}
            </div>

            {/* Reply Form */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Add Reply</h4>
              <div className="space-y-3">
                <Textarea
                  placeholder="Type your reply..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={4}
                  disabled={loading}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Reply
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Status */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings size={20} />
              Ticket Status
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full h-9 rounded-md border bg-transparent px-3 py-1"
                  disabled={loading}
                >
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Assign To</label>
                <Input
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="Enter staff email or ID"
                  disabled={loading}
                />
              </div>

              <Button 
                onClick={handleStatusUpdate}
                disabled={loading || (newStatus === ticket.status && assignedTo === ticket.assignedTo)}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  'Update Ticket'
                )}
              </Button>
            </div>
          </Card>

          {/* Ticket Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User size={20} />
              Ticket Information
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                  {ticket.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{ticket.createdAt.toLocaleDateString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated:</span>
                <span>{ticket.updatedAt.toLocaleDateString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Creator:</span>
                <span>{ticketCreator?.displayName || 'Unknown'}</span>
              </div>

              {ticket.assignedToName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assigned to:</span>
                  <span>{ticket.assignedToName}</span>
                </div>
              )}

              {ticket.assignedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assigned:</span>
                  <span>{ticket.assignedAt.toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
