export default function PageShell({ children }) {
  return (
    <div className="relative overflow-x-clip bg-bg text-text">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_12%_8%,rgba(255,30,30,0.16),transparent_38%),radial-gradient(circle_at_85%_70%,rgba(184,0,0,0.14),transparent_42%),linear-gradient(180deg,#030303_0%,#080808_55%,#030303_100%)]" />
      <div className="bg-dots-red pointer-events-none fixed inset-0 -z-10 opacity-[0.5]" />
      {children}
    </div>
  );
}
