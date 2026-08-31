import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Globe2, LoaderCircle, ShieldCheck } from "lucide-react";
import SectionLabel from "../ui/SectionLabel";
import { ScrollTrigger } from "../../lib/gsap";

const INITIAL_FORM = { whatsapp: "", fullName: "", email: "", instagram: "", decisionMaker: "", occupation: "", goal: "", previousAttempts: "", investment: "", commitment: "" };
const FORM_GRID_CLASS = "columns-1 lg:columns-2 lg:gap-4";
const FORM_FIELD_CLASS = "mb-3 break-inside-avoid";
const QUESTIONS = [
  { name: "fullName", label: "Nombre completo", type: "text", placeholder: "Tu nombre y apellido" },
  { name: "email", label: "Correo electrónico", type: "email", placeholder: "nombre@correo.com" },
  { name: "whatsapp", label: "WhatsApp / número de celular", helper: "Solo tomamos llamadas confirmadas. Si el número es inválido o no respondés, la llamada puede cancelarse.", type: "tel", placeholder: "+54 9 11 1234 5678" },
  { name: "instagram", label: "Usuario de Instagram", type: "text", placeholder: "@coach.arete" },
  { name: "decisionMaker", label: "¿Necesitás consultar con alguien antes de decidir?", options: ["No, decido yo.", "Sí, con mi socio o pareja."] },
  { name: "occupation", label: "¿Con qué perfil te identificás?", options: ["Emprendedor/Empresario", "Trabajador en relación de dependencia", "Dueño de negocio"] },
  { name: "goal", label: "¿Cuál es tu objetivo principal?", options: ["Perder grasa", "Ganar músculo", "Recomposición corporal"] },
  { name: "previousAttempts", label: "¿Qué probaste hasta ahora?", type: "textarea", placeholder: "Contanos brevemente qué intentaste..." },
  { name: "investment", label: "¿Qué inversión podrías considerar para este cambio?", helper: "Rangos orientativos. No es el valor final del programa.", options: ["$600 - $1.000 USD", "$200 - $600 USD", "No quiero invertir ahora"] },
  { name: "commitment", label: "¿Te comprometés a asistir o avisar con 24 h?", helper: "Faltar sin aviso puede bloquear futuras reservas.", options: ["Sí, me comprometo.", "No puedo comprometerme."] },
];
const TIME_SLOTS = ["09:00", "10:30", "12:00", "15:00", "16:30", "18:00"];
const DAY_STATUS = ["Disponible", "Pocos horarios", "Disponible", "Disponible", "Últimos cupos"];

function buildAvailableDays() {
  const formatter = new Intl.DateTimeFormat("es-AR", { weekday: "short", day: "2-digit", month: "short" });
  const days = [];
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  while (days.length < 5) {
    cursor.setDate(cursor.getDate() + 1);
    if ([0, 6].includes(cursor.getDay())) continue;
    const parts = formatter.formatToParts(cursor);
    const part = (type) => parts.find((item) => item.type === type)?.value.replace(".", "") || "";
    days.push({ id: cursor.toISOString().slice(0, 10), weekday: part("weekday"), day: part("day"), month: part("month"), status: DAY_STATUS[days.length], fullLabel: formatter.format(cursor).replaceAll(".", "") });
  }
  return days;
}

function Field({ question, value, error, onChange }) {
  const inputClass = `w-full rounded-xl border bg-[#0b0909] px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-[#6f6666] focus:border-[var(--red)] focus:ring-2 focus:ring-red-500/10 ${error ? "border-red-500" : "border-white/10"}`;
  return <fieldset className={`min-w-0 ${FORM_FIELD_CLASS}`}>
    <legend className="mb-1.5 text-[0.76rem] font-medium leading-[1.4] text-[#ded8d8]">{question.label} <span className="text-[var(--red)]">*</span></legend>
    {question.options ? <div className="grid gap-1.5">{question.options.map((option) => <label key={option} className={`flex cursor-pointer items-start gap-2.5 rounded-xl border px-3 py-2 text-xs leading-[1.35] transition ${value === option ? "border-red-500/70 bg-red-500/10 text-white" : "border-white/10 bg-[#0b0909] text-[#aaa1a1] hover:border-white/20"}`}><input className="mt-0.5 accent-red-600" type="radio" name={question.name} value={option} checked={value === option} onChange={onChange} /><span>{option}</span></label>)}</div>
      : question.type === "textarea" ? <textarea className={`${inputClass} min-h-20 resize-none`} name={question.name} value={value} placeholder={question.placeholder} onChange={onChange} />
        : <input className={inputClass} name={question.name} type={question.type} value={value} placeholder={question.placeholder} onChange={onChange} autoComplete={question.name === "email" ? "email" : question.name === "fullName" ? "name" : question.name === "whatsapp" ? "tel" : "off"} />}
    {question.helper && <div className="mt-1.5">
      {question.helper && <p className="text-[0.66rem] leading-[1.35] text-[#776f6f]">{question.helper}</p>}
    </div>}
    {error && error !== "required" && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </fieldset>;
}

function BackButton({ onClick, children, disabled = false }) {
  return <button type="button" onClick={onClick} disabled={disabled} className="inline-flex items-center gap-1 text-sm text-[#aaa1a1] hover:text-white disabled:opacity-50"><ChevronLeft size={16} />{children}</button>;
}

function NextButton({ onClick, disabled = false, children }) {
  return <button type="button" onClick={onClick} disabled={disabled} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-35">{children}<ChevronRight size={17} /></button>;
}

export default function BookingSection({ data, landingVariant }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const availableDays = useMemo(() => buildAvailableDays(), []);
  useEffect(() => { ScrollTrigger.refresh(); }, [step]);

  const validateFields = (names) => {
    const next = {};
    names.forEach((name) => {
      const value = formData[name].trim();
      if (!value) next[name] = "required";
      else if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) next[name] = "Ingresá un correo electrónico válido.";
    });
    setErrors(next);
    return !Object.keys(next).length;
  };
  const handleChange = ({ target }) => { setFormData((current) => ({ ...current, [target.name]: target.value })); setErrors((current) => ({ ...current, [target.name]: undefined })); };
  const advanceForm = () => { if (validateFields(Object.keys(INITIAL_FORM))) setStep(2); };
  const chooseDay = (day) => { setSelectedDay(day); setSelectedTime(""); setErrors((current) => ({ ...current, schedule: undefined })); };
  const confirmBooking = (event) => {
    event.preventDefault();
    if (!validateFields(Object.keys(INITIAL_FORM))) { setStep(1); return; }
    if (!selectedDay || !selectedTime) { setErrors((current) => ({ ...current, schedule: "Seleccioná un día y un horario para continuar." })); setStep(2); return; }
    setIsSubmitting(true);
    sessionStorage.setItem("arete_scheduled_booking", JSON.stringify({ formData, selectedDay: { id: selectedDay.id, label: selectedDay.fullLabel }, selectedTime, landing_variant: landingVariant, status: "scheduled_demo" }));
    window.setTimeout(() => window.location.assign("/thank-you-page"), 1100);
  };
  return <section id="booking" className="bg-black py-16 md:py-20"><div className="mx-auto w-full max-w-[1180px] px-5 md:px-8">
    <SectionLabel>{data.eyebrow}</SectionLabel>
    <div className="mt-3"><h2 className="max-w-[900px] font-display text-[clamp(2.75rem,5vw,4.75rem)] uppercase leading-[0.88] tracking-[0.01em] text-white text-glow-red">{data.title}</h2><p className="mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--line-warm)] bg-red-500/[0.06] px-4 py-1.5 text-[0.66rem] uppercase tracking-[0.2em] text-[var(--text)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--red)] shadow-[0_0_10px_rgba(255,30,30,0.8)]" />{data.duration} · {data.durationNote}</p></div>
    <div className="relative mt-6 overflow-hidden rounded-[1.6rem] border border-red-500/35 bg-[#070303] p-3 shadow-[0_0_0_1px_rgba(255,30,30,0.06),0_0_36px_rgba(255,30,30,0.12),0_20px_60px_rgba(0,0,0,0.7)] md:p-4"><div className="bg-dots-red pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative mb-3 grid grid-cols-2 gap-1 rounded-xl border border-white/[0.07] bg-black/50 p-1">{["Tus datos", "Tu llamada"].map((label, index) => { const itemStep = index + 1; return <button key={label} type="button" onClick={() => itemStep < step && setStep(itemStep)} className={`flex min-w-0 items-center justify-center gap-2 rounded-lg px-2 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.08em] transition sm:text-xs ${step === itemStep ? "bg-red-600 text-white shadow-[0_0_16px_rgba(220,38,38,0.28)]" : itemStep < step ? "text-white" : "cursor-default text-[#655d5d]"}`}><span className={`flex h-5 w-5 items-center justify-center rounded-full border ${itemStep <= step ? "border-white/30" : "border-white/10"}`}>{itemStep < step ? <Check size={12} /> : itemStep}</span>{label}</button>; })}</div>
      <form onSubmit={confirmBooking} className="relative rounded-2xl border border-white/[0.08] bg-[#080606]/95 p-4 md:p-5">
        {step === 1 && <div><div className="mb-4"><p className="text-xs font-bold uppercase tracking-[0.18em] text-red-400">Paso 1 de 2</p><h3 className="mt-0.5 text-xl font-semibold text-white">Contanos sobre vos</h3></div><div className={FORM_GRID_CLASS}>{QUESTIONS.map((question) => <Field key={question.name} question={question} value={formData[question.name]} error={errors[question.name]} onChange={handleChange} />)}</div><div className="flex justify-end"><NextButton onClick={advanceForm}>Elegir día y horario</NextButton></div></div>}
        {step === 2 && <div><div className="mb-4"><p className="text-xs font-bold uppercase tracking-[0.18em] text-red-400">Paso 2 de 2</p><h3 className="mt-0.5 text-xl font-semibold text-white">Tu llamada</h3><p className="mt-1 text-sm text-[#918888]">Elegí el día y horario que mejor te funcionen.</p></div><div className="grid gap-5 lg:grid-cols-[1.45fr_0.75fr] lg:items-start"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a49a9a]">Día disponible</p><div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-5">{availableDays.map((day) => <button key={day.id} type="button" onClick={() => chooseDay(day)} className={`rounded-xl border p-3 text-left transition ${selectedDay?.id === day.id ? "border-red-500 bg-red-500/10 shadow-[0_0_18px_rgba(239,68,68,0.12)]" : "border-white/10 bg-[#0c0909] hover:border-red-500/40"}`}><span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#938989]">{day.weekday}</span><span className="mt-0.5 block text-xl font-bold text-white">{day.day} <small className="text-xs font-medium text-[#938989]">{day.month}</small></span><span className={`mt-1.5 block text-[0.62rem] ${day.status === "Disponible" ? "text-emerald-400" : "text-amber-400"}`}>● {day.status}</span></button>)}</div><div className="mt-4"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a49a9a]">Horario</p>{selectedDay ? <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">{TIME_SLOTS.map((time) => <button key={time} type="button" onClick={() => { setSelectedTime(time); setErrors((current) => ({ ...current, schedule: undefined })); }} className={`rounded-xl border px-2 py-2.5 text-sm font-bold transition ${selectedTime === time ? "border-red-500 bg-red-600 text-white shadow-[0_0_18px_rgba(220,38,38,0.25)]" : "border-white/10 bg-[#0c0909] text-[#d4cece] hover:border-red-500/50"}`}>{time}</button>)}</div> : <div className="mt-2 rounded-xl border border-dashed border-white/10 bg-black/20 px-4 py-4 text-sm text-[#716969]">Seleccioná un día para ver los horarios disponibles.</div>}</div>{errors.schedule && <p className="mt-3 text-sm text-red-400">{errors.schedule}</p>}</div><div className="rounded-2xl border border-red-500/25 bg-gradient-to-b from-red-500/[0.08] to-black p-4"><p className="text-base font-bold text-white">Diagnóstico R1</p><p className="mt-1 text-xs text-[#9b9292]">1 hora · Consulta inicial sin cargo</p><div className="my-4 space-y-2.5 border-y border-white/10 py-4">{[{ icon: CalendarDays, label: "Día seleccionado", value: selectedDay?.fullLabel || "Por seleccionar" }, { icon: Clock3, label: "Horario seleccionado", value: selectedTime || "Por seleccionar" }, { icon: Globe2, label: "Modalidad", value: "Online" }, { icon: ShieldCheck, label: "Consulta", value: "Inicial Sin Cargo" }].map(({ icon: Icon, label, value }) => <div key={label} className="flex items-center gap-2.5"><Icon size={15} className="shrink-0 text-red-400" /><span className="min-w-0"><small className="block text-[0.58rem] uppercase tracking-[0.08em] text-[#776e6e]">{label}</small><strong className="block truncate text-xs capitalize text-white">{value}</strong></span></div>)}</div><button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-bold text-white shadow-[0_0_24px_rgba(220,38,38,0.28)] transition hover:bg-red-500 disabled:cursor-wait disabled:opacity-80">{isSubmitting ? <><LoaderCircle size={18} className="animate-spin" /> Confirmando llamada...</> : <><Check size={18} /> Confirmar llamada</>}</button><p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-[0.65rem] text-[#756c6c]"><ShieldCheck size={13} /> Tus datos están protegidos</p></div></div><div className="mt-4"><BackButton disabled={isSubmitting} onClick={() => setStep(1)}>Editar mis datos</BackButton></div></div>}
      </form>
    </div>
  </div></section>;
}
