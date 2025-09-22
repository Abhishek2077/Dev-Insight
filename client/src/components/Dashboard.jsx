import { useEffect, useMemo, useState } from 'react';
import api from '../api/axiosConfig';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const FILTERS = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Current Week', value: 'currentWeek' },
  { label: 'Last Week', value: 'lastWeek' },
  { label: 'Last 7 Days', value: 'last7days' },
  { label: 'Current Month', value: 'currentMonth' },
  { label: 'Last Month', value: 'lastMonth' },
  { label: 'Last 30 Days', value: 'last30days' },
  { label: 'Last 3 Months', value: 'last3months' },
  { label: 'Last 6 Months', value: 'last6months' },
  { label: 'Last 1 Year', value: 'last1year' },
  { label: 'All Time', value: 'all' },
  { label: 'Custom Range', value: 'custom' },
];

function getDateRange(filter, customRange) {
  const now = new Date();
  let start, end;
  switch (filter) {
    case 'today':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      break;
    case 'yesterday':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);
      break;
    case 'currentWeek': {
      const day = now.getDay();
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      break;
    }
    case 'lastWeek': {
      const day = now.getDay();
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day - 1, 23, 59, 59, 999);
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day - 7);
      break;
    }
    case 'last7days':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      break;
    case 'currentMonth':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      break;
    case 'lastMonth':
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      break;
    case 'last30days':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      break;
    case 'last3months':
      start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      break;
    case 'last6months':
      start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      break;
    case 'last1year':
      start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      break;
    case 'all':
    case 'alltime':
      start = null;
      end = null;
      break;
    case 'custom':
      if (customRange && customRange.start && customRange.end) {
        start = new Date(customRange.start);
        end = new Date(customRange.end);
      } else {
        start = null;
        end = null;
      }
      break;
    default:
      start = null;
      end = null;
  }
  return { start, end };
}

function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState('currentWeek');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  // Auto-refresh every 10s for live updates
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get('/codingsessions');
        setSessions(response.data);
      } catch {}
    };
    fetchSessions();
    const interval = setInterval(fetchSessions, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredSessions = useMemo(() => {
    if (!sessions) return [];
    const { start, end } = getDateRange(filter, customRange);
    if (!start || !end) return sessions;
    return sessions.filter(s => {
      const d = new Date(s.startTime);
      return d >= start && d <= end;
    });
  }, [sessions, filter, customRange]);

  // Sessions per day for bar chart
  const chartData = useMemo(() => {
    if (!filteredSessions || filteredSessions.length === 0) {
      return [{ day: 'No Data', sessions: 0 }];
    }
    const dataByDay = {};
    filteredSessions.forEach(session => {
      const day = new Date(session.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      if (!dataByDay[day]) dataByDay[day] = { day, sessions: 0 };
      dataByDay[day].sessions += 1;
    });
    // Sort by day (for All/Year/Month, show in order)
    return Object.values(dataByDay);
  }, [filteredSessions]);

  const showNoData = !filteredSessions || filteredSessions.length === 0;

  return (
    <div className="card mt-8" style={{ background: 'linear-gradient(135deg, #18181b 0%, #232946 100%)', color: '#fff' }}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-3xl font-extrabold text-accent mb-2 md:mb-0 tracking-tight drop-shadow">Sessions Per Day</h2>
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <select
            className="border border-gray-700 rounded-lg px-4 py-2 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-accent bg-gray-900 text-accent shadow"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            {FILTERS.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          {filter === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="border border-gray-700 rounded px-2 py-1 bg-gray-900 text-accent"
                value={customRange.start}
                onChange={e => setCustomRange(r => ({ ...r, start: e.target.value }))}
              />
              <span className="text-accent">to</span>
              <input
                type="date"
                className="border border-gray-700 rounded px-2 py-1 bg-gray-900 text-accent"
                value={customRange.end}
                onChange={e => setCustomRange(r => ({ ...r, end: e.target.value }))}
              />
            </div>
          )}
        </div>
      </div>
      <div style={{ position: 'relative', width: '100%', height: 400, background: '#18181b', borderRadius: '1.5rem' }}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} barSize={48} style={{ background: '#18181b' }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#232946" />
            <XAxis dataKey="day" stroke="#a5b4fc" fontSize={16} />
            <YAxis stroke="#a5b4fc" fontSize={16} allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#232946', border: '1px solid #6366f1', color: '#fff' }}
              cursor={{ fill: 'rgba(99,102,241,0.15)' }}
            />
            <Bar
              dataKey="sessions"
              fill="#6366f1"
              radius={[8,8,0,0]}
              name="Sessions"
              activeBar={{ fill: '#6366f1' }}
            />
          </BarChart>
        </ResponsiveContainer>
        {showNoData && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(24,24,27,0.85)',
            zIndex: 10,
            flexDirection: 'column',
            borderRadius: '1.5rem',
          }}>
            <svg width="64" height="64" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#232946"/><path d="M8 15h8M9 9h.01M15 9h.01" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/><path d="M12 17a4 4 0 0 1-4-4h8a4 4 0 0 1-4 4Z" fill="#6366f1"/></svg>
            <div className="text-lg font-semibold text-accent mt-2">No session data yet</div>
            <div className="text-main text-base mt-1">Start logging your coding sessions to see your progress!</div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Dashboard;