"use client";

import React, { useState, useEffect } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { 
  Inbox, Loader2, Calendar, Phone, Mail, Globe, 
  MessageSquare, User, Eye, Trash2, ArrowUpRight, Filter
} from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { useToast } from "@/components/toast-provider";

interface Lead {
  id: number;
  created_at: string;
  tenant_id: number;
  site_id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  source_url: string;
}

interface Site {
  id: number;
  name: string;
}

export default function LeadsPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { activeTenantId } = useActiveTenant();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Detail states
  const [selectedSiteId, setSelectedSiteId] = useState("all");
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  const fetchData = async () => {
    if (!token || !activeTenantId) return;
    try {
      setLoading(true);
      // Fetch leads
      const leadsRes = await request<Lead[]>("/leads", {
        headers: { "X-Tenant-ID": activeTenantId.toString() }
      }, token);
      setLeads(leadsRes.data || []);

      // Fetch sites for filtering
      const sitesRes = await request<Site[]>("/sites", {
        headers: { "X-Tenant-ID": activeTenantId.toString() }
      }, token);
      setSites(sitesRes.data || []);
    } catch (err: any) {
      pushToast(err.message || "Gagal memuat inbox leads", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTenantId) {
      fetchData();
    }
  }, [activeTenantId]);

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoStr;
    }
  };

  // Filter logic
  const filteredLeads = selectedSiteId === "all" 
    ? leads 
    : leads.filter(l => l.site_id === Number(selectedSiteId));

  if (loading && leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-xs text-muted-foreground">Memuat kotak masuk leads...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header control */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Customer Leads</h1>
          <p className="text-xs text-muted-foreground">Inkuiri kontak dan prospek yang dikirimkan oleh pengunjung situs publik Anda.</p>
        </div>

        {/* Filter dropdown */}
        {leads.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select 
              value={selectedSiteId} 
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="px-3.5 py-1.5 border rounded-xl text-xs outline-none focus:border-primary bg-card"
            >
              <option value="all">Semua Website</option>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {leads.length === 0 ? (
        <Card className="border-dashed border-border/70 p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Inbox className="w-8 h-8 opacity-75" />
          </div>
          <h2 className="text-xl font-bold mb-2">Kotak Masuk Kosong</h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Belum ada leads yang masuk. Pastikan Anda mengaktifkan opsi "Tampilkan Formulir Kontak" pada konfigurasi website Anda.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-start">
          {/* Table list */}
          <Card className="border-border/40 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-border/40 text-slate-500 uppercase font-bold tracking-wider">
                    <th className="p-4">Pengirim</th>
                    <th className="p-4">Tanggal Masuk</th>
                    <th className="p-4">Website Sumber</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredLeads.map((lead) => {
                    const matchedSite = sites.find(s => s.id === lead.site_id);
                    return (
                      <tr 
                        key={lead.id} 
                        className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                          activeLead?.id === lead.id ? "bg-primary/5" : ""
                        }`}
                        onClick={() => setActiveLead(lead)}
                      >
                        <td className="p-4 font-semibold">
                          <div>{lead.name}</div>
                          <div className="text-[10px] text-muted-foreground font-normal">{lead.email}</div>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {formatDate(lead.created_at)}
                        </td>
                        <td className="p-4 font-medium">
                          {matchedSite?.name || `Situs ID #${lead.site_id}`}
                        </td>
                        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="rounded-lg gap-1 text-[11px] h-8"
                            onClick={() => setActiveLead(lead)}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Detail
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Lead Detail Panel */}
          <div>
            {activeLead ? (
              <Card className="border-border/40 shadow-md sticky top-6">
                <CardHeader className="bg-slate-50/50 border-b border-border/40 p-6">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Detail Leads Pelanggan
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  <div className="space-y-3 border-b pb-4">
                    <div className="text-lg font-bold text-slate-900 leading-tight">{activeLead.name}</div>
                    <div className="flex items-center gap-2 text-slate-600 text-xs">
                      <Mail className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                      <a href={`mailto:${activeLead.email}`} className="hover:underline hover:text-primary">{activeLead.email}</a>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-xs">
                      <Phone className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                      <a href={`tel:${activeLead.phone}`} className="hover:underline hover:text-primary">{activeLead.phone}</a>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Pesan Inkuiri</span>
                    <p className="text-xs text-slate-700 bg-slate-50 border p-4 rounded-xl leading-relaxed whitespace-pre-line text-justify font-medium">
                      {activeLead.message}
                    </p>
                  </div>

                  <div className="space-y-2 border-t pt-4 text-[10px] text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Diterima pada</span>
                      <span className="font-semibold text-slate-600">{formatDate(activeLead.created_at)}</span>
                    </div>
                    {activeLead.source_url && (
                      <div className="flex justify-between gap-4">
                        <span>URL Halaman Sumber</span>
                        <a 
                          href={activeLead.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="font-semibold text-primary hover:underline truncate max-w-[200px]"
                        >
                          {activeLead.source_url}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/40 p-8 text-center text-muted-foreground border-dashed h-64 flex flex-col items-center justify-center">
                <MessageSquare className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs">Pilih salah satu lead di tabel untuk melihat isi pesan detail.</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
