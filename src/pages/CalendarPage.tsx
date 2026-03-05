import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { ChevronLeft, ChevronRight, PlusCircle, X, Edit, Trash2, Filter } from "lucide-react";

/* ─── MOCK DATA ─── */
type PostStatus = "scheduled" | "published" | "draft" | "error";
interface MockPost {
  id: number;
  title: string;
  time: string;
  status: PostStatus;
  day: number;
  hour?: number;
}

const statusConfig: Record<PostStatus, { label: string; dot: string; badge: string }> = {
  scheduled: { label: "Programmé", dot: "bg-yellow", badge: "bg-yellow/20 text-yellow" },
  published: { label: "Publié", dot: "bg-green-500", badge: "bg-green-500/20 text-green-400" },
  draft: { label: "Brouillon", dot: "bg-primary", badge: "bg-primary/20 text-primary" },
  error: { label: "Erreur", dot: "bg-destructive", badge: "bg-destructive/20 text-destructive" },
};

const mockPosts: MockPost[] = [
  { id: 1, title: "Nouveau lookbook été — collection capsule", time: "18:00", status: "scheduled", day: 3, hour: 18 },
  { id: 2, title: "Behind the scenes shooting", time: "12:30", status: "scheduled", day: 7, hour: 12 },
  { id: 3, title: "5 astuces pour votre feed", time: "10:00", status: "published", day: 7, hour: 10 },
  { id: 4, title: "Carrousel tendances mode", time: "09:00", status: "scheduled", day: 11, hour: 9 },
  { id: 5, title: "Rétrospective février", time: "14:00", status: "draft", day: 15, hour: 14 },
  { id: 6, title: "Lancement nouvelle feature", time: "17:00", status: "scheduled", day: 18, hour: 17 },
  { id: 7, title: "Post Instagram story", time: "20:00", status: "error", day: 18, hour: 20 },
  { id: 8, title: "Inspiration du week-end", time: "11:00", status: "published", day: 22, hour: 11 },
  { id: 9, title: "Tips & tricks créateurs", time: "16:00", status: "scheduled", day: 25, hour: 16 },
  { id: 10, title: "Collaboration brand", time: "13:00", status: "published", day: 28, hour: 13 },
];

const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const DAYS_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

/* ─── SIDE PANEL ─── */
const PostPanel = ({ post, onClose }: { post: MockPost; onClose: () => void }) => {
  const sc = statusConfig[post.status];
  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-card border-l border-border shadow-2xl flex flex-col" style={{ animation: "fadeUp 0.3s ease-out" }}>
      <div className="flex items-center justify-between p-5 border-b border-border">
        <h3 className="font-display font-bold text-foreground">Détails du post</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
      </div>
      <div className="flex-1 p-5 space-y-5 overflow-auto">
        <div className="aspect-video rounded-xl bg-secondary flex items-center justify-center text-3xl">📷</div>
        <div>
          <p className="text-foreground font-medium">{post.title}</p>
          <p className="text-muted-foreground text-sm mt-1">Jour {post.day} · {post.time}</p>
        </div>
        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${sc.badge}`}>{sc.label}</span>
      </div>
      <div className="p-5 border-t border-border flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:-translate-y-0.5 transition-transform">
          <Edit className="w-4 h-4" /> Éditer
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/* ─── MONTH VIEW ─── */
const MonthView = ({ year, month, posts, onSelectPost, onSelectEmpty }: {
  year: number; month: number; posts: MockPost[];
  onSelectPost: (p: MockPost) => void; onSelectEmpty: (day: number) => void;
}) => {
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const cells: (number | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS_SHORT.map((d) => (
          <div key={d} className="text-center text-xs text-muted-foreground py-2 font-medium">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 border-t border-l border-border">
        {cells.map((day, i) => {
          const dayPosts = day ? posts.filter((p) => p.day === day) : [];
          const isToday = isCurrentMonth && day === today.getDate();
          return (
            <div
              key={i}
              onClick={() => day && (dayPosts.length > 0 ? onSelectPost(dayPosts[0]) : onSelectEmpty(day))}
              className={`min-h-[90px] lg:min-h-[110px] border-b border-r border-border p-1.5 cursor-pointer transition-colors ${
                day ? "hover:bg-secondary/50" : "bg-secondary/20"
              } ${isToday ? "ring-1 ring-inset ring-primary" : ""}`}
            >
              {day && (
                <>
                  <span className={`text-xs font-medium ${isToday ? "text-primary" : "text-muted-foreground"}`}>{day}</span>
                  <div className="mt-1 space-y-0.5">
                    {dayPosts.slice(0, 3).map((p) => {
                      const sc = statusConfig[p.status];
                      return (
                        <div key={p.id} onClick={(e) => { e.stopPropagation(); onSelectPost(p); }}
                          className="flex items-center gap-1 bg-card rounded px-1 py-0.5 border border-border hover:border-primary/30 transition-colors">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sc.dot}`} />
                          <span className="text-[10px] text-foreground truncate">{p.time}</span>
                        </div>
                      );
                    })}
                    {dayPosts.length > 3 && (
                      <span className="text-[10px] text-primary font-medium pl-1">+{dayPosts.length - 3} autres</span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─── WEEK VIEW ─── */
const WeekView = ({ year, month, weekStart, posts, onSelectPost }: {
  year: number; month: number; weekStart: number; posts: MockPost[];
  onSelectPost: (p: MockPost) => void;
}) => {
  const hours = Array.from({ length: 18 }, (_, i) => i + 6); // 6h-23h
  const days = Array.from({ length: 7 }, (_, i) => weekStart + i);

  return (
    <div className="overflow-auto">
      <div className="grid grid-cols-[60px_repeat(7,1fr)] min-w-[700px]">
        {/* Header */}
        <div className="border-b border-border" />
        {days.map((d) => (
          <div key={d} className="text-center text-xs text-muted-foreground py-2 font-medium border-b border-l border-border">
            {DAYS_SHORT[(d - 1) % 7] || "?"} {d > 0 && d <= 31 ? d : ""}
          </div>
        ))}

        {/* Time grid */}
        {hours.map((h) => (
          <div key={h} className="contents">
            <div className="text-[10px] text-muted-foreground text-right pr-2 py-2 border-b border-border">{h}:00</div>
            {days.map((d) => {
              const post = posts.find((p) => p.day === d && p.hour === h);
              const sc = post ? statusConfig[post.status] : null;
              return (
                <div key={`${d}-${h}`} className="border-b border-l border-border min-h-[40px] relative hover:bg-secondary/30 cursor-pointer transition-colors"
                  onClick={() => post && onSelectPost(post)}>
                  {post && sc && (
                    <div className={`absolute inset-x-0.5 top-0.5 rounded-md px-1.5 py-1 text-[10px] font-medium border ${sc.badge} border-current/10 truncate`}>
                      {post.title.slice(0, 20)}…
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── DAY VIEW ─── */
const DayView = ({ day, posts, onSelectPost }: {
  day: number; posts: MockPost[]; onSelectPost: (p: MockPost) => void;
}) => {
  const hours = Array.from({ length: 18 }, (_, i) => i + 6);
  const dayPosts = posts.filter((p) => p.day === day);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
      <div>
        {hours.map((h) => {
          const post = dayPosts.find((p) => p.hour === h);
          const sc = post ? statusConfig[post.status] : null;
          return (
            <div key={h} className="flex border-b border-border">
              <div className="w-16 text-right pr-3 py-3 text-xs text-muted-foreground flex-shrink-0">{h}:00</div>
              <div className="flex-1 min-h-[48px] py-1 hover:bg-secondary/30 cursor-pointer transition-colors"
                onClick={() => post && onSelectPost(post)}>
                {post && sc && (
                  <div className={`rounded-xl px-3 py-2 ${sc.badge} border border-current/10`}>
                    <p className="text-sm font-medium text-foreground">{post.title}</p>
                    <p className="text-xs mt-0.5">{sc.label} · {post.time}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Side suggestions */}
      <div className="bg-card border border-border rounded-2xl p-5 h-fit space-y-3">
        <h3 className="font-display font-bold text-foreground text-sm">Suggestions IA pour aujourd'hui</h3>
        {["10:00 — Fort engagement prévu", "14:00 — Audience maximale", "18:30 — Créneau optimal"].map((s) => (
          <div key={s} className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2">
            <span className="text-primary">⭐</span> {s}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── MAIN PAGE ─── */
const CalendarPage = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedPost, setSelectedPost] = useState<MockPost | null>(null);
  const [statusFilter, setStatusFilter] = useState<PostStatus | "all">("all");

  const filteredPosts = statusFilter === "all" ? mockPosts : mockPosts.filter((p) => p.status === statusFilter);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  // Week start for week view (Monday of the selected day's week)
  const weekStart = selectedDay - ((new Date(year, month, selectedDay).getDay() + 6) % 7);

  return (
    <AdminLayout title="Calendrier éditorial">
      <div className="max-w-7xl space-y-4">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="font-display font-bold text-lg text-foreground min-w-[180px] text-center">
              {MONTHS[month]} {year}
            </h2>
            <button onClick={nextMonth} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center gap-0.5 bg-secondary rounded-lg p-0.5">
              {(["month", "week", "day"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  {v === "month" ? "Mois" : v === "week" ? "Semaine" : "Jour"}
                </button>
              ))}
            </div>
            <a href="/dashboard/programmer" className="flex items-center gap-1.5 bg-gradient-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium shadow-glow hover:-translate-y-0.5 transition-transform">
              <PlusCircle className="w-4 h-4" /> Nouveau
            </a>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {(["all", "scheduled", "published", "draft", "error"] as const).map((s) => {
            const label = s === "all" ? "Tous" : statusConfig[s].label;
            return (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  statusFilter === s ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:border-primary/30"
                }`}>{label}</button>
            );
          })}
        </div>

        {/* Views */}
        <div className="bg-card border border-border rounded-2xl p-3 lg:p-5 overflow-hidden">
          {view === "month" && (
            <MonthView year={year} month={month} posts={filteredPosts}
              onSelectPost={(p) => setSelectedPost(p)}
              onSelectEmpty={(day) => { /* navigate to programmer with date */ }} />
          )}
          {view === "week" && (
            <WeekView year={year} month={month} weekStart={weekStart} posts={filteredPosts}
              onSelectPost={(p) => setSelectedPost(p)} />
          )}
          {view === "day" && (
            <DayView day={selectedDay} posts={filteredPosts}
              onSelectPost={(p) => setSelectedPost(p)} />
          )}
        </div>

        {/* Day selector for day view */}
        {view === "day" && (
          <div className="flex items-center gap-2">
            <button onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))} className="text-muted-foreground hover:text-foreground"><ChevronLeft className="w-5 h-5" /></button>
            <span className="text-sm text-foreground font-medium min-w-[100px] text-center">Jour {selectedDay}</span>
            <button onClick={() => setSelectedDay(Math.min(31, selectedDay + 1))} className="text-muted-foreground hover:text-foreground"><ChevronRight className="w-5 h-5" /></button>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-5 text-xs text-muted-foreground">
          {Object.entries(statusConfig).map(([key, val]) => (
            <span key={key} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${val.dot}`} /> {val.label}
            </span>
          ))}
        </div>
      </div>

      {/* Side panel */}
      {selectedPost && (
        <>
          <div className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm" onClick={() => setSelectedPost(null)} />
          <PostPanel post={selectedPost} onClose={() => setSelectedPost(null)} />
        </>
      )}
    </AdminLayout>
  );
};

export default CalendarPage;
