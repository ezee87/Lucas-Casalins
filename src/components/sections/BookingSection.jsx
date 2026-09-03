import { useEffect, useState } from "react";
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, Globe2, LoaderCircle, ShieldCheck } from "lucide-react";
import SectionLabel from "../ui/SectionLabel";
import { ScrollTrigger } from "../../lib/gsap";

const INITIAL_FORM = { fullName: "", email: "", whatsapp: "", instagram: "", decisionMaker: "", occupation: "", goal: "", previousAttempts: "", investment: "", commitment: "" };
const QUESTIONS = [
  { name: "fullName", label: "Nombre completo", type: "text", placeholder: "Tu nombre y apellido", autoComplete: "name" },
  { name: "email", label: "Correo electrónico", type: "email", placeholder: "nombre@correo.com", autoComplete: "email" },
  { name: "whatsapp", label: "WhatsApp / número de celular", type: "tel", placeholder: "+54 9 11 1234 5678", autoComplete: "tel" },
  { name: "instagram", label: "Usuario de Instagram", type: "text", placeholder: "@tuusuario", autoComplete: "off" },
  { name: "decisionMaker", label: "¿Necesitás consultar con alguien antes de decidir?", options: ["No, decido yo.", "Sí, con mi socio o pareja."] },
  { name: "occupation", label: "¿Con qué perfil te identificás?", options: ["Emprendedor / Empresario", "Trabajador en relación de dependencia", "Dueño de negocio"] },
  { name: "goal", label: "¿Cuál es tu objetivo principal?", options: ["Perder grasa", "Ganar músculo", "Recomposición corporal"] },
  { name: "previousAttempts", label: "¿Qué probaste hasta ahora?", type: "textarea", placeholder: "Contanos brevemente qué intentaste..." },
  { name: "investment", label: "¿Qué inversión podrías considerar para este cambio?", options: ["USD 600 - 1.000", "USD 200 - 600", "No quiero invertir ahora"] },
  { name: "commitment", label: "¿Te comprometés a asistir o avisar con 24 h?", options: ["Sí, me comprometo.", "No puedo comprometerme."] },
];
const DAYS = [
  { id: "2026-09-01", weekday: "Mar", day: "01", month: "sept", status: "Disponible", fullLabel: "martes 01 de septiembre" },
  { id: "2026-09-02", weekday: "Mié", day: "02", month: "sept", status: "Pocos horarios", fullLabel: "miércoles 02 de septiembre" },
  { id: "2026-09-03", weekday: "Jue", day: "03", month: "sept", status: "Disponible", fullLabel: "jueves 03 de septiembre" },
  { id: "2026-09-04", weekday: "Vie", day: "04", month: "sept", status: "Disponible", fullLabel: "viernes 04 de septiembre" },
  { id: "2026-09-07", weekday: "Lun", day: "07", month: "sept", status: "Últimos cupos", fullLabel: "lunes 07 de septiembre" },
];
const TIMES = ["09:00", "10:30", "12:00", "15:00", "16:30", "18:00"];
const INPUT = "h-10 w-full rounded-lg border bg-[#0b0909] px-3 text-sm text-white outline-none transition placeholder:text-[#655d5d] focus:border-red-500 focus:ring-2 focus:ring-red-500/10 md:h-11 lg:h-9 lg:px-2.5 lg:text-[0.8rem]";

function Field({ question, value, error, onChange }) {
  const classes = `${INPUT} ${error ? "border-red-500" : "border-white/10"}`;
  return <label className="block min-w-0">
    <span className="mb-1 block min-h-5 text-[0.72rem] font-medium leading-5 text-[#ded8d8] md:text-xs lg:min-h-4 lg:text-[0.68rem] lg:leading-4">{question.label} <span className="text-red-500">*</span></span>
    {question.options ? <span className="relative block"><select className={`${classes} cursor-pointer appearance-none pr-9`} name={question.name} value={value} onChange={onChange}><option value="" disabled>Seleccioná una opción</option>{question.options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown aria-hidden="true" size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8f8686]" /></span>
      : question.type === "textarea" ? <textarea className={`${classes} h-[4.25rem] resize-none py-2 md:h-[4.75rem] lg:h-[3.75rem]`} name={question.name} value={value} placeholder={question.placeholder} onChange={onChange} />
        : <input className={classes} name={question.name} type={question.type} value={value} placeholder={question.placeholder} onChange={onChange} autoComplete={question.autoComplete} />}
    {error && <span className="mt-1 block text-[0.68rem] text-red-400">{error}</span>}
  </label>;
}

function StepTwo({ selectedDay, selectedTime, errors, isSubmitting, chooseDay, chooseTime, goBack }) {
  const summary = [
    { icon: CalendarDays, label: "Día seleccionado", value: selectedDay?.fullLabel || "Por seleccionar" },
    { icon: Clock3, label: "Horario seleccionado", value: selectedTime || "Por seleccionar" },
    { icon: Globe2, label: "Modalidad", value: "Online" },
    { icon: ShieldCheck, label: "Consulta", value: "Inicial Sin Cargo" },
  ];
  return <div className="booking-content box-border w-full min-w-0 max-w-full text-left">
    <div className="mb-4 w-full min-w-0 max-w-full lg:mb-3">
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-red-400">Paso 2 de 2</p>
      <h3 className="mt-0.5 text-xl font-semibold text-white">Tu llamada</h3>
      <p className="mt-1 text-sm text-[#918888]">Elegí el día y horario que mejor te funcionen.</p>
    </div>
    <div className="grid w-full min-w-0 max-w-full grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,0.75fr)] lg:items-center lg:gap-4">
      <div className="box-border w-full min-w-0 max-w-full">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a49a9a]">Días disponibles</p>
        <div className="mt-2 grid w-full min-w-0 max-w-full grid-cols-2 gap-3 lg:grid-cols-5 lg:gap-1.5">
          {DAYS.map((day) => <button key={day.id} type="button" onClick={() => chooseDay(day)} className={`box-border w-full min-w-0 max-w-full rounded-xl border p-3 text-left lg:p-2.5 ${selectedDay?.id === day.id ? "border-red-500 bg-red-500/10" : "border-white/10 bg-[#0c0909] hover:border-red-500/40"}`}>
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#938989]">{day.weekday}</span>
            <span className="mt-0.5 block text-xl font-bold text-white">{day.day} <small className="text-xs font-medium text-[#938989]">{day.month}</small></span>
            <span className={`mt-1.5 block text-[0.62rem] ${day.status === "Disponible" ? "text-emerald-400" : "text-amber-400"}`}>● {day.status}</span>
          </button>)}
        </div>
        <div className="mt-4 box-border w-full min-w-0 max-w-full">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a49a9a]">Horarios disponibles</p>
          <div className="mt-2 grid w-full min-w-0 max-w-full grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6 lg:gap-2">
            {TIMES.map((time) => <button key={time} type="button" disabled={!selectedDay} onClick={() => chooseTime(time)} className={`box-border w-full min-w-0 max-w-full rounded-xl border px-2 py-2.5 text-center text-sm font-bold disabled:cursor-not-allowed disabled:opacity-35 lg:py-2 lg:text-xs ${selectedTime === time ? "border-red-500 bg-red-600 text-white" : "border-white/10 bg-[#0c0909] text-[#d4cece] hover:border-red-500/50"}`}>{time}</button>)}
          </div>
          {errors.schedule && <p className="mt-2 text-sm text-red-400">{errors.schedule}</p>}
        </div>
      </div>
      <aside className="booking-summary box-border w-full min-w-0 max-w-full rounded-2xl border border-red-500/25 bg-gradient-to-b from-red-500/[0.08] to-black p-3.5 text-left md:p-4 lg:p-3">
        <p className="text-base font-bold text-white">Diagnóstico R1</p><p className="mt-1 text-xs text-[#9b9292]">1 hora · Consulta inicial sin cargo</p>
        <div className="my-4 space-y-2.5 border-y border-white/10 py-4 lg:my-3 lg:space-y-2 lg:py-3">{summary.map(({ icon: Icon, label, value }) => <div key={label} className="flex min-w-0 items-center gap-2.5 text-left"><Icon size={15} className="shrink-0 text-red-400" /><span className="min-w-0 text-left"><small className="block text-left text-[0.58rem] uppercase tracking-[0.08em] text-[#776e6e]">{label}</small><strong className="block break-words text-left text-xs capitalize text-white">{value}</strong></span></div>)}</div>
        <button type="submit" disabled={isSubmitting || !selectedDay || !selectedTime} className="flex w-full min-w-0 max-w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-3.5 text-center text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 md:px-5 lg:py-2.5 lg:text-xs">{isSubmitting ? <><LoaderCircle size={18} className="animate-spin" /> Confirmando llamada...</> : <><Check size={18} /> Confirmar llamada</>}</button>
        <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-[0.65rem] text-[#756c6c]"><ShieldCheck size={13} /> Tus datos están protegidos</p>
      </aside>
    </div>
    <button type="button" disabled={isSubmitting} onClick={goBack} className="mt-4 inline-flex items-center gap-1 text-sm text-[#aaa1a1] hover:text-white"><ChevronLeft size={16} /> Editar mis datos</button>
  </div>;
}

export default function BookingSection({ data, landingVariant }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => { ScrollTrigger.refresh(); }, [step]);
  const validate = () => { const next = {}; Object.keys(INITIAL_FORM).forEach((name) => { const value = formData[name].trim(); if (!value) next[name] = "Completá este campo."; else if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) next[name] = "Ingresá un correo válido."; }); setErrors(next); return Object.keys(next).length === 0; };
  const change = ({ target }) => { setFormData((current) => ({ ...current, [target.name]: target.value })); setErrors((current) => ({ ...current, [target.name]: undefined })); };
  const chooseDay = (day) => { setSelectedDay(day); setSelectedTime(""); setErrors((current) => ({ ...current, schedule: undefined })); };
  const chooseTime = (time) => { setSelectedTime(time); setErrors((current) => ({ ...current, schedule: undefined })); };
  const confirm = (event) => { event.preventDefault(); if (!validate()) { setStep(1); return; } if (!selectedDay || !selectedTime) { setErrors((current) => ({ ...current, schedule: "Seleccioná un día y un horario para continuar." })); return; } setIsSubmitting(true); const variant = new URLSearchParams(window.location.search).get("variant") || landingVariant; const destination = variant ? `/thank-you-page?variant=${encodeURIComponent(variant)}` : "/thank-you-page"; window.setTimeout(() => window.location.assign(destination), 900); };

  return <section id="booking" className="scroll-mt-20 bg-black py-14 md:scroll-mt-24 md:py-20 lg:py-16"><div className="mx-auto w-full max-w-[1180px] px-4 md:px-8 lg:max-w-[1000px] lg:px-6">
    <SectionLabel>{data.eyebrow}</SectionLabel>
    <div className="mt-3"><h2 className="max-w-[900px] font-display text-[clamp(2.5rem,5vw,4.75rem)] uppercase leading-[0.88] text-white text-glow-red">{data.title}</h2><p className="mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--line-warm)] bg-red-500/[0.06] px-4 py-1.5 text-[0.66rem] uppercase tracking-[0.2em] text-[var(--text)]"><span className="h-1.5 w-1.5 rounded-full bg-red-600" />{data.duration} · {data.durationNote}</p></div>
    <div className="relative mt-6 box-border w-full max-w-full overflow-x-hidden rounded-2xl border border-red-500/35 bg-[#070303] p-2.5 shadow-[0_0_36px_rgba(255,30,30,0.12)] md:rounded-[1.6rem] md:p-4 lg:mt-5 lg:p-3"><div className="bg-dots-red pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative mb-2.5 grid w-full min-w-0 max-w-full grid-cols-2 gap-1 rounded-xl border border-white/[0.07] bg-black/50 p-1 md:mb-3 lg:mb-2">{["Tus datos", "Tu llamada"].map((label, index) => { const itemStep = index + 1; return <button key={label} type="button" onClick={() => itemStep < step && setStep(itemStep)} className={`flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-1.5 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.06em] sm:gap-2 sm:px-2 sm:text-[0.68rem] sm:tracking-[0.08em] lg:py-1.5 lg:text-[0.62rem] ${step === itemStep ? "bg-red-600 text-white" : itemStep < step ? "text-white" : "cursor-default text-[#655d5d]"}`}><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/20 lg:h-4 lg:w-4">{itemStep < step ? <Check size={12} /> : itemStep}</span>{label}</button>; })}</div>
      <form onSubmit={confirm} noValidate className="booking-content relative box-border w-full min-w-0 max-w-full overflow-x-hidden rounded-xl border border-white/[0.08] bg-[#080606]/95 p-3.5 text-left md:rounded-2xl md:p-5 lg:p-4">
        {step === 1 && <div><div className="mb-3 md:mb-4 lg:mb-3"><p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-red-400">Paso 1 de 2</p><h3 className="mt-0.5 text-lg font-semibold text-white md:text-xl lg:text-lg">Tus datos</h3></div><div className="grid gap-x-4 gap-y-2.5 md:gap-y-3 lg:grid-cols-2 lg:gap-x-3 lg:gap-y-2">{QUESTIONS.map((question) => <Field key={question.name} question={question} value={formData[question.name]} error={errors[question.name]} onChange={change} />)}</div><div className="mt-4 flex md:justify-end lg:mt-3"><button type="button" onClick={() => validate() && setStep(2)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-500 md:w-auto lg:px-4 lg:py-2.5 lg:text-xs">Elegir día y horario <ChevronRight size={17} /></button></div></div>}
        {step === 2 && <StepTwo selectedDay={selectedDay} selectedTime={selectedTime} errors={errors} isSubmitting={isSubmitting} chooseDay={chooseDay} chooseTime={chooseTime} goBack={() => setStep(1)} />}
      </form>
    </div>
  </div></section>;
}
