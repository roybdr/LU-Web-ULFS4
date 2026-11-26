// =========================================================================
// 1. EXTENSIBLE PORTAL ARCHITECTURE (PAGE REGISTRY + STATE)
//    Adding a new page later is as simple as registering a new entry in
//    state.customPages (or adding a built-in page definition below).
// =========================================================================

const STORAGE_KEY = 'luweb_proto_v6';

const FACULTIES = [
  { id: 'sci', name: 'Faculty of Sciences', branches: ['Branch 4'] }
];

const MAJORS = [
  { id: 'math', en: 'Mathematics', fr: 'Mathématiques' },
  { id: 'physics', en: 'Physics', fr: 'Physique' },
  { id: 'cs', en: 'Computer Science', fr: 'Informatique' }
];

function getMajorLabel(majorId, lang) {
  const m = MAJORS.find(x => x.id === majorId);
  if (!m) return majorId;
  return lang === 'fr' ? m.fr : m.en;
}

const PROFESSORS = [
  'Dr. M. Dandache',
  'Dr. H. Mansour',
  'Dr. R. Khoury',
  'Dr. N. Salameh'
];

const ROLES = {
  student: { label: 'Public Visitor', badge: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200', canEdit: false, canManagePages: false, desc: 'Open access to Calendar, Cours, Announcements, Offers, Bylaws, and Guides.' },
  delegate: { label: 'Class Delegate', badge: 'bg-blue-500', pill: 'bg-blue-50 text-blue-700 border-blue-200', canEdit: true, canManagePages: false, desc: 'Class Delegate updates.' },
  professor: { label: 'Professor', badge: 'bg-violet-500', pill: 'bg-violet-50 text-violet-700 border-violet-200', canEdit: true, canManagePages: false, desc: 'Manage your own teaching schedule and announcements (Cours is managed exclusively by Site Admins).' },
  council: { label: 'Site Admin', badge: 'bg-amber-500', pill: 'bg-amber-50 text-amber-800 border-amber-200', canEdit: true, canManagePages: true, desc: 'Full admin privileges: manage all schedules, approve Cours uploads, post announcements, and add new website windows.' },
  directory: { label: 'Directory', badge: 'bg-rose-500', pill: 'bg-rose-50 text-rose-700 border-rose-200', canEdit: true, canManagePages: true, desc: 'Official Branch 4 Directory notices.' }
};

function getDefaultState() {
  return {
    activePage: 'dashboard',
    theme: 'light',
    profile: {
      role: 'student',
      professorName: '',
      facultyId: 'sci',
      branch: 'Branch 4'
    },
    calendarFilters: {
      selectedDate: '2026-11-23',
      major: 'All',
      year: 'All',
      query: '',
      class: true,
      exam: true,
      holiday: true,
      event: true
    },
    archiveFilters: {
      lang: 'en',
      major: 'All',
      year: 'All',
      type: 'All',
      query: ''
    },
    announcementFilter: 'All',
    timeCalcMinutes: 20,
    announcements: [
      { id: 'a1', title: 'I2201 Web Development — Project Guidelines Posted', body: 'Updated HTML/CSS/JS requirements for the semester project are now available inside Cours.', authorRole: 'professor', authorName: 'Dr. M. Dandache', date: 'Today, 08:15', pinned: true, facultyId: 'sci' },
      { id: 'a2', title: 'Midterm Exam Schedule — Fall Semester Published', body: 'Official midterm dates for Year 1 & Year 2 are now live in Calendar. Check for any overlaps before Friday.', authorRole: 'directory', authorName: 'ULFS4 Directory', date: 'Yesterday', pinned: true, facultyId: 'sci' },
      { id: 'a3', title: 'M1101 Analyse 1 — Updated TD Series 4', body: 'Added exercises 12–16 covering sequences and limits. Solutions will be reviewed in Monday session.', authorRole: 'delegate', authorName: 'Year 1 Class Delegate', date: '2 days ago', pinned: false, facultyId: 'sci' }
    ],
    events: [
      { id: 'e1', isoDate: '2026-11-23', day: 'Mon', date: 'Nov 23', time: '08:30 – 10:30', title: 'I2201 Web Development', location: 'Year 2 CS Class', category: 'class', year: 'Year 2', major: 'cs', professor: 'Dr. M. Dandache', facultyId: 'sci', editorRole: 'professor', note: '' },
      { id: 'e2', isoDate: '2026-11-23', day: 'Mon', date: 'Nov 23', time: '11:00 – 13:00', title: 'M1101 Analyse 1', location: 'Year 1 Math Class', category: 'class', year: 'Year 1', major: 'math', professor: 'Dr. H. Mansour', facultyId: 'sci', editorRole: 'professor', note: 'Chapter 4 sequences & limits.' },
      { id: 'e3', isoDate: '2026-11-24', day: 'Tue', date: 'Nov 24', time: '09:00 – 11:00', title: 'P1100 Mécanique Classique', location: 'Year 1 Physics Class', category: 'class', year: 'Year 1', major: 'physics', professor: 'Dr. R. Khoury', facultyId: 'sci', editorRole: 'professor', note: 'Rotational dynamics lecture.' },
      { id: 'e4', isoDate: '2026-11-25', day: 'Wed', date: 'Nov 25', time: '09:00 – 11:00', title: 'I2205 Graphs Quiz', location: 'Year 2 CS Class', category: 'exam', year: 'Year 2', major: 'cs', professor: 'Dr. M. Dandache', facultyId: 'sci', editorRole: 'professor', note: 'Covers BFS, DFS, and shortest paths.' },
      { id: 'e5', isoDate: '2026-11-26', day: 'Thu', date: 'Nov 26', time: '10:30 – 12:30', title: 'P1101 Electro TD', location: 'Year 1 Physics Class', category: 'class', year: 'Year 1', major: 'physics', professor: 'Dr. R. Khoury', facultyId: 'sci', editorRole: 'professor', note: 'Gauss law exercises.' },
      { id: 'e6', isoDate: '2026-11-26', day: 'Thu', date: 'Nov 26', time: '13:30 – 15:00', title: 'Français B2', location: 'Year 2 Assigned Class', category: 'class', year: 'Year 2', major: 'All', professor: 'Dr. N. Salameh', facultyId: 'sci', editorRole: 'delegate', note: 'Oral & written comprehension.' },
      { id: 'e7', isoDate: '2026-11-27', day: 'Fri', date: 'Nov 27', time: 'All Day', title: 'University Holiday (No Classes)', location: 'All ULFS4 Classes', category: 'holiday', year: 'All', major: 'All', professor: '', facultyId: 'sci', editorRole: 'directory', note: 'Official directory notice.' }
    ],
    documents: [
      // English Section — 6 Believable ULFS4 Courses
      { id: 'DOC-101', facultyId: 'sci', branch: 'Branch 4', major: 'math', lang: 'en', year: 'Year 1', semester: 'S1', courseCode: 'M1101', courseName: 'Analyse 1', type: 'Dawrat', title: '2024–2025 Session 1 Final + Full Solution', uploader: 'Archive Migration', verifiedBy: 'Admin', status: 'approved', size: '2.4 MB', updated: '2026-10-12' },
      { id: 'DOC-102', facultyId: 'sci', branch: 'Branch 4', major: 'physics', lang: 'en', year: 'Year 1', semester: 'S1', courseCode: 'P1100', courseName: 'Mécanique Classique', type: 'Course', title: 'Complete Lecture Notes (Chapters 1–6)', uploader: 'Dr. R. Khoury', verifiedBy: 'Admin', status: 'approved', size: '5.1 MB', updated: '2026-10-18' },
      { id: 'DOC-103', facultyId: 'sci', branch: 'Branch 4', major: 'physics', lang: 'en', year: 'Year 1', semester: 'S2', courseCode: 'P1101', courseName: 'Electro', type: 'Dawrat', title: '2023–2025 Past Exams & Worked Solutions', uploader: 'Year 1 Delegate', verifiedBy: 'Admin', status: 'approved', size: '3.2 MB', updated: '2026-10-25' },
      { id: 'DOC-201', facultyId: 'sci', branch: 'Branch 4', major: 'cs', lang: 'en', year: 'Year 2', semester: 'S3', courseCode: 'I2201', courseName: 'Web Dev', type: 'Course', title: 'HTML, CSS, Vanilla JS & DOM Complete Slides', uploader: 'Dr. M. Dandache', verifiedBy: 'Admin', status: 'approved', size: '4.1 MB', updated: '2026-11-05' },
      { id: 'DOC-202', facultyId: 'sci', branch: 'Branch 4', major: 'cs', lang: 'en', year: 'Year 2', semester: 'S3', courseCode: 'I2205', courseName: 'Graphs', type: 'Dawrat', title: '2023–2025 Dawrat Bundle (Trees, BFS & Dijkstra)', uploader: 'Year 2 CS Student', verifiedBy: 'Admin', status: 'approved', size: '3.6 MB', updated: '2026-11-09' },
      { id: 'DOC-203', facultyId: 'sci', branch: 'Branch 4', major: 'cs', lang: 'en', year: 'Year 2', semester: 'S3', courseCode: 'FR-B2', courseName: 'Français B2', type: 'Exercises', title: 'TD Comprehension & Exam Prep Pack', uploader: 'Year 2 Delegate', verifiedBy: 'Admin', status: 'approved', size: '1.8 MB', updated: '2026-11-14' },
      { id: 'DOC-204', facultyId: 'sci', branch: 'Branch 4', major: 'cs', lang: 'en', year: 'Year 2', semester: 'S3', courseCode: 'I2201', courseName: 'Web Dev', type: 'Dawrat', title: '2025 Midterm — Forms & Responsive Layout', uploader: 'Branch 4 Student', verifiedBy: 'Pending Review', status: 'pending', size: '1.1 MB', updated: '2026-11-18' },
      // French Section — Same 6 Believable ULFS4 Courses
      { id: 'DOC-301', facultyId: 'sci', branch: 'Branch 4', major: 'math', lang: 'fr', year: 'Year 1', semester: 'S1', courseCode: 'M1101', courseName: 'Analyse 1', type: 'Dawrat', title: 'Dawrat 2023–2025 Session 1 & 2 avec Corrigés', uploader: 'Délégué Math L1', verifiedBy: 'Admin', status: 'approved', size: '3.1 MB', updated: '2026-11-10' },
      { id: 'DOC-302', facultyId: 'sci', branch: 'Branch 4', major: 'physics', lang: 'fr', year: 'Year 1', semester: 'S1', courseCode: 'P1100', courseName: 'Mécanique Classique', type: 'Course', title: 'Cours Complet — Cinématique & Dynamique', uploader: 'Dr. R. Khoury', verifiedBy: 'Admin', status: 'approved', size: '4.8 MB', updated: '2026-11-11' },
      { id: 'DOC-303', facultyId: 'sci', branch: 'Branch 4', major: 'physics', lang: 'fr', year: 'Year 1', semester: 'S2', courseCode: 'P1101', courseName: 'Electro', type: 'Dawrat', title: "Sujets d'Examens 2022–2025 + Corrigés", uploader: 'Délégué Physique L1', verifiedBy: 'Admin', status: 'approved', size: '3.7 MB', updated: '2026-11-15' },
      { id: 'DOC-304', facultyId: 'sci', branch: 'Branch 4', major: 'cs', lang: 'fr', year: 'Year 2', semester: 'S3', courseCode: 'I2201', courseName: 'Web Dev', type: 'Course', title: 'Cours & TP — Développement Web (HTML/CSS/JS)', uploader: 'Dr. M. Dandache', verifiedBy: 'Admin', status: 'approved', size: '3.9 MB', updated: '2026-11-14' },
      { id: 'DOC-305', facultyId: 'sci', branch: 'Branch 4', major: 'cs', lang: 'fr', year: 'Year 2', semester: 'S3', courseCode: 'I2205', courseName: 'Graphs', type: 'Dawrat', title: 'Dawrat Théorie des Graphes 2024–2025', uploader: 'Délégué Info L2', verifiedBy: 'Admin', status: 'approved', size: '1.9 MB', updated: '2026-11-16' },
      { id: 'DOC-306', facultyId: 'sci', branch: 'Branch 4', major: 'cs', lang: 'fr', year: 'Year 2', semester: 'S3', courseCode: 'FR-B2', courseName: 'Français B2', type: 'Exercises', title: 'Fiches TD & Sujets B2 Corrigés', uploader: 'Dr. N. Salameh', verifiedBy: 'Admin', status: 'approved', size: '1.4 MB', updated: '2026-11-16' }
    ],
    forumSort: 'hot',
    forumFlair: 'All',
    expandedPostId: null,
    forumPosts: [
      {
        id: 'fp1',
        author: 'u/cs_year2',
        timeAgo: '2h ago',
        flair: 'Study Tips',
        title: 'Best way to prepare for I2201 Web Dev midterm with Dr. M. Dandache?',
        body: 'Anyone who took it last year—should we focus more on DOM manipulation and vanilla JS events or CSS Flexbox/Grid layouts? Sharing my summary sheet below.',
        attachment: 'I2201_DOM_Cheatsheet.pdf',
        votes: 42,
        userVote: 0,
        comments: [
          { id: 'c1', author: 'u/senior_info', timeAgo: '1h ago', text: 'Definitely practice addEventListener, form validation, and Flexbox. The exam is super fair if you build 2–3 small pages from scratch.' },
          { id: 'c2', author: 'u/math_l2', timeAgo: '40m ago', text: 'Thanks for the cheatsheet! Saved me an hour.' }
        ]
      },
      {
        id: 'fp2',
        author: 'u/phys_l1',
        timeAgo: '5h ago',
        flair: 'Question',
        title: 'Does anyone have the full solution for P1100 Mécanique Classique TD 3 Ex 4?',
        body: 'Stuck on the rotating frame part—my acceleration term has a missing factor of 2 compared to the final answer.',
        attachment: '',
        votes: 27,
        userVote: 0,
        comments: [
          { id: 'c3', author: 'u/electro_nerd', timeAgo: '3h ago', text: 'You probably forgot the Coriolis term 2(omega x v_rel). Check page 14 of the course PDF in Cours!' }
        ]
      },
      {
        id: 'fp3',
        author: 'u/zahle_commuter',
        timeAgo: '1d ago',
        flair: 'Campus',
        title: 'Quick review of Al-Forno vs Bean & Study between morning classes',
        body: 'Al-Forno is unbeatable if you only have 10 minutes between sessions, while Bean & Study is way better if you have a 2-hour gap and need Wi-Fi + power outlets.',
        attachment: '',
        votes: 64,
        userVote: 0,
        comments: []
      }
    ],
    guides: [
      { id: 'g1', title: 'Course Registration & Credit Rules (LMD System)', tag: 'Academics', summary: 'How 30-credit semesters, compensation between courses, and prerequisite blocks work.', steps: ['Check your required semester courses in Cours.', 'Verify prerequisites before submitting your administrative registration slip.', 'Remember: 1 full 6-credit course equals ~60 lecture hours — plan study blocks accordingly.', 'Keep a copy of your stamped registration receipt for exam verification.'] },
      { id: 'g2', title: 'Requesting an Exam Paper Re-Check / Petition', tag: 'Admin', summary: 'Exact window and paperwork needed if a grade looks miscalculated.', steps: ['Check your grade on the Official LU SIS (http://sisol.ul.edu.lb/) as soon as results drop.', 'Submit a written petition at the ULFS4 Student Affairs office within the official 48–72 hour window.', 'Include your exact course code, exam session, and year.'] },
      { id: 'g3', title: 'How to Submit Missing Dawrat & TD Notes', tag: 'Cours', summary: 'Naming rules so every student can find files in one search.', steps: ['Use the format: CourseCode_Type_Year_Topic (e.g. M1101_Dawrat_2025_S1.pdf).', 'Click "Submit Document" inside Cours and select Language, Major, Year, and Type.', 'Admins review and approve uploads so they appear cleanly in search.'] }
    ],
    offerFilter: 'All',
    offerSort: 'popularity',
    foodCoffeeTags: { Food: true, Coffee: true },
    offers: [
      { id: 'o1', partner: 'Campus Copy & Print Center', category: 'Printing', discount: '25% OFF', avgPrice: 1.5, popularity: 96, tags: [], details: 'Discounted printing, binding, and past exam booklets for students.', location: 'Across from ULFS4 Main Gate' },
      { id: 'o2', partner: 'Al-Ilm Scientific Bookstore', category: 'Books & Supplies', discount: '15% OFF', avgPrice: 8.0, popularity: 82, tags: [], details: 'Textbooks, scientific calculators, and lab supplies.', location: 'Zahlé Main Blvd' },
      { id: 'o3', partner: 'Bean & Study Café', category: 'Food & Coffee', discount: 'From $2.00', avgPrice: 2.0, popularity: 95, tags: ['Coffee', 'Food'], details: 'Espresso $1.50 · Iced Latte $2.50 · Club Sandwich $4.00 · Free Wi-Fi & study tables.', location: '5 min walk from ULFS4' },
      { id: 'o4', partner: 'Al-Forno Manakish & Snacks', category: 'Food & Coffee', discount: 'From $1.25', avgPrice: 1.25, popularity: 98, tags: ['Food'], details: 'Zaatar $1.00 · Cheese Manoushe $2.00 · Tawouk Sandwich $3.50 · Fast pickup between classes.', location: '2 min from ULFS4 Gate' },
      { id: 'o5', partner: 'Roast Corner Espresso Bar', category: 'Food & Coffee', discount: 'From $1.50', avgPrice: 1.5, popularity: 88, tags: ['Coffee'], details: 'Turkish Coffee $1.00 · Americano $1.75 · Cappuccino $2.25 · Quick morning grab-and-go.', location: '3 min walk from ULFS4' },
      { id: 'o6', partner: 'Cedar Grill & Bowls', category: 'Food & Coffee', discount: 'From $3.50', avgPrice: 3.5, popularity: 85, tags: ['Food'], details: 'Daily Plat du Jour $4.50 · Chicken Sub $3.50 · Fries $1.50.', location: '4 min from ULFS4' },
      { id: 'o7', partner: 'Computer Store 1', category: 'Tech', discount: 'Free Mouse', avgPrice: 25.0, popularity: 90, tags: [], details: 'At Computer Store 1 you get a free mouse with every keyboard you get.', location: 'Main Road, 3 min from ULFS4' }
    ],
    bylaws: [
      { num: 1, text: 'This is a student-made website, not the official LU website which is http://sisol.ul.edu.lb/.', hasLink: true },
      { num: 2, text: 'We are not responsible for any student materials available or missing on this platform.' },
      { num: 3, text: 'Schedules, exam dates, and announcements are provided for student convenience—always double-check official deadlines on http://sisol.ul.edu.lb/ or with your faculty.' },
      { num: 4, text: 'All Cours, TD, and Dawrat files hosted here are free for students and may not be sold or redistributed commercially.' },
      { num: 5, text: 'Uploaded files and calendar updates are moderated to keep information accurate and organized.' }
    ],
    customPages: []
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Object.assign(getDefaultState(), parsed);
    }
  } catch (e) {
    // Fallback safely in restricted storage environments
  }
  return getDefaultState();
}

let state = loadState();

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // Ignore storage quota or sandbox errors
  }
}

// Core Built-in Pages Registry + Dynamic Custom Pages
function getPageRegistry() {
  const roleInfo = ROLES[state.profile.role] || ROLES.student;
  const pendingCount = state.documents.filter(d => d.status === 'pending').length;
  const pages = [
    { id: 'dashboard', label: 'Today', subtitle: 'Next up & quick jump', builtin: true },
    { id: 'calendar', label: 'Calendar', subtitle: 'Classes, exams & holidays', builtin: true },
    { id: 'archive', label: 'Cours', subtitle: 'Courses, books, Dawrat & solutions', builtin: true },
    { id: 'announcements', label: 'Verified Announcements', subtitle: 'Directory, profs, delegates & admins', builtin: true, badge: String(state.announcements.length) },
    { id: 'offers', label: 'Offers & Discounts', subtitle: 'Near you, menus & deals', builtin: true, badge: String(state.offers.length) },
    { id: 'bylaws', label: 'Bylaws', subtitle: 'Rules & disclaimers', builtin: true },
    { id: 'guides', label: 'Survival Guides', subtitle: 'Registration & admin steps', builtin: true },
    { id: 'forum', label: 'Forum', subtitle: 'Student posts, Q&A & upvotes', builtin: true }
  ];
  state.customPages.forEach(cp => {
    pages.push({ id: cp.id, label: cp.label, subtitle: cp.shortDesc || 'Custom window', builtin: false, badge: cp.badge || '' });
  });
  if (roleInfo.canEdit) {
    pages.push({ id: 'editor', label: 'Editor Console', subtitle: 'Manage events, docs & pages', builtin: true, badge: pendingCount > 0 ? String(pendingCount) : '' });
  }
  return pages;
}

// =========================================================================
// 2. HELPERS (ESCAPING, TOASTS, MODALS, ICS EXPORT)
// =========================================================================

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showToast(message, tone = 'info') {
  const container = document.getElementById('toast-container');
  const colors = {
    info: 'bg-slate-900 text-white',
    success: 'bg-emerald-700 text-white',
    warning: 'bg-amber-600 text-white'
  };
  const el = document.createElement('div');
  el.className = `pointer-events-auto px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in ${colors[tone] || colors.info}`;
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.25s';
    setTimeout(() => el.remove(), 250);
  }, 3000);
}

function openModal(title, htmlContent) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = htmlContent;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

function downloadIcsFile() {
  const filtered = getFilteredEvents();
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ULFS4 Student Portal//EN',
    'CALSCALE:GREGORIAN'
  ];
  filtered.forEach((ev, idx) => {
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:scihub-b4-${ev.id}-${idx}@ulfs4.local`);
    lines.push(`SUMMARY:${ev.title}`);
    lines.push(`LOCATION:${ev.location}`);
    lines.push(`DESCRIPTION:${ev.note || ''} (Verified by ${ROLES[ev.editorRole]?.label || 'Admin'})`);
    lines.push('DTSTART:20261123T083000Z');
    lines.push('DTEND:20261123T103000Z');
    lines.push('END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `branch4_${state.calendarFilters.major.toLowerCase()}_calendar.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast(`Exported ${filtered.length} events to .ics calendar file`, 'success');
}

function getTodayIso() {
  const now = new Date();
  const yy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

function shiftIsoDate(isoStr, deltaDays) {
  const [y, m, d] = isoStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + deltaDays));
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(dt.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

function formatIsoDateLong(isoStr) {
  const [y, m, d] = isoStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

function getWeekStrip(isoStr) {
  const [y, m, d] = isoStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const dow = dt.getUTCDay(); // 0=Sun..6=Sat
  const diffToMon = dow === 0 ? -6 : 1 - dow;
  const monIso = shiftIsoDate(isoStr, diffToMon);
  const days = [];
  const shortNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  for (let i = 0; i < 7; i++) {
    const cur = shiftIsoDate(monIso, i);
    const dayNum = Number(cur.split('-')[2]);
    days.push({ iso: cur, shortName: shortNames[i], dayNum });
  }
  return days;
}

function getFilteredEvents(opts = {}) {
  const cf = state.calendarFilters;
  const q = (cf.query || '').trim().toLowerCase();
  return state.events.filter(ev => {
    if (!cf[ev.category]) return false;
    if (cf.major !== 'All' && ev.major !== 'All' && ev.major !== cf.major) return false;
    if (cf.year !== 'All' && ev.year !== 'All' && ev.year !== cf.year) return false;
    if (q) {
      const hay = `${ev.title} ${ev.location} ${ev.professor || ''} ${ev.note || ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (opts.onlySelectedDate && !q) {
      if (ev.isoDate !== cf.selectedDate) return false;
    }
    return true;
  });
}

function getCategoryStyle(cat) {
  const map = {
    class: { label: 'Class', badge: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
    exam: { label: 'Exam / Quiz', badge: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
    holiday: { label: 'Holiday', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    event: { label: 'Campus Event', badge: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' }
  };
  return map[cat] || map.class;
}

// =========================================================================
// 3. HEADER & NAVIGATION RENDERING
// =========================================================================

function openDrawer() {
  document.getElementById('slide-drawer-backdrop').classList.remove('hidden');
  document.getElementById('slide-drawer').classList.remove('-translate-x-full');
}

function closeDrawer() {
  document.getElementById('slide-drawer-backdrop').classList.add('hidden');
  document.getElementById('slide-drawer').classList.add('-translate-x-full');
}

function renderHeaderAndNav() {
  const roleInfo = ROLES[state.profile.role] || ROLES.student;
  const isAdmin = roleInfo.canEdit;
  const isCouncilAdmin = roleInfo.canManagePages;

  document.getElementById('header-scope-label').textContent = `Faculty of Sciences · ${state.profile.branch}`;

  // Header Admin Pill (hidden for normal public users)
  const adminPill = document.getElementById('header-admin-pill');
  if (isAdmin) {
    adminPill.classList.remove('hidden');
    adminPill.classList.add('flex');
    document.getElementById('role-badge-dot').className = `w-2 h-2 rounded-full shrink-0 ${roleInfo.badge}`;
    document.getElementById('header-admin-label').textContent =
      state.profile.role === 'professor' ? state.profile.professorName : 'Site Admin';
  } else {
    adminPill.classList.add('hidden');
    adminPill.classList.remove('flex');
  }

  // Drawer Admin Row + Admin-Only "Add New Window" button
  const drawerAddBtn = document.getElementById('btn-drawer-addpage');
  const footerAddBtn = document.getElementById('btn-footer-addpage');
  const footerAddSep = document.getElementById('footer-addpage-sep');
  if (isCouncilAdmin) {
    drawerAddBtn.classList.remove('hidden');
    drawerAddBtn.classList.add('flex');
    footerAddBtn.classList.remove('hidden');
    footerAddSep.classList.remove('hidden');
  } else {
    drawerAddBtn.classList.add('hidden');
    drawerAddBtn.classList.remove('flex');
    footerAddBtn.classList.add('hidden');
    footerAddSep.classList.add('hidden');
  }

  document.getElementById('drawer-admin-title').textContent = isAdmin
    ? (state.profile.role === 'professor' ? state.profile.professorName : 'Admin')
    : 'Admin Access';

  // Sync Light/Dark Theme
  const isDark = state.theme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  const lightBtn = document.getElementById('btn-theme-light');
  const darkBtn = document.getElementById('btn-theme-dark');
  if (lightBtn && darkBtn) {
    lightBtn.className = isDark
      ? 'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition text-slate-400 hover:text-white'
      : 'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition bg-white text-slate-900 shadow-xs';
    darkBtn.className = isDark
      ? 'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition bg-slate-900 text-white shadow-xs'
      : 'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition text-slate-500 hover:text-slate-900';
  }
  const statusBadge = document.getElementById('drawer-admin-status');
  statusBadge.textContent = isAdmin ? 'Active' : 'Locked';
  statusBadge.className = isAdmin
    ? 'text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0'
    : 'text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0';

  const pages = getPageRegistry();
  if (!pages.some(p => p.id === state.activePage)) {
    state.activePage = 'dashboard';
  }
  const activeObj = pages.find(p => p.id === state.activePage) || pages[0];
  document.getElementById('header-active-window').textContent = activeObj.label;

  const drawerList = document.getElementById('slide-drawer-list');
  drawerList.innerHTML = pages.map(p => {
    const active = state.activePage === p.id;
    return `
      <button type="button" data-nav-id="${esc(p.id)}"
        class="nav-item w-full text-left flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl transition ${
          active ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'text-slate-700 hover:bg-slate-100 border border-transparent'
        }">
        <div class="min-w-0">
          <div class="text-sm font-semibold truncate">${esc(p.label)}</div>
          <div class="text-[11px] ${active ? 'text-brand-600/80' : 'text-slate-500'} truncate">${esc(p.subtitle || '')}</div>
        </div>
        ${p.badge ? `<span class="shrink-0 px-2 py-0.5 text-[10px] font-semibold rounded-full ${active ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-700'}">${esc(p.badge)}</span>` : ''}
      </button>
    `;
  }).join('');

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activePage = btn.getAttribute('data-nav-id');
      closeDrawer();
      saveState();
      renderApp();
    });
  });
}

// =========================================================================
// 4. VIEW RENDERERS
// =========================================================================

function renderDashboard() {
  const myEvents = getFilteredEvents();
  const nextUp = myEvents[0];
  const approvedDocs = state.documents.filter(d => d.status === 'approved' && d.lang === state.archiveFilters.lang);
  const minsPerDay = state.timeCalcMinutes;
  const totalHours = ((minsPerDay * 5 * 16) / 60).toFixed(1);
  const pctCourse = Math.round(((minsPerDay * 5 * 16) / 60 / 60) * 100);

  const visibleAnnouncements = state.announcements.filter(a => {
    if (state.announcementFilter !== 'All' && a.authorRole !== state.announcementFilter) return false;
    return true;
  });

  const courseMap = new Map();
  approvedDocs.forEach(d => {
    if (!courseMap.has(d.courseCode)) {
      courseMap.set(d.courseCode, { code: d.courseCode, name: d.courseName, year: d.year, count: 0 });
    }
    courseMap.get(d.courseCode).count += 1;
  });
  const quickCourses = Array.from(courseMap.values()).slice(0, 6);

  return `
    <div class="space-y-6 animate-in">
      <!-- Next Up Card (Clean Full Width) -->
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between gap-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <span class="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600">
              <span class="w-2 h-2 rounded-full bg-brand-600"></span>
              Next Up at Branch 4
            </span>
            <h1 class="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              ${nextUp ? esc(nextUp.title) : 'No upcoming sessions for your calendar filter'}
            </h1>
            <p class="text-sm text-slate-600 mt-1">
              ${nextUp ? `${esc(nextUp.day)}, ${esc(nextUp.date)} · ${esc(nextUp.time)} · <strong class="text-slate-800">${esc(nextUp.location)}</strong>${nextUp.professor ? ` · ${esc(nextUp.professor)}` : ''}` : 'Adjust filters in Calendar to view all Branch 4 sessions.'}
            </p>
          </div>
          <button type="button" data-goto="calendar" class="shrink-0 px-3.5 py-2 text-xs font-semibold rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 transition">
            Open Calendar →
          </button>
        </div>
        ${nextUp && nextUp.note ? `<div class="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-700"><span class="font-semibold text-slate-900">Note:</span> ${esc(nextUp.note)}</div>` : ''}
      </div>

      <!-- Quick Jump to Courses -->
      <section class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div class="flex items-center justify-between gap-2 mb-3">
          <div>
            <h2 class="text-base font-bold text-slate-900">Quick Jump to Cours</h2>
            <p class="text-xs text-slate-500">One click straight into Cours, TD, and Dawrat.</p>
          </div>
          <button type="button" data-goto="archive" class="text-xs font-semibold text-brand-600 hover:text-brand-700">Browse All →</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          ${quickCourses.map(c => `
            <button type="button" data-course-jump="${esc(c.code)}" class="course-jump-btn text-left p-3.5 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/40 transition flex items-center justify-between gap-3">
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono text-xs font-semibold">${esc(c.code)}</span>
                  <span class="text-[11px] text-slate-500">${esc(c.year)}</span>
                </div>
                <div class="font-semibold text-sm text-slate-900 mt-1 truncate">${esc(c.name)}</div>
              </div>
            </button>
          `).join('')}
        </div>
      </section>

      <!-- Verified Announcements Feed -->
      <section class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 class="text-base font-bold text-slate-900">Verified Announcements</h2>
            <p class="text-xs text-slate-500">Only posted by verified Delegates, Professors, Site Admins, or Directory.</p>
          </div>
          <div class="flex flex-wrap gap-1.5">
            ${['All', 'directory', 'professor', 'delegate', 'council'].map(f => `
              <button type="button" data-ann-filter="${f}" class="ann-filter-btn px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                state.announcementFilter === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }">${f === 'All' ? 'All' : ROLES[f].label}</button>
            `).join('')}
          </div>
        </div>
        <div class="space-y-3">
          ${visibleAnnouncements.length === 0 ? '<p class="text-sm text-slate-500 py-4 text-center">No announcements from this role yet.</p>' : visibleAnnouncements.map(a => {
            const r = ROLES[a.authorRole] || ROLES.council;
            return `
              <article class="p-4 rounded-xl border ${a.pinned ? 'border-brand-200 bg-brand-50/30' : 'border-slate-200 bg-white'}">
                <div class="flex flex-wrap items-center gap-2 text-xs mb-1.5">
                  <span class="px-2 py-0.5 rounded-full border font-medium ${r.pill}">${esc(r.label)}</span>
                  <span class="font-medium text-slate-700">${esc(a.authorName)}</span>
                  <span class="text-slate-400">· ${esc(a.date)}</span>
                  ${a.pinned ? '<span class="ml-auto text-[11px] font-semibold text-brand-700">Pinned</span>' : ''}
                </div>
                <h3 class="font-semibold text-sm text-slate-900">${esc(a.title)}</h3>
                <p class="text-xs sm:text-sm text-slate-600 mt-1">${esc(a.body)}</p>
              </article>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Compact Time-Saved Fidget Strip at Bottom -->
      <div class="bg-slate-900 text-slate-200 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs">
          <span class="text-sky-300 font-semibold uppercase tracking-wide text-[11px]">Why This Utility Exists</span>
          <span class="inline-flex items-center gap-1.5">
            <input id="time-saved-input" type="number" min="1" max="120" step="1" value="${minsPerDay}" aria-label="Set daily minutes saved" class="w-14 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-white font-mono text-xs text-center focus:border-sky-400 focus:outline-none" />
            <span class="text-slate-300">min/day</span>
            <span class="text-slate-500">→</span>
            <strong id="dash-hours-val" class="text-white font-bold">${totalHours} hrs</strong>/semester
            <span class="text-slate-400">(≈ <strong id="dash-pct-val" class="text-sky-300">${pctCourse}%</strong> of a 6-credit course)</span>
          </span>
        </div>
        <div class="flex items-center gap-2 sm:w-44 shrink-0">
          <input id="time-saved-slider" type="range" min="1" max="120" step="1" value="${minsPerDay}" aria-label="Daily minutes saved slider" class="w-full accent-sky-400 cursor-pointer h-1.5" />
          <span id="dash-slider-readout" class="font-mono text-[11px] text-slate-300 w-10 text-right shrink-0">${minsPerDay}m</span>
        </div>
      </div>
    </div>
  `;
}

function renderCalendar() {
  const cf = state.calendarFilters;
  const hasSearch = (cf.query || '').trim().length > 0;
  const events = getFilteredEvents({ onlySelectedDate: !hasSearch });
  const allMatchingWithoutDate = getFilteredEvents({ onlySelectedDate: false });
  const datesWithEvents = new Set(allMatchingWithoutDate.map(e => e.isoDate));
  const weekDays = getWeekStrip(cf.selectedDate);
  const todayIso = getTodayIso();
  const isSelectedToday = cf.selectedDate === todayIso;
  const canEdit = (ROLES[state.profile.role] || ROLES.student).canEdit;

  return `
    <div class="space-y-5 animate-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 class="text-xl font-bold text-slate-900">Calendar</h1>
          <p class="text-xs sm:text-sm text-slate-500">Flip through your daily ULFS4 schedule, filter by major or year, or search any class.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button id="btn-export-ics" type="button" class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition">
            <svg class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"/></svg>
            Export .ics
          </button>
          ${canEdit ? `
            <button type="button" data-goto="editor" class="px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition">
              + Manage Schedule
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Daily Flipper Header + Week Strip -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-xs">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <button id="btn-cal-prev-day" type="button" aria-label="Previous day" class="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <div class="px-1">
              <div class="text-sm sm:text-base font-bold text-slate-900">${esc(formatIsoDateLong(cf.selectedDate))}</div>
              <div class="text-[11px] text-slate-500 flex items-center gap-1.5">
                ${isSelectedToday ? '<span class="px-1.5 py-0.5 rounded bg-brand-100 text-brand-700 font-semibold">Today</span>' : ''}
                <span>${hasSearch ? `Searching all days for "${esc(cf.query.trim())}"` : `${events.length} item${events.length === 1 ? '' : 's'} scheduled`}</span>
              </div>
            </div>
            <button id="btn-cal-next-day" type="button" aria-label="Next day" class="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
          <div class="flex items-center gap-2">
            <button id="btn-cal-today" type="button" class="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition">Mon Nov 23</button>
            <input id="cal-date-picker" type="date" value="${esc(cf.selectedDate)}" aria-label="Pick a date" class="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-brand-500 focus:outline-none" />
          </div>
        </div>

        <!-- 7-Day Clickable Strip -->
        <div class="grid grid-cols-7 gap-1.5">
          ${weekDays.map(d => {
            const isSelected = d.iso === cf.selectedDate && !hasSearch;
            const isToday = d.iso === todayIso;
            const hasEv = datesWithEvents.has(d.iso);
            return `
              <button type="button" data-cal-day="${d.iso}" class="cal-day-pill flex flex-col items-center justify-center py-2 rounded-xl border transition ${
                isSelected
                  ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-brand-400 hover:bg-brand-50/40'
              }">
                <span class="text-[11px] font-medium ${isSelected ? 'text-sky-100' : 'text-slate-500'}">${d.shortName}</span>
                <span class="text-sm font-bold mt-0.5">${d.dayNum}</span>
                ${isToday
                  ? `<span class="text-[10px] font-bold mt-0.5 ${isSelected ? 'text-sky-100' : 'text-brand-600'}">Today</span>`
                  : `<span class="w-1.5 h-1.5 rounded-full mt-1 ${hasEv ? (isSelected ? 'bg-white' : 'bg-brand-500') : 'bg-transparent'}"></span>`
                }
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Major Picker Pills -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center gap-2">
        <span class="text-xs font-semibold text-slate-500 mr-1">Major:</span>
        <button type="button" data-cal-major="All" class="cal-major-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
          cf.major === 'All' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
        }">All Majors</button>
        ${MAJORS.map(m => `
          <button type="button" data-cal-major="${m.id}" class="cal-major-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
            cf.major === m.id ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-700 border-slate-200 hover:border-brand-400 hover:bg-brand-50/40'
          }">${esc(m.en)}</button>
        `).join('')}
      </div>

      <!-- Year 1/2/3 Selector + Class Search Bar + Layers -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Academic Year</label>
            <select id="cal-year-select" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-brand-500 focus:outline-none">
              ${['All', 'Year 1', 'Year 2', 'Year 3'].map(y => `<option value="${y}" ${cf.year === y ? 'selected' : ''}>${y === 'All' ? 'All Years' : y}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Search Classes</label>
            <input id="cal-search-input" type="text" value="${esc(cf.query || '')}" placeholder="e.g. I2201, Web Dev, Analyse 1, Dandache..." class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-brand-500 focus:outline-none" />
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span class="text-xs font-semibold text-slate-500 mr-1">Layers:</span>
          ${['class', 'exam', 'holiday', 'event'].map(cat => {
            const st = getCategoryStyle(cat);
            const active = cf[cat];
            return `
              <button type="button" data-cal-toggle="${cat}" class="cal-toggle-btn inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                active ? st.badge : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
              }">
                <span class="w-2 h-2 rounded-full ${active ? st.dot : 'bg-slate-300'}"></span>
                ${st.label}
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Daily Schedule Cards -->
      <div class="space-y-3">
        ${events.length === 0 ? `
          <div class="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
            ${hasSearch
              ? 'No classes match your search. Try another course code or clear the search bar.'
              : 'No classes or exams scheduled for this day. Flip to another day using the arrows or week strip above.'}
          </div>
        ` : events.map(ev => {
          const st = getCategoryStyle(ev.category);
          const ed = ROLES[ev.editorRole] || ROLES.council;
          return `
            <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center gap-4">
              <div class="sm:w-32 shrink-0 flex sm:flex-col items-baseline sm:items-start gap-2 sm:gap-0.5 border-b sm:border-b-0 sm:border-r border-slate-100 pb-2 sm:pb-0 sm:pr-4">
                <span class="text-xs font-bold uppercase tracking-wide text-brand-600">${esc(ev.day)} · ${esc(ev.date)}</span>
                <span class="text-xs font-mono text-slate-600">${esc(ev.time)}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="px-2 py-0.5 rounded-full text-[11px] font-medium border ${st.badge}">${st.label}</span>
                  ${ev.major !== 'All' ? `<span class="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">${esc(getMajorLabel(ev.major, 'en'))}</span>` : ''}
                  ${ev.professor ? `<span class="px-2 py-0.5 rounded-full text-[11px] font-medium bg-violet-50 text-violet-700">${esc(ev.professor)}</span>` : ''}
                  <span class="text-xs text-slate-500">${esc(ev.location)}</span>
                  <span class="text-[11px] text-slate-400 ml-auto">Updated by ${esc(ed.label)}</span>
                </div>
                <h3 class="font-semibold text-sm sm:text-base text-slate-900 mt-1">${esc(ev.title)}</h3>
                ${ev.note ? `<p class="text-xs text-slate-600 mt-1">${esc(ev.note)}</p>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderArchive() {
  const f = state.archiveFilters;
  const isFr = f.lang === 'fr';
  const docs = state.documents.filter(d => {
    if (d.status !== 'approved') return false;
    if (d.lang !== f.lang) return false;
    if (f.major !== 'All' && d.major !== f.major) return false;
    if (f.year !== 'All' && d.year !== f.year) return false;
    if (f.type !== 'All' && d.type !== f.type) return false;
    if (f.query.trim()) {
      const q = f.query.trim().toLowerCase();
      const hay = `${d.courseCode} ${d.courseName} ${d.title} ${d.type} ${d.id} ${getMajorLabel(d.major, f.lang)}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const typeOptions = [
    { val: 'All', en: 'All Types', fr: 'Tous les types' },
    { val: 'Dawrat', en: 'Dawrat', fr: 'Dawrat' },
    { val: 'Course', en: 'Course', fr: 'Cours' },
    { val: 'Exercises', en: 'Exercises', fr: 'Exercices / TD' },
    { val: 'Solutions', en: 'Solutions', fr: 'Solutions / Corrigés' },
    { val: 'Book', en: 'Book', fr: 'Livres' },
    { val: 'Syllabus', en: 'Syllabus', fr: 'Syllabus' }
  ];

  function typeDisplay(val) {
    const opt = typeOptions.find(o => o.val === val);
    return opt ? (isFr ? opt.fr : opt.en) : val;
  }

  return `
    <div class="space-y-5 animate-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 class="text-xl font-bold text-slate-900">Cours</h1>
          <p class="text-xs sm:text-sm text-slate-500">
            ${isFr
              ? 'Archive SQL de la Faculté des Sciences (Section 4) — Mathématiques, Physique et Informatique.'
              : 'Faculty of Sciences (Branch 4) SQL Archive — Mathematics, Physics, and Computer Science.'}
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <!-- Language Toggle (English / Français) -->
          <div class="inline-flex p-1 rounded-xl bg-slate-200/80 border border-slate-200">
            <button type="button" data-cours-lang="en" class="cours-lang-btn px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              !isFr ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }">English</button>
            <button type="button" data-cours-lang="fr" class="cours-lang-btn px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              isFr ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }">Français</button>
          </div>
          <button id="btn-open-upload" type="button" class="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
            ${isFr ? 'Soumettre un document' : 'Submit Document'}
          </button>
        </div>
      </div>

      <!-- Major Picker Pills (3 Target Majors) -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center gap-2">
        <span class="text-xs font-semibold text-slate-500 mr-1">${isFr ? 'Filière :' : 'Major:'}</span>
        <button type="button" data-cours-major="All" class="cours-major-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
          f.major === 'All' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
        }">${isFr ? 'Toutes les filières' : 'All Majors'}</button>
        ${MAJORS.map(m => `
          <button type="button" data-cours-major="${m.id}" class="cours-major-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
            f.major === m.id ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-700 border-slate-200 hover:border-brand-400 hover:bg-brand-50/40'
          }">${esc(isFr ? m.fr : m.en)}</button>
        `).join('')}
      </div>

      <!-- Filter Bar -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label class="block text-[11px] font-semibold text-slate-500 uppercase mb-1">${isFr ? 'Année Académique' : 'Academic Year'}</label>
          <select id="arch-year" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-brand-500 focus:outline-none">
            ${['All', 'Year 1', 'Year 2', 'Year 3'].map(y => {
              const lbl = y === 'All' ? (isFr ? 'Toutes les années' : 'All Years') : (isFr ? y.replace('Year ', 'L') : y);
              return `<option value="${y}" ${f.year === y ? 'selected' : ''}>${lbl}</option>`;
            }).join('')}
          </select>
        </div>
        <div>
          <label class="block text-[11px] font-semibold text-slate-500 uppercase mb-1">${isFr ? 'Type de Document' : 'Document Type'}</label>
          <select id="arch-type" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-brand-500 focus:outline-none">
            ${typeOptions.map(t => `<option value="${t.val}" ${f.type === t.val ? 'selected' : ''}>${esc(isFr ? t.fr : t.en)}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-[11px] font-semibold text-slate-500 uppercase mb-1">${isFr ? 'Code ou Mot-clé' : 'Course / Keyword'}</label>
          <input id="arch-query" type="text" value="${esc(f.query)}" placeholder="${isFr ? 'ex. M1101, Dawrat, SQL...' : 'e.g. M1101, Dawrat, SQL...'}" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-brand-500 focus:outline-none" />
        </div>
      </div>

      <!-- Results Table / Cards -->
      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div class="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>${isFr ? 'Affichage de' : 'Showing'} <strong class="text-slate-900">${docs.length}</strong> ${isFr ? 'document(s) vérifié(s)' : `verified document${docs.length === 1 ? '' : 's'}`} · <strong class="text-slate-700">${isFr ? 'Section Française' : 'English Section'}</strong></span>
          <span class="font-mono text-[11px]">table: cours_documents</span>
        </div>
        ${docs.length === 0 ? `
          <div class="p-8 text-center text-sm text-slate-500">${isFr ? 'Aucun document trouvé pour ce filtre.' : 'No documents match your filter. Try clearing the search or submitting a missing file.'}</div>
        ` : `
          <div class="divide-y divide-slate-100">
            ${docs.map(d => `
              <div class="p-4 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2 text-xs">
                    <span class="px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono font-semibold">${esc(d.courseCode)}</span>
                    <span class="px-2 py-0.5 rounded-full ${d.type === 'Dawrat' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-brand-50 text-brand-700'} font-semibold">${esc(typeDisplay(d.type))}</span>
                    <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">${esc(getMajorLabel(d.major, f.lang))}</span>
                    <span class="text-slate-500">${esc(d.year)} · ${esc(d.semester)}</span>
                    <span class="text-slate-400">· ${esc(d.size)}</span>
                  </div>
                  <div class="font-semibold text-sm text-slate-900 mt-1">${esc(d.courseName)} — ${esc(d.title)}</div>
                  <div class="text-xs text-slate-500 mt-0.5">${isFr ? 'Ajouté par' : 'Uploaded by'} ${esc(d.uploader)} · ${isFr ? 'Vérifié par' : 'Verified by'} <span class="text-emerald-700 font-medium">${esc(d.verifiedBy)}</span></div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <button type="button" data-doc-preview="${esc(d.id)}" class="doc-preview-btn px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition">
                    Download PDF
                  </button>
                  ${state.profile.role === 'council' ? `
                    <button type="button" data-doc-delete="${esc(d.id)}" class="doc-delete-btn px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700 transition">
                      ${isFr ? 'Supprimer' : 'Remove'}
                    </button>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>
  `;
}

function renderAnnouncementsWindow() {
  const canEdit = (ROLES[state.profile.role] || ROLES.student).canEdit;
  const visibleAnnouncements = state.announcements.filter(a => {
    if (state.announcementFilter !== 'All' && a.authorRole !== state.announcementFilter) return false;
    return true;
  });
  return `
    <div class="space-y-5 animate-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 class="text-xl font-bold text-slate-900">Verified Announcements</h1>
          <p class="text-xs sm:text-sm text-slate-500">Filter official updates strictly by verified source: Directory, Professors, Class Delegates, or Site Admins.</p>
        </div>
        ${canEdit ? `
          <button type="button" data-goto="editor" class="shrink-0 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition">
            + Post Announcement
          </button>
        ` : ''}
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap gap-2">
        ${['All', 'directory', 'professor', 'delegate', 'council'].map(f => `
          <button type="button" data-ann-filter="${f}" class="ann-filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
            state.announcementFilter === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }">${f === 'All' ? 'All Sources' : ROLES[f].label}</button>
        `).join('')}
      </div>
      <div class="space-y-3">
        ${visibleAnnouncements.length === 0 ? '<div class="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">No announcements from this role yet.</div>' : visibleAnnouncements.map(a => {
          const r = ROLES[a.authorRole] || ROLES.council;
          return `
            <article class="bg-white p-5 rounded-2xl border ${a.pinned ? 'border-brand-200 bg-brand-50/20' : 'border-slate-200'} shadow-xs">
              <div class="flex flex-wrap items-center gap-2 text-xs mb-2">
                <span class="px-2.5 py-0.5 rounded-full border font-semibold ${r.pill}">${esc(r.label)}</span>
                <span class="font-medium text-slate-700">${esc(a.authorName)}</span>
                <span class="text-slate-400">· ${esc(a.date)}</span>
                ${a.pinned ? '<span class="ml-auto text-[11px] font-semibold text-brand-700">Pinned</span>' : ''}
              </div>
              <h2 class="font-bold text-base text-slate-900">${esc(a.title)}</h2>
              <p class="text-sm text-slate-600 mt-1.5 leading-relaxed">${esc(a.body)}</p>
            </article>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderOffersWindow() {
  const cats = ['All', 'Food & Coffee', 'Printing', 'Books & Supplies', 'Tech'];
  let filtered = state.offers.filter(o => {
    if (state.offerFilter !== 'All' && o.category !== state.offerFilter) return false;
    if (state.offerFilter === 'Food & Coffee') {
      const wantFood = state.foodCoffeeTags.Food;
      const wantCoffee = state.foodCoffeeTags.Coffee;
      const tags = o.tags || [];
      const matchesFood = wantFood && tags.includes('Food');
      const matchesCoffee = wantCoffee && tags.includes('Coffee');
      if (!matchesFood && !matchesCoffee) return false;
    }
    return true;
  });

  if (state.offerSort === 'price_asc') {
    filtered = [...filtered].sort((a, b) => (a.avgPrice || 0) - (b.avgPrice || 0));
  } else if (state.offerSort === 'popularity') {
    filtered = [...filtered].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }

  const isFoodCoffee = state.offerFilter === 'Food & Coffee';

  return `
    <div class="space-y-5 animate-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 class="text-xl font-bold text-slate-900">Offers &amp; Near You</h1>
          <p class="text-xs sm:text-sm text-slate-500">Local spots, menus, prices, and student deals around ULFS4.</p>
        </div>
        <button id="btn-open-offer-modal" type="button" class="shrink-0 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition">
          + Suggest a Place / Deal
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap gap-2">
            ${cats.map(c => `
              <button type="button" data-offer-filter="${esc(c)}" class="offer-filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                state.offerFilter === c ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }">${esc(c)}</button>
            `).join('')}
          </div>
          <div class="flex items-center gap-2">
            <label class="text-xs font-semibold text-slate-500" for="offer-sort-select">Order:</label>
            <select id="offer-sort-select" class="px-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg focus:border-brand-500 focus:outline-none">
              <option value="popularity" ${state.offerSort === 'popularity' ? 'selected' : ''}>Popularity</option>
              <option value="price_asc" ${state.offerSort === 'price_asc' ? 'selected' : ''}>Low Prices</option>
            </select>
          </div>
        </div>

        ${isFoodCoffee ? `
          <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span class="text-xs font-semibold text-slate-500 mr-1">Near You Tags:</span>
            ${['Food', 'Coffee'].map(tag => {
              const active = state.foodCoffeeTags[tag];
              return `
                <button type="button" data-fc-tag="${tag}" class="fc-tag-btn inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition ${
                  active ? 'bg-brand-600 text-white border-brand-600' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }">
                  <span>${tag === 'Food' ? '🍽️' : '☕'}</span>
                  <span>${tag}</span>
                </button>
              `;
            }).join('')}
          </div>
        ` : ''}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${filtered.length === 0 ? `
          <div class="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
            No places match your selected tags. Turn on Food or Coffee above to see spots near you.
          </div>
        ` : filtered.map(o => `
          <article class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between gap-3">
            <div>
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex flex-wrap items-center gap-1.5">
                  <span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">${esc(o.category)}</span>
                  ${(o.tags || []).map(t => `<span class="px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 text-[11px] font-semibold">${esc(t)}</span>`).join('')}
                </div>
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">${esc(o.discount)}</span>
              </div>
              <h2 class="font-bold text-base text-slate-900 mt-2">${esc(o.partner)}</h2>
              <p class="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">${esc(o.details)}</p>
            </div>
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-500">
              <span class="inline-flex items-center gap-1.5 truncate">
                <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span class="truncate">${esc(o.location)}</span>
              </span>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `;
}

function renderBylawsWindow() {
  return `
    <div class="space-y-5 animate-in">
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h1 class="text-xl font-bold text-slate-900">Bylaws &amp; Disclaimers</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">Simple rules and disclaimers for using this student-made website.</p>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        ${state.bylaws.map(b => {
          const formatted = esc(b.text).replace(
            /http:\/\/sisol\.ul\.edu\.lb\//g,
            '<a href="http://sisol.ul.edu.lb/" target="_blank" rel="noopener noreferrer" class="text-brand-600 hover:underline font-medium">http://sisol.ul.edu.lb/</a>'
          );
          return `
            <div class="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
              <span class="font-bold text-slate-900 shrink-0">${b.num}.</span>
              <p>${formatted}</p>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function openOfferModal() {
  openModal('Suggest a Local Place or Deal', `
    <form id="form-add-offer" class="space-y-3.5">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Place / Store Name</label>
        <input name="partner" required placeholder="e.g. Campus Snacks" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg" />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Category</label>
          <select name="category" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white">
            <option value="Food & Coffee">Food &amp; Coffee</option>
            <option value="Printing">Printing</option>
            <option value="Books & Supplies">Books &amp; Supplies</option>
            <option value="Tech">Tech</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Price / Deal Badge</label>
          <input name="discount" required placeholder="e.g. From $2.00 or 15% OFF" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg" />
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Location</label>
        <input name="location" required placeholder="e.g. 3 min from ULFS4 Gate" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg" />
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Menu / Deal Details</label>
        <textarea name="details" required rows="2" placeholder="Prices, menu items, or offer details..." class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"></textarea>
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" id="btn-cancel-offer" class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
        <button type="submit" class="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg">Add Place</button>
      </div>
    </form>
  `);
  document.getElementById('btn-cancel-offer').addEventListener('click', closeModal);
  document.getElementById('form-add-offer').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const cat = fd.get('category');
    state.offers.unshift({
      id: 'o-' + Date.now(),
      partner: fd.get('partner').trim(),
      category: cat,
      discount: fd.get('discount').trim(),
      avgPrice: 3.0,
      popularity: 80,
      tags: cat === 'Food & Coffee' ? ['Food', 'Coffee'] : [],
      location: fd.get('location').trim(),
      details: fd.get('details').trim()
    });
    saveState();
    closeModal();
    renderApp();
    showToast('Added to Offers & Near You!', 'success');
  });
}

function renderGuides() {
  return `
    <div class="space-y-5 animate-in">
      <div>
        <h1 class="text-xl font-bold text-slate-900">Student Survival &amp; Admin Guides</h1>
        <p class="text-xs sm:text-sm text-slate-500">Plain-language steps for university procedures that aren't clearly explained elsewhere.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${state.guides.map(g => `
          <article class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">${esc(g.tag)}</span>
            </div>
            <h2 class="font-bold text-base text-slate-900">${esc(g.title)}</h2>
            <p class="text-xs text-slate-600">${esc(g.summary)}</p>
            <ol class="space-y-2 text-xs text-slate-700 list-decimal list-inside pt-2 border-t border-slate-100">
              ${g.steps.map(s => `<li class="leading-relaxed">${esc(s)}</li>`).join('')}
            </ol>
          </article>
        `).join('')}
      </div>
    </div>
  `;
}

function renderForum() {
  const flairs = ['All', 'Question', 'Study Tips', 'Campus', 'Resources', 'General'];
  let posts = state.forumPosts.filter(p => state.forumFlair === 'All' || p.flair === state.forumFlair);

  if (state.forumSort === 'top') {
    posts = [...posts].sort((a, b) => b.votes - a.votes);
  } else if (state.forumSort === 'hot') {
    posts = [...posts].sort((a, b) => (b.votes + b.comments.length * 4) - (a.votes + a.comments.length * 4));
  }
  // 'new' preserves array insertion order (newest first)

  return `
    <div class="space-y-5 animate-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 class="text-xl font-bold text-slate-900">Forum</h1>
          <p class="text-xs sm:text-sm text-slate-500">Ask questions, share notes or files, upvote helpful posts, and discuss campus life.</p>
        </div>
        <button id="btn-open-forum-post" type="button" class="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
          New Post / Upload
        </button>
      </div>

      <!-- Sort & Flair Filter Bar -->
      <div class="bg-white rounded-2xl border border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-1.5">
          ${['hot', 'top', 'new'].map(sortKey => {
            const labels = { hot: '🔥 Hot', top: '🏆 Top', new: '✨ New' };
            const active = state.forumSort === sortKey;
            return `
              <button type="button" data-forum-sort="${sortKey}" class="forum-sort-btn px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                active ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }">${labels[sortKey]}</button>
            `;
          }).join('')}
        </div>
        <div class="flex flex-wrap items-center gap-1.5">
          ${flairs.map(fl => `
            <button type="button" data-forum-flair="${esc(fl)}" class="forum-flair-btn px-2.5 py-1 rounded-full text-xs font-medium border transition ${
              state.forumFlair === fl ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }">${esc(fl)}</button>
          `).join('')}
        </div>
      </div>

      <!-- Reddit-Style Post Feed -->
      <div class="space-y-3">
        ${posts.length === 0 ? `
          <div class="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
            No posts under this flair yet. Be the first to post!
          </div>
        ` : posts.map(p => {
          const isExpanded = state.expandedPostId === p.id;
          return `
            <article class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex">
              <!-- Left Vertical Upvote / Downvote Rail -->
              <div class="w-12 sm:w-14 shrink-0 bg-slate-50 border-r border-slate-100 flex flex-col items-center justify-start py-3 gap-1">
                <button type="button" data-vote-post="${esc(p.id)}" data-vote-dir="1" aria-label="Upvote" class="forum-vote-btn p-1.5 rounded-lg transition ${
                  p.userVote === 1 ? 'text-orange-600 bg-orange-100/80' : 'text-slate-400 hover:text-orange-600 hover:bg-slate-200/70'
                }">
                  <svg class="w-5 h-5" fill="${p.userVote === 1 ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>
                </button>
                <span class="text-xs font-bold ${p.userVote === 1 ? 'text-orange-600' : p.userVote === -1 ? 'text-indigo-600' : 'text-slate-800'}">${p.votes}</span>
                <button type="button" data-vote-post="${esc(p.id)}" data-vote-dir="-1" aria-label="Downvote" class="forum-vote-btn p-1.5 rounded-lg transition ${
                  p.userVote === -1 ? 'text-indigo-600 bg-indigo-100/80' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-200/70'
                }">
                  <svg class="w-5 h-5" fill="${p.userVote === -1 ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </button>
              </div>

              <!-- Main Post Content -->
              <div class="flex-1 min-w-0 p-4 space-y-2">
                <div class="flex flex-wrap items-center gap-2 text-xs">
                  <span class="px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 font-semibold">${esc(p.flair)}</span>
                  <span class="font-medium text-slate-600">${esc(p.author)}</span>
                  <span class="text-slate-400">· ${esc(p.timeAgo)}</span>
                </div>
                <h2 class="font-bold text-sm sm:text-base text-slate-900 leading-snug">${esc(p.title)}</h2>
                ${p.body ? `<p class="text-xs sm:text-sm text-slate-600 leading-relaxed">${esc(p.body)}</p>` : ''}
                ${p.attachment ? `
                  <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
                    <svg class="w-4 h-4 text-brand-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                    <span class="font-mono text-[11px]">${esc(p.attachment)}</span>
                  </div>
                ` : ''}

                <div class="pt-2 flex items-center gap-3 text-xs">
                  <button type="button" data-toggle-comments="${esc(p.id)}" class="forum-comments-toggle inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                    <span>${p.comments.length} Comment${p.comments.length === 1 ? '' : 's'}</span>
                  </button>
                </div>

                ${isExpanded ? `
                  <div class="pt-3 mt-2 border-t border-slate-100 space-y-3">
                    ${p.comments.length === 0 ? '<p class="text-xs text-slate-400">No comments yet. Start the discussion!</p>' : p.comments.map(c => `
                      <div class="pl-3 border-l-2 border-slate-200 space-y-0.5">
                        <div class="text-[11px] text-slate-500"><strong class="text-slate-700">${esc(c.author)}</strong> · ${esc(c.timeAgo)}</div>
                        <p class="text-xs text-slate-700">${esc(c.text)}</p>
                      </div>
                    `).join('')}
                    <form data-comment-form="${esc(p.id)}" class="forum-comment-form flex gap-2 pt-1">
                      <input name="commentText" required placeholder="Write a reply..." class="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-brand-500 focus:outline-none" />
                      <button type="submit" class="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition">Reply</button>
                    </form>
                  </div>
                ` : ''}
              </div>
            </article>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderCustomPage(pageId) {
  const page = state.customPages.find(p => p.id === pageId);
  if (!page) return renderDashboard();
  const canManage = (ROLES[state.profile.role] || ROLES.student).canManagePages;
  return `
    <div class="space-y-5 animate-in">
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span class="inline-flex px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">Modular Custom Page</span>
          <h1 class="text-xl font-bold text-slate-900 mt-1.5">${esc(page.label)}</h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-0.5">${esc(page.shortDesc)}</p>
        </div>
        ${canManage ? `
          <button type="button" data-delete-page="${esc(page.id)}" class="delete-page-btn px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition">
            Remove Page
          </button>
        ` : ''}
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${page.sections.map(sec => `
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h2 class="font-bold text-sm sm:text-base text-slate-900">${esc(sec.heading)}</h2>
            <p class="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">${esc(sec.body)}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderEditorConsole() {
  const roleInfo = ROLES[state.profile.role] || ROLES.student;
  const isProf = state.profile.role === 'professor';
  const pendingDocs = state.documents.filter(d => d.status === 'pending');
  const myManagedEvents = isProf
    ? state.events.filter(ev => ev.professor === state.profile.professorName)
    : state.events.slice(0, 6);

  return `
    <div class="space-y-6 animate-in">
      <div class="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div class="text-xs font-semibold uppercase tracking-wide text-amber-300">Password-Protected Admin Console</div>
          <h1 class="text-xl font-bold mt-1">${isProf ? esc(state.profile.professorName) : 'Site Admin'}</h1>
          <p class="text-xs text-slate-300 mt-0.5">${esc(roleInfo.desc)}</p>
        </div>
        <div class="flex flex-wrap items-center gap-2 shrink-0">
          ${roleInfo.canManagePages ? `
            <button id="btn-editor-add-page" type="button" class="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold transition">
              + Add New Window
            </button>
          ` : ''}
          <button id="btn-editor-signout" type="button" class="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition">
            Sign Out
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <!-- Add Calendar Event Form -->
        <form id="form-add-event" class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h2 class="font-bold text-base text-slate-900">${isProf ? `Add to ${esc(state.profile.professorName)}'s Schedule` : 'Publish Calendar Event'}</h2>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">Day &amp; Date</label>
              <input name="dateLabel" required placeholder="e.g. Tue · Dec 01" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-brand-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">Time</label>
              <input name="time" required placeholder="e.g. 10:00 – 12:00" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-brand-500 focus:outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">Title</label>
            <input name="title" required placeholder="e.g. P2201 Electromagnetism Quiz" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-brand-500 focus:outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">Major</label>
              <select name="major" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white">
                <option value="All">All Majors</option>
                ${MAJORS.map(m => `<option value="${m.id}">${esc(m.en)}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">Year</label>
              <select name="year" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white">
                <option value="All">All Years</option>
                <option value="Year 1">Year 1</option>
                <option value="Year 2" selected>Year 2</option>
                <option value="Year 3">Year 3</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">Location</label>
              <input name="location" required placeholder="e.g. Year 2 CS Class" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-brand-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">Category</label>
              <select name="category" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white">
                <option value="class">Class</option>
                <option value="exam">Exam / Quiz</option>
                ${!isProf ? '<option value="holiday">Holiday</option><option value="event">Campus Event</option>' : ''}
              </select>
            </div>
          </div>
          ${!isProf ? `
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">Professor (optional)</label>
              <select name="professor" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white">
                <option value="">None / General</option>
                ${PROFESSORS.map(pr => `<option value="${esc(pr)}">${esc(pr)}</option>`).join('')}
              </select>
            </div>
          ` : ''}
          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">Note (optional)</label>
            <input name="note" placeholder="Extra instructions for students..." class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-brand-500 focus:outline-none" />
          </div>
          <button type="submit" class="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition">Add to Calendar</button>
        </form>

        <!-- Right Column: Managed Schedule Items + Approvals (Council) + Announcements -->
        <div class="space-y-5">
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h2 class="font-bold text-base text-slate-900 mb-3">${isProf ? 'Your Scheduled Sessions' : 'Recent Calendar Sessions'}</h2>
            ${myManagedEvents.length === 0 ? '<p class="text-xs text-slate-500">No sessions scheduled yet.</p>' : `
              <div class="space-y-2">
                ${myManagedEvents.map(ev => `
                  <div class="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
                    <div class="min-w-0">
                      <div class="text-xs font-semibold text-slate-900 truncate">${esc(ev.title)}</div>
                      <div class="text-[11px] text-slate-500">${esc(ev.day)} · ${esc(ev.date)} · ${esc(ev.time)} · ${esc(ev.location)}</div>
                    </div>
                    <button type="button" data-delete-event="${esc(ev.id)}" class="delete-event-btn shrink-0 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-xs font-semibold text-slate-600">Remove</button>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          ${roleInfo.canManagePages ? `
            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div class="flex items-center justify-between mb-3">
                <h2 class="font-bold text-base text-slate-900">Cours Approval Queue</h2>
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold ${pendingDocs.length ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'}">${pendingDocs.length} pending</span>
              </div>
              ${pendingDocs.length === 0 ? '<p class="text-xs text-slate-500 py-2">All student document submissions have been reviewed.</p>' : `
                <div class="space-y-3">
                  ${pendingDocs.map(d => `
                    <div class="p-3 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2">
                      <div class="text-xs font-semibold text-slate-900">${esc(d.courseCode)} · ${esc(d.title)}</div>
                      <div class="text-[11px] text-slate-500">${esc(d.year)} · ${esc(d.type)} · ${esc(getMajorLabel(d.major, 'en'))}</div>
                      <div class="flex gap-2">
                        <button type="button" data-approve-doc="${esc(d.id)}" class="approve-doc-btn px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold">Approve</button>
                        <button type="button" data-reject-doc="${esc(d.id)}" class="reject-doc-btn px-3 py-1 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-xs font-semibold text-slate-600">Reject</button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          ` : ''}

          <form id="form-add-announcement" class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h2 class="font-bold text-base text-slate-900">Post Verified Announcement</h2>
            <input name="title" required placeholder="Headline (e.g. Lab 3 open for exam prep)" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-brand-500 focus:outline-none" />
            <textarea name="body" required rows="2" placeholder="Details for students..." class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-brand-500 focus:outline-none"></textarea>
            <button type="submit" class="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition">Publish Announcement</button>
          </form>
        </div>
      </div>
    </div>
  `;
}

// =========================================================================
// 5. MODALS (PROFILE SWITCHER, UPLOAD DOC, ADD CUSTOM PAGE, SQL INSPECTOR)
// =========================================================================

function openAdminModal() {
  const isSignedIn = (ROLES[state.profile.role] || ROLES.student).canEdit;
  if (isSignedIn) {
    const label = state.profile.role === 'professor' ? state.profile.professorName : 'Site Admin';
    openModal('Admin Session Active', `
      <div class="space-y-4">
        <p class="text-sm text-slate-600">You are currently signed in as <strong class="text-slate-900">${esc(label)}</strong>.</p>
        <div class="flex flex-wrap justify-end gap-2">
          <button type="button" id="btn-admin-goto-console" class="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg">Open Editor Console</button>
          <button type="button" id="btn-admin-signout" class="px-4 py-2 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg">Sign Out</button>
        </div>
      </div>
    `);
    document.getElementById('btn-admin-goto-console').addEventListener('click', () => {
      state.activePage = 'editor';
      saveState();
      closeModal();
      renderApp();
    });
    document.getElementById('btn-admin-signout').addEventListener('click', () => {
      state.profile.role = 'student';
      state.profile.professorName = '';
      if (state.activePage === 'editor') state.activePage = 'dashboard';
      saveState();
      closeModal();
      renderApp();
      showToast('Signed out of Admin mode.', 'info');
    });
    return;
  }

  openModal('Admin Access', `
    <div class="space-y-4">
      <!-- Layer 1: Would You Rather 50/50 Split -->
      <div>
        <div class="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Step 1 · Who are you?</div>
        <div class="grid grid-cols-2 gap-3 relative">
          <button type="button" id="wyr-professor" data-wyr="professor" class="wyr-card group text-left p-4 rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-400 transition-all duration-200 flex flex-col justify-between min-h-[124px]">
            <div class="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-600 flex items-center justify-center transition">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
            </div>
            <div class="mt-3">
              <div class="font-bold text-sm text-slate-900">Professor</div>
              <div class="text-[11px] text-slate-500 mt-0.5 leading-snug">Manage your own class &amp; exam schedule</div>
            </div>
          </button>

          <button type="button" id="wyr-council" data-wyr="council" class="wyr-card group text-left p-4 rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-400 transition-all duration-200 flex flex-col justify-between min-h-[124px]">
            <div class="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-600 flex items-center justify-center transition">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <div class="mt-3">
              <div class="font-bold text-sm text-slate-900">Site Admin</div>
              <div class="text-[11px] text-slate-500 mt-0.5 leading-snug">Full admin privileges &amp; custom windows</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Layer 2: Password Entry (Revealed after picking a side) -->
      <form id="form-admin-login" class="hidden space-y-3.5 pt-3 border-t border-slate-100 animate-in">
        <input type="hidden" id="admin-selected-role" name="adminType" value="" />
        <div class="flex items-center justify-between">
          <div id="admin-layer2-label" class="text-xs font-semibold uppercase tracking-wide text-blue-600">Step 2 · Enter Password</div>
          <button type="button" id="btn-reset-wyr" class="text-[11px] text-slate-500 hover:text-slate-800 underline">Change side</button>
        </div>
        <div id="admin-prof-picker" class="hidden">
          <label class="block text-xs font-semibold text-slate-700 mb-1">Select Your Name</label>
          <select name="professorName" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white">
            ${PROFESSORS.map(pr => `<option value="${esc(pr)}">${esc(pr)}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Password</label>
          <input id="admin-password-input" name="password" type="password" required placeholder="Enter your access password..." class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none" />
          <p id="admin-login-error" class="hidden text-xs text-rose-600 mt-1.5 font-medium">Incorrect password. Try again.</p>
        </div>
        <div class="flex justify-end gap-2 pt-1">
          <button type="button" id="btn-cancel-admin" class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
          <button type="submit" class="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs transition">Unlock</button>
        </div>
      </form>
    </div>
  `);

  const form = document.getElementById('form-admin-login');
  const roleHidden = document.getElementById('admin-selected-role');
  const profPicker = document.getElementById('admin-prof-picker');
  const layer2Label = document.getElementById('admin-layer2-label');
  const pwInput = document.getElementById('admin-password-input');
  const errEl = document.getElementById('admin-login-error');
  const cards = document.querySelectorAll('.wyr-card');

  function selectSide(side) {
    roleHidden.value = side;
    errEl.classList.add('hidden');
    cards.forEach(card => {
      const isPicked = card.getAttribute('data-wyr') === side;
      if (isPicked) {
        card.className = 'wyr-card group text-left p-4 rounded-2xl border-2 border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/40 shadow-[0_0_24px_rgba(37,99,235,0.35)] transition-all duration-200 flex flex-col justify-between min-h-[124px]';
      } else {
        card.className = 'wyr-card group text-left p-4 rounded-2xl border-2 border-slate-200 bg-white opacity-60 hover:opacity-100 hover:border-blue-300 transition-all duration-200 flex flex-col justify-between min-h-[124px]';
      }
    });
    profPicker.classList.toggle('hidden', side !== 'professor');
    layer2Label.textContent = side === 'professor' ? 'Step 2 · Professor Password' : 'Step 2 · Site Admin Password';
    form.classList.remove('hidden');
    setTimeout(() => pwInput.focus(), 50);
  }

  cards.forEach(card => {
    card.addEventListener('click', () => selectSide(card.getAttribute('data-wyr')));
  });

  document.getElementById('btn-reset-wyr').addEventListener('click', () => {
    roleHidden.value = '';
    pwInput.value = '';
    errEl.classList.add('hidden');
    form.classList.add('hidden');
    cards.forEach(card => {
      card.className = 'wyr-card group text-left p-4 rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-400 transition-all duration-200 flex flex-col justify-between min-h-[124px]';
    });
  });

  document.getElementById('btn-cancel-admin').addEventListener('click', closeModal);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const type = fd.get('adminType');
    const pw = (fd.get('password') || '').trim();

    if (type === 'council' && (pw === 'admin2026' || pw === 'council2026')) {
      state.profile.role = 'council';
      state.profile.professorName = '';
      state.activePage = 'editor';
      saveState();
      closeModal();
      renderApp();
      showToast('Unlocked Site Admin privileges.', 'success');
    } else if (type === 'professor' && pw === 'prof2026') {
      state.profile.role = 'professor';
      state.profile.professorName = fd.get('professorName') || PROFESSORS[0];
      state.activePage = 'editor';
      saveState();
      closeModal();
      renderApp();
      showToast(`Signed in as ${state.profile.professorName}.`, 'success');
    } else {
      errEl.classList.remove('hidden');
    }
  });
}

function openUploadDocModal() {
  const autoApprove = state.profile.role === 'council';
  const curLang = state.archiveFilters.lang;
  openModal('Submit Document to Cours', `
    <form id="form-upload-doc" class="space-y-3.5">
      <p class="text-xs text-slate-500">
        ${autoApprove ? 'Signed in as Site Admin — this upload will publish immediately to Cours.' : 'Only Site Admins can publish to Cours. Your submission will enter the Admin approval queue.'}
      </p>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Language</label>
          <select name="lang" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white">
            <option value="en" ${curLang === 'en' ? 'selected' : ''}>English</option>
            <option value="fr" ${curLang === 'fr' ? 'selected' : ''}>Français</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Major</label>
          <select name="major" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white">
            <option value="math">Mathematics / Mathématiques</option>
            <option value="physics">Physics / Physique</option>
            <option value="cs" selected>Computer Science / Informatique</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Course Code</label>
          <input name="courseCode" required placeholder="e.g. M1101" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg font-mono" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Course Name</label>
          <input name="courseName" required placeholder="e.g. Calculus I" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Academic Year</label>
          <select name="year" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white">
            <option value="Year 1">Year 1</option>
            <option value="Year 2" selected>Year 2</option>
            <option value="Year 3">Year 3</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Document Type</label>
          <select name="type" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white">
            <option value="Dawrat">Dawrat</option>
            <option value="Course">Course</option>
            <option value="Exercises">Exercises</option>
            <option value="Solutions">Solutions</option>
            <option value="Book">Book</option>
            <option value="Syllabus">Syllabus</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Document Title</label>
        <input name="title" required placeholder="e.g. 2025 Session 1 Dawrat + Correction" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg" />
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" id="btn-cancel-upload" class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
        <button type="submit" class="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg">Submit to Cours</button>
      </div>
    </form>
  `);
  document.getElementById('btn-cancel-upload').addEventListener('click', closeModal);
  document.getElementById('form-upload-doc').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newDoc = {
      id: `DOC-${Math.floor(400 + Math.random() * 500)}`,
      facultyId: 'sci',
      branch: state.profile.branch,
      lang: fd.get('lang'),
      major: fd.get('major'),
      year: fd.get('year'),
      semester: fd.get('year') === 'Year 1' ? 'S1' : 'S3',
      courseCode: fd.get('courseCode').trim().toUpperCase(),
      courseName: fd.get('courseName').trim(),
      type: fd.get('type'),
      title: fd.get('title').trim(),
      uploader: state.profile.role === 'professor' ? state.profile.professorName : (state.profile.role === 'council' ? 'Site Admin' : 'ULFS4 Student'),
      verifiedBy: autoApprove ? ROLES[state.profile.role].label : 'Pending Review',
      status: autoApprove ? 'approved' : 'pending',
      size: '1.5 MB',
      updated: '2026-11-19'
    };
    state.documents.unshift(newDoc);
    state.archiveFilters.lang = newDoc.lang;
    saveState();
    closeModal();
    renderApp();
    showToast(autoApprove ? 'Document published directly to Cours!' : 'Submitted to Site Admin approval queue.', 'success');
  });
}

function openAddPageModal() {
  openModal('Add a New Website Page / Module', `
    <form id="form-add-page" class="space-y-3.5">
      <p class="text-xs text-slate-500">Because navigation is driven by a modular Page Registry, you can add new sections (e.g. Peer Tutoring, Lab Schedules, Club Directory) without touching existing pages.</p>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Page Name (appears in top nav)</label>
        <input name="label" required placeholder="e.g. Peer Tutoring" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg" />
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Short Description</label>
        <input name="shortDesc" required placeholder="e.g. Free student-led review sessions before midterms" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg" />
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">First Section Heading</label>
        <input name="secHeading" required placeholder="e.g. How to Book a Session" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg" />
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">First Section Content</label>
        <textarea name="secBody" required rows="3" placeholder="Describe what students will find on this page..." class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"></textarea>
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" id="btn-cancel-page" class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
        <button type="submit" class="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg">Create Page</button>
      </div>
    </form>
  `);
  document.getElementById('btn-cancel-page').addEventListener('click', closeModal);
  document.getElementById('form-add-page').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const label = fd.get('label').trim();
    const id = 'custom-' + Date.now();
    state.customPages.push({
      id,
      label,
      shortDesc: fd.get('shortDesc').trim(),
      badge: 'Custom',
      sections: [
        { heading: fd.get('secHeading').trim(), body: fd.get('secBody').trim() }
      ]
    });
    state.activePage = id;
    saveState();
    closeModal();
    renderApp();
    showToast(`Added "${label}" to the navigation bar!`, 'success');
  });
}

function openForumPostModal() {
  openModal('Create a Forum Post', `
    <form id="form-forum-post" class="space-y-3.5">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Display Name / Handle</label>
          <input name="author" placeholder="e.g. u/ulfs4_student" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Flair</label>
          <select name="flair" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white">
            <option value="Question">Question</option>
            <option value="Study Tips">Study Tips</option>
            <option value="Resources">Resources</option>
            <option value="Campus">Campus</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Title</label>
        <input name="title" required placeholder="What's on your mind?" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg" />
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Details (optional)</label>
        <textarea name="body" rows="3" placeholder="Add context, links, or notes..." class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"></textarea>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Upload File / Notes (optional)</label>
        <input id="forum-file-input" name="fileUpload" type="file" class="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100" />
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" id="btn-cancel-forum-post" class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
        <button type="submit" class="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg">Post to Forum</button>
      </div>
    </form>
  `);
  document.getElementById('btn-cancel-forum-post').addEventListener('click', closeModal);
  document.getElementById('form-forum-post').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const fileInput = document.getElementById('forum-file-input');
    const fileName = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0].name : '';
    const rawAuthor = (fd.get('author') || '').trim();
    const author = rawAuthor ? (rawAuthor.startsWith('u/') ? rawAuthor : 'u/' + rawAuthor) : 'u/ulfs4_student';
    state.forumPosts.unshift({
      id: 'fp-' + Date.now(),
      author,
      timeAgo: 'Just now',
      flair: fd.get('flair'),
      title: fd.get('title').trim(),
      body: (fd.get('body') || '').trim(),
      attachment: fileName,
      votes: 1,
      userVote: 1,
      comments: []
    });
    state.forumSort = 'new';
    saveState();
    closeModal();
    renderApp();
    showToast('Posted to Forum!', 'success');
  });
}

function openDocPreviewModal(docId) {
  const d = state.documents.find(x => x.id === docId);
  if (!d) return;
  const sqlObj = {
    doc_id: d.id,
    faculty_id: d.facultyId,
    branch: d.branch,
    major: d.major,
    language: d.lang,
    academic_year: d.year,
    semester: d.semester,
    course_code: d.courseCode,
    doc_type: d.type,
    storage_key: `r2://archive/${d.facultyId}/${d.year.toLowerCase().replace(/\s+/g, '')}/${d.courseCode}_${d.id}.pdf`,
    verified_by: d.verifiedBy,
    status: d.status
  };
  openModal(`${d.courseCode} — SQL Metadata Record`, `
    <div class="space-y-4">
      <div>
        <div class="text-sm font-bold text-slate-900">${esc(d.courseName)}: ${esc(d.title)}</div>
        <div class="text-xs text-slate-500 mt-0.5">${esc(d.type)} · ${esc(d.size)} · Updated ${esc(d.updated)}</div>
      </div>
      <pre class="bg-slate-900 text-sky-300 text-xs p-4 rounded-xl overflow-x-auto font-mono leading-relaxed">${esc(JSON.stringify(sqlObj, null, 2))}</pre>
      <p class="text-xs text-slate-500">In production, the PDF binary lives in object storage (e.g. Cloudflare R2 / Supabase Storage) while PostgreSQL indexes the metadata above for instant search.</p>
      <div class="flex justify-end">
        <button type="button" id="btn-close-doc-preview" class="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg">Done</button>
      </div>
    </div>
  `);
  document.getElementById('btn-close-doc-preview').addEventListener('click', closeModal);
}

// =========================================================================
// 6. EVENT WIRING & MAIN RENDER LOOP
// =========================================================================

function attachViewListeners() {
  // Cross-page navigation buttons
  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activePage = btn.getAttribute('data-goto');
      saveState();
      renderApp();
    });
  });

  // Dashboard listeners (synced time-saved input + slider)
  const slider = document.getElementById('time-saved-slider');
  const timeInput = document.getElementById('time-saved-input');
  function updateTimeFidget(rawVal, source) {
    const clamped = Math.max(1, Math.min(120, Math.round(Number(rawVal) || 1)));
    state.timeCalcMinutes = clamped;
    const hrs = ((clamped * 5 * 16) / 60).toFixed(1);
    const pct = Math.round(((clamped * 5 * 16) / 60 / 60) * 100);
    document.getElementById('dash-hours-val').textContent = `${hrs} hrs`;
    document.getElementById('dash-slider-readout').textContent = `${clamped}m`;
    document.getElementById('dash-pct-val').textContent = `${pct}%`;
    if (slider && source !== 'slider') slider.value = String(clamped);
    if (timeInput && source !== 'input') timeInput.value = String(clamped);
    saveState();
  }
  if (slider) {
    slider.addEventListener('input', e => updateTimeFidget(e.target.value, 'slider'));
  }
  if (timeInput) {
    timeInput.addEventListener('input', e => {
      if (e.target.value !== '') updateTimeFidget(e.target.value, 'input');
    });
    timeInput.addEventListener('blur', e => updateTimeFidget(e.target.value, 'blur'));
  }


  document.querySelectorAll('.course-jump-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.archiveFilters.query = btn.getAttribute('data-course-jump');
      state.archiveFilters.year = 'All';
      state.archiveFilters.type = 'All';
      state.activePage = 'archive';
      saveState();
      renderApp();
    });
  });

  document.querySelectorAll('.ann-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.announcementFilter = btn.getAttribute('data-ann-filter');
      saveState();
      renderApp();
    });
  });

  // Calendar listeners
  const exportBtn = document.getElementById('btn-export-ics');
  if (exportBtn) exportBtn.addEventListener('click', downloadIcsFile);

  document.querySelectorAll('.cal-major-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.calendarFilters.major = btn.getAttribute('data-cal-major');
      saveState();
      renderApp();
    });
  });

  const calYrSel = document.getElementById('cal-year-select');
  if (calYrSel) calYrSel.addEventListener('change', e => { state.calendarFilters.year = e.target.value; saveState(); renderApp(); });

  const calPrevBtn = document.getElementById('btn-cal-prev-day');
  if (calPrevBtn) {
    calPrevBtn.addEventListener('click', () => {
      state.calendarFilters.selectedDate = shiftIsoDate(state.calendarFilters.selectedDate, -1);
      saveState();
      renderApp();
    });
  }

  const calNextBtn = document.getElementById('btn-cal-next-day');
  if (calNextBtn) {
    calNextBtn.addEventListener('click', () => {
      state.calendarFilters.selectedDate = shiftIsoDate(state.calendarFilters.selectedDate, 1);
      saveState();
      renderApp();
    });
  }

  const calTodayBtn = document.getElementById('btn-cal-today');
  if (calTodayBtn) {
    calTodayBtn.addEventListener('click', () => {
      state.calendarFilters.selectedDate = '2026-11-23';
      state.calendarFilters.query = '';
      saveState();
      renderApp();
    });
  }

  const calDatePicker = document.getElementById('cal-date-picker');
  if (calDatePicker) {
    calDatePicker.addEventListener('change', e => {
      if (e.target.value) {
        state.calendarFilters.selectedDate = e.target.value;
        saveState();
        renderApp();
      }
    });
  }

  document.querySelectorAll('.cal-day-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      state.calendarFilters.selectedDate = btn.getAttribute('data-cal-day');
      state.calendarFilters.query = '';
      saveState();
      renderApp();
    });
  });

  const calSearchInput = document.getElementById('cal-search-input');
  if (calSearchInput) {
    calSearchInput.addEventListener('input', e => {
      state.calendarFilters.query = e.target.value;
      saveState();
      renderApp();
      const refreshed = document.getElementById('cal-search-input');
      if (refreshed) {
        refreshed.focus();
        refreshed.setSelectionRange(refreshed.value.length, refreshed.value.length);
      }
    });
  }

  document.querySelectorAll('.cal-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-cal-toggle');
      state.calendarFilters[cat] = !state.calendarFilters[cat];
      saveState();
      renderApp();
    });
  });

  // Archive listeners
  const btnUpload = document.getElementById('btn-open-upload');
  if (btnUpload) btnUpload.addEventListener('click', openUploadDocModal);

  document.querySelectorAll('.cours-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.archiveFilters.lang = btn.getAttribute('data-cours-lang');
      saveState();
      renderApp();
    });
  });

  document.querySelectorAll('.cours-major-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.archiveFilters.major = btn.getAttribute('data-cours-major');
      saveState();
      renderApp();
    });
  });
  const archYr = document.getElementById('arch-year');
  if (archYr) archYr.addEventListener('change', e => { state.archiveFilters.year = e.target.value; saveState(); renderApp(); });
  const archType = document.getElementById('arch-type');
  if (archType) archType.addEventListener('change', e => { state.archiveFilters.type = e.target.value; saveState(); renderApp(); });
  const archQuery = document.getElementById('arch-query');
  if (archQuery) {
    archQuery.addEventListener('input', e => {
      state.archiveFilters.query = e.target.value;
      saveState();
      renderApp();
      const refreshed = document.getElementById('arch-query');
      if (refreshed) {
        refreshed.focus();
        refreshed.setSelectionRange(refreshed.value.length, refreshed.value.length);
      }
    });
  }

  document.querySelectorAll('.doc-preview-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const doc = state.documents.find(x => x.id === btn.getAttribute('data-doc-preview'));
      if (doc) showToast(`Downloading ${doc.courseCode}_${doc.type.replace(/\s+/g, '')}.pdf (${doc.size})`, 'success');
    });
  });

  document.querySelectorAll('.doc-delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (state.profile.role !== 'council') return;
      const id = btn.getAttribute('data-doc-delete');
      state.documents = state.documents.filter(d => d.id !== id);
      saveState();
      renderApp();
      showToast('Document removed from Cours.', 'info');
    });
  });

  // Offers & Discounts listeners
  const btnOfferModal = document.getElementById('btn-open-offer-modal');
  if (btnOfferModal) btnOfferModal.addEventListener('click', openOfferModal);

  document.querySelectorAll('.offer-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.offerFilter = btn.getAttribute('data-offer-filter');
      saveState();
      renderApp();
    });
  });

  const offerSortSel = document.getElementById('offer-sort-select');
  if (offerSortSel) {
    offerSortSel.addEventListener('change', e => {
      state.offerSort = e.target.value;
      saveState();
      renderApp();
    });
  }

  document.querySelectorAll('.fc-tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.getAttribute('data-fc-tag');
      state.foodCoffeeTags[tag] = !state.foodCoffeeTags[tag];
      saveState();
      renderApp();
    });
  });

  // Forum listeners (Reddit-style upvote/downvote, sort, flair, comments)
  const btnNewPost = document.getElementById('btn-open-forum-post');
  if (btnNewPost) btnNewPost.addEventListener('click', openForumPostModal);

  document.querySelectorAll('.forum-sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.forumSort = btn.getAttribute('data-forum-sort');
      saveState();
      renderApp();
    });
  });

  document.querySelectorAll('.forum-flair-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.forumFlair = btn.getAttribute('data-forum-flair');
      saveState();
      renderApp();
    });
  });

  document.querySelectorAll('.forum-vote-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-vote-post');
      const dir = Number(btn.getAttribute('data-vote-dir'));
      const post = state.forumPosts.find(p => p.id === pid);
      if (!post) return;
      if (post.userVote === dir) {
        post.votes -= dir;
        post.userVote = 0;
      } else {
        post.votes += dir - post.userVote;
        post.userVote = dir;
      }
      saveState();
      renderApp();
    });
  });

  document.querySelectorAll('.forum-comments-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-toggle-comments');
      state.expandedPostId = state.expandedPostId === pid ? null : pid;
      saveState();
      renderApp();
    });
  });

  document.querySelectorAll('.forum-comment-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const pid = form.getAttribute('data-comment-form');
      const post = state.forumPosts.find(p => p.id === pid);
      const fd = new FormData(form);
      const text = (fd.get('commentText') || '').trim();
      if (!post || !text) return;
      post.comments.push({
        id: 'c-' + Date.now(),
        author: 'u/ulfs4_student',
        timeAgo: 'Just now',
        text
      });
      saveState();
      renderApp();
    });
  });

  // Custom Page delete listener
  document.querySelectorAll('.delete-page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-delete-page');
      state.customPages = state.customPages.filter(p => p.id !== pid);
      state.activePage = 'dashboard';
      saveState();
      renderApp();
      showToast('Custom page removed from navigation.', 'info');
    });
  });

  // Editor Console listeners
  const btnAddPage = document.getElementById('btn-editor-add-page');
  if (btnAddPage) btnAddPage.addEventListener('click', openAddPageModal);

  const btnEdSignout = document.getElementById('btn-editor-signout');
  if (btnEdSignout) {
    btnEdSignout.addEventListener('click', () => {
      state.profile.role = 'student';
      state.profile.professorName = '';
      state.activePage = 'dashboard';
      saveState();
      renderApp();
      showToast('Signed out of Admin mode.', 'info');
    });
  }

  document.querySelectorAll('.delete-event-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const eid = btn.getAttribute('data-delete-event');
      state.events = state.events.filter(ev => ev.id !== eid);
      saveState();
      renderApp();
      showToast('Session removed from Calendar.', 'info');
    });
  });

  const formEv = document.getElementById('form-add-event');
  if (formEv) {
    formEv.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const rawDate = fd.get('dateLabel').trim();
      const parts = rawDate.split('·').map(s => s.trim());
      const profVal = state.profile.role === 'professor'
        ? state.profile.professorName
        : (fd.get('professor') || '');
      state.events.unshift({
        id: 'e-' + Date.now(),
        isoDate: state.calendarFilters.selectedDate || '2026-11-23',
        day: parts[0] || 'Mon',
        date: parts[1] || rawDate,
        time: fd.get('time').trim(),
        title: fd.get('title').trim(),
        location: fd.get('location').trim(),
        category: fd.get('category'),
        year: fd.get('year') || 'All',
        major: fd.get('major') || 'All',
        professor: profVal,
        facultyId: 'sci',
        editorRole: state.profile.role,
        note: fd.get('note').trim()
      });
      saveState();
      renderApp();
      showToast('Session added to Calendar!', 'success');
    });
  }

  const formAnn = document.getElementById('form-add-announcement');
  if (formAnn) {
    formAnn.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      state.announcements.unshift({
        id: 'a-' + Date.now(),
        title: fd.get('title').trim(),
        body: fd.get('body').trim(),
        authorRole: state.profile.role,
        authorName: state.profile.role === 'professor' ? state.profile.professorName : 'Site Admin',
        date: 'Just now',
        pinned: true,
        facultyId: 'sci'
      });
      saveState();
      renderApp();
      showToast('Verified announcement posted!', 'success');
    });
  }

  document.querySelectorAll('.approve-doc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const doc = state.documents.find(d => d.id === btn.getAttribute('data-approve-doc'));
      if (doc) {
        doc.status = 'approved';
        doc.verifiedBy = ROLES[state.profile.role].label;
        saveState();
        renderApp();
        showToast(`Approved ${doc.courseCode} document!`, 'success');
      }
    });
  });

  document.querySelectorAll('.reject-doc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-reject-doc');
      state.documents = state.documents.filter(d => d.id !== id);
      saveState();
      renderApp();
      showToast('Submission removed from queue.', 'info');
    });
  });
}

function renderApp() {
  renderHeaderAndNav();
  const main = document.getElementById('app-main');
  switch (state.activePage) {
    case 'dashboard': main.innerHTML = renderDashboard(); break;
    case 'calendar': main.innerHTML = renderCalendar(); break;
    case 'archive': main.innerHTML = renderArchive(); break;
    case 'announcements': main.innerHTML = renderAnnouncementsWindow(); break;
    case 'offers': main.innerHTML = renderOffersWindow(); break;
    case 'bylaws': main.innerHTML = renderBylawsWindow(); break;
    case 'guides': main.innerHTML = renderGuides(); break;
    case 'forum': main.innerHTML = renderForum(); break;
    case 'editor': main.innerHTML = renderEditorConsole(); break;
    default: main.innerHTML = renderCustomPage(state.activePage); break;
  }
  attachViewListeners();
}

// Global Static Listeners
document.getElementById('btn-brand-home').addEventListener('click', () => {
  state.activePage = 'dashboard';
  saveState();
  renderApp();
});
document.getElementById('btn-header-admin').addEventListener('click', openAdminModal);
document.getElementById('btn-drawer-admin').addEventListener('click', () => {
  closeDrawer();
  openAdminModal();
});
document.getElementById('btn-open-drawer').addEventListener('click', openDrawer);
document.getElementById('btn-close-drawer').addEventListener('click', closeDrawer);
document.getElementById('slide-drawer-backdrop').addEventListener('click', closeDrawer);
document.getElementById('btn-drawer-addpage').addEventListener('click', () => {
  closeDrawer();
  openAddPageModal();
});
document.getElementById('btn-close-modal').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target.id === 'modal-overlay') closeModal();
});
document.getElementById('btn-theme-light').addEventListener('click', () => {
  state.theme = 'light';
  saveState();
  renderApp();
});
document.getElementById('btn-theme-dark').addEventListener('click', () => {
  state.theme = 'dark';
  saveState();
  renderApp();
});
document.getElementById('btn-footer-addpage').addEventListener('click', openAddPageModal);
document.getElementById('btn-footer-reset').addEventListener('click', () => {
  state = getDefaultState();
  saveState();
  renderApp();
  showToast('Demo data reset to defaults.', 'info');
});

function handleGlobalSearch(val) {
  state.archiveFilters.query = val;
  state.archiveFilters.year = 'All';
  state.archiveFilters.type = 'All';
  state.activePage = 'archive';
  saveState();
  renderApp();
}
document.getElementById('global-search-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') handleGlobalSearch(e.target.value);
});
document.getElementById('mobile-search-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    closeDrawer();
    handleGlobalSearch(e.target.value);
  }
});

// Initial Boot
renderApp();
