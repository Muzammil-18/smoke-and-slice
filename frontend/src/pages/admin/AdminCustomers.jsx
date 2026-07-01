import React, { useState, useEffect } from 'react'
import { Search, Users, ChevronDown, ChevronUp, ShoppingBag, Calendar, Shield } from 'lucide-react'

function AdminCustomers({ user }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchCustomers = async () => {
    try {
      let url = '/api/admin/customers';
      if (search) {
        url += `?search=${encodeURIComponent(search)}`;
      }
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCustomers();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const confirmMsg = newRole === 'admin' 
      ? 'Are you sure you want to promote this user to Admin?' 
      : 'Are you sure you want to remove Admin rights from this user?';

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/admin/customers/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (res.ok) {
        // Sirf is specific user ki state update kardo locally taake refresh ka time bache
        setCustomers(prev => prev.map(c => c.id === userId ? { ...c, role: newRole } : c));
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to update role');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while updating the role.');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide font-sans">Customers Database</h1>
          <p className="text-xs text-neutral-450 mt-1">Browse registered users, assign roles, and audit buyer histories.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-neutral-900 border border-neutral-850 rounded-2xl pl-11 pr-4 py-2.5 text-white text-xs font-medium"
          />
          <Search className="w-4.5 h-4.5 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : customers.length > 0 ? (
        <div className="space-y-4">
          <div className="hidden lg:block bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden shadow-lg animate-fadeIn">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-xs font-semibold text-neutral-455 uppercase tracking-wider bg-neutral-900/50">
                  <th className="py-4 px-6">Customer Details</th>
                  <th className="py-4 px-6">Contact Info</th>
                  <th className="py-4 px-6 text-center">Orders Placed</th>
                  <th className="py-4 px-6 text-right">Total Spent</th>
                  <th className="py-4 px-6 text-center">Actions & History</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850 text-sm">
                {customers.map((c) => {
                  const isExpanded = expandedId === c.id;
                  return (
                    <React.Fragment key={c.id}>
                      <tr className="hover:bg-neutral-900/40">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white">{c.name}</span>
                            {c.role === 'admin' && (
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-primary/20 text-primary uppercase tracking-wider">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-neutral-500 mt-0.5">Joined: {new Date(c.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-white text-xs">{c.email}</div>
                          <div className="text-[11px] text-neutral-550 mt-0.5">{c.phone || 'No phone'}</div>
                        </td>
                        <td className="py-4 px-6 text-center text-neutral-300 font-bold">{c.totalOrders}</td>
                        <td className="py-4 px-6 text-right font-black text-primary">${c.totalSpent.toFixed(2)}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center space-x-2">
                            {c.id !== user.id && (
                              <button
                                onClick={() => handleRoleToggle(c.id, c.role)}
                                className={`p-1.5 rounded-lg transition-colors ${c.role === 'admin' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}
                                title={c.role === 'admin' ? 'Remove Admin Rights' : 'Make Admin'}
                              >
                                <Shield className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => toggleExpand(c.id)}
                              className="p-1.5 bg-neutral-800 text-neutral-450 hover:text-white rounded-lg transition-colors"
                              title="View Purchase History"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan="5" className="bg-neutral-950/70 p-6 border-b border-neutral-850">
                            <div className="space-y-4 animate-fadeIn">
                              <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center space-x-1.5">
                                <ShoppingBag className="w-4 h-4" />
                                <span>Purchase Log for {c.name}</span>
                              </h3>
                              {c.orders.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-60 overflow-y-auto pr-2">
                                  {c.orders.map((o) => (
                                    <div key={o.id} className="bg-neutral-900 border border-neutral-850 p-4 rounded-xl flex items-center justify-between text-xs">
                                      <div className="space-y-1">
                                        <p className="font-bold text-white">Invoice #{o.id}</p>
                                        <p className="text-neutral-500 flex items-center space-x-1">
                                          <Calendar className="w-3.5 h-3.5" />
                                          <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-bold text-primary">${o.grandTotal.toFixed(2)}</p>
                                        <p className="text-[10px] text-neutral-400 mt-0.5">{o.status}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-neutral-500">No transactions recorded.</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {customers.map((c) => {
              const isExpanded = expandedId === c.id;
              return (
                <div key={c.id} className="bg-neutral-900 border border-neutral-850 rounded-2xl p-5 space-y-4 shadow-md">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-white text-base truncate">{c.name}</h3>
                          {c.role === 'admin' && (
                            <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider flex-shrink-0">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5 break-all">{c.email}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {c.id !== user.id && (
                          <button
                            onClick={() => handleRoleToggle(c.id, c.role)}
                            className={`p-1.5 rounded-lg transition-colors ${c.role === 'admin' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => toggleExpand(c.id)}
                          className="p-1.5 bg-neutral-800 text-neutral-450 hover:text-white rounded-lg transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs text-neutral-400 border-t border-neutral-850 pt-3">
                    <div>
                      <p className="text-neutral-500">Invoices</p>
                      <p className="text-base font-bold text-white mt-0.5">{c.totalOrders}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-neutral-500">Total spent</p>
                      <p className="text-base font-black text-primary mt-0.5">${c.totalSpent.toFixed(2)}</p>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="bg-neutral-950/75 p-4 rounded-xl border border-neutral-850 space-y-3 mt-4 animate-fadeIn text-xs">
                      <h4 className="font-bold text-primary uppercase tracking-widest text-[10px]">Purchase Log</h4>
                      {c.orders.length > 0 ? (
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                          {c.orders.map((o) => (
                            <div key={o.id} className="flex justify-between items-center py-1 border-b border-neutral-900 last:border-0">
                              <div>
                                <p className="font-bold text-white">Invoice #{o.id}</p>
                                <p className="text-[10px] text-neutral-500">{new Date(o.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-primary">${o.grandTotal.toFixed(2)}</p>
                                <p className="text-[9px] text-neutral-550">{o.status}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-neutral-500 text-[11px]">No orders recorded.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-850 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
          <Users className="w-12 h-12 text-neutral-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No registered customers</h3>
          <p className="text-neutral-400 text-xs leading-normal">
            Users who register accounts on the website will be listed here.
          </p>
        </div>
      )}
    </div>
  );
}

export default AdminCustomers;