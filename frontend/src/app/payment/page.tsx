"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { api } from '@/lib/api';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
.pw-shell { display: flex; min-height: 100vh; background: #F8FAFC; font-family: 'Plus Jakarta Sans', sans-serif; color: #0F172A; }
.pw-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.pw-page { flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 20px; }

/* Header */
.pw-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 4px; }
.pw-h1 { font-size: 24px; font-weight: 800; color: #0F172A; margin: 0 0 4px; font-family: 'Outfit', sans-serif; letter-spacing: -0.02em; }
.pw-sub { font-size: 13px; color: #64748B; margin: 0; font-weight: 500; }

/* Actions */
.pw-actions { display: flex; align-items: center; gap: 10px; }
.pw-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 12.5px; font-weight: 700; color: #334155; cursor: pointer; transition: all .15s; text-decoration: none; }
.pw-btn:hover { border-color: #6366F1; color: #6366F1; }
.pw-btn-primary { background: #6366F1; color: #fff; border-color: #6366F1; box-shadow: 0 4px 12px rgba(99,102,241,0.25); }
.pw-btn-primary:hover { background: #4f46e5; border-color: #4f46e5; color: #fff; }
.pw-btn-danger { background: #EF4444; color: #fff; border-color: #EF4444; box-shadow: 0 4px 12px rgba(239,68,68,0.25); }
.pw-btn-danger:hover { background: #DC2626; border-color: #DC2626; color: #fff; }

/* Stat Cards Grid */
.pw-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.pw-sc { background: #fff; border: 1px solid #E2E8F0; border-radius: 16px; padding: 18px; box-shadow: 0 1px 3px rgba(0,0,0,.02); transition: all .15s; }
.pw-sc:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.04); border-color: #CBD5E1; }
.pw-sc-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 4px; }
.pw-sc-ic { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.pw-sc-tit { font-size: 11.5px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.04em; }
.pw-sc-val { font-size: 26px; font-weight: 800; color: #0F172A; line-height: 1.1; margin: 10px 0 4px; font-family: 'Outfit', sans-serif; }
.pw-sc-sub { font-size: 11px; color: #64748B; font-weight: 600; }

.ic-purple { background: #EEF2FF; color: #6366F1; }
.ic-green { background: #ECFDF5; color: #10B981; }
.ic-orange { background: #FFF7ED; color: #F97316; }
.ic-blue { background: #EFF6FF; color: #2563EB; }

/* Tabs & Container Card */
.pw-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,.02); overflow: hidden; display: flex; flex-direction: column; }
.pw-tabs { display: flex; border-bottom: 1px solid #F1F5F9; padding: 0 20px; background: #fff; align-items: center; justify-content: space-between; }
.pw-tab-group { display: flex; }
.pw-tab { padding: 14px 18px; font-size: 13.5px; font-weight: 700; color: #64748B; border-bottom: 2px solid transparent; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all .15s; }
.pw-tab:hover { color: #6366F1; }
.pw-tab.active { color: #6366F1; border-bottom-color: #6366F1; }
.pw-badge { padding: 2px 7px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #EEF2FF; color: #6366F1; }

/* Filters Bar */
.pw-filters-bar { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; background: #fff; border-bottom: 1px solid #F1F5F9; gap: 14px; flex-wrap: wrap; }
.pw-search-wrapper { position: relative; display: flex; align-items: center; flex: 1; min-width: 260px; max-width: 380px; }
.pw-search-ic { position: absolute; left: 12px; color: #94A3B8; display: flex; align-items: center; }
.pw-input-search { width: 100%; padding: 8px 12px 8px 36px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 12.5px; outline: none; color: #0F172A; background: #fff; font-weight: 500; }
.pw-input-search:focus { border-color: #6366F1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }

.pw-filter-select { padding: 8px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 12.5px; color: #334155; background: #fff; font-weight: 600; cursor: pointer; outline: none; transition: border-color .15s; }
.pw-filter-select:focus { border-color: #6366F1; }
.pw-filter-group { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

/* Table */
.pw-table-wrap { overflow-x: auto; width: 100%; }
.pw-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 12.5px; }
.pw-table th { font-size: 10px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: .05em; padding: 12px 18px; border-bottom: 1px solid #F1F5F9; background: #F8FAFC; white-space: nowrap; }
.pw-table td { padding: 14px 18px; color: #334155; border-bottom: 1px solid #F1F5F9; vertical-align: middle; white-space: nowrap; }
.pw-table tr:last-child td { border-bottom: none; }
.pw-table tr:hover td { background: #F8FAFC; }

.pw-chk { width: 16px; height: 16px; cursor: pointer; accent-color: #6366F1; }

.pw-user-cell { display: flex; align-items: center; gap: 10px; }
.pw-avatar { width: 34px; height: 34px; border-radius: 10px; background: #EEF2FF; color: #6366F1; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; flex-shrink: 0; }

.pw-sbadge { display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 20px; font-size: 10.5px; font-weight: 700; white-space: nowrap; }
.s-verified { background: #DCFCE7; color: #15803D; }
.s-pending { background: #FFEDD5; color: #C2410C; }
.s-credit { background: #DCFCE7; color: #15803D; }
.s-debit { background: #FEE2E2; color: #B91C1C; }

.pw-amt { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 14px; color: #0F172A; }
.pw-amt-bonus { color: #8B5CF6; }

.pw-act-del { padding: 5px 10px; border-radius: 6px; border: 1px solid #FEE2E2; background: #FEF2F2; color: #EF4444; font-size: 11px; font-weight: 700; cursor: pointer; transition: all .15s; }
.pw-act-del:hover { background: #EF4444; color: #fff; border-color: #EF4444; }
`;

interface WalletUser {
  id: number;
  name: string;
  mobile: string;
  email: string;
  address: string;
  kyc_status: string;
  wallet_balance: number;
  bonus_balance: number;
  total_balance: number;
  created_at: string;
}

interface WalletTx {
  id: number;
  mobile: string;
  customer_name?: string;
  title: string;
  subtitle: string;
  amount: number;
  type: string;
  status: string;
  payment_method: string;
  transaction_id: string;
  created_at: string;
}

export default function PaymentWalletPage() {
  const [users, setUsers] = useState<WalletUser[]>([]);
  const [transactions, setTransactions] = useState<WalletTx[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'transactions'>('users');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Filters
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Checkbox selections for delete
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [selectedTxIds, setSelectedTxIds] = useState<number[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const resUsers: any = await api.get('/wallet/users');
      const userData = resUsers?.data || (Array.isArray(resUsers) ? resUsers : []);
      setUsers(userData);

      const resTxs: any = await api.get('/wallet/transactions');
      const txData = resTxs?.data || (Array.isArray(resTxs) ? resTxs : []);
      setTransactions(txData);
    } catch (e) {
      console.error('Failed to load wallet data:', e);
    } finally {
      setLoading(false);
    }
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(u => 
      (u.name || '').toLowerCase().includes(q) ||
      (u.mobile || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  }, [users, search]);

  // Filtered Transactions with operational filters
  const filteredTxs = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = !search.trim() || 
        (t.customer_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (t.mobile || '').toLowerCase().includes(search.toLowerCase()) ||
        (t.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (t.transaction_id || '').toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter === 'All' || t.type.toLowerCase() === typeFilter.toLowerCase();
      const matchesStatus = statusFilter === 'All' || t.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [transactions, search, typeFilter, statusFilter]);

  // Checkbox logic for Users
  const toggleSelectUser = (id: number) => {
    setSelectedUserIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAllUsers = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map(u => u.id));
    }
  };

  const handleDeleteUsers = async (idsToDelete: number[]) => {
    if (!confirm(`Are you sure you want to delete ${idsToDelete.length} selected rider wallet record(s)?`)) return;
    try {
      await api.delete('/wallet/users', { ids: idsToDelete });
      setSelectedUserIds(prev => prev.filter(id => !idsToDelete.includes(id)));
      fetchData();
    } catch (err: any) {
      alert(`Failed to delete users: ${err.message || err}`);
    }
  };

  // Checkbox logic for Transactions
  const toggleSelectTx = (id: number) => {
    setSelectedTxIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAllTxs = () => {
    if (selectedTxIds.length === filteredTxs.length) {
      setSelectedTxIds([]);
    } else {
      setSelectedTxIds(filteredTxs.map(t => t.id));
    }
  };

  const handleDeleteTxs = async (idsToDelete: number[]) => {
    if (!confirm(`Are you sure you want to delete ${idsToDelete.length} selected transaction(s)?`)) return;
    try {
      await api.delete('/wallet/transactions', { ids: idsToDelete });
      setSelectedTxIds(prev => prev.filter(id => !idsToDelete.includes(id)));
      fetchData();
    } catch (err: any) {
      alert(`Failed to delete transactions: ${err.message || err}`);
    }
  };

  const totalMainBalance = useMemo(() => {
    return users.reduce((sum, u) => sum + (Number(u.wallet_balance) || 0), 0);
  }, [users]);

  const totalBonusBalance = useMemo(() => {
    return users.reduce((sum, u) => sum + (Number(u.bonus_balance) || 0), 0);
  }, [users]);

  return (
    <div className="pw-shell">
      <style>{CSS}</style>
      <Sidebar />
      <div className="pw-main">
        <TopBar />
        <div className="pw-page">
          {/* Title Row */}
          <div className="pw-title-row">
            <div>
              <h1 className="pw-h1">Payments & Wallet Management</h1>
              <p className="pw-sub">Live rider wallet balances, Razorpay payment collections, and instant payouts.</p>
            </div>
            <div className="pw-actions">
              <Link href="/payment/history" className="pw-btn">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Payment History
              </Link>
              <Link href="/payment/refund" className="pw-btn">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                Refunds
              </Link>
              <button onClick={fetchData} className="pw-btn pw-btn-primary">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Refresh Data
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="pw-stats">
            <div className="pw-sc">
              <div className="pw-sc-top">
                <span className="pw-sc-tit">Total Wallet Balance</span>
                <div className="pw-sc-ic ic-purple">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
              </div>
              <div className="pw-sc-val">₹{totalMainBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              <div className="pw-sc-sub">User deposited wallet float</div>
            </div>

            <div className="pw-sc">
              <div className="pw-sc-top">
                <span className="pw-sc-tit">Total Bonus Distributed</span>
                <div className="pw-sc-ic ic-green">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
              <div className="pw-sc-val">₹{totalBonusBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              <div className="pw-sc-sub">Promotional bonus pool</div>
            </div>

            <div className="pw-sc">
              <div className="pw-sc-top">
                <span className="pw-sc-tit">Active Wallet Users</span>
                <div className="pw-sc-ic ic-orange">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
              </div>
              <div className="pw-sc-val">{users.length}</div>
              <div className="pw-sc-sub">Registered EV riders with wallet</div>
            </div>

            <div className="pw-sc">
              <div className="pw-sc-top">
                <span className="pw-sc-tit">Total Transactions</span>
                <div className="pw-sc-ic ic-blue">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                </div>
              </div>
              <div className="pw-sc-val">{transactions.length}</div>
              <div className="pw-sc-sub">Live credit/debit transaction records</div>
            </div>
          </div>

          {/* Main Card with Tabs */}
          <div className="pw-card">
            <div className="pw-tabs">
              <div className="pw-tab-group">
                <div 
                  className={`pw-tab ${activeTab === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveTab('users')}
                >
                  Rider Wallet Directory <span className="pw-badge">{users.length}</span>
                </div>
                <div 
                  className={`pw-tab ${activeTab === 'transactions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('transactions')}
                >
                  Live Wallet Transactions <span className="pw-badge">{transactions.length}</span>
                </div>
              </div>

              {/* Bulk Delete Button when items selected */}
              {activeTab === 'users' && selectedUserIds.length > 0 && (
                <button className="pw-btn pw-btn-danger" onClick={() => handleDeleteUsers(selectedUserIds)}>
                  Delete Selected ({selectedUserIds.length})
                </button>
              )}

              {activeTab === 'transactions' && selectedTxIds.length > 0 && (
                <button className="pw-btn pw-btn-danger" onClick={() => handleDeleteTxs(selectedTxIds)}>
                  Delete Selected ({selectedTxIds.length})
                </button>
              )}
            </div>

            {/* Filter & Search Bar */}
            <div className="pw-filters-bar">
              <div className="pw-search-wrapper">
                <span className="pw-search-ic">
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </span>
                <input 
                  type="text" 
                  className="pw-input-search"
                  placeholder={activeTab === 'users' ? "Search rider by name, phone or email..." : "Search by customer name, phone, title or ID..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Operational Filters for Transactions */}
              {activeTab === 'transactions' && (
                <div className="pw-filter-group">
                  <select 
                    className="pw-filter-select"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="All">All Types</option>
                    <option value="Credit">Credit (Top-Up / Deposit)</option>
                    <option value="Debit">Debit (Ride Fare)</option>
                    <option value="Withdrawal">Withdrawal</option>
                  </select>

                  <select 
                    className="pw-filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="Success">Success</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              )}
            </div>

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="pw-table-wrap">
                <table className="pw-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>
                        <input 
                          type="checkbox" 
                          className="pw-chk"
                          checked={filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length}
                          onChange={toggleSelectAllUsers}
                        />
                      </th>
                      <th>Rider Details</th>
                      <th>Mobile Number</th>
                      <th>Email Address</th>
                      <th>KYC Status</th>
                      <th>Main Balance</th>
                      <th>Bonus Balance</th>
                      <th>Total Balance</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={9} style={{ textAlign: 'center', padding: '30px' }}>Loading riders...</td></tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr><td colSpan={9} style={{ textAlign: 'center', padding: '30px' }}>No riders found</td></tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id}>
                          <td>
                            <input 
                              type="checkbox" 
                              className="pw-chk"
                              checked={selectedUserIds.includes(u.id)}
                              onChange={() => toggleSelectUser(u.id)}
                            />
                          </td>
                          <td>
                            <div className="pw-user-cell">
                              <div className="pw-avatar">
                                {u.name ? u.name.charAt(0).toUpperCase() : 'R'}
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, color: '#0F172A' }}>{u.name || 'Rider'}</div>
                                <div style={{ fontSize: '11px', color: '#64748B' }}>{u.address || 'Vadodara, Gujarat'}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ fontWeight: 600 }}>{u.mobile}</td>
                          <td style={{ color: '#64748B' }}>{u.email || '—'}</td>
                          <td>
                            <span className={`pw-sbadge ${u.kyc_status === 'Verified' ? 's-verified' : 's-pending'}`}>
                              {u.kyc_status || 'Verified'}
                            </span>
                          </td>
                          <td className="pw-amt">₹{(Number(u.wallet_balance) || 0).toFixed(2)}</td>
                          <td className="pw-amt pw-amt-bonus">₹{(Number(u.bonus_balance) || 0).toFixed(2)}</td>
                          <td className="pw-amt" style={{ color: '#4338CA', fontSize: '15px' }}>
                            ₹{(Number(u.total_balance) || 0).toFixed(2)}
                          </td>
                          <td>
                            <button className="pw-act-del" onClick={() => handleDeleteUsers([u.id])}>Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="pw-table-wrap">
                <table className="pw-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>
                        <input 
                          type="checkbox" 
                          className="pw-chk"
                          checked={filteredTxs.length > 0 && selectedTxIds.length === filteredTxs.length}
                          onChange={toggleSelectAllTxs}
                        />
                      </th>
                      <th>Tx ID</th>
                      <th>Customer Name</th>
                      <th>Mobile Number</th>
                      <th>Title / Description</th>
                      <th>Method</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={11} style={{ textAlign: 'center', padding: '30px' }}>Loading transactions...</td></tr>
                    ) : filteredTxs.length === 0 ? (
                      <tr><td colSpan={11} style={{ textAlign: 'center', padding: '30px' }}>No transactions found</td></tr>
                    ) : (
                      filteredTxs.map((t, idx) => (
                        <tr key={t.id || idx}>
                          <td>
                            <input 
                              type="checkbox" 
                              className="pw-chk"
                              checked={selectedTxIds.includes(t.id)}
                              onChange={() => toggleSelectTx(t.id)}
                            />
                          </td>
                          <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{t.transaction_id || `TXN-${t.id}`}</td>
                          <td style={{ fontWeight: 700, color: '#0F172A' }}>{t.customer_name || 'Rider Customer'}</td>
                          <td style={{ fontWeight: 600 }}>{t.mobile}</td>
                          <td>
                            <div style={{ fontWeight: 700 }}>{t.title}</div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>{t.subtitle}</div>
                          </td>
                          <td>{t.payment_method || 'Razorpay'}</td>
                          <td>
                            <span className={`pw-sbadge ${t.type === 'Credit' ? 's-credit' : 's-debit'}`}>
                              {t.type}
                            </span>
                          </td>
                          <td>
                            <span className="pw-sbadge s-verified">{t.status || 'Success'}</span>
                          </td>
                          <td className="pw-amt" style={{ color: t.type === 'Credit' ? '#15803D' : '#B91C1C' }}>
                            {t.type === 'Credit' ? '+' : '-'}₹{(Number(t.amount) || 0).toFixed(2)}
                          </td>
                          <td style={{ color: '#64748B', fontSize: '11.5px' }}>
                            {new Date(t.created_at).toLocaleString()}
                          </td>
                          <td>
                            <button className="pw-act-del" onClick={() => handleDeleteTxs([t.id])}>Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
