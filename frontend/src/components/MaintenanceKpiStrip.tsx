"use client";
import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export interface MaintenanceStatsData {
  total_jobs: number;
  rider_damage_jobs: number;
  rider_recovery_total: number;
  under_maintenance: number;
  completed_resolved: number;
  recovered_from_riders?: number;
  pending_recovery_from_riders?: number;
  fleet_absorbed_expense?: number;
  total_maintenance_cost?: number;
}

interface MaintenanceKpiStripProps {
  stats?: MaintenanceStatsData | null;
  onCardClick?: (filterType: string) => void;
  activeFilter?: string;
}

export default function MaintenanceKpiStrip({ stats: propStats, onCardClick, activeFilter }: MaintenanceKpiStripProps) {
  const [internalStats, setInternalStats] = useState<MaintenanceStatsData>({
    total_jobs: 0,
    rider_damage_jobs: 0,
    rider_recovery_total: 0,
    under_maintenance: 0,
    completed_resolved: 0,
    recovered_from_riders: 0,
    pending_recovery_from_riders: 0
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (propStats) {
      setInternalStats(propStats);
      return;
    }
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res: any = await api.get('/maintenance/stats');
        const data = res?.data || res;
        if (data) {
          setInternalStats({
            total_jobs: data.total_jobs ?? data.total ?? 0,
            rider_damage_jobs: data.rider_damage_jobs ?? 0,
            rider_recovery_total: data.rider_recovery_total ?? 0,
            under_maintenance: data.under_maintenance ?? 0,
            completed_resolved: data.completed_resolved ?? data.completed ?? 0,
            recovered_from_riders: data.recovered_from_riders ?? 0,
            pending_recovery_from_riders: data.pending_recovery_from_riders ?? 0
          });
        }
      } catch (e) {
        console.error('Failed to load maintenance stats:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [propStats]);

  const stats = propStats || internalStats;

  const cards = [
    {
      id: 'all',
      lbl: 'TOTAL JOB CARDS',
      val: stats.total_jobs.toLocaleString(),
      trend: 'Fleet Maintenance Orders',
      trendColor: '#16A34A',
      bg: '#2A195C',
      ic: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
    {
      id: 'rider_damage',
      lbl: 'RIDER DAMAGE JOBS',
      val: stats.rider_damage_jobs.toLocaleString(),
      trend: `${stats.pending_recovery_from_riders ? `₹${stats.pending_recovery_from_riders.toLocaleString()} pending` : 'Rider Liable'}`,
      trendColor: '#EF4444',
      bg: '#EF4444',
      ic: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    },
    {
      id: 'recovery',
      lbl: 'RIDER RECOVERY AMT',
      val: `₹${(stats.rider_recovery_total || 0).toLocaleString()}`,
      trend: `₹${(stats.recovered_from_riders || 0).toLocaleString()} recovered`,
      trendColor: '#10B981',
      bg: '#10B981',
      ic: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      )
    },
    {
      id: 'under_maintenance',
      lbl: 'UNDER MAINTENANCE',
      val: stats.under_maintenance.toLocaleString(),
      trend: 'Active in Workshop',
      trendColor: '#F59E0B',
      bg: '#F59E0B',
      ic: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    },
    {
      id: 'completed',
      lbl: 'COMPLETED & RESOLVED',
      val: stats.completed_resolved.toLocaleString(),
      trend: 'Back in Rental Fleet',
      trendColor: '#16A34A',
      bg: '#3B82F6',
      ic: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      )
    }
  ];

  return (
    <>
      <style>{`
        .mk-stats-strip {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 20px;
          width: 100%;
        }
        .mk-stat-card {
          background: #ffffff;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
          box-sizing: border-box;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          user-select: none;
          min-width: 0;
        }
        .mk-stat-card:hover {
          border-color: #CBD5E1;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
        }
        .mk-stat-card.active {
          border-color: #2A195C;
          box-shadow: 0 0 0 2px rgba(42, 25, 92, 0.15);
        }
        .mk-stat-ic {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .mk-stat-info {
          min-width: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .mk-stat-lbl {
          font-size: 9.5px;
          color: #64748B;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .mk-stat-val {
          font-size: 20px;
          font-weight: 800;
          color: #0F172A;
          line-height: 1.2;
          margin-bottom: 2px;
          letter-spacing: -0.02em;
        }
        .mk-stat-trend {
          font-size: 10.5px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 1200px) {
          .mk-stats-strip {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 768px) {
          .mk-stats-strip {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .mk-stat-card {
            padding: 12px;
            gap: 10px;
          }
          .mk-stat-ic {
            width: 36px;
            height: 36px;
          }
          .mk-stat-val {
            font-size: 17px;
          }
        }
        @media (max-width: 480px) {
          .mk-stats-strip {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="mk-stats-strip">
        {cards.map((c) => {
          const isSelected = activeFilter === c.id;
          return (
            <div
              key={c.id}
              className={`mk-stat-card ${isSelected ? 'active' : ''}`}
              onClick={() => onCardClick && onCardClick(c.id)}
            >
              <div className="mk-stat-ic" style={{ background: c.bg }}>
                {c.ic}
              </div>
              <div className="mk-stat-info">
                <span className="mk-stat-lbl">{c.lbl}</span>
                <span className="mk-stat-val">{c.val}</span>
                <span className="mk-stat-trend" style={{ color: c.trendColor }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                  {c.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
