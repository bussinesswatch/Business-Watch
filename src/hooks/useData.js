import { useState, useEffect, useMemo } from 'react';

// Mock data for development - replace with actual API calls
const mockBids = [
  {
    id: 1,
    tender_title: 'Supply of Computer Equipment',
    title: 'Supply of Computer Equipment',
    authority: 'Ministry of Education',
    bid_amount: 150000,
    result: 'Won',
    status: 'Submitted',
    submission_deadline: '2026-04-15',
    category: 'IT Equipment'
  },
  {
    id: 2,
    tender_title: 'Office Furniture Supply',
    title: 'Office Furniture Supply',
    authority: 'Public Service Commission',
    bid_amount: 85000,
    result: 'Pending',
    status: 'Draft',
    submission_deadline: '2026-04-20',
    category: 'Furniture'
  },
  {
    id: 3,
    tender_title: 'Network Infrastructure',
    title: 'Network Infrastructure',
    authority: 'Housing Development Corporation',
    bid_amount: 250000,
    result: 'Lost',
    status: 'Submitted',
    submission_deadline: '2026-03-30',
    category: 'IT Infrastructure'
  }
];

const mockTenders = [
  {
    id: 1,
    title: 'Supply of Computer Equipment',
    authority: 'Ministry of Education',
    amount: 200000,
    submission_deadline: '2026-04-15',
    bid_opening_date: '2026-04-16',
    category: 'IT Equipment',
    status: 'Open'
  },
  {
    id: 2,
    title: 'Office Renovation Project',
    authority: 'Health Ministry',
    amount: 500000,
    submission_deadline: '2026-05-01',
    bid_opening_date: '2026-05-02',
    category: 'Construction',
    status: 'Open'
  },
  {
    id: 3,
    title: 'Vehicle Maintenance Services',
    authority: 'Police Service',
    amount: 120000,
    submission_deadline: '2026-04-10',
    bid_opening_date: '2026-04-11',
    category: 'Services',
    status: 'Closed'
  }
];

export function useData() {
  const [bids, setBids] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      try {
        setLoading(true);
        // In production, replace with actual API calls
        // const bidsData = await fetchBids();
        // const tendersData = await fetchTenders();
        
        setBids(mockBids);
        setTenders(mockTenders);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const refresh = () => {
    setLoading(true);
    // Reload data
    setTimeout(() => {
      setBids([...mockBids]);
      setTenders([...mockTenders]);
      setLoading(false);
    }, 500);
  };

  return {
    bids,
    tenders,
    loading,
    error,
    refresh
  };
}

export default useData;
