import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, type ReactNode, type CSSProperties } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UpKeep MM — Mobile Prototype" },
      { name: "description", content: "Interactive mobile prototype of the UpKeep MM Enterprise Maintenance Management app." },
      { property: "og:title", content: "UpKeep MM — Mobile Prototype" },
      { property: "og:description", content: "Interactive mobile prototype of the UpKeep MM Enterprise Maintenance Management app." },
    ],
  }),
  component: Index,
});

/* ---------------- Design tokens ---------------- */
const C = {
  primary: "#0037b0",
  secondary: "#0051d5",
  primaryFixed: "#dce1ff",
  onPrimary: "#ffffff",
  onPrimaryFixed: "#001551",
  surface: "#f9f9ff",
  bg: "#f9f9ff",
  sLowest: "#ffffff",
  sLow: "#f1f3ff",
  sMid: "#e9edff",
  sHigh: "#e1e8fd",
  onSurface: "#141b2b",
  onSurfaceVar: "#434655",
  outline: "#747686",
  outlineVar: "#c4c5d7",
  error: "#ba1a1a",
};

/* ---------------- Icon (Material Symbols) ---------------- */
const Icon = ({ n, size = 20, color, fill = false, style }: { n: string; size?: number; color?: string; fill?: boolean; style?: CSSProperties }) => (
  <span
    className="material-symbols-outlined select-none"
    style={{
      fontSize: size,
      lineHeight: 1,
      color,
      fontVariationSettings: fill ? "'FILL' 1" : "'FILL' 0",
      ...style,
    }}
  >
    {n}
  </span>
);

/* ---------------- Mock data ---------------- */
type Status = "open" | "acknowledged" | "in_progress" | "completed" | "verified" | "cancelled";
type Priority = "normal" | "urgent";
type Job = {
  id: string;
  order: string;
  title: string;
  location: string;
  floor: string;
  status: Status;
  priority: Priority;
  category: [string, string];
  asset?: string;
  vendor?: string;
  reporter: string;
  reporterType: string;
  description: string;
  reportedAt: string;
};

const JOBS: Job[] = [
  { id: "1", order: "ORD-1042", title: "AC not cooling in Meeting Room B", location: "Sakura Tower", floor: "Level 12, Meeting Room B · Kyauktada", status: "in_progress", priority: "urgent", category: ["HVAC", "Not Cooling"], asset: "AHU-04B", vendor: "CoolAir Myanmar", reporter: "Ma Aye Thida", reporterType: "Client", description: "Meeting room AC stopped cooling around 9am, room is now ~32°C.", reportedAt: "Today 09:14" },
  { id: "2", order: "ORD-1041", title: "Leaking pipe under pantry sink", location: "FMI Centre", floor: "Level 8, Pantry Area · Bahan", status: "acknowledged", priority: "normal", category: ["Plumbing", "Pipe Leak"], reporter: "Daw Khin Myo Aye", reporterType: "Client", description: "Slow drip from the U-bend, bucket placed underneath.", reportedAt: "Today 08:02" },
  { id: "3", order: "ORD-1040", title: "Tripped breaker in server room", location: "Sule Square", floor: "Level 5, Server Room · Kyauktada", status: "open", priority: "urgent", category: ["Electrical", "Tripped Breaker"], reporter: "Reception", reporterType: "Walk-in", description: "Server room lost power at 7:45am, racks on UPS.", reportedAt: "Today 07:48" },
  { id: "4", order: "ORD-1039", title: "Ceiling tile damage near reception", location: "Taw Win Centre", floor: "Level 6, Reception · Bahan", status: "completed", priority: "normal", category: ["Civil", "Ceiling Damage"], reporter: "Ma Thant Sin", reporterType: "Client", description: "Two tiles sagging, possible water damage from above.", reportedAt: "Yesterday 16:20" },
  { id: "5", order: "ORD-1038", title: "Spillage on open floor area", location: "Times City", floor: "Level 2, Open Floor · Kamaryut", status: "verified", priority: "normal", category: ["Janitorial", "Spillage"], reporter: "Pantry Staff", reporterType: "Walk-in", description: "Tea spill near the entrance, ~1m wide.", reportedAt: "Yesterday 11:05" },
];

const TECHNICIANS = ["Ko Aung Kyaw Zin", "Ko Pyae Sone", "Ko Zaw Lin Htet"];
const VENDORS = ["CoolAir Myanmar", "FlowFix Plumbing Yangon", "Voltline Electric MM", "BuildRight Civil Yangon"];
const LOCATIONS = [
  "Sakura Tower — Level 12, Meeting Room B (Kyauktada)",
  "FMI Centre — Level 8, Pantry Area (Bahan)",
  "Junction City — Level 3, Car Park B1 (Pabedan)",
  "Taw Win Centre — Level 6, Reception (Bahan)",
  "Times City — Level 2, Open Floor (Kamaryut)",
  "Sule Square — Level 5, Server Room (Kyauktada)",
];
const CLIENTS = ["Ma Aye Thida", "Daw Khin Myo Aye", "Ma Thant Sin"];
const CATEGORY_MAP: Record<string, string[]> = {
  HVAC: ["Not Cooling", "Not Heating", "Strange Noise", "Water Leak", "Filter Change", "Other"],
  Plumbing: ["Low Water Pressure", "Pipe Leak", "Blocked Drain", "No Hot Water", "Burst Pipe", "Other"],
  Electrical: ["Power Outage", "Wiring Fault", "Lighting Issue", "Tripped Breaker", "Socket Not Working", "Other"],
  Civil: ["Ceiling Damage", "Floor Damage", "Door / Window Issue", "Wall Crack", "Roof Leak", "Other"],
  Janitorial: ["Spillage", "Pest Report", "Waste Collection", "General Cleaning", "Other"],
  Security: ["Access Card Issue", "CCTV Fault", "Broken Lock", "Alarm Triggered", "Other"],
};

/* ---------------- Shared UI ---------------- */
const StatusBadge = ({ status }: { status: Status }) => {
  const map: Record<Status, { bg: string; text: string; label: string; pulse?: boolean }> = {
    open: { bg: C.sHigh, text: C.onSurfaceVar, label: "Open" },
    acknowledged: { bg: C.primaryFixed, text: C.onPrimaryFixed, label: "Acknowledged" },
    in_progress: { bg: "#eff6ff", text: "#1d4ed8", label: "In Progress", pulse: true },
    completed: { bg: "#f0fdf4", text: "#15803d", label: "Completed" },
    verified: { bg: "#f0fdfa", text: "#0f766e", label: "Verified" },
    cancelled: { bg: "#fef2f2", text: "#b91c1c", label: "Cancelled" },
  };
  const m = map[status];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: m.bg, color: m.text }}>
      {m.pulse && <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: m.text }} /><span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: m.text }} /></span>}
      {m.label}
    </span>
  );
};

const PriorityBadge = ({ p }: { p: Priority }) =>
  p === "urgent" ? (
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: "#fef2f2", color: "#b91c1c" }}>
      <Icon n="priority_high" size={12} color="#b91c1c" /> Urgent
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: C.sMid, color: C.onSurfaceVar }}>
      Normal
    </span>
  );

const JobCard = ({ job, onTap }: { job: Job; onTap: () => void }) => (
  <button onClick={onTap} className="w-full rounded-xl bg-white p-4 text-left shadow-sm transition active:scale-[0.99]" style={{ border: `1px solid ${C.outlineVar}` }}>
    <div className="flex items-center justify-between"><PriorityBadge p={job.priority} /><StatusBadge status={job.status} /></div>
    <div className="mt-2.5 text-[15px] font-semibold leading-snug" style={{ color: C.onSurface }}>{job.title}</div>
    <div className="mt-1 text-[13px]" style={{ color: C.onSurfaceVar }}>{job.location} · {job.floor}</div>
    <div className="mt-2 flex items-center justify-between">
      <span className="text-[11px] font-medium tracking-wide" style={{ color: C.outline }}>#{job.order}</span>
      <Icon n="chevron_right" size={20} color={C.outline} />
    </div>
  </button>
);

const SectionHeader = ({ children }: { children: ReactNode }) => (
  <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ background: C.sLow, color: C.onSurfaceVar }}>{children}</div>
);

const PrimaryButton = ({ children, onClick, icon, disabled }: { children: ReactNode; onClick?: () => void; icon?: string; disabled?: boolean }) => (
  <button onClick={onClick} disabled={disabled} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[14px] font-semibold uppercase tracking-[0.05em] transition active:opacity-80 disabled:opacity-50" style={{ background: C.primary, color: C.onPrimary }}>
    {icon && <Icon n={icon} size={18} color={C.onPrimary} />} {children}
  </button>
);

const SecondaryButton = ({ children, onClick, icon }: { children: ReactNode; onClick?: () => void; icon?: string }) => (
  <button onClick={onClick} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl text-[13px] font-semibold transition active:opacity-80" style={{ background: C.sLow, color: C.primary, border: `1px solid ${C.outlineVar}` }}>
    {icon && <Icon n={icon} size={18} color={C.primary} />} {children}
  </button>
);

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div>
    <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: C.onSurfaceVar }}>{label}</div>
    {children}
  </div>
);

const inputCls = "h-12 w-full rounded-lg px-3.5 text-[14px] outline-none transition focus:bg-white";
const inputStyle: CSSProperties = { background: C.sLow, border: `1px solid ${C.outlineVar}`, color: C.onSurface };

const Input = (p: React.InputHTMLAttributes<HTMLInputElement>) => <input {...p} className={inputCls} style={inputStyle} />;
const TextArea = (p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...p} className="w-full rounded-lg p-3 text-[14px] outline-none focus:bg-white" style={{ ...inputStyle, minHeight: 96 }} />;
const Select = (p: React.SelectHTMLAttributes<HTMLSelectElement>) => <select {...p} className={inputCls} style={inputStyle} />;

const SegmentedToggle = <T extends string>({ options, value, onChange }: { options: T[]; value: T; onChange: (v: T) => void }) => (
  <div className="flex rounded-lg p-1" style={{ background: C.sLow, border: `1px solid ${C.outlineVar}` }}>
    {options.map((o) => {
      const active = o === value;
      return (
        <button key={o} onClick={() => onChange(o)} className="flex-1 rounded-md py-2 text-[12px] font-semibold capitalize transition" style={{ background: active ? C.primary : "transparent", color: active ? C.onPrimary : C.onSurfaceVar }}>{o.replace("_", " ")}</button>
      );
    })}
  </div>
);

const Toast = ({ msg }: { msg: string }) => (
  <div className="pointer-events-none absolute left-1/2 top-16 z-50 -translate-x-1/2 rounded-full px-4 py-2 text-[13px] font-semibold shadow-lg" style={{ background: "#15803d", color: "white" }}>
    <span className="inline-flex items-center gap-1.5"><Icon n="check_circle" size={16} color="white" />{msg}</span>
  </div>
);

const TimelineStep = ({ status, label, time, note, last }: { status: "done" | "current" | "pending"; label: string; time?: string; note?: string; last?: boolean }) => (
  <div className="flex gap-3">
    <div className="flex flex-col items-center">
      {status === "done" && <div className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: C.primary }}><Icon n="check" size={14} color="white" /></div>}
      {status === "current" && <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white" style={{ border: `2px solid ${C.primary}` }}><span className="h-2 w-2 animate-pulse rounded-full" style={{ background: C.primary }} /></div>}
      {status === "pending" && <div className="h-6 w-6 rounded-full bg-white" style={{ border: `1px solid ${C.outlineVar}` }} />}
      {!last && <div className="mt-1 w-0.5 flex-1" style={{ background: status === "done" ? `${C.primary}55` : C.outlineVar }} />}
    </div>
    <div className="flex-1 pb-5">
      <div className="text-[14px] font-semibold" style={{ color: status === "current" ? C.primary : status === "pending" ? `${C.onSurfaceVar}99` : C.onSurface }}>{label}</div>
      {time && <div className="text-[12px]" style={{ color: C.outline }}>{time}</div>}
      {note && <div className="mt-1 text-[12px]" style={{ color: C.onSurfaceVar }}>{note}</div>}
    </div>
  </div>
);

/* ---------------- App state ---------------- */
type Role = "admin" | "technician" | "client";
type Screen =
  | { name: "login" }
  | { name: "role" }
  | { name: "tab"; role: Role; tab: string }
  | { name: "jobDetail"; role: Role; jobId: string; from: string };

function Index() {
  const [screen, setScreen] = useState<Screen>({ name: "login" });
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 1800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center font-[Inter] p-0 sm:p-6" style={{ background: "#0b1020", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div className="relative w-full max-w-[420px] overflow-hidden bg-white shadow-2xl sm:rounded-[40px]" style={{ height: "100dvh", maxHeight: "880px", background: C.bg, border: `1px solid ${C.outlineVar}` }}>
        {toast && <Toast msg={toast} />}
        <Router screen={screen} setScreen={setScreen} showToast={showToast} />
      </div>
    </div>
  );
}

function Router({ screen, setScreen, showToast }: { screen: Screen; setScreen: (s: Screen) => void; showToast: (m: string) => void }) {
  if (screen.name === "login") return <LoginScreen onNext={() => setScreen({ name: "role" })} />;
  if (screen.name === "role") return <RoleSelectScreen onBack={() => setScreen({ name: "login" })} onPick={(r) => setScreen({ name: "tab", role: r, tab: defaultTab(r) })} />;
  if (screen.name === "jobDetail") {
    const job = JOBS.find((j) => j.id === screen.jobId)!;
    if (screen.role === "admin") return <AdminJobDetailScreen job={job} onBack={() => setScreen({ name: "tab", role: "admin", tab: screen.from })} showToast={showToast} />;
    if (screen.role === "technician") return <TechJobDetailScreen job={job} onBack={() => setScreen({ name: "tab", role: "technician", tab: screen.from })} showToast={showToast} />;
    return <ClientRequestDetailScreen job={job} onBack={() => setScreen({ name: "tab", role: "client", tab: screen.from })} />;
  }
  return (
    <TabShell role={screen.role} tab={screen.tab} setTab={(t) => setScreen({ name: "tab", role: screen.role, tab: t })} onJob={(jobId) => setScreen({ name: "jobDetail", role: screen.role, jobId, from: screen.tab })} onSignOut={() => setScreen({ name: "login" })} onSwitchRole={() => setScreen({ name: "role" })} showToast={showToast} />
  );
}

const defaultTab = (r: Role) => (r === "admin" ? "jobs" : r === "technician" ? "myjobs" : "requests");

/* ---------------- Auth screens ---------------- */
function LoginScreen({ onNext }: { onNext: () => void }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex h-full flex-col px-6 pt-16" style={{ background: C.bg }}>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-md" style={{ background: C.primary }}>
            <Icon n="precision_manufacturing" size={32} color="white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight" style={{ color: C.onSurface }}>UpKeep MM</h1>
          <p className="mt-1 text-[13px]" style={{ color: C.onSurfaceVar }}>Enterprise Maintenance Management</p>
        </div>

        <div className="mt-12 space-y-4">
          <Field label="Email"><Input type="email" defaultValue="demo@upkeepmm.com" /></Field>
          <Field label="Password">
            <div className="relative">
              <Input type={show ? "text" : "password"} defaultValue="••••••••••" />
              <button onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2"><Icon n={show ? "visibility_off" : "visibility"} size={20} color={C.onSurfaceVar} /></button>
            </div>
          </Field>

          <label className="flex items-center gap-2 text-[13px]" style={{ color: C.onSurfaceVar }}>
            <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#0037b0]" /> Keep me signed in
          </label>

          <div className="pt-2"><PrimaryButton onClick={onNext}>Sign In</PrimaryButton></div>
          <button className="w-full text-center text-[13px] font-medium" style={{ color: C.primary }}>Forgot Password?</button>
        </div>
      </div>
      <div className="pb-8 pt-4 text-center text-[11px]" style={{ color: C.outline }}>v1.0 · Prototype</div>
    </div>
  );
}

function RoleSelectScreen({ onBack, onPick }: { onBack: () => void; onPick: (r: Role) => void }) {
  const roles: { r: Role; icon: string; label: string; desc: string }[] = [
    { r: "admin", icon: "shield_person", label: "Admin", desc: "Oversee all jobs, assign work, manage requests" },
    { r: "technician", icon: "engineering", label: "Technician", desc: "View assigned jobs and update progress" },
    { r: "client", icon: "person", label: "Client", desc: "Submit and track maintenance requests" },
  ];
  return (
    <div className="flex h-full flex-col" style={{ background: C.bg }}>
      <div className="flex items-center gap-2 px-4 pt-12 pb-2">
        <button onClick={onBack} className="-ml-2 p-2"><Icon n="arrow_back" size={24} color={C.onSurface} /></button>
      </div>
      <div className="px-6 pb-4">
        <h1 className="text-[22px] font-bold" style={{ color: C.onSurface }}>Choose your portal</h1>
        <p className="mt-1 text-[13px]" style={{ color: C.onSurfaceVar }}>Select the role you want to enter as.</p>
      </div>
      <div className="flex-1 space-y-3 px-4">
        {roles.map(({ r, icon, label, desc }) => (
          <button key={r} onClick={() => onPick(r)} className="w-full rounded-2xl bg-white p-4 text-left shadow-sm transition active:scale-[0.99]" style={{ border: `1px solid ${C.outlineVar}` }}>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: C.primaryFixed }}>
                <Icon n={icon} size={24} color={C.onPrimaryFixed} />
              </div>
              <div className="flex-1">
                <div className="text-[16px] font-semibold" style={{ color: C.onSurface }}>{label}</div>
                <div className="text-[12px]" style={{ color: C.onSurfaceVar }}>{desc}</div>
              </div>
              <Icon n="chevron_right" size={20} color={C.outline} />
            </div>
            <div className="mt-3 text-[12px] font-semibold uppercase tracking-wide" style={{ color: C.primary }}>Enter {label} Portal →</div>
          </button>
        ))}
      </div>
      <div className="pb-8" />
    </div>
  );
}

/* ---------------- Tab shell ---------------- */
function TabShell({ role, tab, setTab, onJob, onSignOut, onSwitchRole, showToast }: { role: Role; tab: string; setTab: (t: string) => void; onJob: (id: string) => void; onSignOut: () => void; onSwitchRole: () => void; showToast: (m: string) => void }) {
  const tabs: { id: string; label: string; icon: string }[] =
    role === "admin"
      ? [{ id: "jobs", label: "Jobs", icon: "assignment" }, { id: "submit", label: "Submit", icon: "add_task" }, { id: "settings", label: "Settings", icon: "settings" }]
      : role === "technician"
        ? [{ id: "myjobs", label: "My Jobs", icon: "assignment" }, { id: "settings", label: "Settings", icon: "settings" }]
        : [{ id: "requests", label: "My Requests", icon: "list_alt" }, { id: "new", label: "New Request", icon: "add_circle" }, { id: "settings", label: "Settings", icon: "settings" }];

  return (
    <div className="flex h-full flex-col" style={{ background: C.bg }}>
      <div className="flex-1 overflow-y-auto pb-20">
        {role === "admin" && tab === "jobs" && <AdminJobsScreen onJob={onJob} />}
        {role === "admin" && tab === "submit" && <AdminSubmitScreen onDone={() => { showToast("Job submitted"); setTab("jobs"); }} />}
        {role === "admin" && tab === "settings" && <SettingsScreen role="Admin" onSignOut={onSignOut} onSwitchRole={onSwitchRole} />}
        {role === "technician" && tab === "myjobs" && <TechJobsScreen onJob={onJob} />}
        {role === "technician" && tab === "settings" && <SettingsScreen role="Technician" onSignOut={onSignOut} onSwitchRole={onSwitchRole} />}
        {role === "client" && tab === "requests" && <ClientRequestsScreen onJob={onJob} onNew={() => setTab("new")} />}
        {role === "client" && tab === "new" && <ClientNewRequestScreen onDone={() => { showToast("Request submitted"); setTab("requests"); }} />}
        {role === "client" && tab === "settings" && <SettingsScreen role="Client" onSignOut={onSignOut} onSwitchRole={onSwitchRole} />}
      </div>
      <nav className="absolute bottom-0 left-0 right-0 flex" style={{ background: C.sLowest, borderTop: `1px solid ${C.outlineVar}` }}>
        {tabs.map((t) => {
          const active = t.id === tab;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className="flex flex-1 flex-col items-center gap-0.5 py-2.5">
              <Icon n={t.icon} size={24} color={active ? C.primary : C.onSurfaceVar} fill={active} />
              <span className="text-[11px] font-semibold" style={{ color: active ? C.primary : C.onSurfaceVar }}>{t.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/* ---------------- Shared screen pieces ---------------- */
const TopBar = ({ title, right, onBack }: { title: string; right?: ReactNode; onBack?: () => void }) => (
  <div className="flex items-center gap-2 px-4 pt-12 pb-3" style={{ background: C.bg }}>
    {onBack && <button onClick={onBack} className="-ml-2 p-1.5"><Icon n="arrow_back" size={24} color={C.onSurface} /></button>}
    <h1 className="flex-1 text-[20px] font-bold" style={{ color: C.onSurface }}>{title}</h1>
    {right}
  </div>
);

const StatCard = ({ n, label, sub, accent }: { n: string; label: string; sub: string; accent: string }) => (
  <div className="min-w-[140px] rounded-xl p-3" style={{ background: C.sLowest, border: `1px solid ${C.outlineVar}` }}>
    <div className="text-[28px] font-bold leading-none" style={{ color: accent }}>{n}</div>
    <div className="mt-1 text-[12px] font-semibold" style={{ color: C.onSurface }}>{label}</div>
    <div className="text-[11px]" style={{ color: C.onSurfaceVar }}>{sub}</div>
  </div>
);

const FilterChips = ({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) => (
  <div className="-mx-4 mb-2 flex gap-2 overflow-x-auto px-4 pb-1" style={{ scrollbarWidth: "none" }}>
    {options.map((o) => {
      const active = value === o;
      return (
        <button key={o} onClick={() => onChange(o)} className="shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={{ background: active ? C.primary : C.sLowest, color: active ? C.onPrimary : C.onSurfaceVar, border: `1px solid ${active ? C.primary : C.outlineVar}` }}>{o}</button>
      );
    })}
  </div>
);

/* ---------------- Admin screens ---------------- */
function AdminJobsScreen({ onJob }: { onJob: (id: string) => void }) {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Open", "In Progress", "Completed", "Urgent"];
  const filtered = useMemo(
    () => JOBS.filter((j) => filter === "All" || (filter === "Urgent" ? j.priority === "urgent" : j.status === filter.toLowerCase().replace(" ", "_"))),
    [filter]
  );

  return (
    <div>
      <TopBar title="All Jobs" right={<button className="p-2"><Icon n="search" size={22} color={C.onSurface} /></button>} />
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-3" style={{ scrollbarWidth: "none" }}>
        <StatCard n="42" label="Completed" sub="This week" accent="#15803d" />
        <StatCard n="18" label="Assigned" sub="Active" accent={C.primary} />
        <StatCard n="7" label="In Progress" sub="Right now" accent="#1d4ed8" />
      </div>
      <div className="px-4"><FilterChips options={filters} value={filter} onChange={setFilter} /></div>
      <div className="space-y-2.5 px-4 pt-2">
        {filtered.map((j) => <JobCard key={j.id} job={j} onTap={() => onJob(j.id)} />)}
        {filtered.length === 0 && <EmptyState icon="inbox" title="No jobs match this filter" />}
      </div>
    </div>
  );
}

function AdminJobDetailScreen({ job, onBack, showToast }: { job: Job; onBack: () => void; showToast: (m: string) => void }) {
  const [statusOpen, setStatusOpen] = useState(true);
  const [assignOpen, setAssignOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<Status>(job.status);
  const [note, setNote] = useState("");

  return (
    <div>
      <TopBar title="Job Detail" onBack={onBack} />
      <div className="space-y-3 px-4 pb-6">
        <div className="rounded-2xl bg-white p-4" style={{ border: `1px solid ${C.outlineVar}` }}>
          <div className="text-[11px] font-semibold tracking-wide" style={{ color: C.outline }}>#{job.order}</div>
          <h2 className="mt-1 text-[22px] font-bold leading-tight" style={{ color: C.onSurface }}>{job.title}</h2>
          <div className="mt-3 flex gap-2"><PriorityBadge p={job.priority} /><StatusBadge status={job.status} /></div>
          <div className="mt-3 flex items-center gap-1.5 text-[12px]" style={{ color: C.onSurfaceVar }}>
            <Icon n="lock" size={14} color={C.outline} /> Reported {job.reportedAt} · <span className="font-semibold tracking-wide" style={{ color: C.outline }}>AUTO-LOCKED</span>
          </div>
        </div>

        <InfoCard rows={[
          ["Category", `${job.category[0]} → ${job.category[1]}`],
          ["Location", `${job.location} · ${job.floor}`],
          ...(job.asset ? [["Asset", job.asset] as [string, string]] : []),
          ["Vendor", job.vendor ?? "Not assigned"],
          ["Reporter", `${job.reporter} (${job.reporterType})`],
        ]} />

        <Collapsible open={statusOpen} onToggle={() => setStatusOpen(!statusOpen)} title="Update Status" icon="published_with_changes">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg p-3" style={{ background: C.sLow }}>
              <span className="text-[12px] uppercase tracking-wide" style={{ color: C.onSurfaceVar }}>Current</span>
              <StatusBadge status={job.status} />
            </div>
            <Field label="New status">
              <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value as Status)}>
                {(["open", "acknowledged", "in_progress", "completed", "verified", "cancelled"] as Status[]).map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
              </Select>
            </Field>
            <Field label="Note"><TextArea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note for the log…" /></Field>
            <PrimaryButton onClick={() => showToast("Status updated")}>Update Status</PrimaryButton>
          </div>
        </Collapsible>

        <Collapsible open={assignOpen} onToggle={() => setAssignOpen(!assignOpen)} title="Assign Technician" icon="engineering">
          <div className="space-y-3">
            <Field label="Technician"><Select>{TECHNICIANS.map((t) => <option key={t}>{t}</option>)}</Select></Field>
            <Field label="Vendor"><Select>{VENDORS.map((v) => <option key={v}>{v}</option>)}</Select></Field>
            <PrimaryButton onClick={() => showToast("Assignment saved")}>Save Assignment</PrimaryButton>
          </div>
        </Collapsible>

        <div className="rounded-2xl bg-white p-4" style={{ border: `1px solid ${C.outlineVar}` }}>
          <div className="mb-3 text-[12px] font-semibold uppercase tracking-wide" style={{ color: C.onSurfaceVar }}>Activity Log</div>
          <TimelineStep status="done" label="Submitted" time="Today 09:14" note={`by ${job.reporter}`} />
          <TimelineStep status="done" label="Acknowledged" time="Today 09:22" note="by Admin" />
          <TimelineStep status="current" label="In Progress" time="Today 09:48" note={`Tech assigned: ${TECHNICIANS[0]}`} />
          <TimelineStep status="pending" label="Completed" />
          <TimelineStep status="pending" label="Verified" last />
        </div>

        <div className="rounded-2xl bg-white p-4" style={{ border: `1px solid ${C.outlineVar}` }}>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: C.onSurfaceVar }}>Attachments</div>
            <button className="text-[12px] font-semibold" style={{ color: C.primary }}>View All</button>
          </div>
          <div className="-mx-1 flex gap-2 overflow-x-auto">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 w-20 shrink-0 rounded-lg" style={{ background: `linear-gradient(135deg, ${C.primaryFixed}, ${C.sHigh})`, border: `1px solid ${C.outlineVar}` }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminSubmitScreen({ onDone }: { onDone: () => void }) {
  const [priority, setPriority] = useState<Priority>("normal");
  const [cat, setCat] = useState("HVAC");
  return (
    <div>
      <TopBar title="Submit Job" />
      <div className="space-y-3 px-4 pb-6">
        <Field label="Client"><Select>{CLIENTS.map((c) => <option key={c}>{c}</option>)}</Select></Field>
        <Field label="Issue Title"><Input placeholder="e.g. AC not cooling" /></Field>
        <Field label="Location"><Select>{LOCATIONS.map((l) => <option key={l}>{l}</option>)}</Select></Field>
        <Field label="Asset (optional)"><Select><option>—</option><option>AHU-04B</option><option>Pump-12</option></Select></Field>
        <Field label="Priority"><SegmentedToggle options={["normal", "urgent"] as Priority[]} value={priority} onChange={setPriority} /></Field>
        <Field label="Category"><Select value={cat} onChange={(e) => setCat(e.target.value)}>{Object.keys(CATEGORY_MAP).map((k) => <option key={k}>{k}</option>)}</Select></Field>
        <Field label="Sub-category"><Select>{CATEGORY_MAP[cat].map((s) => <option key={s}>{s}</option>)}</Select></Field>
        <Field label="Description"><TextArea rows={4} placeholder="Describe the issue…" /></Field>
        <Field label="Attachments">
          <SecondaryButton icon="add_photo_alternate">Add Photos</SecondaryButton>
          <div className="mt-2 flex gap-2"><div className="h-16 w-16 rounded-lg" style={{ background: C.sMid }} /><div className="h-16 w-16 rounded-lg" style={{ background: C.sMid }} /></div>
        </Field>
        <div className="pt-2"><PrimaryButton onClick={onDone} icon="send">Submit Job</PrimaryButton></div>
      </div>
    </div>
  );
}

/* ---------------- Technician screens ---------------- */
function TechJobsScreen({ onJob }: { onJob: (id: string) => void }) {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Urgent", "In Progress", "Assigned"];
  const list = JOBS.filter((j) => j.status !== "verified" && j.status !== "cancelled");
  return (
    <div>
      <TopBar title="My Jobs" right={<button className="relative p-2"><Icon n="notifications" size={22} color={C.onSurface} /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full" style={{ background: C.error }} /></button>} />
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-3" style={{ scrollbarWidth: "none" }}>
        <StatCard n="12" label="Completed" sub="This week" accent="#15803d" />
        <StatCard n="5" label="Assigned" sub="To you" accent={C.primary} />
        <StatCard n="2" label="In Progress" sub="Right now" accent="#1d4ed8" />
      </div>
      <div className="px-4"><FilterChips options={filters} value={filter} onChange={setFilter} /></div>
      <div className="space-y-2.5 px-4 pt-2">{list.map((j) => <JobCard key={j.id} job={j} onTap={() => onJob(j.id)} />)}</div>
    </div>
  );
}

function TechJobDetailScreen({ job, onBack, showToast }: { job: Job; onBack: () => void; showToast: (m: string) => void }) {
  const [step, setStep] = useState<"acknowledged" | "in_progress" | "completed">("in_progress");
  const [pre, setPre] = useState(true);
  const [post, setPost] = useState(false);
  return (
    <div className="pb-24">
      <TopBar title={`#${job.order}`} onBack={onBack} />
      <div className="space-y-3 px-4">
        <div className="rounded-2xl bg-white p-4" style={{ border: `1px solid ${C.outlineVar}` }}>
          <h2 className="text-[20px] font-bold leading-tight" style={{ color: C.onSurface }}>{job.title}</h2>
          <div className="mt-2 flex gap-2"><PriorityBadge p={job.priority} /><StatusBadge status={job.status} /></div>
          <div className="mt-2 flex items-center gap-1.5 text-[12px]" style={{ color: C.onSurfaceVar }}><Icon n="lock" size={14} color={C.outline} /> Reported {job.reportedAt}</div>
        </div>

        <InfoCard rows={[
          ["Category", `${job.category[0]} → ${job.category[1]}`],
          ["Location", `${job.location} · ${job.floor}`],
          ["Asset", job.asset ?? "—"],
          ["Description", job.description],
        ]} />

        <div className="rounded-2xl bg-white p-4 space-y-3" style={{ border: `1px solid ${C.outlineVar}` }}>
          <div className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: C.onSurfaceVar }}>Update Status</div>
          <SegmentedToggle options={["acknowledged", "in_progress", "completed"] as const} value={step} onChange={setStep} />
          <TextArea rows={3} placeholder="Add a note…" />
          <PrimaryButton onClick={() => showToast("Status updated")}>Update Status</PrimaryButton>
        </div>

        <div className="rounded-2xl bg-white p-4 space-y-3" style={{ border: `1px solid ${C.outlineVar}` }}>
          <div className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: C.onSurfaceVar }}>Photo Upload</div>
          <Checkitem checked={pre} onClick={() => setPre(!pre)} label="Pre-job photos uploaded" />
          <SecondaryButton icon="photo_camera" onClick={() => { setPre(true); showToast("Pre-job photos uploaded"); }}>Upload Pre-job Photos</SecondaryButton>
          <div className="flex gap-2">{[1, 2].map((i) => <div key={i} className="h-16 w-16 rounded-lg" style={{ background: C.sMid }} />)}</div>
          <div className="my-1 h-px" style={{ background: C.outlineVar }} />
          <Checkitem checked={post} onClick={() => setPost(!post)} label="Post-job photos uploaded" />
          <SecondaryButton icon="photo_camera" onClick={() => { setPost(true); showToast("Post-job photos uploaded"); }}>Upload Post-job Photos</SecondaryButton>
        </div>

        <div className="rounded-2xl bg-white p-4 space-y-2" style={{ border: `1px solid ${C.outlineVar}` }}>
          <div className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: C.onSurfaceVar }}>Requester Photos</div>
          <div className="flex gap-2">{[1, 2, 3].map((i) => <div key={i} className="h-16 w-16 rounded-lg" style={{ background: `linear-gradient(135deg, ${C.primaryFixed}, ${C.sHigh})` }} />)}</div>
        </div>
      </div>
      <div className="absolute bottom-[68px] left-0 right-0 px-4 py-3" style={{ background: C.bg, borderTop: `1px solid ${C.outlineVar}` }}>
        <PrimaryButton icon="check_circle" onClick={() => { showToast("Marked as done"); onBack(); }}>Mark as Done</PrimaryButton>
      </div>
    </div>
  );
}

const Checkitem = ({ checked, onClick, label }: { checked: boolean; onClick: () => void; label: string }) => (
  <button onClick={onClick} className="flex items-center gap-2 text-[13px]" style={{ color: checked ? "#15803d" : C.onSurfaceVar }}>
    <Icon n={checked ? "check_box" : "check_box_outline_blank"} size={20} color={checked ? "#15803d" : C.outline} /> {label}
  </button>
);

/* ---------------- Client screens ---------------- */
function ClientRequestsScreen({ onJob, onNew }: { onJob: (id: string) => void; onNew: () => void }) {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Open", "In Progress", "Completed"];
  const mine = JOBS.slice(0, 3);
  const filtered = mine.filter((j) => filter === "All" || j.status === filter.toLowerCase().replace(" ", "_"));
  return (
    <div>
      <TopBar title="My Requests" />
      <div className="px-4"><FilterChips options={filters} value={filter} onChange={setFilter} /></div>
      <div className="space-y-2.5 px-4 pt-2">
        {filtered.map((j) => <JobCard key={j.id} job={j} onTap={() => onJob(j.id)} />)}
        {filtered.length === 0 && (
          <EmptyState icon="inbox" title="No requests yet" cta={{ label: "Submit your first request", onClick: onNew }} />
        )}
      </div>
    </div>
  );
}

function ClientRequestDetailScreen({ job, onBack }: { job: Job; onBack: () => void }) {
  const order: Status[] = ["open", "acknowledged", "in_progress", "completed", "verified"];
  const currentIdx = order.indexOf(job.status);
  const labels = ["Submitted", "Acknowledged", "In Progress", "Completed", "Verified"];
  return (
    <div>
      <TopBar title="Request Detail" onBack={onBack} />
      <div className="space-y-3 px-4 pb-6">
        <div className="rounded-2xl bg-white p-4" style={{ border: `1px solid ${C.outlineVar}` }}>
          <div className="text-[11px] font-semibold tracking-wide" style={{ color: C.outline }}>#{job.order}</div>
          <h2 className="mt-1 text-[22px] font-bold leading-tight" style={{ color: C.onSurface }}>{job.title}</h2>
          <div className="mt-3 flex gap-2"><PriorityBadge p={job.priority} /><StatusBadge status={job.status} /></div>
          <div className="mt-3 flex items-center gap-1.5 text-[12px]" style={{ color: C.onSurfaceVar }}><Icon n="lock" size={14} color={C.outline} /> Submitted {job.reportedAt} · Auto-locked</div>
        </div>

        <div className="rounded-2xl bg-white p-4" style={{ border: `1px solid ${C.outlineVar}` }}>
          <div className="mb-3 text-[12px] font-semibold uppercase tracking-wide" style={{ color: C.onSurfaceVar }}>Status Timeline</div>
          {labels.map((l, i) => (
            <TimelineStep
              key={l}
              status={i < currentIdx ? "done" : i === currentIdx ? "current" : "pending"}
              label={l}
              time={i <= currentIdx ? "Today" : undefined}
              last={i === labels.length - 1}
            />
          ))}
        </div>

        <InfoCard rows={[
          ["Category", `${job.category[0]} → ${job.category[1]}`],
          ["Location", `${job.location} · ${job.floor}`],
          ["Description", job.description],
        ]} />

        {job.vendor && (
          <div className="rounded-2xl bg-white p-4" style={{ border: `1px solid ${C.outlineVar}` }}>
            <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide" style={{ color: C.onSurfaceVar }}>Assigned Technician</div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: C.primaryFixed }}><Icon n="engineering" size={20} color={C.onPrimaryFixed} /></div>
              <div><div className="text-[14px] font-semibold" style={{ color: C.onSurface }}>{TECHNICIANS[0]}</div><div className="text-[12px]" style={{ color: C.onSurfaceVar }}>Technician · {job.vendor}</div></div>
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-white p-4" style={{ border: `1px solid ${C.outlineVar}` }}>
          <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide" style={{ color: C.onSurfaceVar }}>Your uploads</div>
          <div className="flex gap-2">{[1, 2].map((i) => <div key={i} className="h-16 w-16 rounded-lg" style={{ background: C.sMid }} />)}</div>
          <div className="mt-3 mb-2 text-[12px] font-semibold uppercase tracking-wide" style={{ color: C.onSurfaceVar }}>Technician photos</div>
          <div className="flex gap-2">{[1, 2, 3].map((i) => <div key={i} className="h-16 w-16 rounded-lg" style={{ background: `linear-gradient(135deg, ${C.primaryFixed}, ${C.sHigh})` }} />)}</div>
        </div>
      </div>
    </div>
  );
}

function ClientNewRequestScreen({ onDone }: { onDone: () => void }) {
  const [priority, setPriority] = useState<Priority>("normal");
  const [cat, setCat] = useState("HVAC");
  return (
    <div>
      <TopBar title="New Request" />
      <div className="space-y-3 px-4 pb-6">
        <Field label="Issue Title"><Input placeholder="e.g. AC not cooling" /></Field>
        <Field label="Location"><Select>{LOCATIONS.map((l) => <option key={l}>{l}</option>)}</Select></Field>
        <Field label="Priority"><SegmentedToggle options={["normal", "urgent"] as Priority[]} value={priority} onChange={setPriority} /></Field>
        <Field label="Category"><Select value={cat} onChange={(e) => setCat(e.target.value)}>{Object.keys(CATEGORY_MAP).map((k) => <option key={k}>{k}</option>)}</Select></Field>
        <Field label="Sub-category"><Select>{CATEGORY_MAP[cat].map((s) => <option key={s}>{s}</option>)}</Select></Field>
        <Field label="Description"><TextArea rows={4} placeholder="Describe the issue…" /></Field>
        <Field label="Attachments"><SecondaryButton icon="add_photo_alternate">Add Photos</SecondaryButton></Field>
        <div className="pt-2"><PrimaryButton icon="send" onClick={onDone}>Submit Request</PrimaryButton></div>
      </div>
    </div>
  );
}

/* ---------------- Settings ---------------- */
function SettingsScreen({ role, onSignOut, onSwitchRole }: { role: string; onSignOut: () => void; onSwitchRole: () => void }) {
  return (
    <div>
      <TopBar title="Settings" />
      <div className="space-y-3 px-4 pb-6">
        <div className="rounded-2xl bg-white p-4" style={{ border: `1px solid ${C.outlineVar}` }}>
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full text-[18px] font-bold" style={{ background: C.primaryFixed, color: C.onPrimaryFixed }}>DC</div>
            <div className="flex-1">
              <div className="text-[16px] font-semibold" style={{ color: C.onSurface }}>Demo Carter</div>
              <div className="text-[12px]" style={{ color: C.onSurfaceVar }}>demo@upkeepmm.com</div>
              <div className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ background: C.primaryFixed, color: C.onPrimaryFixed }}>{role}</div>
            </div>
          </div>
        </div>
        <SettingsRow icon="edit" label="Edit Profile" />
        <SettingsRow icon="lock" label="Change Password" />
        <SettingsRow icon="swap_horiz" label="Switch Role" onClick={onSwitchRole} />
        <SettingsRow icon="notifications" label="Notifications" />
        <SettingsRow icon="help" label="Help & Support" />
        <div className="pt-2">
          <button onClick={onSignOut} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[14px] font-semibold" style={{ background: "#fef2f2", color: C.error }}>
            <Icon n="logout" size={18} color={C.error} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

const SettingsRow = ({ icon, label, onClick }: { icon: string; label: string; onClick?: () => void }) => (
  <button onClick={onClick} className="flex w-full items-center gap-3 rounded-xl bg-white px-4 py-3.5 text-left" style={{ border: `1px solid ${C.outlineVar}` }}>
    <Icon n={icon} size={20} color={C.onSurfaceVar} />
    <span className="flex-1 text-[14px] font-medium" style={{ color: C.onSurface }}>{label}</span>
    <Icon n="chevron_right" size={20} color={C.outline} />
  </button>
);

/* ---------------- Helpers ---------------- */
const InfoCard = ({ rows }: { rows: [string, string][] }) => (
  <div className="rounded-2xl bg-white p-4" style={{ border: `1px solid ${C.outlineVar}` }}>
    <div className="space-y-2.5">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-start justify-between gap-3">
          <div className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: C.onSurfaceVar }}>{k}</div>
          <div className="max-w-[60%] text-right text-[13px]" style={{ color: C.onSurface }}>{v}</div>
        </div>
      ))}
    </div>
  </div>
);

function Collapsible({ open, onToggle, title, icon, children }: { open: boolean; onToggle: () => void; title: string; icon: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white" style={{ border: `1px solid ${C.outlineVar}` }}>
      <button onClick={onToggle} className="flex w-full items-center gap-2 px-4 py-3.5">
        <Icon n={icon} size={20} color={C.primary} />
        <span className="flex-1 text-left text-[14px] font-semibold" style={{ color: C.onSurface }}>{title}</span>
        <Icon n={open ? "expand_less" : "expand_more"} size={20} color={C.onSurfaceVar} />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

const EmptyState = ({ icon, title, cta }: { icon: string; title: string; cta?: { label: string; onClick: () => void } }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: C.sMid }}><Icon n={icon} size={28} color={C.onSurfaceVar} /></div>
    <div className="mt-3 text-[14px] font-semibold" style={{ color: C.onSurface }}>{title}</div>
    {cta && <button onClick={cta.onClick} className="mt-3 rounded-full px-4 py-2 text-[13px] font-semibold" style={{ background: C.primary, color: C.onPrimary }}>{cta.label}</button>}
  </div>
);
