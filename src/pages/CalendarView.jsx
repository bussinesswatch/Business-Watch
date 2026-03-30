import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertCircle, CheckCircle, Plus } from 'lucide-react';
import { useData } from '../hooks/useData';

export default function CalendarView() {
  const { bids, tenders } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // month, week, day

  const events = useMemo(() => {
    const allEvents = [];
    
    // Add bid submission deadlines
    bids.forEach(bid => {
      if (bid.submission_deadline) {
        allEvents.push({
          id: `bid-${bid.id}`,
          title: bid.tender_title || bid.title || 'Bid Due',
          date: new Date(bid.submission_deadline),
          type: 'deadline',
          status: bid.status || 'Pending',
          amount: bid.bid_amount
        });
      }
      if (bid.bid_opening_date) {
        allEvents.push({
          id: `opening-${bid.id}`,
          title: `Opening: ${bid.tender_title || bid.title}`,
          date: new Date(bid.bid_opening_date),
          type: 'opening',
          status: bid.status
        });
      }
    });
    
    // Add tender deadlines
    tenders.forEach(tender => {
      if (tender.submission_deadline) {
        allEvents.push({
          id: `tender-${tender.id}`,
          title: tender.title,
          date: new Date(tender.submission_deadline),
          type: 'tender',
          status: tender.status
        });
      }
    });
    
    return allEvents.sort((a, b) => a.date - b.date);
  }, [bids, tenders]);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === date &&
             eventDate.getMonth() === currentDate.getMonth() &&
             eventDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const today = new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar View</h1>
          <p className="text-gray-500 mt-1">Track deadlines and bid openings</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="btn btn-secondary"
          >
            Today
          </button>
          <div className="flex items-center bg-white rounded-lg border">
            <button 
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-l-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 font-medium min-w-[140px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button 
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-r-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-red-50 to-red-100">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-red-700">
                {events.filter(e => e.type === 'deadline' && e.date > today).length}
              </p>
              <p className="text-sm text-gray-600">Upcoming Deadlines</p>
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-blue-700">
                {events.filter(e => e.type === 'opening' && e.date > today).length}
              </p>
              <p className="text-sm text-gray-600">Bid Openings</p>
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
            <div>
              <p className="text-2xl font-bold text-emerald-700">
                {events.filter(e => e.date < today).length}
              </p>
              <p className="text-sm text-gray-600">Past Events</p>
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-purple-700">{events.length}</p>
              <p className="text-sm text-gray-600">Total Events</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 card">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for previous month */}
            {[...Array(firstDayOfMonth)].map((_, i) => (
              <div key={`empty-${i}`} className="h-24 bg-gray-50 rounded-lg" />
            ))}

            {/* Days */}
            {[...Array(daysInMonth)].map((_, i) => {
              const date = i + 1;
              const dayEvents = getEventsForDate(date);
              const isToday = today.getDate() === date && 
                             today.getMonth() === currentDate.getMonth() &&
                             today.getFullYear() === currentDate.getFullYear();
              const isSelected = selectedDate === date;

              return (
                <div 
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`h-24 border rounded-lg p-2 cursor-pointer transition-colors ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 
                    isToday ? 'border-emerald-500 bg-emerald-50' : 
                    'hover:bg-gray-50'
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'text-emerald-700' : 'text-gray-700'
                  }`}>
                    {date}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event, idx) => (
                      <div 
                        key={idx}
                        className={`text-xs px-2 py-1 rounded truncate ${
                          event.type === 'deadline' ? 'bg-red-100 text-red-700' :
                          event.type === 'opening' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {event.title.substring(0, 20)}...
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 px-2">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar - Selected Date Events */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">
            {selectedDate ? (
              <>
                Events for {monthNames[currentDate.getMonth()]} {selectedDate}
              </>
            ) : (
              'Upcoming Events'
            )}
          </h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {(selectedDate ? getEventsForDate(selectedDate) : events.slice(0, 10)).map(event => (
              <div 
                key={event.id}
                className={`p-3 rounded-lg border-l-4 ${
                  event.type === 'deadline' ? 'bg-red-50 border-red-500' :
                  event.type === 'opening' ? 'bg-blue-50 border-blue-500' :
                  'bg-amber-50 border-amber-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(event.date).toLocaleDateString()} at{' '}
                      {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {event.amount && (
                      <p className="text-xs font-medium text-emerald-600 mt-1">
                        MVR {event.amount.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    event.type === 'deadline' ? 'bg-red-100 text-red-700' :
                    event.type === 'opening' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {event.type}
                  </span>
                </div>
              </div>
            ))}

            {(selectedDate ? getEventsForDate(selectedDate) : events.slice(0, 10)).length === 0 && (
              <p className="text-gray-500 text-center py-8">No events scheduled</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
