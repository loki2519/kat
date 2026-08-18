import React, { useState, useEffect } from 'react';
import { Newspaper, Plus, Edit2, Trash2, Power, AlertTriangle, CheckCircle2, Clock, Megaphone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function NewsManager() {
  const { token } = useAuth();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ text: '', status: 'ACTIVE' });
  const [saving, setSaving] = useState(false);

  const [deleteModalItem, setDeleteModalItem] = useState(null);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/news', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch news items');
      setNews(data.news || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ text: '', status: 'ACTIVE' });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({ text: item.text, status: item.status || 'ACTIVE' });
    setIsFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return;

    setSaving(true);
    setError('');
    setSuccessMsg('');

    try {
      const url = editingItem ? `/api/news/${editingItem.id}` : '/api/news';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save news item');

      setSuccessMsg(editingItem ? 'News item updated successfully!' : 'News item created successfully!');
      setIsFormOpen(false);
      fetchNews();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (item) => {
    const newStatus = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await fetch(`/api/news/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');
      fetchNews();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteSingle = async () => {
    if (!deleteModalItem) return;
    try {
      const res = await fetch(`/api/news/${deleteModalItem.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete news item');

      setDeleteModalItem(null);
      setSuccessMsg('News item deleted.');
      fetchNews();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAll = async () => {
    try {
      const res = await fetch('/api/news/all/clear', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete all news');

      setIsDeleteAllOpen(false);
      setSuccessMsg('All scrolling news deleted.');
      fetchNews();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-600">
            <Megaphone className="w-5 h-5" />
            <h2 className="text-xl font-extrabold text-slate-900">Scrolling News Management</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage live horizontal announcement ticker displayed on public KAT website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {news.length > 0 && (
            <button
              onClick={() => setIsDeleteAllOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>DELETE ALL NEWS</span>
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-extrabold text-xs shadow-md flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>ADD NEWS</span>
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="font-bold underline text-[10px]">Dismiss</button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* News Items Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-bold">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading scrolling news data...
          </div>
        ) : news.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Newspaper className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800">No scrolling news available.</h3>
              <p className="text-xs text-slate-500 mt-1">Add news announcements to display on the public header ticker.</p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>ADD NEWS</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-extrabold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="p-4 pl-6">ID</th>
                  <th className="p-4">News Announcement Text</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {news.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-slate-500">#{item.id}</td>
                    <td className="p-4 text-slate-900 font-bold max-w-md break-words">{item.text}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        item.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 border border-slate-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'ACTIVE' ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-[11px] font-mono">
                      {new Date(item.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleStatus(item)}
                          title={item.status === 'ACTIVE' ? 'Disable News' : 'Enable News'}
                          className={`p-2 rounded-lg border text-xs font-bold transition-colors ${
                            item.status === 'ACTIVE'
                              ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Edit News"
                          className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteModalItem(item)}
                          title="Delete News"
                          className="p-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-blue-600" />
                <span>{editingItem ? 'Edit News Announcement' : 'Add New News Announcement'}</span>
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">News Text Announcement *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter scrolling news content (e.g. NEW SERVICES AVAILABLE • GET YOUR QUOTE TODAY IN MINUTES)..."
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-blue-600 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Display Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:border-blue-600 bg-slate-50 text-slate-800"
                >
                  <option value="ACTIVE">ACTIVE (Shown on public ticker)</option>
                  <option value="INACTIVE">INACTIVE (Hidden publicly)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-extrabold text-xs hover:bg-blue-700 shadow-md transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'SAVE NEWS'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Single Confirmation Modal */}
      {deleteModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 text-center">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Delete News Item?</h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to delete this news item? It will be removed from the public website.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 text-left font-mono break-words">
                "{deleteModalItem.text}"
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleDeleteSingle}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-extrabold text-xs hover:bg-red-700 shadow-md transition-all"
              >
                YES, DELETE
              </button>
              <button
                onClick={() => setDeleteModalItem(null)}
                className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete ALL Confirmation Modal */}
      {isDeleteAllOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 text-center">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Delete ALL Scrolling News?</h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to delete ALL scrolling news? This cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleDeleteAll}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-extrabold text-xs hover:bg-red-700 shadow-md transition-all"
              >
                DELETE ALL
              </button>
              <button
                onClick={() => setIsDeleteAllOpen(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
