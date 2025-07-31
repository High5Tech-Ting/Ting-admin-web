import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  Timestamp,
  serverTimestamp,
  writeBatch,
  arrayUnion,
} from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./auth";
import app from "./config";

const db = getFirestore(app);

// Types based on the Firestore backup data
export interface User {
  uid: string;
  displayName: string;
  email: string;
  userType: 'student' | 'staff' | 'lecturer' | 'admin';
  createdAt: Date;
  lastUpdated?: Date;
  lastSeen?: Date;
  online?: boolean;
  
  // Student fields
  studentId?: string;
  academicYear?: number;
  batchNo?: string;
  course?: string;
  
  // Staff/Lecturer fields
  staffId?: string;
  lecturerId?: string;
  department?: string;
  position?: string;
  modules?: string[];
  
  // Profile
  photoURL?: string;
  profilePictureUrl?: string;
  fcmToken?: string;
  
  // Google Calendar integration
  googleCalendarAuthenticated?: boolean;
  googleCalendarAuthenticatedAt?: Date;
  googleCalendarRevokedAt?: Date;
}

export interface SupportTicket {
  id?: string;
  title: string;
  description: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  userId: string;
  assignedTo?: string;
  assignedToName?: string;
  assignedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id?: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  message: string;
  isFromAdmin: boolean;
  createdAt: Date;
}

export interface Event {
  id?: string;
  title: string;
  description: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  status: 'active' | 'inactive' | 'cancelled';
  batchNo: string;
  createdBy: string;
}

export interface Appointment {
  id?: string;
  title: string;
  description: string;
  appointmentDate: Date;
  timeSlot: string;
  location: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  userId: string;
  lecturerId?: string;
  lecturerName?: string;
  createdAt: Date;
  updatedAt: Date;
  messages?: AppointmentMessage[];
}

export interface AppointmentMessage {
  id?: string;
  appointmentId: string;
  senderId: string;
  senderName: string;
  message: string;
  isFromLecturer: boolean;
  createdAt: Date;
}

// Utility function to convert Firestore timestamps
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp && timestamp.seconds) {
    return new Date(timestamp.seconds * 1000);
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  return new Date();
};

// USER MANAGEMENT FUNCTIONS
export const getUsers = async (
  userType?: string,
  pageSize: number = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ users: User[]; lastDoc?: QueryDocumentSnapshot<DocumentData> }> => {
  try {
    let q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    
    if (userType && userType !== 'all') {
      q = query(q, where("userType", "==", userType));
    }
    
    if (pageSize) {
      q = query(q, limit(pageSize));
    }
    
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    
    const querySnapshot = await getDocs(q);
    const users: User[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        uid: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        lastUpdated: data.lastUpdated ? convertTimestamp(data.lastUpdated) : undefined,
        lastSeen: data.lastSeen ? convertTimestamp(data.lastSeen) : undefined,
        googleCalendarAuthenticatedAt: data.googleCalendarAuthenticatedAt ? 
          convertTimestamp(data.googleCalendarAuthenticatedAt) : undefined,
        googleCalendarRevokedAt: data.googleCalendarRevokedAt ? 
          convertTimestamp(data.googleCalendarRevokedAt) : undefined,
      } as User);
    });
    
    const lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    return { users, lastDoc: lastDocument };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUserById = async (uid: string): Promise<User | null> => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        uid: docSnap.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        lastUpdated: data.lastUpdated ? convertTimestamp(data.lastUpdated) : undefined,
        lastSeen: data.lastSeen ? convertTimestamp(data.lastSeen) : undefined,
        googleCalendarAuthenticatedAt: data.googleCalendarAuthenticatedAt ? 
          convertTimestamp(data.googleCalendarAuthenticatedAt) : undefined,
        googleCalendarRevokedAt: data.googleCalendarRevokedAt ? 
          convertTimestamp(data.googleCalendarRevokedAt) : undefined,
      } as User;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const createUser = async (userData: Omit<User, 'uid' | 'createdAt'> & { password: string }): Promise<User> => {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    
    // Update display name
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: userData.displayName
      });
    }
    
    // Create Firestore document
    const { password, ...firestoreData } = userData;
    const newUser: Omit<User, 'uid'> = {
      ...firestoreData,
      createdAt: new Date(),
      lastUpdated: new Date(),
    };
    
    await setDoc(doc(db, "users", userCredential.user.uid), {
      ...newUser,
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
    });
    
    return {
      uid: userCredential.user.uid,
      ...newUser,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (uid: string, userData: Partial<User>): Promise<void> => {
  try {
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, {
      ...userData,
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (uid: string): Promise<void> => {
  try {
    const docRef = doc(db, "users", uid);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// SUPPORT TICKET FUNCTIONS
export const getSupportTickets = async (
  status?: string,
  pageSize: number = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ tickets: SupportTicket[]; lastDoc?: QueryDocumentSnapshot<DocumentData> }> => {
  try {
    let q = query(collection(db, "support_tickets"), orderBy("createdAt", "desc"));
    
    if (status && status !== 'all') {
      q = query(q, where("status", "==", status));
    }
    
    if (pageSize) {
      q = query(q, limit(pageSize));
    }
    
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    
    const querySnapshot = await getDocs(q);
    const tickets: SupportTicket[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Convert messages if they exist
      const messages: TicketMessage[] = [];
      if (data.messages) {
        Object.keys(data.messages).forEach((messageId) => {
          const messageData = data.messages[messageId];
          messages.push({
            id: messageId,
            ...messageData,
            createdAt: convertTimestamp(messageData.createdAt),
          });
        });
      }
      
      tickets.push({
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        assignedAt: data.assignedAt ? convertTimestamp(data.assignedAt) : undefined,
        messages: messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
      } as SupportTicket);
    });
    
    const lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    return { tickets, lastDoc: lastDocument };
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    throw error;
  }
};

export const getSupportTicketById = async (ticketId: string): Promise<SupportTicket | null> => {
  try {
    const docRef = doc(db, "support_tickets", ticketId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Convert messages if they exist
      const messages: TicketMessage[] = [];
      if (data.messages) {
        Object.keys(data.messages).forEach((messageId) => {
          const messageData = data.messages[messageId];
          messages.push({
            id: messageId,
            ...messageData,
            createdAt: convertTimestamp(messageData.createdAt),
          });
        });
      }
      
      return {
        id: docSnap.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        assignedAt: data.assignedAt ? convertTimestamp(data.assignedAt) : undefined,
        messages: messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
      } as SupportTicket;
    }
    return null;
  } catch (error) {
    console.error("Error fetching support ticket:", error);
    throw error;
  }
};

export const createSupportTicket = async (ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>): Promise<SupportTicket> => {
  try {
    const newTicket = {
      ...ticketData,
      status: 'pending' as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, "support_tickets"), newTicket);
    
    return {
      id: docRef.id,
      ...ticketData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Error creating support ticket:", error);
    throw error;
  }
};

export const updateSupportTicket = async (ticketId: string, ticketData: Partial<SupportTicket>): Promise<void> => {
  try {
    const docRef = doc(db, "support_tickets", ticketId);
    await updateDoc(docRef, {
      ...ticketData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating support ticket:", error);
    throw error;
  }
};

export const deleteSupportTicket = async (ticketId: string): Promise<void> => {
  try {
    const docRef = doc(db, "support_tickets", ticketId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting support ticket:", error);
    throw error;
  }
};

export const addTicketMessage = async (
  ticketId: string, 
  messageData: Omit<TicketMessage, 'id' | 'createdAt'>
): Promise<void> => {
  try {
    const batch = writeBatch(db);
    
    // Add message to ticket's messages subcollection
    const messageRef = doc(collection(db, "support_tickets", ticketId, "messages"));
    const newMessage = {
      ...messageData,
      createdAt: serverTimestamp(),
    };
    
    batch.set(messageRef, newMessage);
    
    // Update ticket's updatedAt timestamp
    const ticketRef = doc(db, "support_tickets", ticketId);
    batch.update(ticketRef, {
      updatedAt: serverTimestamp(),
    });
    
    await batch.commit();
  } catch (error) {
    console.error("Error adding ticket message:", error);
    throw error;
  }
};

// EVENT FUNCTIONS
export const getEvents = async (
  pageSize: number = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ events: Event[]; lastDoc?: QueryDocumentSnapshot<DocumentData> }> => {
  try {
    let q = query(collection(db, "events"), orderBy("date", "desc"));
    
    if (pageSize) {
      q = query(q, limit(pageSize));
    }
    
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    
    const querySnapshot = await getDocs(q);
    const events: Event[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      events.push({
        id: doc.id,
        ...data,
        date: convertTimestamp(data.date),
        startTime: convertTimestamp(data.startTime),
        endTime: convertTimestamp(data.endTime),
      } as Event);
    });
    
    const lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    return { events, lastDoc: lastDocument };
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const createEvent = async (eventData: Omit<Event, 'id'>): Promise<Event> => {
  try {
    const newEvent = {
      ...eventData,
      date: Timestamp.fromDate(eventData.date),
      startTime: Timestamp.fromDate(eventData.startTime),
      endTime: Timestamp.fromDate(eventData.endTime),
    };
    
    const docRef = await addDoc(collection(db, "events"), newEvent);
    
    return {
      id: docRef.id,
      ...eventData,
    };
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const updateEvent = async (eventId: string, eventData: Partial<Event>): Promise<void> => {
  try {
    const docRef = doc(db, "events", eventId);
    const updateData: any = { ...eventData };

    if (eventData.date) {
      updateData.date = Timestamp.fromDate(eventData.date);
    }
    if (eventData.startTime) {
      updateData.startTime = Timestamp.fromDate(eventData.startTime);
    }
    if (eventData.endTime) {
      updateData.endTime = Timestamp.fromDate(eventData.endTime);
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    const docRef = doc(db, "events", eventId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

// APPOINTMENT FUNCTIONS
export const getAppointment = async (appointmentId: string): Promise<Appointment> => {
  const appointmentRef = doc(db, 'appointments', appointmentId);
  const appointmentSnap = await getDoc(appointmentRef);
  
  if (!appointmentSnap.exists()) {
    throw new Error('Appointment not found');
  }
  
  const data = appointmentSnap.data();
  return {
    id: appointmentSnap.id,
    title: data.title,
    description: data.description,
    appointmentDate: convertTimestamp(data.appointmentDate),
    timeSlot: data.timeSlot,
    location: data.location,
    status: data.status,
    userId: data.userId,
    lecturerId: data.lecturerId,
    lecturerName: data.lecturerName,
    messages: data.messages?.map((msg: DocumentData) => ({
      ...msg,
      createdAt: convertTimestamp(msg.createdAt)
    })) || [],
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt),
  };
};

export const addAppointmentMessage = async (appointmentId: string, message: Omit<AppointmentMessage, 'id'>): Promise<void> => {
  const appointmentRef = doc(db, 'appointments', appointmentId);
  const messageWithTimestamp = {
    ...message,
    createdAt: Timestamp.now(),
    id: Date.now().toString(), // Simple ID generation
  };
  
  await updateDoc(appointmentRef, {
    messages: arrayUnion(messageWithTimestamp),
    updatedAt: Timestamp.now(),
  });
};

export const getAppointments = async (
  userId?: string,
  status?: string,
  pageSize: number = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ appointments: Appointment[]; lastDoc?: QueryDocumentSnapshot<DocumentData> }> => {
  try {
    let q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
    
    if (userId) {
      q = query(q, where("userId", "==", userId));
    }
    
    if (status && status !== 'all') {
      q = query(q, where("status", "==", status));
    }
    
    if (pageSize) {
      q = query(q, limit(pageSize));
    }
    
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    
    const querySnapshot = await getDocs(q);
    const appointments: Appointment[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Convert messages if they exist
      const messages: AppointmentMessage[] = [];
      if (data.messages) {
        Object.keys(data.messages).forEach((messageId) => {
          const messageData = data.messages[messageId];
          messages.push({
            id: messageId,
            ...messageData,
            createdAt: convertTimestamp(messageData.createdAt),
          });
        });
      }
      
      appointments.push({
        id: doc.id,
        ...data,
        appointmentDate: convertTimestamp(data.appointmentDate),
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        messages: messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
      } as Appointment);
    });
    
    const lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    return { appointments, lastDoc: lastDocument };
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

export const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> => {
  try {
    const newAppointment = {
      ...appointmentData,
      appointmentDate: Timestamp.fromDate(appointmentData.appointmentDate),
      status: 'pending' as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, "appointments"), newAppointment);
    
    return {
      id: docRef.id,
      ...appointmentData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

export const updateAppointment = async (appointmentId: string, appointmentData: Partial<Appointment>): Promise<void> => {
  try {
    const docRef = doc(db, "appointments", appointmentId);
    const updateData: any = { ...appointmentData };
    
    if (appointmentData.appointmentDate) {
      updateData.appointmentDate = Timestamp.fromDate(appointmentData.appointmentDate);
    }
    
    updateData.updatedAt = serverTimestamp();
    
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};

export const deleteAppointment = async (appointmentId: string): Promise<void> => {
  try {
    const docRef = doc(db, "appointments", appointmentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  }
};

// UTILITY FUNCTIONS
export const getTicketStats = async () => {
  try {
    const ticketsRef = collection(db, "support_tickets");
    
    const [allTickets, pendingTickets, assignedTickets, closedTickets] = await Promise.all([
      getDocs(query(ticketsRef)),
      getDocs(query(ticketsRef, where("status", "==", "pending"))),
      getDocs(query(ticketsRef, where("status", "==", "assigned"))),
      getDocs(query(ticketsRef, where("status", "==", "closed"))),
    ]);
    
    return {
      total: allTickets.size,
      pending: pendingTickets.size,
      assigned: assignedTickets.size,
      closed: closedTickets.size,
      open: pendingTickets.size + assignedTickets.size,
    };
  } catch (error) {
    console.error("Error fetching ticket stats:", error);
    throw error;
  }
};

export const getUserStats = async () => {
  try {
    const usersRef = collection(db, "users");
    
    const [allUsers, students, staff, lecturers, admins] = await Promise.all([
      getDocs(query(usersRef)),
      getDocs(query(usersRef, where("userType", "==", "student"))),
      getDocs(query(usersRef, where("userType", "==", "staff"))),
      getDocs(query(usersRef, where("userType", "==", "lecturer"))),
      getDocs(query(usersRef, where("userType", "==", "admin"))),
    ]);
    
    return {
      total: allUsers.size,
      students: students.size,
      staff: staff.size,
      lecturers: lecturers.size,
      admins: admins.size,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
};
