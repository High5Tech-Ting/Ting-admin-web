import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  // form states
  const [status, setStatus] = useState("Open");
  const [priority, setPriority] = useState("High");
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [attachments, setAttachments] = useState<FileList | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Sample messages for demonstration
  const messages = [
    {
      avatar: "https://static.vecteezy.com/system/resources/previews/048/216/761/non_2x/modern-male-avatar-with-black-hair-and-hoodie-illustration-free-png.png",
      author: "Alex Chamara",
      time: "27/07/2025 10:00 AM",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      subject: "Inquiry about final project",
    },
    {
      avatar: "https://img.freepik.com/free-vector/support-worker_1212-32.jpg",
      author: "Support Team",
      time: "27/07/2025 10:15 AM",
      body: "Thank you for reaching out. The project requirements are...",
      subject: "Re: Inquiry about final project",
    },
  ];

  const auditRecords = [
    { timestamp: "Jan 15, 2024 10:00 AM", actor: "System",     field: "Ticket Created", oldValue: "N/A",           newValue: "Open" },
    { timestamp: "Jan 15, 2024 10:15 AM", actor: "System",     field: "Assigned To",    oldValue: "N/A",           newValue: "Support Team" },
    { timestamp: "Jan 15, 2024 11:00 AM", actor: "Support Team", field: "Status",         oldValue: "Open",          newValue: "In Progress" },
  ];

  return (
    <div className="p-6 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Left column: breadcrumb, header, filters, tabs, messages */}
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
                  <Link to="/dashboard/tickets/list">Tickets List</Link>
                </BreadcrumbLink>
                <BreadcrumbSeparator />
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbPage>#{id}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header + selectors */}
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Ticket #{id}</h1>
              <p className="text-sm text-muted-foreground">
                Created by Ethan Carter on Jan 15, 2024
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="status-select" className="text-sm font-medium">
                Status
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Open", "In Progress", "Closed"].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="space-y-2">
                    {["Open", "In Progress", "Closed"].map((s) => (
                      <Button
                        key={s}
                        variant="ghost"
                        onClick={() => setStatus(s)}
                        className="w-full text-left"
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="priority-select" className="text-sm font-medium">
                Priority
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {["High", "Medium", "Low"].map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="space-y-2">
                    {["High", "Medium", "Low"].map((p) => (
                      <Button
                        key={p}
                        variant="ghost"
                        onClick={() => setPriority(p)}
                        className="w-full text-left"
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Tabs + content */}
          <Tabs defaultValue="messages">
            <TabsList className="border-b border-[#dde1e3]">
              <TabsTrigger
                value="messages"
                className="mx-2 data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
              >
                Messages
              </TabsTrigger>
              <TabsTrigger
                value="tasks"
                className="mx-2 data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
              >
                Tasks & Checklists
              </TabsTrigger>
              <TabsTrigger
                value="audit"
                className="mx-2 data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
              >
                Audit Trail
              </TabsTrigger>
              <TabsTrigger
                value="attachments"
                className="mx-2 data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
              >
                Attachments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="messages" className="space-y-4">
              {messages.map((msg, idx) => (
                <Card key={idx} className="flex gap-4 p-4">
                  <Avatar>
                    <AvatarImage src={msg.avatar} alt={msg.author} />
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{msg.author}</p>
                    <p className="text-sm text-muted-foreground">{msg.time}</p>
                    <p className="mt-2">{msg.body}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Subject: {msg.subject}
                    </p>
                  </div>
                </Card>
              ))}

              {/* New Message button & dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-4">Send Message</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Message</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Title"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                    <RichTextEditor
                      value={newBody}
                      onChange={setNewBody}
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Attach Files
                      </Button>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        ref={fileInputRef}
                        onChange={(e) => setAttachments(e.target.files)}
                      />
                    </div>
                    {attachments && (
                      <ul className="space-y-1">
                        {Array.from(attachments).map((file) => (
                          <li key={file.name} className="flex items-center gap-2 text-sm">
                            <span>📎</span>
                            <span>{file.name}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => {
                        // TODO: send newTitle, newBody, attachments to backend
                        setNewTitle("");
                        setNewBody("");
                        setAttachments(null);
                      }}
                      disabled={!newTitle || !newBody}
                    >
                      Send
                    </Button>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="resolution">{/* ... */}</TabsContent>
            <TabsContent value="tasks">{/* ... */}</TabsContent>
            <TabsContent value="audit" className="space-y-4">
              <div className="py-3">
                <div className="overflow-auto rounded-xl border border-[#dde1e3] bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Actor</TableHead>
                        <TableHead>Field</TableHead>
                        <TableHead>Old Value</TableHead>
                        <TableHead>New Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditRecords.map((rec, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{rec.timestamp}</TableCell>
                          <TableCell>{rec.actor}</TableCell>
                          <TableCell>{rec.field}</TableCell>
                          <TableCell>{rec.oldValue}</TableCell>
                          <TableCell>{rec.newValue}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="attachments">{/* ... */}</TabsContent>
          </Tabs>
        </div>

        {/* Right column: ticket info panel */}
        <Card className="space-y-4 p-4 lg:sticky lg:top-6 lg:self-start">
          <Section title="Ticket Information">
            <Row label="Ticket ID" value={`#${id}`} />
            <Row label="Created At" value="Jan 15, 2024 10:00 AM" />
            <Row label="Status" value={status} />
            <Row label="Priority" value={priority} />
          </Section>
          <Section title="Student Information">
            <Row label="Name" value="Ethan Carter" />
            <Row label="Email" value="ethan.carter@example.com" />
            <Row label="Student ID" value="STU12345" />
          </Section>
          <Section title="Assignment Information">
            <Row label="Course" value="Introduction to Programming" />
            <Row label="Assignment" value="Final Project" />
            <Row label="Due Date" value="Feb 28, 2024" />
          </Section>
          <Section title="Quick Actions">
            <Button className="w-full">Close Ticket</Button>
            <Button className="w-full">Reassign Ticket</Button>
          </Section>
          <Section title="SLA Details">
            <Row label="Response Time" value="Within 2 hours" />
            <Row label="Resolution Time" value="Within 24 hours" />
          </Section>
        </Card>
      </div>
    </div>
  );
}

// helper components
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[30%_1fr] gap-x-4 py-1 border-t">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
