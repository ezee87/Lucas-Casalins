import { testimonialCases } from "../data/TestimonialCases";

export const landingCopy = {
  meta: {
    title: "Lucas Casalins | Programa ARETÉ",
    description:
      "Programa de transformación física para profesionales y dueños de negocio.",
  },
  ui: {
    previous: "Anterior",
    next: "Siguiente",
    close: "Cerrar",
    viewImage: "Ver imagen",
    social: "Red social",
    logoAlt: "Programa ARETÉ",
  },
  cta: {
    primaryLabel: "QUIERO EMPEZAR",
    href: "#booking",
    ariaLabel: "Quiero empezar el Programa ARETÉ",
  },
  header: {
    logo: "/assets/brand/logo.webp",
    logoAlt: "Programa ARETÉ",
    nav: [
      { label: "Método", href: "#method" },
      { label: "Casos", href: "#cases" },
      { label: "Lucas", href: "#about" },
      { label: "FAQ", href: "#faq" },
    ],
    ctaLabel: "QUIERO EMPEZAR",
    ctaHref: "#booking",
  },
  marquee: {
    items: [
      "FUERZA",
      "DISCIPLINA",
      "TRANSFORMACIÓN",
      "ENERGÍA",
      "RESULTADOS",
    ],
  },
  popup: {
    badge: "🔥 ÚLTIMOS CUPOS DISPONIBLES 🔥",
    headline: "Programa ARETÉ",
    subheadline:
      "Transformá tu cuerpo con un sistema personalizado para profesionales ocupados.",
    ctaLabel: "QUIERO EMPEZAR",
    ctaHref: "#booking",
    ctaAriaLabel: "Quiero empezar el Programa ARETÉ",
    microcopy: "Aplicación inicial sin compromiso.",
    note: "Cupos limitados para seguimiento 1:1",
    image: "/assets/lucas/lucas-3.webp",
    imageAlt: "Lucas Casalins",
    closeLabel: "Cerrar",
  },
  urgencyBar: {
    text: "ÚLTIMOS CUPOS DISPONIBLES",
  },
  hero: {
    eyebrow: "Programa para profesionales y dueños de negocio",
    title: "CÓMO BAJAR +15 kg DE GRASA CORPORAL en sólo 90 DÍAS",
    subtitle:
      "El método que ayudó a más de 2.500 personas en 10 países diferentes a verse mejor, sentirse más seguros y rendir con más energía en su vida personal y profesional.",
    supportText:
      "Sin pasar hambre con dietas extremas ni rutinas eternas en el gimnasio.",
    logo: "/assets/brand/logo.webp",
    video: {
      // Horizontal 16:9 VSL. The iframe is only mounted after the user clicks
      // play, so there is no autoplay on page load.
      embedUrl:
        "https://fast.wistia.net/embed/iframe/f9hw92egpw?autoplay=1&playerColor=ff1e1e",
      poster: "/assets/lucas/portada.webp",
      posterAlt: "Lucas Casalins — video de presentación del Programa ARETÉ",
    },
    proofStrip: [
      { value: "+2.500", countTo: 2500, label: "personas ayudadas" },
      { value: "10", countTo: 10, label: "países" },
      { value: "+15", countTo: 15, label: "años de experiencia" },
      { value: "100%", countTo: 100, label: "personalizado" },
      { value: "90", countTo: 90, label: "días" },
      { value: "1:1", countTo: null, label: "Acompañamiento Directo" },
    ],
  },
  videoProof: {
    eyebrow: "PRUEBA VISUAL",
    title: "Transformación real, estructura real.",
    statement:
      "Sistema privado de transformación física para profesionales de alto rendimiento.",
    media: {
      src: null,
      poster: "/assets/lucas/lucas-3.webp",
    },
  },
  successCases: {
    eyebrow: "TESTIMONIOS",
    title: "ALGUNOS DE NUESTROS CASOS DE ÉXITO",
    subtitle:
      "Resultados de profesionales y empresarios que confiaron en el método ARETÉ.",
    items: testimonialCases,
  },
  testimonials: {
    label: "TESTIMONIOS",
    eyebrow: "EN SUS PALABRAS",
    title: "Lo que dicen quienes ya transformaron su cuerpo",
    subtitle:
      "Historias de personas que aplicaron el sistema y recuperaron su físico, su energía y su confianza.",
    items: [
      {
        quote:
          "Este programa me transformó por completo. Siendo madre de 3 hijos, creía que ya era tarde para recuperar mi cuerpo. Pero lo fácil que fue adaptar los entrenamientos a mi vida caótica y el acompañamiento real de Lucas, hicieron que lograra un físico de atleta, algo que jamás pensé que podría conseguir.",
        name: "Silvana",
        role: "Ejecutiva y Mamá de 3",
        rating: 5,
      },
      {
        quote:
          "Me sentía atrapado en la vorágine laboral, intentando bajar la grasa abdominal con consejos sueltos de redes que no funcionaban. Gracias a la estructura de Lucas, dejé de adivinar y logré una definición perfecta manteniendo mi masa muscular, todo adaptado a mi ritmo de trabajo.",
        name: "Eick",
        role: "Founder",
        rating: 5,
      },
      {
        quote:
          "Entrenaba a diario sin ver resultados, sintiéndome perdido y estancado. Gracias al plan de 4 días de Lucas, aprendí a entrenar de verdad y simplifiqué mi rutina: bajé 7 kilos de grasa y por fin logré definir el abdomen al máximo.",
        name: "Javier",
        role: "Arquitecto",
        rating: 5,
      },
      {
        quote:
          "Después de años descuidándome por mis negocios, mi autoestima tocó fondo. En solo 90 días con Lucas bajé más de 20 kilos; no solo transformé mi cuerpo, sino que recuperé mi energía, mi masculinidad y me volví a sentir pleno.",
        name: "Francisco",
        role: "Empresario Rubro Comestibles",
        rating: 5,
      },
      {
        quote:
          "El CrossFit me hacía sentir 'grandota' y no lograba la estética que buscaba. Con el plan de Lucas transformé mi enfoque: en 120 días perdí más de 11 kilos de grasa, definí mi abdomen y por fin logré esa figura de atleta que tanto quería.",
        name: "Milagros",
        role: "Emprendedora",
        rating: 5,
      },
      {
        quote:
          "Me costaba muchísimo ganar masa muscular y me sentía flaco a pesar de tener buena estructura. Con la guía de Lucas rompí ese estancamiento y transformé mi cuerpo, logrando un físico casi de competencia.",
        name: "Matías",
        role: "Banquero",
        rating: 5,
      },
      {
        quote:
          "Entre el trabajo en el estado y mi consultorio, me era imposible organizarme para entrenar con efectividad. En solo 90 días con Lucas, logré lo que mi agenda no me permitía: bajar más de 10 kilos de grasa y definir mi abdomen por completo.",
        name: "Belén",
        role: "Odontóloga",
        rating: 5,
      },
      {
        quote:
          "Volví a buscar a Lucas porque sabía que con él los resultados son reales. Quería recuperar mis hábitos y mi mejor forma; en 90 días bajé más de 10 kilos de grasa y logré un físico extremadamente estético, casi al nivel de un atleta.",
        name: "Mariano",
        role: "Asesor Inmobiliario",
        rating: 5,
      },
      {
        quote:
          "Buscaba una silueta más fina y mejorar mi zona abdominal. En 90 días, bajé más de 7 kilos sin presiones; logré esa estructura delicada y la forma que tanto quería en todo mi cuerpo.",
        name: "Ingrid Julieta",
        role: "Relación de Dependencia",
        rating: 5,
      },
    ],
  },
  noSystem: {
    eyebrow: "EL PROBLEMA REAL",
    title: "NO TE FALTA DISCIPLINA. TE FALTA UN SISTEMA.",
    subtitle:
      "Durante años te hicieron creer que el problema era tu voluntad. Pero si el plan no se adapta a tu vida real, tarde o temprano lo abandonás.",
    blocks: [
      {
        number: "01",
        heading: "Rutinas genéricas",
        text: "Planes copiados de internet que no consideran tu cuerpo, tu agenda ni tu punto de partida.",
      },
      {
        number: "02",
        heading: "Dietas imposibles",
        text: "Restricciones que podés sostener una semana, pero no una vida real con trabajo, familia y compromisos.",
      },
      {
        number: "03",
        heading: "Cero acompañamiento",
        text: "Intentás avanzar solo, sin correcciones, sin ajustes y sin una guía que te mantenga enfocado.",
      },
    ],
    closing:
      "ARETÉ cambia eso: estructura, seguimiento y personalización para que puedas sostener el cambio.",
    ctaLabel: "Quiero empezar",
  },
  pain: {
    title: "SE EXACTAMENTE COMO SE SIENTE CUANDO...",
    items: [
      "Te mirás al espejo y no te gusta lo que ves.",
      "La ropa que te gusta ya no te entra, y tener que usar ropa suelta para esconder la panza.",
      "Sentís vergüenza frente a tu pareja y te asusta que te deje de desear o que tu inseguridad esté apagando la relación.",
      "Sentís que tu imagen no comunica la autoridad que tenés.",
      "Tu falta de energía impacta en tu rendimiento personal y profesional.",
      "Haces dietas restrictivas, rutinas genéricas de internet o te anotas mil veces al gimnasio, pero que nada te funcione.",
    ],
    bridge:
      "Si estás pasando por alguno de estos problemas este programa es exactamente lo que necesitas en este momento de tu vida.",
  },
  outcomes: {
    titlePrefix: "ESTO ES LO QUE VAS A LOGRAR CON",
    titleHighlight: "ARETE PROGRAM FIT",
    items: [
      {
        number: "1",
        title: "Plan de Entrenamiento Personalizado",
        text: "Un plan que se ajusta a tu rutina actual, sin rutinas eternas ni métodos extremos.",
      },
      {
        number: "2",
        title: "Corrección técnica y biomecánica",
        text: "Con técnica y biomecánica aplicada a tu entrenamiento Aprendés a entrenar mejor, no a entrenar más.",
      },
      {
        number: "3",
        title: "Nutrición estratégica y personalizada",
        text: "Un plan diseñado para tu contexto, alimentarte bien sin depender de dietas extremas, con lugar a tus eventos sociales.",
      },
      {
        number: "4",
        title: "App Personalizada y Comunidad",
        text: "Planes personalizados con ajustes en tiempo real y Acompañamiento diario todo el año.",
      },
    ],
  },
  method: {
    title: "¿POR QUÉ EL PROGRAMA ARETÉ NO ES UN MÉTODO COMO CUALQUIER OTRO?",
    intro:
      'Con tanta información en Instagram (influencers, rutinas mágicas, dietas extremas), es normal que sientas que ya "probaste de todo" y sigas sin ver el resultado real que buscás en el espejo.',
    cards: [
      "El Programa ARETÉ se creó para profesionales ocupados y empresarios que necesitan un plan real que se adapte a su agenda. Algo que puedas aplicar incluso sin tiempo de sobra o sin experiencia previa, y que te dé resultados visibles.",
      "Con más de 15 años de experiencia y +2.000 transformaciones reales, no te hablo desde la teoría. Soy Licenciado en Alto Rendimiento, Profesor de Ed. Física y Atleta Campeón. Sé exactamente qué necesita tu cuerpo para cambiar.",
      "Esta es la gran ventaja de ARETÉ: no es una dieta extrema ni una rutina genérica. Es un plan 100% personalizado y adaptado a tu vida real, para que logres una transformación física visible y sostenible en solo 90 días.",
    ],
  },
  about: {
    eyebrow: "Conocé a Lucas Casalins",
    title: "¿QUIÉN ES LUCAS CASALINS?",
    image: "/assets/lucas/lucas-2.webp",
    bullets: [
      "Mi nombre es Lucas Casalins, soy Profesor de Educación Física, Licenciado en Alto Rendimiento Deportivo y atleta con más de 20 torneos regionales, nacionales e internacionales, incluyendo el 1er puesto en un Campeonato Sudamericano (NPC), un Campeonato Argentino (NPC), y un Campeonato Cordobés (NPC).",
      "Además de competir, me formé con más de 65 certificaciones nacionales e internacionales en nutrición, entrenamiento y biomecánica, y soy parte de la cátedra de Biomecánica en la Facultad de Educación Física, lo que me permite unir la ciencia con la práctica real.",
      "Con mi método ayudé a más de 2.500 personas en 10 países a transformar su cuerpo, recuperar energía y volver a sentirse seguras consigo mismas. Soy preparador de atletas de culturismo y he llevado a ganar mundiales y podios, campeones/as sudamericanos, campeones/as Argentinos y torneos regionales.",
      "Sé lo que es mirarte al espejo y no gustarte, sentir que no tenés tiempo o frustrarte porque nada funciona. Lo viví en carne propia. Y por eso mi estilo es claro: no vendo humo, no prometo atajos ni resultados mágicos.",
    ],
    finalStatement:
      "Ofrezco un sistema probado, basado en ciencia, experiencia real y un acompañamiento humano cercano, pensado para profesionales ocupados que buscan un cambio sostenible.",
  },
  booking: {
    eyebrow: "ESTAS A UN PASO DE CAMBIAR TU VIDA",
    title: "Agendá ahora tu diagnóstico gratuito",
    subtitle: "Elegí tu horario para comenzar tu diagnóstico.",
    formTitle: "Introducir información",
    fullNameLabel: "Nombre Completo *",
    fullNamePlaceholder: "Nombre y Apellido",
    emailLabel: "Correo electrónico *",
    duration: "1 hr",
    durationNote: "Consulta inicial sin cargo",
  },
  faq: {
    eyebrow: "¿TENÉS ALGUNAS DUDAS?",
    title: "Preguntas Frecuentes",
    items: [
      {
        question:
          "¿Puedo lograr resultados si no tengo experiencia previa en el gimnasio?",
        answer:
          "Sí. El programa está pensado para personas de todos los niveles. Si nunca entrenaste, empezás con un plan progresivo y ejercicios guiados paso a paso para que puedas aprender la técnica correcta, evitar lesiones y avanzar seguro.",
      },
      {
        question: "¿El asesoramiento es en línea o presencial?",
        answer:
          "El asesoramiento es 100% online, adaptado a tu rutina y estilo de vida. Vas a tener tu plan de entrenamiento y nutrición personalizado, seguimiento por app y contacto directo con Lucas por WhatsApp o videollamada cuando sea necesario.",
      },
      {
        question: "¿Cuánto dura el asesoramiento?",
        answer:
          "El programa tiene una duración inicial de 90 días (3 meses), porque es el tiempo mínimo para lograr una transformación física visible y sostenible. Dependiendo del objetivo y los resultados, se puede continuar con un seguimiento extendido.",
      },
      {
        question:
          "¿Funciona si tengo una agenda muy cargada y viajo seguido?",
        answer:
          "Sí. El programa está diseñado específicamente para profesionales con agendas exigentes. Los entrenamientos son de 3 sesiones por semana y el plan nutricional se adapta a tus horarios, viajes y compromisos sociales. Alumnos como Diego, que come afuera todos los días y viaja constantemente, bajó más de 11 kg sin cambiar su rutina laboral.",
      },
      {
        question:
          "¿Qué pasa si no puedo entrenar alguna semana o me desordeno?",
        answer:
          "El sistema está pensado para eso. Martín dejó de entrenar la mitad del primer mes y aun así bajó 19 kg en 90 días. El programa no depende de tu motivación, depende de la estructura. Se ajusta semana a semana según lo que realmente estés pudiendo hacer.",
      },
      {
        question: "¿Cómo sé que esto va a funcionar para mí?",
        answer:
          "Porque no es un método genérico. Antes de empezar evaluamos tu caso particular: tu peso, tu contexto, tu historial y tus objetivos. A partir de ahí se arma un plan 100% personalizado. Ya ayudamos a más de 2.500 personas en 10 países con perfiles similares al tuyo. Si aplicás y no sos un buen candidato, te lo vamos a decir directamente.",
      },
    ],
  },
  finalCta: {
    title: "CÓMO BAJAR +15 kg DE GRASA CORPORAL en sólo 90 DÍAS",
    text: "Sin pasar hambre con dietas extremas ni rutinas eternas en el gimnasio.",
    buttonLabel: "QUIERO EMPEZAR",
  },
  footer: {
    logo: "/assets/brand/logo.webp",
    socials: [
      { label: "Facebook", href: "https://www.facebook.com/profile.php?id=100054622772365" },
      { label: "Instagram", href: "https://www.instagram.com/coach.arete/" },
      { label: "YouTube", href: "https://www.youtube.com/@coachlucascasalins/videos" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/lucas-casalins-7b8a6a1aa/" },
    ],
  },
};
