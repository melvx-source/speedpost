import AdminLayout from "@/components/AdminLayout";
import { CalendarClock, CheckCircle2, TrendingUp, Clock, ArrowUpRight, ArrowDownRight, Sparkles, ExternalLink } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useState } from "react";
import InstagramAccountsCard from "@/components/dashboard/InstagramAccountsCard";

/* ─── MOCK DATA ─── */
const kpis = [
  { label: "Posts programmés", value: "12", change: "+3", up: true, icon: CalendarClock, color: "bg-primary/15 text-primary" },
  { label: "Posts publiés", value: "28", change: "+8", up: true, icon: CheckCircle2, color: "bg-green-500/15 text-green-400" },
  { label: "Taux d'engagement", value: "4.7%", change: "+0.3%", up: true, icon: TrendingUp, color: "bg-violet/15 text-violet-light" },
  { label: "Prochain post", value: "Demain 18h", change: "", up: true, icon: Clock, color: "bg-yellow/15 text-yellow", hasImage: true },
];

const upcomingPosts = [
  { id: 1, title: "Nouveau lookbook été — Découvrez notre collection...", date: "Demain 18h00", status: "Programmé", statusColor: "bg-yellow/20 text-yellow" },
  { id: 2, title: "Behind the scenes de notre shooting photo...", date: "Jeu 12h30", status: "Programmé", statusColor: "bg-yellow/20 text-yellow" },
  { id: 3, title: "5 astuces pour booster votre feed Instagram...", date: "Sam 10h00", status: "En attente", statusColor: "bg-muted text-muted-foreground" },
  { id: 4, title: "Carrousel — Les tendances mode 2026...", date: "Lun 09h00", status: "Programmé", statusColor: "bg-yellow/20 text-yellow" },
  { id: 5, title: "Rétrospective du mois de février...", date: "Mar 14h00", status: "Brouillon", statusColor: "bg-primary/20 text-primary" },
];

const activity = [
  { text: "Post publié avec succès", time: "il y a 2h", icon: "✅" },
  { text: "Description régénérée par IA", time: "hier 14h32", icon: "🤖" },
  { text: "Nouveau post ajouté", time: "hier 09h15", icon: "➕" },
  { text: "Filtre appliqué en masse", time: "il y a 2 jours", icon: "🎨" },
  { text: "Erreur de publication — token expiré", time: "il y a 3 jours", icon: "⚠️" },
];

const chartData7 = Array.from({ length: 7 }, (_, i) => ({
  day: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"][i],
  likes: Math.floor(Math.random() * 300 + 150),
  comments: Math.floor(Math.random() * 60 + 20),
}));
const chartData30 = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  likes: Math.floor(Math.random() * 400 + 100),
  comments: Math.floor(Math.random() * 80 + 10),
}));
const chartData90 = Array.from({ length: 12 }, (_, i) => ({
  day: `S${i + 1}`,
  likes: Math.floor(Math.random() * 500 + 200),
  comments: Math.floor(Math.random() * 100 + 30),
}));

const aiSuggestions = [
  { icon: "📈", text: "Vos posts du mardi à 18h obtiennent 2x plus d'engagement." },
  { icon: "🏷️", text: "Le hashtag #lifestyle performe moins bien cette semaine, essayez #slowlife." },
  { icon: "🎠", text: "Les carrousels génèrent 40% plus de reach que les posts simples." },
];

/* ─── CUSTOM TOOLTIP ─── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-lg text-xs">
      <p className="text-foreground font-medium mb-1">{label}</p>
      <p className="text-primary">❤️ {payload[0]?.value} likes</p>
      <p className="text-violet-light">💬 {payload[1]?.value} commentaires</p>
    </div>
  );
};

/* ─── PAGE ─── */
const Dashboard = () => {
  const [chartRange, setChartRange] = useState<"7" | "30" | "90">("30");
  const chartDataMap = { "7": chartData7, "30": chartData30, "90": chartData90 };

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6 max-w-7xl">

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/20 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${kpi.color} flex items-center justify-center`}>
                  <kpi.icon className="w-5 h-5" />
                </div>
                {kpi.change && (
                  <span className={`flex items-center gap-0.5 text-xs font-medium ${kpi.up ? "text-green-400" : "text-destructive"}`}>
                    {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {kpi.change}
                  </span>
                )}
              </div>
              <p className="text-2xl font-display font-bold text-foreground">{kpi.value}</p>
              <p className="text-muted-foreground text-xs mt-1">{kpi.label}</p>
              {kpi.hasImage && (
                <div className="mt-2 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-lg">📸</div>
              )}
            </div>
          ))}
        </div>

        {/* ROW 2: Posts + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Upcoming posts — 3/5 */}
          <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-foreground">Posts à venir</h2>
              <a href="/dashboard/calendrier" className="text-primary text-xs hover:underline font-medium">Voir tous →</a>
            </div>
            <div className="space-y-2">
              {upcomingPosts.map((post) => (
                <div key={post.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer group">
                  <div className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center text-lg flex-shrink-0">📷</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground text-sm truncate group-hover:text-primary transition-colors">{post.title}</p>
                    <p className="text-muted-foreground text-xs">{post.date}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${post.statusColor} flex-shrink-0`}>
                    {post.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity — 2/5 */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
            <h2 className="font-display font-bold text-foreground mb-4">Activité récente</h2>
            <div className="space-y-3">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0 mt-0.5">{a.icon}</span>
                  <div>
                    <p className="text-foreground text-sm">{a.text}</p>
                    <p className="text-muted-foreground text-xs">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 3: Chart */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-foreground">Engagement</h2>
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
              {(["7", "30", "90"] as const).map((r) => (
                <button key={r} onClick={() => setChartRange(r)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${chartRange === r ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  {r === "7" ? "7 jours" : r === "30" ? "30 jours" : "3 mois"}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartDataMap[chartRange]}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 24% 14%)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(245 10% 58%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(245 10% 58%)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="likes" stroke="hsl(349 100% 65%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="comments" stroke="hsl(271 61% 52%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-6 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-primary" /> Likes</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-violet" /> Commentaires</span>
            <a href="/dashboard/statistiques" className="ml-auto text-primary hover:underline font-medium">Voir les statistiques complètes →</a>
          </div>
        </div>

        {/* ROW 4: Accounts + AI */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Connected accounts — real data */}
          <InstagramAccountsCard />

          {/* AI Suggestions */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-foreground">Suggestions IA</h2>
            </div>
            <div className="space-y-3">
              {aiSuggestions.map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50">
                  <span className="text-lg flex-shrink-0">{s.icon}</span>
                  <p className="text-foreground text-sm leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
            <button onClick={() => {}} className="mt-4 w-full py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:-translate-y-0.5 transition-transform">
              Programmer un post maintenant →
            </button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default Dashboard;
