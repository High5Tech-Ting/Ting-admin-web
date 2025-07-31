import { useState, useEffect, useCallback } from 'react';
import { 
  getUsers, 
  getSupportTickets, 
  getEvents, 
  getAppointments,
  getUserById,
  getSupportTicketById,
  getTicketStats,
  getUserStats,
} from '../firebase/firestore';
import type {
  User,
  SupportTicket,
  Event,
  Appointment
} from '../firebase/firestore';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

// Hook for fetching users with pagination
export const useUsers = (userType?: string, pageSize: number = 10) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | undefined>();
  const [hasMore, setHasMore] = useState(true);

  const fetchUsers = useCallback(async (reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const { users: newUsers, lastDoc: newLastDoc } = await getUsers(
        userType, 
        pageSize, 
        reset ? undefined : lastDoc
      );
      
      if (reset) {
        setUsers(newUsers);
      } else {
        setUsers(prev => [...prev, ...newUsers]);
      }
      
      setLastDoc(newLastDoc);
      setHasMore(newUsers.length === pageSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [userType, pageSize, lastDoc]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchUsers(false);
    }
  };

  const refresh = () => {
    setLastDoc(undefined);
    fetchUsers(true);
  };

  useEffect(() => {
    fetchUsers(true);
  }, [userType, pageSize]);

  return { users, loading, error, hasMore, loadMore, refresh };
};

// Hook for fetching a single user
export const useUser = (uid: string | null) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await getUserById(uid);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [uid]);

  return { user, loading, error };
};

// Hook for fetching support tickets with pagination
export const useSupportTickets = (status?: string, pageSize: number = 10) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | undefined>();
  const [hasMore, setHasMore] = useState(true);

  const fetchTickets = useCallback(async (reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const { tickets: newTickets, lastDoc: newLastDoc } = await getSupportTickets(
        status, 
        pageSize, 
        reset ? undefined : lastDoc
      );
      
      if (reset) {
        setTickets(newTickets);
      } else {
        setTickets(prev => [...prev, ...newTickets]);
      }
      
      setLastDoc(newLastDoc);
      setHasMore(newTickets.length === pageSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  }, [status, pageSize, lastDoc]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchTickets(false);
    }
  };

  const refresh = () => {
    setLastDoc(undefined);
    fetchTickets(true);
  };

  useEffect(() => {
    fetchTickets(true);
  }, [status, pageSize]);

  return { tickets, loading, error, hasMore, loadMore, refresh };
};

// Hook for fetching a single support ticket
export const useSupportTicket = (ticketId: string | null) => {
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticketId) {
      setTicket(null);
      setLoading(false);
      return;
    }

    const fetchTicket = async () => {
      try {
        setLoading(true);
        setError(null);
        const ticketData = await getSupportTicketById(ticketId);
        setTicket(ticketData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch ticket');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  return { ticket, loading, error };
};

// Hook for fetching events with pagination
export const useEvents = (pageSize: number = 10) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | undefined>();
  const [hasMore, setHasMore] = useState(true);

  const fetchEvents = useCallback(async (reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const { events: newEvents, lastDoc: newLastDoc } = await getEvents(
        pageSize, 
        reset ? undefined : lastDoc
      );
      
      if (reset) {
        setEvents(newEvents);
      } else {
        setEvents(prev => [...prev, ...newEvents]);
      }
      
      setLastDoc(newLastDoc);
      setHasMore(newEvents.length === pageSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [pageSize, lastDoc]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchEvents(false);
    }
  };

  const refresh = () => {
    setLastDoc(undefined);
    fetchEvents(true);
  };

  useEffect(() => {
    fetchEvents(true);
  }, [pageSize]);

  return { events, loading, error, hasMore, loadMore, refresh };
};

// Hook for fetching appointments with pagination
export const useAppointments = (userId?: string, status?: string, pageSize: number = 10) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | undefined>();
  const [hasMore, setHasMore] = useState(true);

  const fetchAppointments = useCallback(async (reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const { appointments: newAppointments, lastDoc: newLastDoc } = await getAppointments(
        userId,
        status, 
        pageSize, 
        reset ? undefined : lastDoc
      );
      
      if (reset) {
        setAppointments(newAppointments);
      } else {
        setAppointments(prev => [...prev, ...newAppointments]);
      }
      
      setLastDoc(newLastDoc);
      setHasMore(newAppointments.length === pageSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  }, [userId, status, pageSize, lastDoc]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchAppointments(false);
    }
  };

  const refresh = () => {
    setLastDoc(undefined);
    fetchAppointments(true);
  };

  useEffect(() => {
    fetchAppointments(true);
  }, [userId, status, pageSize]);

  return { appointments, loading, error, hasMore, loadMore, refresh };
};

// Hook for fetching dashboard stats
export const useDashboardStats = () => {
  const [stats, setStats] = useState<{
    tickets: {
      total: number;
      pending: number;
      assigned: number;
      closed: number;
      open: number;
    };
    users: {
      total: number;
      students: number;
      staff: number;
      lecturers: number;
      admins: number;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [ticketStats, userStats] = await Promise.all([
          getTicketStats(),
          getUserStats()
        ]);
        
        setStats({
          tickets: ticketStats,
          users: userStats
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};
