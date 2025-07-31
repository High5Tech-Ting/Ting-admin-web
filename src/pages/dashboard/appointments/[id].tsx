import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Calendar, Clock, MapPin, User, MessageSquare, Send, Loader2 } from "lucide-react";
import { getAppointment, addAppointmentMessage, updateAppointment } from "@/firebase/firestore";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import type { Appointment } from "@/firebase/firestore";

export default function AppointmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    location: string;
    lecturerName: string;
  } | null>(null);

  useEffect(() => {
    const loadAppointment = async () => {
      if (!id) return;
      
      try {
        const appointmentData = await getAppointment(id);
        setAppointment(appointmentData);
        setFormData({
          title: appointmentData.title,
          description: appointmentData.description,
          location: appointmentData.location,
          lecturerName: appointmentData.lecturerName || "",
        });
      } catch (error) {
        console.error("Error loading appointment:", error);
        toast.error("Failed to load appointment details");
      } finally {
        setLoading(false);
      }
    };

    loadAppointment();
  }, [id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !appointment || !currentUser || !appointment.id) return;

    setSendingMessage(true);
    try {
      const message = {
        appointmentId: appointment.id,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email || "User",
        message: newMessage.trim(),
        isFromLecturer: false, // assuming student is sending
        createdAt: new Date(),
      };

      await addAppointmentMessage(appointment.id, message);
      
      // Update local state
      setAppointment({
        ...appointment,
        messages: [...(appointment.messages || []), message]
      });
      
      setNewMessage("");
      toast.success("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleStatusChange = async (newStatus: "pending" | "confirmed" | "completed" | "cancelled") => {
    if (!appointment || !appointment.id) return;

    setUpdatingStatus(true);
    try {
      await updateAppointment(appointment.id, { status: newStatus });
      setAppointment({ ...appointment, status: newStatus });
      toast.success(`Appointment status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update appointment status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const saveChanges = async () => {
    if (!appointment || !formData || !appointment.id) return;

    try {
      await updateAppointment(appointment.id, {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        lecturerName: formData.lecturerName,
      });
      
      setAppointment({
        ...appointment,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        lecturerName: formData.lecturerName,
      });
      
      setIsEditing(false);
      toast.success("Appointment updated successfully");
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update appointment");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-lg text-muted-foreground">Appointment not found</p>
        <Button onClick={() => navigate("/dashboard/appointments")}>
          Back to Appointments
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white space-y-6">
      {/* Breadcrumb & Header */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard/appointments">Appointments</Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>{appointment.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="icon"
            onClick={() => navigate(-1)}
            className="bg-black hover:bg-gray-800 text-white cursor-pointer"
          >
            <ChevronLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{appointment.title}</h1>
            <Badge className={`${getStatusColor(appointment.status)} mt-1`}>
              {appointment.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" disabled={updatingStatus}>
                    {updatingStatus ? (
                      <>
                        <Loader2 size={16} className="animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      "Update Status"
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup 
                    value={appointment.status} 
                    onValueChange={(value) => handleStatusChange(value as "pending" | "confirmed" | "completed" | "cancelled")}
                  >
                    <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="confirmed">Confirmed</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="cancelled">Cancelled</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    title: appointment.title,
                    description: appointment.description,
                    location: appointment.location,
                    lecturerName: appointment.lecturerName || "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button onClick={saveChanges}>Save</Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Appointment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Title</span>
                  {isEditing ? (
                    <Input
                      value={formData?.title || ""}
                      onChange={(e) => setFormData(formData ? { ...formData, title: e.target.value } : null)}
                    />
                  ) : (
                    <span className="text-base flex items-center gap-2">
                      {appointment.title}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Date & Time</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-base">
                      {appointment.appointmentDate.toLocaleDateString()} - {appointment.timeSlot}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Location</span>
                  {isEditing ? (
                    <Input
                      value={formData?.location || ""}
                      onChange={(e) => setFormData(formData ? { ...formData, location: e.target.value } : null)}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-base">{appointment.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Lecturer</span>
                  {isEditing ? (
                    <Input
                      value={formData?.lecturerName || ""}
                      onChange={(e) => setFormData(formData ? { ...formData, lecturerName: e.target.value } : null)}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-base">{appointment.lecturerName || "TBD"}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col md:col-span-2">
                  <span className="text-sm text-muted-foreground">Description</span>
                  {isEditing ? (
                    <Textarea
                      className="mt-1"
                      value={formData?.description || ""}
                      onChange={(e) => setFormData(formData ? { ...formData, description: e.target.value } : null)}
                    />
                  ) : (
                    <span className="text-base mt-1">{appointment.description}</span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Messages Section */}
          <Card className="mt-6">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages ({appointment.messages?.length || 0})
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {appointment.messages && appointment.messages.length > 0 ? (
                  appointment.messages.map((message, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{message.senderName}</span>
                          <span className="text-xs text-muted-foreground">
                            {message.createdAt.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No messages yet. Start a conversation!
                  </p>
                )}
              </div>

              {/* Send Message */}
              <div className="flex gap-2 mt-4">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 min-h-[80px]"
                  disabled={sendingMessage}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendingMessage}
                  size="icon"
                  className="self-end"
                >
                  {sendingMessage ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {appointment.status !== "cancelled" && (
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => handleStatusChange("cancelled")}
                    disabled={updatingStatus}
                  >
                    Cancel Appointment
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-muted-foreground">
                    {appointment.createdAt?.toLocaleDateString()}
                  </p>
                </div>
                
                {appointment.updatedAt && (
                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-muted-foreground">
                      {appointment.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
