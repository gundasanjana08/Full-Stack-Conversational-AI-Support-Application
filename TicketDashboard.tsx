
import React from 'react';
import { Ticket, TicketStatus, TicketPriority } from '../types';
import { 
  InboxIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface TicketDashboardProps {
  tickets: Ticket[];
}

const TicketDashboard: React.FC<TicketDashboardProps> = ({ tickets }) => {
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === TicketStatus.OPEN).length,
    urgent: tickets.filter(t => t.priority === TicketPriority.URGENT).length,
    resolved: tickets.filter(t => t.status === TicketStatus.RESOLVED).length,
  };

  const getPriorityColor = (p: TicketPriority) => {
    switch(p) {
      case TicketPriority.URGENT: return 'bg-rose-100 text-rose-700 border-rose-200';
      case TicketPriority.HIGH: return 'bg-orange-100 text-orange-700 border-orange-200';
      case TicketPriority.MEDIUM: return 'bg-blue-100 text-blue-700 border-blue-200';
      case TicketPriority.LOW: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusColor = (s: TicketStatus) => {
    switch(s) {
      case TicketStatus.OPEN: return 'bg-emerald-100 text-emerald-700';
      case TicketStatus.IN_PROGRESS: return 'bg-indigo-100 text-indigo-700';
      case TicketStatus.RESOLVED: return 'bg-slate-100 text-slate-500';
      default: return 'bg-slate-100 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Support Overview</h2>
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          Last sync: Just now
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Tickets" value={stats.total} icon={<InboxIcon className="w-5 h-5"/>} color="indigo" />
        <StatCard label="Open Issues" value={stats.open} icon={<ClockIcon className="w-5 h-5"/>} color="emerald" />
        <StatCard label="Urgent" value={stats.urgent} icon={<ExclamationCircleIcon className="w-5 h-5"/>} color="rose" />
        <StatCard label="Resolved" value={stats.resolved} icon={<CheckCircleIcon className="w-5 h-5"/>} color="slate" />
      </div>

      {/* Ticket List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ticket</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                    No tickets generated yet. Use the chat to create some!
                  </td>
                </tr>
              ) : (
                tickets.sort((a, b) => b.createdAt - a.createdAt).map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{ticket.subject}</div>
                      <div className="text-xs text-slate-400">ID: {ticket.id}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{ticket.customerName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRightIcon className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string, value: number, icon: React.ReactNode, color: string }> = ({ label, value, icon, color }) => {
  const colors: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
    slate: 'bg-slate-50 text-slate-600'
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
        <span className="text-2xl font-bold text-slate-900">{value}</span>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
};

export default TicketDashboard;
