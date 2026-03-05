import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Eye, Users, Heart, MessageCircle, TrendingUp, ArrowUpRight, ArrowDownRight, Download, Sparkles } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

/* ─── MOCK DATA ─── */
const kpis = [
  { label: "Impressions totales", value: "84.2K", change: "+12%", up: true, icon: Eye },
  { label: "Reach total", value: "42.1K", change: "+8%", up: true, icon: Users },
  { label: "Likes totaux", value: "6,847", change: "+15%", up: true, icon: Heart },
  { label: "Commentaires totaux", value: "892", change: "-3%", up: false, icon: MessageCircle },
  { label: "Taux d'engagement", value: "4.7%", change: "+0.3%", up: true, icon: TrendingUp },
];

const makeEngagement = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    day: n <= 7 ? ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"][i] : n <= 30 ? `${i + 1}` : `S${i + 1}`,
    likes: Math.floor(Math.random() * 350 + 100),
    comments: Math.floor(Math.random() * 70 + 10),
    impressions: Math.floor(Math.random() * 1200 + 400),
  }));

const engagementData: Record<string, ReturnType<typeof makeEngagement>> = {
  "7": makeEngagement(7),
  "30": makeEngagement(30),
  "90": makeEngagement(12),
  "365": makeEngagement(12),
};

// Heatmap data: 7 days × 24 hours
const heatmapData = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 24 }, (_, h) => {
    // Simulate higher engagement mid-week evenings
    const base = Math.random();
    const dayBoost = d >= 1 && d <= 3 ? 0.3 : 0;
    const hourBoost = h >= 17 && h <= 20 ? 0.4 : h >= 11 && h <= 13 ? 0.2 : 0;
    return Math.min(1, base * 0.4 + dayBoost + hourBoost);
  })
);
const DAYS_HEAT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const topHashtags = [
  { tag: "#photography", impressions: "12.4K", reach: "8.2K", engagement: "5.2%", trend: "up" },
  { tag: "#lifestyle", impressions: "9.8K", reach: "6.1K", engagement: "4.8%", trend: "down" },
  { tag: "#creative", impressions: "8.5K", reach: "5.7K", engagement: "4.5%", trend: "up" },
  { tag: "#instagood", impressions: "7.2K", reach: "4.9K", engagement: "3.9%", trend: "up" },
  { tag: "#aesthetic", impressions: "6.1K", reach: "3.8K", engagement: "3.6%", trend: "down" },
];

const topPosts = [
  { id: 1, title: "Lookbook été — Notre collection capsule exclusive", date: "28 fév", likes: 482, comments: 67, reach: "4.2K", engagement: "6.1%" },
  { id: 2, title: "Behind the scenes de notre shooting studio", date: "25 fév", likes: 371, comments: 52, reach: "3.8K", engagement: "5.4%" },
  { id: 3, title: "5 astuces pour un feed Instagram cohérent", date: "22 fév", likes: 298, comments: 89, reach: "5.1K", engagement: "5.8%" },
  { id: 4, title: "Carrousel — Les tendances mode printemps 2026", date: "18 fév", likes: 256, comments: 41, reach: "3.2K", engagement: "4.7%" },
  { id: 5, title: "Rétrospective créative du mois de février", date: "15 fév", likes: 214, comments: 33, reach: "2.9K", engagement: "4.2%" },
];

const growthData = Array.from({ length: 12 }, (_, i) => ({
  week: `S${i + 1}`,
  followers: Math.floor(Math.random() * 120 + 30),
}));

const typeData = [
  { name: "Posts simples", value: 45 },
  { name: "Carrousels", value: 38 },
  { name: "Reels", value: 17 },
];
const PIE_COLORS = ["hsl(349 100% 65%)", "hsl(271 61% 52%)", "hsl(43 100% 70%)"];

const aiRecommendations = [
  "📈 Publiez plus de carrousels, ils génèrent 2x plus de reach que les posts simples.",
  "🕐 Évitez le vendredi soir, votre audience est moins active après 20h.",
  "🏷️ Ajoutez le hashtag #slowlife, en hausse cette semaine dans votre niche.",
  "🎨 Les photos avec des tons chauds obtiennent 30% plus de likes.",
];

/* ─── TOOLTIPS ─── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-lg text-xs space-y-1">
      <p className="text-foreground font-medium">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.dataKey === "likes" ? "❤️" : p.dataKey === "comments" ? "💬" : "👁️"} {p.value}
        </p>
      ))}
    </div>
  );
};

/* ─── PAGE ─── */
const StatsPage = () => {
  const [period, setPeriod] = useState<"7" | "30" | "90" | "365">("30");
  const [hashtagSort, setHashtagSort] = useState<"impressions" | "engagement">("impressions");
  const [selectedPost, setSelectedPost] = useState<typeof topPosts[0] | null>(null);

  return (
    <AdminLayout title="Statistiques & Performances">
      <div className="max-w-7xl space-y-6">

        {/* Header controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
            {(["7", "30", "90", "365"] as const).map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${period === p ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
                {p === "7" ? "7 jours" : p === "30" ? "30 jours" : p === "90" ? "3 mois" : "12 mois"}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-secondary text-sm transition-all">
            <Download className="w-4 h-4" /> Exporter en PDF
          </button>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="bg-card border border-border rounded-2xl p-4 hover:border-primary/20 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className="w-4 h-4 text-muted-foreground" />
                <span className={`flex items-center gap-0.5 text-[10px] font-medium ${kpi.up ? "text-green-400" : "text-destructive"}`}>
                  {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.change}
                </span>
              </div>
              <p className="text-xl font-display font-bold text-foreground">{kpi.value}</p>
              <p className="text-muted-foreground text-[10px] mt-0.5">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* ENGAGEMENT CHART */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-display font-bold text-foreground mb-4">Évolution de l'engagement</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData[period]}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 24% 14%)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(245 10% 58%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(245 10% 58%)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="likes" stroke="hsl(349 100% 65%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="comments" stroke="hsl(271 61% 52%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="impressions" stroke="hsl(43 100% 70%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-5 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-primary" /> Likes</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-violet" /> Commentaires</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-yellow" /> Impressions</span>
          </div>
        </div>

        {/* HEATMAP + HASHTAGS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Heatmap */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-display font-bold text-foreground mb-4">Meilleures heures de publication</h2>
            <div className="overflow-x-auto">
              <div className="min-w-[500px]">
                {/* Hours header */}
                <div className="flex ml-10 mb-1">
                  {[6, 8, 10, 12, 14, 16, 18, 20, 22].map((h) => (
                    <span key={h} className="text-[9px] text-muted-foreground" style={{ width: `${100 / 24 * 2}%` }}>{h}h</span>
                  ))}
                </div>
                {/* Grid */}
                {DAYS_HEAT.map((day, d) => (
                  <div key={day} className="flex items-center gap-1 mb-0.5">
                    <span className="text-[10px] text-muted-foreground w-8 text-right">{day}</span>
                    <div className="flex-1 flex gap-px">
                      {heatmapData[d].map((val, h) => (
                        <div key={h}
                          className="flex-1 aspect-square rounded-[2px] cursor-pointer transition-transform hover:scale-150"
                          style={{
                            backgroundColor: val > 0.7
                              ? "hsl(349 100% 65%)"
                              : val > 0.5
                              ? "hsl(349 100% 65% / 0.6)"
                              : val > 0.3
                              ? "hsl(271 61% 52% / 0.4)"
                              : "hsl(240 24% 14%)",
                          }}
                          title={`${day} ${h}h — ${Math.round(val * 100)}%`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-[10px] text-muted-foreground">
              <span>Faible</span>
              <div className="flex gap-px">
                {["hsl(240 24% 14%)", "hsl(271 61% 52% / 0.4)", "hsl(349 100% 65% / 0.6)", "hsl(349 100% 65%)"].map((c) => (
                  <div key={c} className="w-4 h-3 rounded-[2px]" style={{ backgroundColor: c }} />
                ))}
              </div>
              <span>Élevé</span>
            </div>
            <div className="mt-3 space-y-1">
              {["Mardi 18h — ⭐ Meilleur créneau", "Mercredi 12h — Très bon", "Jeudi 19h — Recommandé"].map((s) => (
                <p key={s} className="text-xs text-muted-foreground">{s}</p>
              ))}
            </div>
          </div>

          {/* Hashtags */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-foreground">Hashtags performants</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground border-b border-border">
                    <th className="pb-2 font-medium">Hashtag</th>
                    <th className="pb-2 font-medium cursor-pointer hover:text-foreground" onClick={() => setHashtagSort("impressions")}>Impressions</th>
                    <th className="pb-2 font-medium hidden sm:table-cell">Reach</th>
                    <th className="pb-2 font-medium cursor-pointer hover:text-foreground" onClick={() => setHashtagSort("engagement")}>Engagement</th>
                    <th className="pb-2 font-medium">Tendance</th>
                  </tr>
                </thead>
                <tbody>
                  {topHashtags.map((h) => (
                    <tr key={h.tag} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-2.5 text-violet-light font-medium">{h.tag}</td>
                      <td className="py-2.5 text-foreground">{h.impressions}</td>
                      <td className="py-2.5 text-foreground hidden sm:table-cell">{h.reach}</td>
                      <td className="py-2.5 text-foreground">{h.engagement}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${h.trend === "up" ? "bg-green-500/20 text-green-400" : "bg-destructive/20 text-destructive"}`}>
                          {h.trend === "up" ? "En hausse" : "En baisse"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <a href="/dashboard/programmer" className="inline-flex items-center gap-1 mt-4 text-xs text-primary hover:underline font-medium">
              Utiliser ces hashtags dans mon prochain post →
            </a>
          </div>
        </div>

        {/* TOP POSTS */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-display font-bold text-foreground mb-4">Top 5 des meilleurs posts</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border">
                  <th className="pb-2 font-medium">Post</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">❤️</th>
                  <th className="pb-2 font-medium">💬</th>
                  <th className="pb-2 font-medium hidden sm:table-cell">Reach</th>
                  <th className="pb-2 font-medium">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {topPosts.map((p) => (
                  <tr key={p.id} onClick={() => setSelectedPost(p)}
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-lg flex-shrink-0">📷</div>
                        <span className="text-foreground truncate max-w-[200px]">{p.title}</span>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">{p.date}</td>
                    <td className="py-3 text-foreground">{p.likes}</td>
                    <td className="py-3 text-foreground">{p.comments}</td>
                    <td className="py-3 text-foreground hidden sm:table-cell">{p.reach}</td>
                    <td className="py-3 text-primary font-medium">{p.engagement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* GROWTH + TYPE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Growth */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-display font-bold text-foreground mb-4">Croissance des abonnés</h2>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 24% 14%)" />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(245 10% 58%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(245 10% 58%)" }} axisLine={false} tickLine={false} />
                  <Tooltip content={({ active, payload, label }) =>
                    active && payload ? (
                      <div className="bg-card border border-border rounded-xl p-2 shadow-lg text-xs">
                        <p className="text-foreground font-medium">{label}</p>
                        <p className="text-primary">+{payload[0]?.value} abonnés</p>
                      </div>
                    ) : null
                  } />
                  <Bar dataKey="followers" fill="hsl(349 100% 65%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">Données fournies par l'API Meta</p>
          </div>

          {/* Post type distribution */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-display font-bold text-foreground mb-4">Répartition par type de post</h2>
            <div className="h-52 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={typeData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}>
                    {typeData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip content={({ active, payload }) =>
                    active && payload?.[0] ? (
                      <div className="bg-card border border-border rounded-xl p-2 shadow-lg text-xs">
                        <p className="text-foreground font-medium">{payload[0].name}</p>
                        <p className="text-primary">{payload[0].value}%</p>
                      </div>
                    ) : null
                  } />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-5 mt-2">
              {typeData.map((t, i) => (
                <span key={t.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  {t.name} ({t.value}%)
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI RECOMMENDATIONS */}
        <div className="bg-gradient-to-br from-violet/10 to-primary/5 border border-primary/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-display font-bold text-foreground">💡 Ce que l'IA recommande pour la semaine prochaine</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {aiRecommendations.map((r, i) => (
              <div key={i} className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 text-sm text-foreground leading-relaxed">
                {r}
              </div>
            ))}
          </div>
          <a href="/dashboard/programmer"
            className="inline-flex items-center gap-2 mt-5 bg-gradient-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium shadow-glow hover:-translate-y-0.5 transition-transform">
            Programmer un post optimisé →
          </a>
        </div>

      </div>

      {/* Post detail panel */}
      {selectedPost && (
        <>
          <div className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm" onClick={() => setSelectedPost(null)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-card border-l border-border shadow-2xl flex flex-col" style={{ animation: "fadeUp 0.3s ease-out" }}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-display font-bold text-foreground">Détails du post</h3>
              <button onClick={() => setSelectedPost(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div className="flex-1 p-5 space-y-4 overflow-auto">
              <div className="aspect-video rounded-xl bg-secondary flex items-center justify-center text-3xl">📷</div>
              <p className="text-foreground font-medium">{selectedPost.title}</p>
              <p className="text-muted-foreground text-sm">{selectedPost.date}</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Likes", value: selectedPost.likes },
                  { label: "Commentaires", value: selectedPost.comments },
                  { label: "Reach", value: selectedPost.reach },
                  { label: "Engagement", value: selectedPost.engagement },
                ].map((m) => (
                  <div key={m.label} className="bg-secondary rounded-xl p-3 text-center">
                    <p className="text-foreground font-bold">{m.value}</p>
                    <p className="text-muted-foreground text-[10px]">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 border-t border-border">
              <a href="/dashboard/programmer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:-translate-y-0.5 transition-transform">
                Reprogrammer ce post →
              </a>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default StatsPage;
