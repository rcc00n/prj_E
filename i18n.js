/* словари */
const T = {
  en:{brand:"MedLink",
      "nav.home":"Home","nav.services":"Services","nav.doctors":"Doctors",
      "nav.how":"How it works","nav.reviews":"Reviews","nav.contact":"Contact",
      "hero.title":"Private Medical Care<br>Anywhere in the World",
      "hero.subtitle":"Connect with certified doctors 24/7, pay securely, travel confidently.",
      "hero.cta":"Find Your Doctor",
      "doctors.title":"Top Doctors","doctors.subtitle":"Hand-picked specialists with outstanding credentials",
      "services.title":"Our Services",
      "services.videoTitle":"Video Consultations","services.videoText":"Instant HD calls with specialists across 40+ fields.",
      "services.secondTitle":"Second Opinion","services.secondText":"Rapid review of diagnostics from top international clinics.",
      "services.travelTitle":"Medical Travel","services.travelText":"Full-service trip planning for surgeries & check-ups.",
      "how.title":"How It Works",
      "how.step1":"Search & Filter Doctors","how.step2":"Book and Pay Online",
      "how.step3":"Meet via Secure Platform","how.step4":"Rate & Receive Records",
     /* i18n.js → EN */
"reviews.title":"Patient Reviews",
"reviews.q1":"“Seamless, fast, and professional. I booked a cardiologist in Germany while sitting in Vancouver.”",
"reviews.q1cite":"— Alex P.",
"reviews.q2":"“Saved me thousands by getting a remote second opinion before surgery.”",
"reviews.q2cite":"— Maria L.",
"reviews.q3":"“Got an appointment with a top dermatologist in Seoul within hours — brilliant.”",
"reviews.q3cite":"— Sarah M.",
"reviews.q4":"“The translator feature made my pediatric consult in Madrid effortless.”",
"reviews.q4cite":"— Daniel K.",
"reviews.q5":"“Being able to see lab results and message the doctor afterwards is priceless.”",
"reviews.q5cite":"— Priya S.",
"reviews.q6":"“My chronic pain plan from a clinic in Zurich changed my life.”",
"reviews.q6cite":"— Michael T.",
"reviews.q7":"“Video physio sessions kept me on track after knee surgery.”",
"reviews.q7cite":"— Emma R.",
"reviews.q8":"“Had MRI images reviewed by three neurosurgeons in two days — amazing.”",
"reviews.q8cite":"— Victor L.",

      "contact.title":"Contact Us","contact.namePh":"Name","contact.emailPh":"Email",
      "contact.msgPh":"Message","contact.sendBtn":"Send",
      footer:"© 2025 MedLink. All rights reserved."
  },
  ru:{brand:"MedLink",
      "nav.home":"Главная","nav.services":"Услуги","nav.doctors":"Врачи",
      "nav.how":"Как это работает","nav.reviews":"Отзывы","nav.contact":"Контакты",
      "hero.title":"Частная медицинская помощь<br>в любой точке мира",
      "hero.subtitle":"Связь с сертифицированными врачами 24/7, безопасная оплата, уверенные путешествия.",
      "hero.cta":"Найти врача",
      "doctors.title":"Лучшие врачи","doctors.subtitle":"Отобранные специалисты с высоким рейтингом",
      "services.title":"Наши услуги",
      "services.videoTitle":"Видеоконсультации","services.videoText":"HD-звонки со специалистами 40+ направлений.",
      "services.secondTitle":"Второе мнение","services.secondText":"Срочный обзор диагностики от топ-клиник мира.",
      "services.travelTitle":"Медицинский туризм","services.travelText":"Полное сопровождение поездок на операции и обследования.",
      "how.title":"Как это работает",
      // ↓ только этот фрагмент ru-словаря
"how.step1":"Поиск врачей",
"how.step2":"Бронь и оплата",
"how.step3":"Онлайн-встреча",
"how.step4":"Оценка и записи",
      /* i18n.js → RU */
"reviews.title":"Отзывы пациентов",
"reviews.q1":"«Быстро и профессионально. Я записался к кардиологу в Германии, находясь в Ванкувере.»",
"reviews.q1cite":"— Алекс П.",
"reviews.q2":"«Сэкономила тысячи, получив удалённое второе мнение перед операцией.»",
"reviews.q2cite":"— Мария Л.",
"reviews.q3":"«Записалась к топовому дерматологу в Сеуле за считанные часы — прекрасно.»",
"reviews.q3cite":"— Сара М.",
"reviews.q4":"«Функция переводчика сделала педиатрическую консультацию в Мадриде лёгкой и понятной.»",
"reviews.q4cite":"— Даниил К.",
"reviews.q5":"«Возможность увидеть результаты анализов и сразу переписываться с врачом — бесценно.»",
"reviews.q5cite":"— Прия С.",
"reviews.q6":"«План лечения хронической боли из клиники в Цюрихе поменял мою жизнь.»",
"reviews.q6cite":"— Михаил Т.",
"reviews.q7":"«Видео-сеансы с физиотерапевтом помогли восстановиться после операции на колене.»",
"reviews.q7cite":"— Эмма Р.",
"reviews.q8":"«Снимки МРТ оценили три нейрохирурга за два дня — впечатляет.»",
"reviews.q8cite":"— Виктор Л.",

      "contact.title":"Связаться с нами","contact.namePh":"Имя","contact.emailPh":"Email",
      "contact.msgPh":"Сообщение","contact.sendBtn":"Отправить",
      footer:"© 2025 MedLink. Все права защищены."
  }
};

/* расширяем глобальный словарь T из i18n.js */
Object.assign(T.en, {
  "doc.heroTitle":"Find the Right Specialist",
  "doc.searchPh":"Search by name or specialty…"
});

Object.assign(T.ru, {
  "doc.heroTitle":"Найдите подходящего специалиста",
  "doc.searchPh":"Поиск по имени или специализации…"
});

/*  Дополняем глобальный словарь T из i18n.js  */
Object.assign(T.en, {
  // HERO
  "svc.heroTitle":    "Connecting Patients with World-Class Doctors Worldwide",
  "svc.heroSubtitle": "Our platform links patients to certified specialists around the globe – and lets doctors extend care beyond borders.",
  // STATS
  "svc.statCountries":"Countries Covered",
  "svc.statDoctors":  "Doctors Onboarded",
  "svc.statPatients": "Patients Served",
  // PATIENTS
  "svc.patientsTitle":   "For Patients",
  "svc.patientsSubtitle":"Select a service to see details",
  "svc.tabConsult": "Video Consultations",
  "svc.tabOpinion": "Second Opinion",
  "svc.tabTravel":  "Medical Travel",
  // Consult panel
  "svc.consultTitle":"Video Consultations",
  "svc.consultP1":"Connect instantly with specialists via secure HD video calls across 40+ fields.",
  "svc.consultP2":"Pick a doctor and time – enjoy 24/7 access to quality care from home.",
  // Opinion panel
  "svc.opinionTitle":"Second Opinion",
  "svc.opinionP1":"Upload records and get an expert review from top clinics in days.",
  "svc.opinionP2":"Double-check diagnoses or plans to make confident decisions.",
  // Travel panel
  "svc.travelTitle":"Medical Travel",
  "svc.travelP1":"We arrange treatment abroad – hospitals, flights, visas, hotels.",
  "svc.travelP2":"Focus on health; we handle logistics and post-care follow-up.",
  // DOCTORS
  "svc.doctorsTitle":"For Doctors",
  "svc.doctorsSubtitle":"Grow your practice internationally with MedLink",
  "svc.accordOnb":"Onboarding",
  "svc.accordEarn":"Earnings",
  "svc.accordBenefits":"Benefits",
  "svc.accordTools":"Tools & Compliance",
  "svc.accordOnbBody":`
    <p><b>100 % online.</b> Upload your docs – approval in&nbsp;48 h.</p>
    <ul>
      <li>Create a profile & choose services</li>
      <li>Set your schedule</li>
      <li>Auto-translate into 15 languages</li>
    </ul>`,

  /* Earnings */
  "svc.accordEarnBody":`
    <p><b>12 % flat commission.</b> You set the price – payouts every Friday.</p>
    <ul>
      <li>HD video consults</li>
      <li>As-you-can Q&amp;A</li>
      <li>Formal second-opinion reports</li>
    </ul>`,

  /* Benefits */
  "svc.accordBenefitsBody":`
    <p>🌍 Patients from 35 countries — no relocation.</p>
    <p>📈 CME credits & research network.</p>`,

  /* Tools & Compliance */
  "svc.accordToolsBody":`
    <p>🔒 HIPAA / GDPR, e-prescriptions, DICOM viewer.</p>`
});

/* ——— Сжатые русские версии ——— */
Object.assign(T.ru, {
  // HERO
  "svc.heroTitle":    "Связываем пациентов с лучшими врачами мира",
  "svc.heroSubtitle": "Платформа соединяет пациентов с сертифицированными специалистами и позволяет врачам лечить без границ.",
  // STATS
  "svc.statCountries":"Стран",
  "svc.statDoctors":  "Врачей",
  "svc.statPatients": "Пациентов",
  // PATIENTS
  "svc.patientsTitle":   "Пациентам",
  "svc.patientsSubtitle":"Выберите услугу",
  "svc.tabConsult": "Видео-консультации",
  "svc.tabOpinion": "Второе мнение",
  "svc.tabTravel":  "Медтуризм",
  // Consult panel
  "svc.consultTitle":"Видео-консультации",
  "svc.consultP1":"Мгновенно связывайтесь с врачами 40+ специализаций по HD-видео.",
  "svc.consultP2":"Выберите специалиста и время – помощь 24/7, не выходя из дома.",
  // Opinion panel
  "svc.opinionTitle":"Второе мнение",
  "svc.opinionP1":"Загрузите обследования и получите отзыв топ-клиники за пару дней.",
  "svc.opinionP2":"Проверьте диагноз или план лечения, чтобы принять верное решение.",
  // Travel panel
  "svc.travelTitle":"Медтуризм",
  "svc.travelP1":"Организуем лечение за рубежом: клиника, перелёт, виза, отель.",
  "svc.travelP2":"Мы решаем логистику, вы сосредотачиваетесь на здоровье.",
  // DOCTORS
  "svc.doctorsTitle":"Врачам",
  "svc.doctorsSubtitle":"Расширяйте практику с MedLink",
  "svc.accordOnb":"Онбординг",
  "svc.accordEarn":"Доход",
  "svc.accordBenefits":"Преимущества",
  "svc.accordTools":"Инструменты и комплаенс",
  // Accordion bodies (коротко, чтобы не ломать вёрстку)
  "svc.accordOnbBody":`
    <p><b>Онлайн-регистрация.</b> Проверка документов – 48 ч.</p>
    <ul><li>Профиль, услуги, расписание</li><li>Автоперевод на 15 языков</li></ul>`,
  "svc.accordEarnBody":`
    <p><b>Комиссия 12 %.</b> Цена ваша – выплаты каждую пятницу.</p>
    <ul><li>HD-встречи</li><li>Q&A</li><li>Отчёты «2-е мнение»</li></ul>`,
  "svc.accordBenefitsBody":`
    <p>🌍 Приём пациентов из 35 стран без переезда.</p>
    <p>📈 CME и исследования.</p>`,
  "svc.accordToolsBody":`
    <p>🔒 HIPAA / GDPR, e-рецепты, DICOM.</p>`
});

function setLang(lang){
  localStorage.setItem('lang',lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el=>{
    el.innerHTML = T[lang][el.dataset.i18n] || '';
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
    el.placeholder = T[lang][el.dataset.i18nPlaceholder] || '';
  });
  document.querySelectorAll('.lang-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.lang===lang);
  });
document.dispatchEvent(new CustomEvent('langChanged', {detail: lang}))
}

document.addEventListener('DOMContentLoaded',()=>{
  setLang(localStorage.getItem('lang') || 'en');
  document.querySelectorAll('.lang-btn').forEach(b=>{
    b.addEventListener('click',()=>setLang(b.dataset.lang));
  });
});

/* =====  ДОБАВЬ в i18n.js после существующих переводов  ===== */
Object.assign(translations.en,{
  "modal.book":"Book Appointment",
  "form.title":"Appointment request",
  "form.send":"Send",
  "form.name":"Name",
  "form.email":"Email",
  "form.phone":"Phone"
});

Object.assign(translations.ru,{
  "modal.book":"Записаться",
  "form.title":"Запрос на приём",
  "form.send":"Отправить",
  "form.name":"Имя",
  "form.email":"E-mail",
  "form.phone":"Телефон"
});

/* === AUTH === */
Object.assign(T.en,{
  "auth.login" :"Log in",
  "auth.signup":"Sign up"
});
Object.assign(T.ru,{
  "auth.login" :"Войти",
  "auth.signup":"Регистрация"
});
