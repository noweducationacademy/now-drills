/**
 * ============================================================================
 * NOW EDUCATION ACADEMY — REGISTRATION SYSTEM & PARENT PORTAL
 * ----------------------------------------------------------------------------
 *   Registration form   ->  your /exec URL              (access-code gated)
 *   Admin dashboard     ->  /exec?page=admin            (password gated)
 *   Parent Portal       ->  /exec?page=portal           (per-family login)
 *   Student Portal      ->  /exec?page=student          (same family login — see Student.gs)
 *
 * FIRST TIME: run setup() once from the editor, then deploy as a Web app
 * with "Execute as: Me" and "Who has access: Anyone".
 * ============================================================================
 */

/* ----------------------------------------------------------------------------
 * CONFIGURATION
 * -------------------------------------------------------------------------- */

const CONFIG = {
  ACADEMY_NAME: 'NOW Education Academy',
  TAGLINE: 'Unlocking Brilliance',
  SUPPORT_EMAIL: 'info@noweducationacademy.com',
  WEBSITE: 'noweducationacademy.ca',

  COLOR_MAGENTA: '#AD0797',
  COLOR_TEAL: '#1BC1A9',
  COLOR_GOLD: '#E0A00B',

  TIMEZONE: 'America/Toronto',

  // ---- Program ----
  // Week 1 begins on this date. It MUST be a Monday.
  // Used only as a fallback; CALENDAR below is the authority on week dates.
  PROGRAM_START: '2026-09-07',
  TOTAL_WEEKS: 37,

  // ---- School calendar, 2026–2027 ----
  // The real teaching calendar, taken from the Student Calendar. Weeks are NOT
  // simply seven days apart — Christmas, March Break and the June closure sit
  // between them — so every class date, homework week and tuition month is read
  // from this list rather than counted forward from PROGRAM_START.
  //
  //   { week: n, monday: 'YYYY-MM-DD', notes: [...] }   a teaching week
  //   { break: 'Name', label: 'dates' }                 a non-teaching block
  //
  // To roll the calendar to a new school year, replace the Mondays below.
  CALENDAR: [
    { week: 1,  monday: '2026-09-07', notes: ['First week of classes',
                                              'Labour Day — classes are running'] },
    { week: 2,  monday: '2026-09-14' },
    { week: 3,  monday: '2026-09-21' },
    { week: 4,  monday: '2026-09-28' },
    { week: 5,  monday: '2026-10-05' },
    { week: 6,  monday: '2026-10-12', notes: ['Thanksgiving Day — classes are running'] },
    { week: 7,  monday: '2026-10-19' },
    { week: 8,  monday: '2026-10-26' },
    { week: 9,  monday: '2026-11-02' },
    { week: 10, monday: '2026-11-09' },
    { week: 11, monday: '2026-11-16' },
    { week: 12, monday: '2026-11-23' },
    { week: 13, monday: '2026-11-30' },
    { week: 14, monday: '2026-12-07' },
    { week: 15, monday: '2026-12-14' },
    { break: 'Christmas Holidays', label: 'December 20, 2026 – January 2, 2027' },
    { week: 16, monday: '2027-01-04', notes: ['Classes resume'] },
    { week: 17, monday: '2027-01-11' },
    { week: 18, monday: '2027-01-18' },
    { week: 19, monday: '2027-01-25' },
    { week: 20, monday: '2027-02-01' },
    { week: 21, monday: '2027-02-08' },
    { week: 22, monday: '2027-02-15', notes: ['Family Day — classes are running'] },
    { week: 23, monday: '2027-02-22' },
    { week: 24, monday: '2027-03-01' },
    { week: 25, monday: '2027-03-08' },
    { break: 'March Break', label: 'March 14 – 27, 2027 · Good Friday, March 26' },
    { week: 26, monday: '2027-03-29', notes: ['Easter Monday — classes are running'] },
    { week: 27, monday: '2027-04-05' },
    { week: 28, monday: '2027-04-12' },
    { week: 29, monday: '2027-04-19' },
    { week: 30, monday: '2027-04-26' },
    { week: 31, monday: '2027-05-03' },
    { week: 32, monday: '2027-05-10' },
    { week: 33, monday: '2027-05-17' },
    { week: 34, monday: '2027-05-24', notes: ['Victoria Day — classes are running'] },
    { week: 35, monday: '2027-05-31', notes: ['Exams'] },
    { week: 36, monday: '2027-06-07' },
    { week: 37, monday: '2027-06-14', notes: ['Last week of classes'] },
    { break: 'School Closed', label: 'June 20 – 30, 2027' }
  ],

  // ---- Courses ----
  // weekday: 0=Mon 1=Tue 2=Wed 3=Thu 4=Fri  (offset from the Monday of the week)
  // NOTE: 5THUR630 — the code says 6:30 but the original list said 4:30.
  //       6:30 PM is used here to match the course code. Change `time` below
  //       if 4:30 PM is correct.
  COURSES: [
    { code: '3MON430',  level: 3, day: 'Monday',   weekday: 0, time: '4:30 PM', capacity: 10 },
    { code: '4MON630',  level: 4, day: 'Monday',   weekday: 0, time: '6:30 PM', capacity: 10 },
    { code: '5TUE500',  level: 5, day: 'Tuesday',  weekday: 1, time: '5:00 PM', capacity: 10 },
    { code: '4TUE645',  level: 4, day: 'Tuesday',  weekday: 1, time: '6:45 PM', capacity: 10 },
    { code: '3THUR430', level: 3, day: 'Thursday', weekday: 3, time: '4:30 PM', capacity: 10 },
    { code: '5THUR630', level: 5, day: 'Thursday', weekday: 3, time: '6:30 PM', capacity: 10 }
  ],

  // ---- Grades offered ----
  // One list, served to both the public form and the dashboard, so the two can
  // never drift apart.
  GRADES: ['Junior Kindergarten','Senior Kindergarten','Grade 1','Grade 2','Grade 3',
    'Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10',
    'Grade 11','Grade 12'],

  // ---- Withdrawals ----
  // The reasons offered when a student is withdrawn. Keeping them to a short
  // fixed list is what makes the withdrawal report worth reading — free text
  // alone cannot be counted. "Other" always allows a note as well.
  // Edit this list to change the dropdown; existing records keep their wording.
  WITHDRAWAL_REASONS: [
    'Moved away',
    'Schedule conflict',
    'Cost',
    'Not the right fit',
    'Goals met',
    'Switched to another program',
    'Health or family circumstances',
    'No longer responding',
    'Other'
  ],

  // ---- Stripe: pre-authorized debit (PAD / ACSS Debit, Canada) ----
  // The secret key lives in Script Properties, never here — run
  // setStripeKey('sk_…') once from the editor.
  STRIPE: {
    ENABLED: true,
    CURRENCY: 'cad',          // must match the parent's bank account currency
    PAYMENT_SCHEDULE: 'combined',   // fixed billing dates + the payment at registration
    TRANSACTION_TYPE: 'personal',
    STATEMENT_DESCRIPTOR: 'NOW EDU ACADEMY',   // what parents see on their statement
    // >>> This is the authorisation a parent agrees to. It MUST describe the
    //     real schedule: debiting outside these terms is grounds for a dispute.
    MANDATE_DESCRIPTION:
      'Tuition for NOW Education Academy: an initial payment at registration ' +
      'where applicable, then on August 31, October 31, December 31, February 28 ' +
      'and April 30 of each school year.'
  },

  // ---- Security ----
  SESSION_MINUTES: 60,
  MAX_LOGIN_ATTEMPTS: 6,
  LOCKOUT_MINUTES: 15,

  // ---- Uploads ----
  MAX_UPLOAD_MB: 10,

  // Homework files live in the owner's Drive. A teacher signed into the teacher
  // portal is not the owner, and neither is a parent, so neither can open one
  // without the file itself carrying link access. Setting this false keeps every
  // file strictly private — and means submissions cannot be opened from the
  // teacher portal, nor marked work from the parent portal. See the TEACHER
  // PORTAL section for the full reasoning.
  LINK_SHARING: true,

  // ---- Tuition & Refund Policy shown in the Parent Portal ----
  //
  // Each entry is one block. Use whichever of the three shapes you need:
  //   { heading: 'Title' }                        a coloured section bar
  //   { text: 'Paragraph…' }                      a paragraph
  //   { table: { head: [...], rows: [[...]] } }   a two-or-more column table
  //
  // Section bars cycle magenta -> teal -> gold automatically, so adding or
  // removing a heading keeps the colours in order without any other edit.
  REFUND_POLICY: [
    { heading: 'Tuition Payment' },
    { text: 'Monthly tuition is due and payable in full prior to the commencement of ' +
            'each billing period of 2 months at a time. Specifically, tuition for the ' +
            'upcoming payment period must be received by the last day of the month prior. ' +
            'For example, tuition for September and October must be paid by August 31st. ' +
            'This ensures the program can effectively manage resources and staffing.' },

    { heading: 'Billing Schedule' },
    { table: { head: ['Billing Date', 'Billing Period', 'Amount',
                      'Sibling (10% discount)'], rows: [
        ['August 31st',   'September 1st – October 31st',
         '$520 plus $45 registration fee', '$468 plus $45 registration fee'],
        ['October 31st',  'November 1st – December 31st', '$520', '$468'],
        ['December 31st', 'January 1st – February 28th',  '$520', '$468'],
        ['February 28th', 'March 1st – April 30th',       '$520', '$468'],
        ['April 30th',    'May 1st – June 30th',          '$520', '$468']
      ] } },

    { heading: 'Tuition' },
    { table: { head: ['Fee Type', 'Amount'], rows: [
        ['Annual Registration Fee, per student', '$45'],
        ['Annual Tuition Fees',                  '$2600'],
        ['Billing Period (2 Months)',            '$520'],
        ['Each Additional Child — Tuition',      '$2340'],
        ['Each Additional Child — 2 Months',     '$468']
      ] } },
    { text: 'Each additional family member enrolled in the program receives a 10% discount ' +
            'on the tuition only, not the registration fee. The registration fee is payable ' +
            'in full for every student enrolled.' },

    { heading: 'Withdrawal and Refund Policy' },
    { text: 'Parents or guardians wishing to withdraw their child from the program must ' +
            'provide written notice of withdrawal at least 10 days prior to the intended ' +
            'date of withdrawal. This notice must be sent to info@noweducationacademy.com. ' +
            'The date of receipt of the written notice will be considered the official ' +
            'withdrawal date. Please note that there is a no refund policy within a ' +
            'billing period. Upon receipt of the withdrawal notification, you will not be ' +
            'billed for subsequent billing periods.' },

    { heading: 'Refund Eligibility' },
    { text: 'There is a zero refund policy during a billing period.' },

    { heading: 'Policy Updates' },
    { text: 'The program provider reserves the right to modify this refund policy at any ' +
            'time. Any changes to the policy will be communicated to parents or guardians ' +
            'via email or posting on the program’s website.' }
  ]
};

const FEES = {
  REGISTRATION_FEE: 45,        // per child, per year — never discounted
  ANNUAL_TUITION: 2600,        // first child, full 37-week program
  TOTAL_WEEKS: 37,
  SIBLING_DISCOUNT: 0.10,      // 2nd child onward: $2340 tuition, $468 per period

  // ---- Billing periods ----
  // Tuition is billed in five two-month periods, not monthly. Each period is
  // $520 for the first child and $468 for each additional child
  // (5 x $520 = $2600; 5 x $468 = $2340). The registration fee rides on the
  // family's first payment.
  // `start` and `end` are the period the payment buys. They are what decides
  // whether a withdrawal cancels a billing: a student who leaves before a
  // period begins is not billed for it, and one who leaves partway through has
  // already been billed for it — any credit there is a refund-policy matter,
  // not something the system takes back on its own.
  PERIOD_AMOUNT: 520,
  PERIODS: [
    { due: '2026-08-31', start: '2026-09-01', end: '2026-10-31', covers: 'September 1 – October 31' },
    { due: '2026-10-31', start: '2026-11-01', end: '2026-12-31', covers: 'November 1 – December 31' },
    { due: '2026-12-31', start: '2027-01-01', end: '2027-02-28', covers: 'January 1 – February 28' },
    { due: '2027-02-28', start: '2027-03-01', end: '2027-04-30', covers: 'March 1 – April 30' },
    { due: '2027-04-30', start: '2027-05-01', end: '2027-06-30', covers: 'May 1 – June 30' }
  ]
};

// Script Properties (values never live in this file)
const PROP_SHEET_ID  = 'SPREADSHEET_ID';
const PROP_ADMIN_PW  = 'ADMIN_PASSWORD';
const PROP_ACCESS    = 'ACCESS_CODE';
const PROP_FOLDER    = 'UPLOAD_FOLDER_ID';
const PROP_NOTIFY    = 'NOTIFY_EMAIL';
const PROP_STRIPE    = 'STRIPE_SECRET_KEY';
const PROP_TEACHER   = 'TEACHER_PASSWORD';

const SHEETS = {
  FAMILIES: 'Families',
  CHILDREN: 'Children',
  HOMEWORK: 'Homework',
  ATTENDANCE: 'Attendance',
  ASSIGNMENTS: 'Assignments',
  MARKS: 'Marks',
  ANNOUNCEMENTS: 'Announcements',
  PAYMENTS: 'Payments',
  LOG: 'Activity Log'
};

const F = {  // Families columns
  ID: 1, CREATED: 2, P1_FIRST: 3, P1_LAST: 4, P1_EMAIL: 5, P1_PHONE: 6, P1_ADDR: 7,
  P2_FIRST: 8, P2_LAST: 9, P2_EMAIL: 10, P2_PHONE: 11, P2_ADDR: 12,
  USERNAME: 13, INITIAL_PW: 14, PW_HASH: 15, PW_SALT: 16, PW_CHANGED: 17,
  ENROLL_WEEK: 18, STATUS: 19, NOTES: 20, FIRST_PAY: 21,
  // Stripe pre-authorized debit
  PAD_CUSTOMER: 22, PAD_METHOD: 23, PAD_MANDATE: 24, PAD_STATUS: 25, PAD_SET_ON: 26
};
const F_HEADERS = ['Family ID','Registered On','Parent 1 First','Parent 1 Last','Parent 1 Email',
  'Parent 1 Phone','Parent 1 Address','Parent 2 First','Parent 2 Last','Parent 2 Email',
  'Parent 2 Phone','Parent 2 Address','Portal Username','Initial Password','Password Hash',
  'Salt','Password Changed','Enrolment Week','Status','Notes','Initial Payment (manual)',
  'Stripe Customer','Stripe Payment Method','Stripe Mandate','Debit Status','Debit Set Up On'];

// STATUS is 'Enrolled' or 'Withdrawn'. WEEK is blank for a student registered
// with the family and holds a week number for one added to the family later —
// that student's tuition is prorated from their own start, not the family's.
const K = {  // Children columns
  ID: 1, FAMILY_ID: 2, FIRST: 3, LAST: 4, GRADE: 5, COURSE: 6, CREATED: 7, STATUS: 8,
  WD_EFFECTIVE: 9, WD_REASON: 10, WD_NOTE: 11, WD_RECORDED: 12, WD_BY: 13, WEEK: 14
};
const K_HEADERS = ['Child ID','Family ID','First Name','Last Name','Grade','Course Code',
  'Created On','Status','Withdrawal Effective','Withdrawal Reason','Withdrawal Note',
  'Withdrawal Recorded','Recorded By','Own Start Week'];

// Columns 9–14 are the teacher's marking: the marked-up file they hand back,
// their comments, and when they did it. A submission counts as marked once
// MARKED_ON has a date — that single field is what the parent portal keys off.
// Columns 9–13 are the teacher's marking of one student's file: the marked-up
// copy handed back and the comments on it. Marks are NOT here — an assignment
// belongs to the whole class, so it lives on its own sheet (see AS / MK below).
// Columns 14–15 held per-student assignment lists before that change; setup()
// migrates anything in them and they are then left alone.
const H = {  // Homework columns
  ID: 1, FAMILY_ID: 2, CHILD_ID: 3, WEEK: 4, FILE_ID: 5, FILE_NAME: 6, SIZE: 7, UPLOADED: 8,
  MARK_FILE_ID: 9, MARK_FILE_NAME: 10, COMMENTS: 11, MARKED_ON: 12, MARKED_BY: 13,
  LEGACY_ASSIGNMENTS: 14, LEGACY_GRADES: 15
};
const H_HEADERS = ['Upload ID','Family ID','Child ID','Week','Drive File ID','File Name',
  'Size (bytes)','Uploaded On','Marked File ID','Marked File Name','Teacher Comments',
  'Marked On','Marked By','(was: Assignments)','(was: Grades)'];

// An assignment is set once for a class in a given week and applies to every
// student in it. SORT keeps the order the teacher created them in, so the
// gradebook columns do not jump around.
const AS = {  // Assignments columns
  ID: 1, COURSE: 2, WEEK: 3, NAME: 4, SORT: 5, CREATED: 6, BY: 7
};
const AS_HEADERS = ['Assignment ID','Course Code','Week','Assignment Name','Order',
  'Created On','Created By'];

// One row per student per assignment. No row means no mark — which the portals
// show as "Incomplete", never as a zero.
const MK = {  // Marks columns
  ASSIGNMENT_ID: 1, CHILD_ID: 2, MARK: 3, RECORDED: 4, BY: 5
};
const MK_HEADERS = ['Assignment ID','Child ID','Mark','Recorded On','Recorded By'];

// One announcement per class per week. Posting again replaces it, so a week
// never carries two notices that contradict each other.
const AN = {  // Announcements columns
  ID: 1, COURSE: 2, WEEK: 3, MESSAGE: 4, POSTED: 5, BY: 6
};
const AN_HEADERS = ['Announcement ID','Course Code','Week','Message',
  'Posted On','Posted By'];
const MAX_ANNOUNCEMENT = 2000;

const MAX_ASSIGNMENTS = 12;      // per week, per class

// One row per student per week. No row means attendance was never taken.
const AT = {  // Attendance columns
  CHILD_ID: 1, FAMILY_ID: 2, COURSE: 3, WEEK: 4, STATUS: 5, RECORDED: 6, BY: 7
};
const AT_HEADERS = ['Child ID','Family ID','Course Code','Week','Status',
  'Recorded On','Recorded By'];
const ATTENDANCE_CODES = { P: 'Present', A: 'Absent', L: 'Late' };

// Only payments that have been RECEIVED are stored. Anything absent is
// outstanding, and whether it is merely upcoming or overdue is decided by its
// due date, so the sheet never has to be kept in step with the calendar.
const PY = {  // Payments columns
  FAMILY_ID: 1, KEY: 2, DUE: 3, AMOUNT: 4, PAID_ON: 5, MARKED_BY: 6,
  STATE: 7, INTENT: 8, DETAIL: 9
};
// STATE is 'paid', 'processing' (debit submitted, not yet settled) or 'failed'.
const PY_HEADERS = ['Family ID','Payment Key','Due Date','Amount','Paid On','Marked By',
  'State','Stripe Payment Intent','Detail'];


/* ----------------------------------------------------------------------------
 * SETUP
 * -------------------------------------------------------------------------- */

function setup() {
  const props = PropertiesService.getScriptProperties();

  let ss = null;
  const existing = props.getProperty(PROP_SHEET_ID);
  if (existing) { try { ss = SpreadsheetApp.openById(existing); } catch (e) { ss = null; } }
  if (!ss) {
    ss = SpreadsheetApp.create(CONFIG.ACADEMY_NAME + ' — Registrations');
    ss.setSpreadsheetTimeZone(CONFIG.TIMEZONE);
    props.setProperty(PROP_SHEET_ID, ss.getId());
  }

  makeSheet_(ss, SHEETS.FAMILIES, F_HEADERS, CONFIG.COLOR_MAGENTA);
  makeSheet_(ss, SHEETS.CHILDREN, K_HEADERS, CONFIG.COLOR_TEAL);
  makeSheet_(ss, SHEETS.HOMEWORK, H_HEADERS, CONFIG.COLOR_GOLD);
  makeSheet_(ss, SHEETS.ATTENDANCE, AT_HEADERS, '#7A3F76');
  makeSheet_(ss, SHEETS.ASSIGNMENTS, AS_HEADERS, '#3F5C7A');
  makeSheet_(ss, SHEETS.MARKS, MK_HEADERS, '#5C7A3F');
  makeSheet_(ss, SHEETS.ANNOUNCEMENTS, AN_HEADERS, '#B4780A');
  makeSheet_(ss, SHEETS.PAYMENTS, PY_HEADERS, '#0E7364');
  makeSheet_(ss, SHEETS.LOG, ['Timestamp','Actor','Action','Detail'], '#4A4A55');

  migrateAssignments_();

  // Remove the default blank sheet if it is still there
  const blank = ss.getSheetByName('Sheet1');
  if (blank && ss.getSheets().length > 1) ss.deleteSheet(blank);

  if (!props.getProperty(PROP_ADMIN_PW)) props.setProperty(PROP_ADMIN_PW, 'Ar12122018!');
  if (!props.getProperty(PROP_ACCESS))   props.setProperty(PROP_ACCESS, 'NOWEDU2026!');
  if (!props.getProperty(PROP_TEACHER))  props.setProperty(PROP_TEACHER, 'Ar12122018!');
  if (!props.getProperty(PROP_NOTIFY))   props.setProperty(PROP_NOTIFY, Session.getEffectiveUser().getEmail());

  // Drive folder for homework uploads
  let folderId = props.getProperty(PROP_FOLDER);
  let folder = null;
  if (folderId) { try { folder = DriveApp.getFolderById(folderId); } catch (e) { folder = null; } }
  if (!folder) {
    folder = DriveApp.createFolder(CONFIG.ACADEMY_NAME + ' — Homework Uploads');
    props.setProperty(PROP_FOLDER, folder.getId());
  }

  Logger.log('Setup complete.\nSpreadsheet: ' + ss.getUrl() +
             '\nUploads folder: ' + folder.getUrl() +
             '\n\nFor pre-authorized debit, also run:' +
             '\n  setStripeKey(\'sk_test_…\')   then   installPadTrigger()');
  return ss.getUrl();
}

function makeSheet_(ss, name, headers, colour) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getMaxColumns() < headers.length) {
    sh.insertColumnsAfter(sh.getMaxColumns(), headers.length - sh.getMaxColumns());
  }
  sh.getRange(1, 1, 1, headers.length).setValues([headers])
    .setFontWeight('bold').setBackground(colour).setFontColor('#FFFFFF');
  sh.setFrozenRows(1);
  return sh;
}

function setAdminPassword(pw) {
  if (!pw || String(pw).length < 8) throw new Error('Password must be at least 8 characters.');
  PropertiesService.getScriptProperties().setProperty(PROP_ADMIN_PW, String(pw));
  return 'Admin password updated.';
}
function setAccessCode(code) {
  if (!code) throw new Error('Access code cannot be blank.');
  PropertiesService.getScriptProperties().setProperty(PROP_ACCESS, String(code));
  return 'Access code updated.';
}
function setTeacherPassword(pw) {
  if (!pw || String(pw).length < 8) throw new Error('Password must be at least 8 characters.');
  PropertiesService.getScriptProperties().setProperty(PROP_TEACHER, String(pw));
  return 'Teacher portal password updated.';
}
function showLinks() {
  const url = ScriptApp.getService().getUrl();
  const msg = 'Registration  : ' + url +
              '\nAdmin         : ' + url + '?page=admin' +
              '\nParent Portal : ' + url + '?page=portal' +
              '\nTeacher Portal: ' + url + '?page=teacher' +
              '\nStudent Portal: ' + url + '?page=student';
  Logger.log(msg);
  return msg;
}


/* ----------------------------------------------------------------------------
 * ROUTING
 * -------------------------------------------------------------------------- */

/**
 * All three pages are served from Index.html. The mode decides which section of
 * that file is sent, so a parent's browser never receives the dashboard markup.
 *
 *   …/exec                → registration form
 *   …/exec?page=admin     → registration dashboard
 *   …/exec?page=portal    → parent portal
 */
function doGet(e) {
  const page = (e && e.parameter && e.parameter.page) ? String(e.parameter.page).toLowerCase() : 'register';
  let mode = 'register', title = 'Register';
  if (page === 'admin' || page === 'dashboard') { mode = 'admin';  title = 'Registration Dashboard'; }
  else if (page === 'portal')                   { mode = 'portal'; title = 'Parent Portal'; }
  else if (page === 'teacher')                  { mode = 'teacher'; title = 'Teacher Portal'; }
  else if (page === 'student')                  { mode = 'student'; title = 'Student Portal'; }
  else if (page === 'padreturn')                { mode = 'padreturn'; title = 'Payment Setup'; }

  // Stripe sends the parent back here after the bank authorisation. Record the
  // outcome before the page renders, so what they read is the real state.
  let padResult = 'cancelled';
  if (mode === 'padreturn') {
    const fid = e && e.parameter ? String(e.parameter.fid || '') : '';
    const sid = e && e.parameter ? String(e.parameter.session_id || '') : '';
    if (sid && fid) {
      try { padResult = padFinalize_(fid, sid).status === 'Active' ? 'active' : 'pending'; }
      catch (err) { padResult = 'error'; log_(fid, 'PAD_RETURN_FAILED', err.message); }
    }
  }

  const tpl = HtmlService.createTemplateFromFile('Index');
  tpl.mode = mode;
  tpl.padResult = padResult;
  tpl.padSupport = CONFIG.SUPPORT_EMAIL;
  tpl.tagline = CONFIG.TAGLINE;
  tpl.academy = CONFIG.ACADEMY_NAME;
  tpl.support = CONFIG.SUPPORT_EMAIL;
  tpl.totalWeeks = String(CONFIG.TOTAL_WEEKS);

  return tpl.evaluate()
    .setTitle(CONFIG.ACADEMY_NAME + ' — ' + title)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


/* ----------------------------------------------------------------------------
 * SHEET HELPERS
 * -------------------------------------------------------------------------- */

function ss_() {
  const id = PropertiesService.getScriptProperties().getProperty(PROP_SHEET_ID);
  if (!id) throw new Error('Not set up yet. Run setup() from the Apps Script editor first.');
  return SpreadsheetApp.openById(id);
}
function sheet_(name) {
  const sh = ss_().getSheetByName(name);
  if (!sh) throw new Error('Sheet "' + name + '" is missing. Re-run setup().');
  return sh;
}
function rows_(name, width) {
  const sh = sheet_(name);
  const last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, width).getValues();
}
function log_(actor, action, detail) {
  try { sheet_(SHEETS.LOG).appendRow([new Date(), actor || 'system', action, detail || '']); }
  catch (e) {}
}
function fmt_(d, p) { return Utilities.formatDate(d, CONFIG.TIMEZONE, p); }
function clean_(v, max) { return String(v == null ? '' : v).trim().slice(0, max || 300); }
function isEmail_(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim()); }
function programStart_() {
  const p = CONFIG.PROGRAM_START.split('-');
  return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
}


/* ----------------------------------------------------------------------------
 * TUITION ENGINE
 * Money is kept in integer cents and per-session amounts are allocated from the
 * total, so a payment schedule always sums back to the invoice exactly.
 * -------------------------------------------------------------------------- */

function money_(cents) { return Math.round(cents) / 100; }

/** Monday -> week number, built once from CONFIG.CALENDAR. */
let WEEK_MONDAYS_ = null;
function weekMondays_() {
  if (WEEK_MONDAYS_) return WEEK_MONDAYS_;
  WEEK_MONDAYS_ = {};
  (CONFIG.CALENDAR || []).forEach(function (r) {
    if (!r.week || !r.monday) return;
    const p = String(r.monday).split('-');
    WEEK_MONDAYS_[r.week] = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  });
  return WEEK_MONDAYS_;
}

/**
 * The Monday that starts a given program week.
 *
 * Read from CONFIG.CALENDAR, because the breaks mean week N is NOT
 * PROGRAM_START + 7(N-1) days. Falls back to that arithmetic only if the
 * calendar has no entry for the week.
 */
function weekStart_(start, week) {
  const m = weekMondays_()[week];
  if (m) { const d = new Date(m.getTime()); d.setHours(0, 0, 0, 0); return d; }
  const d = new Date(start.getTime());
  d.setDate(d.getDate() + (week - 1) * 7);
  d.setHours(0, 0, 0, 0);
  return d;
}
function sessionDate_(start, week, weekday) {
  const d = weekStart_(start, week);
  d.setDate(d.getDate() + weekday);
  return d;
}
function monthKey_(d) {
  return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2);
}
function paymentDate_(year, monthIdx) {
  const lastDay = new Date(year, monthIdx + 1, 0).getDate();
  return new Date(year, monthIdx, Math.min(FEES.PAYMENT_DAY, lastDay));
}
function allocateCents_(total, n) {
  const out = [];
  if (n <= 0) return out;
  const base = Math.floor(total / n), extra = total - base * n;
  for (let i = 0; i < n; i++) out.push(base + (i < extra ? 1 : 0));
  return out;
}

const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];
function monthName_(key) {
  const p = key.split('-');
  return MONTH_NAMES[Number(p[1]) - 1] + ' ' + p[0];
}

/**
 * Prorated cost for one child, in cents.
 *
 * Tuition is the annual figure scaled by the weeks the child will actually
 * attend: a student joining in week 3 does not pay for the two classes already
 * gone. The sibling discount then applies to that prorated tuition, never to
 * the registration fee.
 */
function childCost_(enrollWeek, childIndex) {
  const weeksLeft = Math.max(0, FEES.TOTAL_WEEKS - enrollWeek + 1);
  const discount = childIndex === 0 ? 0 : FEES.SIBLING_DISCOUNT;
  const annualCents = Math.round(FEES.ANNUAL_TUITION * 100);
  const grossCents = Math.round(annualCents * weeksLeft / FEES.TOTAL_WEEKS);
  const discCents = Math.round(grossCents * discount);
  const netCents = grossCents - discCents;
  const regCents = Math.round(FEES.REGISTRATION_FEE * 100);
  const periodCents = periodAmountCents_(childIndex);

  return {
    weeksRemaining: weeksLeft,
    discountPct: discount * 100,
    fullWeeklyRate: money_(Math.round(annualCents / FEES.TOTAL_WEEKS)),
    weeklyRate: money_(weeksLeft ? Math.round(netCents / weeksLeft) : 0),
    periodAmount: money_(periodCents),
    grossTuition: money_(grossCents),
    discountAmount: money_(discCents),
    netTuition: money_(netCents),
    registrationFee: FEES.REGISTRATION_FEE,
    total: money_(netCents + regCents),
    _netCents: netCents,
    _regCents: regCents
  };
}

/** Billing-period amount for one child: $520, or $468 for a sibling. */
function periodAmountCents_(childIndex) {
  const full = Math.round(FEES.PERIOD_AMOUNT * 100);
  if (childIndex === 0) return full;
  return full - Math.round(full * FEES.SIBLING_DISCOUNT);
}

/** What the whole family owes at each billing date, in cents. */
function familyPeriodCents_(childCount) {
  let c = 0;
  for (let i = 0; i < childCount; i++) c += periodAmountCents_(i);
  return c;
}

function parseISO_(s) {
  const p = String(s).split('-');
  return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
}

/**
 * The billing dates still ahead of a given day.
 *
 * A date falling ON the registration day still counts as due — a family
 * registering on August 31st pays that period, exactly as the schedule says.
 */
function futureBillings_(from) {
  const ref = new Date(from.getTime());
  ref.setHours(0, 0, 0, 0);
  return (FEES.PERIODS || []).filter(function (p) {
    return parseISO_(p.due).getTime() >= ref.getTime();
  });
}
/**
 * The family's payment schedule.
 *
 * Tuition is billed in five two-month periods on fixed dates. A family that
 * registers mid-year has already missed some of those dates, so:
 *
 *   1. their tuition is prorated to the weeks they will actually attend;
 *   2. the billing dates still ahead are charged at the standard amount;
 *   3. the difference is collected at registration, with the annual
 *      registration fee.
 *
 * Worked through: a single child joining in week 3 owes 2600/37 x 35 =
 * $2459.46. Four billing dates remain at $520 = $2080, so $379.46 plus the $45
 * fee is due at registration, and the four standard payments follow.
 *
 * A family registering before the first billing date has nothing to settle up
 * front: they simply pay the five scheduled amounts, the first carrying the fee.
 */
function buildSchedule_(tuitionCents, regCents, periodCents, registeredOn) {
  const ahead = futureBillings_(registeredOn);
  const scheduledCents = ahead.length * periodCents;
  const out = [];

  // What is owed now: the prorated tuition the remaining billings will not cover
  let initial = tuitionCents - scheduledCents;
  let toBill;

  if (initial > 0) {
    out.push({
      key: 'REG',
      dueDate: new Date(registeredOn.getTime()),
      dueLabel: 'At registration',
      isFirst: true,
      registrationFees: money_(regCents),
      tuition: money_(initial),
      covers: 'Registration fee + prorated balance for the current billing period',
      amount: money_(initial + regCents),
      _cents: initial + regCents
    });
    toBill = scheduledCents;
  } else {
    // Registered before any billing date, or the remaining billings already
    // cover the balance — the fee rides on the first scheduled payment.
    initial = 0;
    toBill = tuitionCents;
  }

  const feeRides = (out.length === 0);
  ahead.forEach(function (p, i) {
    if (toBill <= 0) return;                       // balance already settled
    const amt = Math.min(periodCents, toBill);
    toBill -= amt;
    const fee = (feeRides && i === 0) ? regCents : 0;
    const due = parseISO_(p.due);
    out.push({
      key: p.due,
      dueDate: due,
      dueLabel: fmt_(due, 'MMM d, yyyy'),
      isFirst: false,
      registrationFees: money_(fee),
      tuition: money_(amt),
      covers: p.covers + (fee ? ' + registration fee' : ''),
      amount: money_(amt + fee),
      _cents: amt + fee
    });
  });

  out.forEach(function (p, i) { p.n = i + 1; });
  return out;
}

/**
 * Manual override: the Academy enters the amount to collect at registration,
 * and the balance is spread over the billing dates still ahead at the standard
 * period amount, the last one trimmed to whatever remains.
 */
function manualSchedule_(firstCents, grandCents, periodCents, registeredOn) {
  const out = [{
    n: 1,
    key: 'REG',
    dueDate: new Date(registeredOn.getTime()),
    dueLabel: 'At registration',
    isFirst: true,
    manual: true,
    registrationFees: 0,
    tuition: 0,
    covers: 'Initial payment — set by the Academy',
    amount: money_(firstCents),
    _cents: firstCents
  }];

  let remaining = grandCents - firstCents;
  futureBillings_(registeredOn).forEach(function (p) {
    if (remaining <= 0) return;
    const amt = Math.min(periodCents, remaining);
    remaining -= amt;
    const due = parseISO_(p.due);
    out.push({
      n: 0,
      key: p.due,
      dueDate: due,
      dueLabel: fmt_(due, 'MMM d, yyyy'),
      isFirst: false,
      manual: true,
      registrationFees: 0,
      tuition: money_(amt),
      covers: p.covers,
      amount: money_(amt),
      _cents: amt
    });
  });

  // If the billing dates run out before the balance does, the remainder falls
  // on the last payment rather than vanishing.
  if (remaining > 0 && out.length > 1) {
    const last = out[out.length - 1];
    last._cents += remaining;
    last.amount = money_(last._cents);
    last.tuition = money_(last._cents);
    last.covers += ' (includes outstanding balance)';
  } else if (remaining > 0) {
    out[0]._cents += remaining;
    out[0].amount = money_(out[0]._cents);
  }

  out.forEach(function (p, i) { p.n = i + 1; });
  return out;
}

/** The billing period a schedule row belongs to, or null for a one-off row. */
function periodByDue_(due) {
  const hit = (FEES.PERIODS || []).filter(function (p) { return p.due === due; });
  return hit.length ? hit[0] : null;
}

/**
 * Take a withdrawn student's share off the billing dates still ahead of them.
 *
 * The rule is the period, not the date: a student is billed for a period they
 * were enrolled at the start of, and not for one that begins after they leave.
 * So a student withdrawing on October 15th keeps the September–October billing
 * — already taken on August 31st — and is off every billing from November on.
 * Whether any of that October money comes back is a refund-policy decision the
 * Academy makes; the system never claws a payment back on its own.
 *
 * Nothing already settled is touched. A row reduced to nothing is marked
 * cancelled, which is what keeps the daily Stripe run from ever debiting it.
 */
function applyWithdrawals_(rows, plans) {
  const leaving = plans.filter(function (p) { return !!p.leave; });
  if (!leaving.length) return 0;

  let creditCents = 0;
  rows.forEach(function (row) {
    const period = periodByDue_(row.key);
    if (!period) return;                       // the at-registration row and friends
    const start = parseISO_(period.start);

    let drop = 0;
    leaving.forEach(function (p) {
      if (p.leave.getTime() <= start.getTime()) drop += p.periodCents;
    });
    if (drop <= 0) return;

    // The registration fee is never refunded, so it is never dropped.
    const feeCents = Math.round((row.registrationFees || 0) * 100);
    const tuitionCents = row._cents - feeCents;
    const removed = Math.min(drop, Math.max(0, tuitionCents));
    if (removed <= 0) return;

    row.originalAmount = money_(row._cents);
    row._cents -= removed;
    row.tuition = money_(tuitionCents - removed);
    row.amount = money_(row._cents);
    row.withdrawalCredit = money_(removed);
    creditCents += removed;

    if (row._cents <= 0) {
      row.cancelled = true;
      row.covers = 'Cancelled — student withdrawn';
    } else {
      row.covers = row.covers + ' · reduced, student withdrawn';
    }
  });

  return creditCents;
}

/**
 * A student added to an existing family part-way through the year.
 *
 * They are billed on exactly the same terms as a family registering that day:
 * tuition prorated to the weeks they will attend, the billing dates still
 * ahead charged at the standard amount, and the difference plus their
 * registration fee collected up front. Reusing buildSchedule_ is deliberate —
 * it is the same arithmetic the Academy already checks every registration
 * against, so there is no second set of rules to keep in step.
 */
function addedStudentRows_(plan) {
  const rows = buildSchedule_(plan.cost._netCents, plan.cost._regCents,
                              plan.periodCents, plan.joinDate);
  rows.forEach(function (r) {
    if (r.key !== 'REG') return;
    r.key = 'ADD-' + plan.id;
    r.dueLabel = fmt_(plan.joinDate, 'MMM d, yyyy');
    r.covers = 'Registration fee + prorated tuition — ' + plan.name + ' added';
    r.addedStudent = plan.name;
  });
  return rows;
}

/** Fold extra rows into the family schedule, summing anything on the same date. */
function mergeRows_(base, extra) {
  const byKey = {};
  base.forEach(function (r) { byKey[r.key] = r; });

  extra.forEach(function (r) {
    const hit = byKey[r.key];
    if (!hit) { base.push(r); byKey[r.key] = r; return; }
    hit._cents += r._cents;
    hit.amount = money_(hit._cents);
    hit.tuition = money_(Math.round(hit.tuition * 100) + Math.round(r.tuition * 100));
    hit.registrationFees = money_(Math.round(hit.registrationFees * 100) +
                                  Math.round(r.registrationFees * 100));
  });

  base.sort(function (a, b) { return a.dueDate - b.dueDate; });
  base.forEach(function (r, i) { r.n = i + 1; });
  return base;
}

/**
 * Whole-family figures plus the payment schedule.
 * children: [{ name, courseCode, weekday, id, week, withdrawnEffective, addedOn }]
 *   week / addedOn — set only for a student added to the family later; blank
 *                    means they registered with the family.
 *   withdrawnEffective — ISO date the student leaves, or blank.
 * manualFirst: dollar amount entered on the dashboard, or null for the
 *              automatic calculation above.
 */
function computeFamily_(enrollWeek, children, registeredOn, manualFirst) {
  enrollWeek = Math.max(1, Math.min(FEES.TOTAL_WEEKS, Number(enrollWeek) || 1));
  registeredOn = registeredOn || new Date();

  const perChild = [];
  const plans = [];
  // Founding students — registered with the family — are billed together on the
  // family's schedule. One added later carries their own start week and is
  // costed from it, so they never pay for weeks that were over before they came.
  let regC = 0, grossC = 0, discC = 0, netC = 0;
  let addedRegC = 0, addedNetC = 0;

  children.forEach(function (c, i) {
    const own = Number(c.week) || 0;
    const startWeek = own
      ? Math.max(1, Math.min(FEES.TOTAL_WEEKS, own))
      : enrollWeek;
    const leave = c.withdrawnEffective ? parseISO_(c.withdrawnEffective) : null;
    const cost = childCost_(startWeek, i);
    cost.name = c.name;
    cost.courseCode = c.courseCode;
    cost.startWeek = startWeek;
    cost.addedLater = !!own;
    cost.withdrawn = !!c.withdrawnEffective;
    cost.withdrawnEffective = c.withdrawnEffective || '';
    cost.withdrawnLabel = leave ? fmt_(leave, 'MMM d, yyyy') : '';
    cost.withdrawalReason = c.withdrawalReason || '';
    perChild.push(cost);

    plans.push({
      id: c.id || ('C' + (i + 1)), name: c.name, cost: cost,
      periodCents: periodAmountCents_(i),
      addedLater: !!own,
      joinDate: c.addedOn ? parseISO_(c.addedOn) : weekStart_(programStart_(), startWeek),
      leave: leave
    });

    grossC += Math.round(cost.grossTuition * 100);
    discC += Math.round(cost.discountAmount * 100);
    if (own) { addedRegC += cost._regCents; addedNetC += cost._netCents; }
    else     { regC += cost._regCents;      netC += cost._netCents; }
  });

  const founding = plans.filter(function (p) { return !p.addedLater; });
  const addedLater = plans.filter(function (p) { return p.addedLater; });

  // The standing amount per billing date, counting only students still enrolled.
  let periodC = 0;
  plans.forEach(function (p) { if (!p.leave) periodC += p.periodCents; });
  const foundingPeriodC = founding.reduce(function (a, p) { return a + p.periodCents; }, 0);

  const contractedC = regC + netC + addedRegC + addedNetC;

  const hasManual = (manualFirst !== null && manualFirst !== undefined &&
                     manualFirst !== '' && !isNaN(Number(manualFirst)));
  const manualCents = hasManual ? Math.max(0, Math.round(Number(manualFirst) * 100)) : 0;

  let schedule = hasManual
    ? manualSchedule_(manualCents, regC + netC, foundingPeriodC, registeredOn)
    : buildSchedule_(netC, regC, foundingPeriodC, registeredOn);

  addedLater.forEach(function (p) { schedule = mergeRows_(schedule, addedStudentRows_(p)); });

  const creditC = applyWithdrawals_(schedule, plans);
  const grandC = contractedC - creditC;

  const schedC = schedule.reduce(function (a, p) { return a + p._cents; }, 0);
  const live = schedule.filter(function (p) { return !p.cancelled; });
  const withdrawnKids = perChild.filter(function (c) { return c.withdrawn; });

  return {
    withdrawal: withdrawnKids.length ? {
      students: withdrawnKids.map(function (c) {
        return { name: c.name, effective: c.withdrawnLabel, reason: c.withdrawalReason };
      }),
      credit: money_(creditC),
      cancelled: schedule.filter(function (p) { return p.cancelled; }).length,
      allWithdrawn: withdrawnKids.length === perChild.length
    } : null,
    enrollWeek: enrollWeek,
    weeksRemaining: Math.max(0, FEES.TOTAL_WEEKS - enrollWeek + 1),
    children: perChild.map(function (c) {
      return {
        name: c.name, courseCode: c.courseCode,
        weeksRemaining: c.weeksRemaining, discountPct: c.discountPct,
        weeklyRate: c.weeklyRate, fullWeeklyRate: c.fullWeeklyRate,
        periodAmount: c.periodAmount,
        grossTuition: c.grossTuition, discountAmount: c.discountAmount,
        netTuition: c.netTuition, registrationFee: c.registrationFee, total: c.total,
        startWeek: c.startWeek, addedLater: c.addedLater,
        withdrawn: c.withdrawn, withdrawnEffective: c.withdrawnEffective,
        withdrawnLabel: c.withdrawnLabel, withdrawalReason: c.withdrawalReason
      };
    }),
    totals: {
      registrationFees: money_(regC + addedRegC),
      grossTuition: money_(grossC),
      siblingDiscount: money_(discC),
      netTuition: money_(netC + addedNetC),
      contractedTotal: money_(contractedC),
      withdrawalCredit: money_(creditC),
      grandTotal: money_(grandC)
    },
    schedule: schedule.map(function (p) {
      return { n: p.n, key: p.key, dueLabel: p.dueLabel, covers: p.covers,
               dueISO: fmt_(p.dueDate, 'yyyy-MM-dd'),
               registrationFees: p.registrationFees, tuition: p.tuition, amount: p.amount,
               cancelled: !!p.cancelled,
               withdrawalCredit: p.withdrawalCredit || 0,
               originalAmount: p.originalAmount || 0,
               addedStudent: p.addedStudent || '' };
    }),
    firstPayment: money_(schedule.length ? schedule[0]._cents : 0),
    nextPayment: live.length > 1
      ? { dueLabel: live[1].dueLabel, amount: live[1].amount, covers: live[1].covers }
      : null,
    manualFirstPayment: hasManual ? money_(manualCents) : null,
    periodAmount: money_(periodC),
    billingPeriodsLeft: futureBillings_(registeredOn).length,
    balanceAfterFirst: money_(Math.max(0, grandC - (schedule.length ? schedule[0]._cents : 0))),
    overpaid: hasManual && manualCents > grandC ? money_(manualCents - grandC) : 0,
    scheduledTotal: money_(schedC),
    reconciles: (schedC === grandC)
  };
}
/** Program week for a date (1..37), clamped. */
function weekForDate_(d) {
  const start = programStart_();
  const diff = Math.floor((d - start) / (7 * 86400000)) + 1;
  return Math.max(1, Math.min(CONFIG.TOTAL_WEEKS, diff));
}

/**
 * PUBLIC (admin/portal) — the school calendar as display rows.
 *
 * Returns teaching weeks and non-teaching blocks in order, each tagged with the
 * month it falls in so the portal can group them under month headings.
 */
function buildCalendar_() {
  const start = programStart_();
  const out = [];

  (CONFIG.CALENDAR || []).forEach(function (r) {
    if (r.break) {
      out.push({ type: 'break', name: r.break, label: r.label || '' });
      return;
    }
    const ws = weekStart_(start, r.week);
    const we = new Date(ws.getTime()); we.setDate(we.getDate() + 4);
    out.push({
      type: 'week',
      week: r.week,
      month: fmt_(ws, 'MMMM yyyy'),
      start: fmt_(ws, 'MMM d, yyyy'),
      end: fmt_(we, 'MMM d, yyyy'),
      mon: fmt_(ws, 'MMM d'),
      tue: fmt_(sessionDate_(start, r.week, 1), 'MMM d'),
      thu: fmt_(sessionDate_(start, r.week, 3), 'MMM d'),
      notes: r.notes || []
    });
  });

  return out;
}


/* ----------------------------------------------------------------------------
 * COURSES & CAPACITY
 * -------------------------------------------------------------------------- */

function courseByCode_(code) {
  return CONFIG.COURSES.filter(function (c) { return c.code === code; })[0] || null;
}

function enrolmentCounts_() {
  const counts = {};
  CONFIG.COURSES.forEach(function (c) { counts[c.code] = 0; });
  rows_(SHEETS.CHILDREN, K_HEADERS.length).forEach(function (r) {
    if (!r[K.ID - 1]) return;
    if (String(r[K.STATUS - 1] || '').toLowerCase() === 'withdrawn') return;
    const code = String(r[K.COURSE - 1] || '');
    if (counts[code] !== undefined) counts[code]++;
  });
  return counts;
}

/**
 * What the registration form is allowed to see. Parents are told whether a class
 * is open or full and nothing more — the head count and the remaining spots stay
 * on the dashboard. Stripping the fields here, rather than hiding them in the
 * page, means the numbers never reach a parent's browser at all.
 */
function publicCourses_() {
  return getCourses().map(function (c) {
    return { code: c.code, level: c.level, day: c.day, time: c.time,
             full: c.full, label: c.label };
  });
}

/** Course list with live availability. Dashboard use — carries the head count. */
function getCourses() {
  const counts = enrolmentCounts_();
  return CONFIG.COURSES.map(function (c) {
    const taken = counts[c.code] || 0;
    return {
      code: c.code, level: c.level, day: c.day, time: c.time,
      capacity: c.capacity, enrolled: taken,
      spotsLeft: Math.max(0, c.capacity - taken),
      full: taken >= c.capacity,
      label: 'Level ' + c.level + ' — ' + c.day + ' ' + c.time
    };
  });
}


/* ----------------------------------------------------------------------------
 * ACCESS CODE
 * -------------------------------------------------------------------------- */

const ACCESS_HELP =
  'Please use the access code that was sent to you in the registration e-mail ' +
  'after completing a student assessment.\n\n' +
  'If you have not booked a student assessment, please do so, as this is required ' +
  'prior to registering with Now Education Academy.\n\n' +
  'For any other concerns please e-mail us as ' + CONFIG.SUPPORT_EMAIL;

/** PUBLIC — check the registration access code. */
function checkAccessCode(code) {
  const cache = CacheService.getScriptCache();
  const key = 'ac_' + Session.getTemporaryActiveUserKey();
  const tries = Number(cache.get(key) || 0);

  if (tries >= CONFIG.MAX_LOGIN_ATTEMPTS) {
    throw new Error('Too many attempts. Please wait ' + CONFIG.LOCKOUT_MINUTES +
                    ' minutes.\n\n' + ACCESS_HELP);
  }

  const stored = PropertiesService.getScriptProperties().getProperty(PROP_ACCESS);
  if (!stored) throw new Error('Not set up yet. Run setup() from the Apps Script editor first.');

  if (String(code).trim() !== stored) {
    cache.put(key, String(tries + 1), CONFIG.LOCKOUT_MINUTES * 60);
    log_('public', 'ACCESS_CODE_FAILED', 'attempt ' + (tries + 1));
    throw new Error(ACCESS_HELP);
  }

  cache.remove(key);
  const token = Utilities.getUuid();
  cache.put('reg_' + token, 'valid', 60 * 60);
  return { ok: true, token: token, courses: publicCourses_(), grades: CONFIG.GRADES };
}

function requireRegToken_(t) {
  if (!t || !CacheService.getScriptCache().get('reg_' + String(t))) {
    throw new Error('Your session has expired. Please enter the access code again.');
  }
  return true;
}


/* ----------------------------------------------------------------------------
 * CREDENTIALS
 * -------------------------------------------------------------------------- */

function hash_(pw, salt) {
  const raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,
                                      salt + '|' + pw, Utilities.Charset.UTF_8);
  return raw.map(function (b) { return ('0' + (b & 0xFF).toString(16)).slice(-2); }).join('');
}

const PW_WORDS = ['Maple','Cedar','Willow','Aspen','Birch','Alder','Hazel','Laurel',
                  'Juniper','Spruce','Poplar','Sorrel'];

function makePassword_() {
  const w = PW_WORDS[Math.floor(Math.random() * PW_WORDS.length)];
  return w + '-' + String(Math.floor(Math.random() * 9000) + 1000);
}

function makeUsername_(lastName) {
  const base = String(lastName || 'family').toLowerCase().replace(/[^a-z]/g, '').slice(0, 12) || 'family';
  const taken = {};
  rows_(SHEETS.FAMILIES, F_HEADERS.length).forEach(function (r) {
    taken[String(r[F.USERNAME - 1] || '').toLowerCase()] = true;
  });
  let n = 1, candidate = base + String(Math.floor(Math.random() * 900) + 100);
  while (taken[candidate] && n < 60) {
    candidate = base + String(Math.floor(Math.random() * 9000) + 1000);
    n++;
  }
  return candidate;
}


/* ----------------------------------------------------------------------------
 * REGISTRATION SUBMISSION
 * -------------------------------------------------------------------------- */

/**
 * PUBLIC — create a family account plus one row per child.
 * A script lock makes it impossible for two submissions to overfill a course.
 */
function submitRegistration(token, form) {
  requireRegToken_(token);
  return createFamily_(form, { actor: 'parent' });
}

/**
 * Create a family account, its children and its portal login.
 *
 * Both the public registration form and the dashboard's own registration go
 * through here, deliberately: a family the Academy enters by hand must end up
 * indistinguishable from one that registered online — same validation, same
 * capacity check, same portal credentials, same welcome email.
 *
 * opts.actor     — 'parent' or an admin label, for the activity log
 * opts.enrollWeek— override the week (the dashboard may register retroactively)
 * opts.sendEmail — false to create the account without emailing the family
 */
function createFamily_(form, opts) {
  opts = opts || {};
  form = form || {};

  const p1 = form.parent1 || {}, p2 = form.parent2 || {};
  const kids = Array.isArray(form.children) ? form.children : [];

  const p1First = clean_(p1.first, 80), p1Last = clean_(p1.last, 80);
  const p1Email = clean_(p1.email, 160), p1Phone = clean_(p1.phone, 40);
  const p1Addr  = clean_(p1.address, 300);

  if (!p1First || !p1Last) throw new Error('Please enter Parent 1’s first and last name.');
  if (!isEmail_(p1Email)) throw new Error('Please enter a valid email address for Parent 1.');
  if (p1Phone.replace(/\D/g, '').length < 10) throw new Error('Please enter a valid phone number for Parent 1.');
  if (!p1Addr) throw new Error('Please enter Parent 1’s address.');
  if (!kids.length) throw new Error('Please add at least one child.');
  if (kids.length > 6) throw new Error('Please contact us directly to register more than six children.');

  const cleanKids = kids.map(function (c, i) {
    const first = clean_(c.first, 80), last = clean_(c.last, 80);
    const grade = clean_(c.grade, 40), course = clean_(c.course, 30);
    if (!first || !last) throw new Error('Please enter a first and last name for child ' + (i + 1) + '.');
    if (!grade) throw new Error('Please select a grade for ' + first + '.');
    if (!course) throw new Error('Please select a course for ' + first + '.');
    if (!courseByCode_(course)) throw new Error('Unknown course selected for ' + first + '.');
    return { first: first, last: last, grade: grade, course: course };
  });

  const lock = LockService.getScriptLock();
  try { lock.waitLock(25000); }
  catch (e) { throw new Error('The system is busy. Please try again in a moment.'); }

  try {
    // Re-check capacity inside the lock, counting this submission's own children
    const counts = enrolmentCounts_();
    const wanted = {};
    cleanKids.forEach(function (c) { wanted[c.course] = (wanted[c.course] || 0) + 1; });
    for (const code in wanted) {
      const course = courseByCode_(code);
      if ((counts[code] || 0) + wanted[code] > course.capacity) {
        // Deliberately no count here either — the parent only needs to know the
        // class can no longer take their child.
        throw new Error(code + ' (' + course.day + ' ' + course.time + ') has just ' +
                        'filled and can no longer take this registration. ' +
                        'Please choose another class.');
      }
    }

    const now = new Date();
    const familyId = 'NEA-F-' + fmt_(now, 'yyyyMMdd') + '-' +
                     String(Math.floor(Math.random() * 9000) + 1000);
    const username = makeUsername_(p1Last);
    const password = makePassword_();
    const salt = Utilities.getUuid();
    const enrollWeek = opts.enrollWeek
      ? Math.max(1, Math.min(FEES.TOTAL_WEEKS, Number(opts.enrollWeek)))
      : weekForDate_(now);

    const fRow = [];
    fRow[F.ID - 1] = familyId;
    fRow[F.CREATED - 1] = now;
    fRow[F.P1_FIRST - 1] = p1First;  fRow[F.P1_LAST - 1] = p1Last;
    fRow[F.P1_EMAIL - 1] = p1Email;  fRow[F.P1_PHONE - 1] = p1Phone;
    fRow[F.P1_ADDR - 1] = p1Addr;
    fRow[F.P2_FIRST - 1] = clean_(p2.first, 80);   fRow[F.P2_LAST - 1] = clean_(p2.last, 80);
    fRow[F.P2_EMAIL - 1] = clean_(p2.email, 160);  fRow[F.P2_PHONE - 1] = clean_(p2.phone, 40);
    fRow[F.P2_ADDR - 1] = clean_(p2.address, 300);
    fRow[F.USERNAME - 1] = username;
    fRow[F.INITIAL_PW - 1] = password;
    fRow[F.PW_HASH - 1] = hash_(password, salt);
    fRow[F.PW_SALT - 1] = salt;
    fRow[F.PW_CHANGED - 1] = 'No';
    fRow[F.ENROLL_WEEK - 1] = enrollWeek;
    fRow[F.STATUS - 1] = 'Active';
    fRow[F.NOTES - 1] = '';
    sheet_(SHEETS.FAMILIES).appendRow(fRow);

    const kSheet = sheet_(SHEETS.CHILDREN);
    cleanKids.forEach(function (c, i) {
      const kRow = [];
      kRow[K.ID - 1] = familyId + '-C' + (i + 1);
      kRow[K.FAMILY_ID - 1] = familyId;
      kRow[K.FIRST - 1] = c.first;   kRow[K.LAST - 1] = c.last;
      kRow[K.GRADE - 1] = c.grade;   kRow[K.COURSE - 1] = c.course;
      kRow[K.CREATED - 1] = now;     kRow[K.STATUS - 1] = 'Enrolled';
      kSheet.appendRow(kRow);
    });

    SpreadsheetApp.flush();
    log_(opts.actor === 'parent' ? p1Email : (opts.actor || 'admin'),
         opts.actor === 'parent' ? 'REGISTRATION_CREATED' : 'REGISTRATION_CREATED_BY_ADMIN',
         familyId + ' — ' + cleanKids.length + ' child(ren)');

    const quote = computeFamily_(enrollWeek, cleanKids.map(function (c) {
      return { name: c.first + ' ' + c.last, courseCode: c.course,
               weekday: courseByCode_(c.course).weekday };
    }), now);

    if (opts.sendEmail !== false) {
      try { sendWelcome_(p1First, p1Email, username, password, cleanKids); } catch (e) {}
    }
    if (opts.actor === 'parent') {
      try { notifyOwner_(p1First, p1Last, p1Email, p1Phone, cleanKids, quote); } catch (e) {}
    }

    return {
      ok: true,
      familyId: familyId,
      username: username,
      password: password,
      portalUrl: ScriptApp.getService().getUrl() + '?page=portal',
      // Lets the confirmation page start bank authorisation before the parent
      // has ever signed in. Valid for a few hours only.
      padToken: padSignupTokenFor_(familyId),
      padEnabled: stripeReady_(),
      children: cleanKids.map(function (c) {
        const co = courseByCode_(c.course);
        return { name: c.first + ' ' + c.last, grade: c.grade,
                 course: c.course, courseLabel: co.day + ' ' + co.time };
      })
      // No tuition figures are returned here: the confirmation page shows the
      // portal credentials only, and the portal is the single place a family
      // sees their account summary.
    };

  } finally { lock.releaseLock(); }
}


/* ----------------------------------------------------------------------------
 * EMAIL
 * -------------------------------------------------------------------------- */

function shell_(body) {
  return '<div style="font-family:Calibri,Segoe UI,Arial,sans-serif;max-width:620px;margin:0 auto;' +
    'border:1px solid #e6e6ea;border-radius:10px;overflow:hidden">' +
    '<div style="height:5px;background:linear-gradient(90deg,' + CONFIG.COLOR_TEAL + ' 0%,' +
      CONFIG.COLOR_GOLD + ' 50%,' + CONFIG.COLOR_MAGENTA + ' 100%)"></div>' +
    '<div style="background:' + CONFIG.COLOR_MAGENTA + ';padding:22px 26px">' +
      '<div style="color:#fff;font-size:20px;font-weight:700">' + CONFIG.ACADEMY_NAME.toUpperCase() + '</div>' +
      '<div style="color:' + CONFIG.COLOR_TEAL + ';font-size:13px;font-style:italic;margin-top:3px">' +
        CONFIG.TAGLINE + '</div>' +
    '</div>' +
    '<div style="padding:26px;color:#1a1a1a;font-size:15px;line-height:1.6">' + body + '</div>' +
    '<div style="background:#f6f6f8;padding:14px 26px;color:#6b6b73;font-size:12px">' +
      CONFIG.ACADEMY_NAME + ' &middot; ' + CONFIG.WEBSITE + '</div></div>';
}

function sendWelcome_(firstName, email, username, password, kids) {
  const portal = ScriptApp.getService().getUrl() + '?page=portal';
  let list = '<ul style="margin:8px 0 0;padding-left:20px">';
  kids.forEach(function (c) {
    const co = courseByCode_(c.course);
    list += '<li><strong>' + c.first + ' ' + c.last + '</strong> — ' + c.course +
            ' (Level ' + co.level + ', ' + co.day + ' ' + co.time + ')</li>';
  });
  list += '</ul>';

  const body =
    '<p>Hello ' + firstName + ',</p>' +
    '<p>Thank you for registering with ' + CONFIG.ACADEMY_NAME + '. Your registration is confirmed.</p>' +
    '<p><strong>Enrolled students</strong>' + list + '</p>' +
    '<div style="background:#e4f8f5;border:2px solid ' + CONFIG.COLOR_TEAL + ';border-radius:10px;' +
      'padding:18px;margin:20px 0">' +
      '<div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#6b6b73">' +
        'Your Parent Portal login</div>' +
      '<table style="margin-top:10px;font-size:15px">' +
        '<tr><td style="padding:3px 14px 3px 0;color:#6b6b73">Username</td>' +
        '<td style="font-weight:700">' + username + '</td></tr>' +
        '<tr><td style="padding:3px 14px 3px 0;color:#6b6b73">Password</td>' +
        '<td style="font-weight:700">' + password + '</td></tr>' +
      '</table>' +
      '<div style="margin-top:14px">' +
        '<a href="' + portal + '" style="display:inline-block;background:' + CONFIG.COLOR_MAGENTA +
        ';color:#fff;padding:11px 24px;border-radius:8px;text-decoration:none;font-weight:700">' +
        'Open the Parent Portal</a></div>' +
      '<div style="font-size:12.5px;color:#6b6b73;margin-top:10px">' +
        'Please change your password after signing in for the first time.</div>' +
    '</div>' +
    // No figures here on purpose: the Academy may set the initial payment by hand
    // after registration, so any amount quoted at this moment could be wrong.
    // The portal always shows the current account summary.
    '<p>Your tuition, payment schedule and account summary are in the Parent Portal ' +
    'under <strong>Account Summary</strong>.</p>' +
    '<p style="margin-top:22px">Warm regards,<br><strong>' + CONFIG.ACADEMY_NAME + '</strong></p>';

  MailApp.sendEmail({ to: email, name: CONFIG.ACADEMY_NAME,
    subject: 'Welcome to ' + CONFIG.ACADEMY_NAME + ' — your Parent Portal login',
    htmlBody: shell_(body) });
}

function notifyOwner_(first, last, email, phone, kids, quote) {
  const to = PropertiesService.getScriptProperties().getProperty(PROP_NOTIFY);
  if (!to) return;
  let list = '';
  kids.forEach(function (c) {
    const co = courseByCode_(c.course);
    list += '<li>' + c.first + ' ' + c.last + ' — ' + c.grade + ' — ' + c.course +
            ' (' + co.day + ' ' + co.time + ')</li>';
  });
  MailApp.sendEmail({ to: to, name: CONFIG.ACADEMY_NAME,
    subject: 'New registration — ' + first + ' ' + last + ' (' + kids.length + ' child' +
             (kids.length === 1 ? '' : 'ren') + ')',
    htmlBody: shell_('<p><strong>New family registration</strong></p>' +
      '<p>' + first + ' ' + last + '<br>' + email + '<br>' + phone + '</p>' +
      '<ul>' + list + '</ul>' +
      '<p>Year total: <strong>$' + quote.totals.grandTotal.toFixed(2) + '</strong><br>' +
      'First payment: <strong>$' + quote.firstPayment.toFixed(2) + '</strong></p>') });
}


/* ----------------------------------------------------------------------------
 * ADMIN AUTH
 * -------------------------------------------------------------------------- */

function adminAuth_(t) {
  if (!t || !CacheService.getScriptCache().get('adm_' + String(t))) {
    throw new Error('Your session has expired. Please sign in again.');
  }
  CacheService.getScriptCache().put('adm_' + String(t), 'valid', CONFIG.SESSION_MINUTES * 60);
  return true;
}

/** PUBLIC — admin sign in. */
function adminLogin(password) {
  const cache = CacheService.getScriptCache();
  const key = 'adm_try_' + Session.getTemporaryActiveUserKey();
  const tries = Number(cache.get(key) || 0);
  if (tries >= CONFIG.MAX_LOGIN_ATTEMPTS) {
    throw new Error('Too many failed attempts. Please wait ' + CONFIG.LOCKOUT_MINUTES + ' minutes.');
  }
  const stored = PropertiesService.getScriptProperties().getProperty(PROP_ADMIN_PW);
  if (!stored) throw new Error('Not set up yet. Run setup() from the Apps Script editor first.');
  if (String(password) !== stored) {
    cache.put(key, String(tries + 1), CONFIG.LOCKOUT_MINUTES * 60);
    log_('unknown', 'ADMIN_LOGIN_FAILED', 'attempt ' + (tries + 1));
    throw new Error('Incorrect password.');
  }
  cache.remove(key);
  const token = Utilities.getUuid();
  cache.put('adm_' + token, 'valid', CONFIG.SESSION_MINUTES * 60);
  log_('owner', 'ADMIN_LOGIN_OK', '');
  return { ok: true, token: token };
}

function adminSignOut(t) {
  if (t) CacheService.getScriptCache().remove('adm_' + String(t));
  return { ok: true };
}


/* ----------------------------------------------------------------------------
 * ADMIN DATA
 * -------------------------------------------------------------------------- */

/** Today at midnight, for comparing against due dates. */
function today_() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** { familyId: { paymentKey: 'MMM d, yyyy' } } for every payment received. */
function paidMap_() {
  const out = {};
  rows_(SHEETS.PAYMENTS, PY_HEADERS.length).forEach(function (r) {
    const fid = String(r[PY.FAMILY_ID - 1] || '');
    const key = String(r[PY.KEY - 1] || '');
    if (!fid || !key) return;
    if (!out[fid]) out[fid] = {};
    const on = r[PY.PAID_ON - 1];
    // Rows written before payment states existed are settled payments.
    const state = String(r[PY.STATE - 1] || 'paid');
    out[fid][key] = {
      state: state,
      on: on instanceof Date ? fmt_(on, 'MMM d, yyyy') : String(on || ''),
      detail: String(r[PY.DETAIL - 1] || ''),
      intent: String(r[PY.INTENT - 1] || '')
    };
  });
  return out;
}

/**
 * Mark each payment paid, overdue, due soon or scheduled.
 *
 * A payment is overdue only once its due date has actually passed — the
 * payment taken at registration counts as due the day the family registers.
 */
function annotateSchedule_(quote, paidForFamily) {
  const now = today_();
  const soon = new Date(now.getTime()); soon.setDate(soon.getDate() + 7);
  let paidCount = 0, overdueCount = 0, dueNowCount = 0;
  let outstandingCents = 0, overdueCents = 0, dueNowCents = 0;

  let processingCount = 0, cancelledCount = 0, cancelledCents = 0;

  quote.schedule.forEach(function (p) {
    const rec = paidForFamily ? paidForFamily[p.key] : null;
    const due = parseISO_(p.dueISO);
    let cents = Math.round(p.amount * 100);

    // A billing cancelled by a withdrawal is simply off the books: it is not
    // outstanding, it never goes overdue, and the daily Stripe run skips it
    // because only 'overdue' and 'due' payments are ever debited.
    if (p.cancelled && !(rec && (rec.state === 'paid' || rec.state === 'processing'))) {
      p.status = 'cancelled';
      p.statusLabel = 'Cancelled';
      cancelledCount++;
      cancelledCents += Math.round((p.originalAmount || 0) * 100);
      return;
    }
    // Cancelled but already collected — the money is real, so it still counts.
    if (p.cancelled && rec) cents = Math.round((p.originalAmount || p.amount) * 100);

    if (rec && rec.state === 'paid') {
      p.status = 'paid';
      p.statusLabel = 'Paid';
      p.paidOn = rec.on;
      paidCount++;
    } else if (rec && rec.state === 'processing') {
      // A pre-authorized debit is in flight. It takes about five business days
      // to settle, and until it does the money is neither here nor overdue.
      p.status = 'processing';
      p.statusLabel = 'Processing';
      p.paidOn = rec.on;
      processingCount++;
      outstandingCents += cents;
    } else if (rec && rec.state === 'failed') {
      p.status = 'failed';
      p.statusLabel = 'Payment failed';
      p.detail = rec.detail;
      overdueCount++;
      overdueCents += cents;
      outstandingCents += cents;
    } else if (due.getTime() < now.getTime()) {
      p.status = 'overdue';
      p.statusLabel = 'Overdue';
      overdueCount++;
      overdueCents += cents;
      outstandingCents += cents;
    } else if (due.getTime() <= soon.getTime()) {
      p.status = 'due';
      p.statusLabel = 'Due now';
      dueNowCount++;
      dueNowCents += cents;
      outstandingCents += cents;
    } else {
      p.status = 'scheduled';
      p.statusLabel = 'Scheduled';
      outstandingCents += cents;
    }
  });

  // A cancelled billing that was nevertheless collected has to be added back to
  // the year's total, or the books would show the family having overpaid.
  const recovered = quote.schedule.reduce(function (a, p) {
    return a + (p.cancelled && p.status !== 'cancelled'
      ? Math.round(((p.originalAmount || p.amount) - p.amount) * 100) : 0);
  }, 0);
  if (recovered > 0) {
    quote.totals.grandTotal = money_(Math.round(quote.totals.grandTotal * 100) + recovered);
  }

  quote.payments = {
    paid: paidCount,
    processing: processingCount,
    cancelled: cancelledCount,
    cancelledAmount: money_(cancelledCents),
    total: quote.schedule.length - cancelledCount,
    overdue: overdueCount,
    dueNow: dueNowCount,
    // A payment that is due now and still unpaid needs chasing just as much as
    // one already past its date, so both count towards "needs attention".
    needsAttention: overdueCount + dueNowCount,
    outstanding: money_(outstandingCents),
    overdueAmount: money_(overdueCents),
    dueNowAmount: money_(dueNowCents),
    actionAmount: money_(overdueCents + dueNowCents),
    collected: money_(Math.round(quote.totals.grandTotal * 100) - outstandingCents)
  };
  return quote;
}

function familiesWithChildren_() {
  const fRows = rows_(SHEETS.FAMILIES, F_HEADERS.length);
  const kRows = rows_(SHEETS.CHILDREN, K_HEADERS.length);
  const paid = paidMap_();

  const kidsBy = {};
  kRows.forEach(function (r) {
    if (!r[K.ID - 1]) return;
    const fid = String(r[K.FAMILY_ID - 1]);
    if (!kidsBy[fid]) kidsBy[fid] = [];
    const co = courseByCode_(String(r[K.COURSE - 1] || ''));
    const eff = r[K.WD_EFFECTIVE - 1];
    const effISO = eff instanceof Date ? fmt_(eff, 'yyyy-MM-dd') : clean_(eff, 12);
    const withdrawn = String(r[K.STATUS - 1] || '').toLowerCase() === 'withdrawn';
    const ownWeek = Number(r[K.WEEK - 1]) || 0;
    kidsBy[fid].push({
      id: String(r[K.ID - 1]),
      first: String(r[K.FIRST - 1] || ''), last: String(r[K.LAST - 1] || ''),
      name: String(r[K.FIRST - 1] || '') + ' ' + String(r[K.LAST - 1] || ''),
      grade: String(r[K.GRADE - 1] || ''),
      course: String(r[K.COURSE - 1] || ''),
      courseLabel: co ? ('Level ' + co.level + ' — ' + co.day + ' ' + co.time) : '',
      weekday: co ? co.weekday : 0,
      status: withdrawn ? 'Withdrawn' : 'Enrolled',
      withdrawn: withdrawn,
      // Only a genuinely withdrawn row drives billing. A stray date on an
      // enrolled student must never quietly cancel their payments.
      withdrawnEffective: withdrawn ? effISO : '',
      withdrawnLabel: withdrawn && effISO ? fmt_(parseISO_(effISO), 'MMM d, yyyy') : '',
      withdrawalReason: withdrawn ? clean_(r[K.WD_REASON - 1], 120) : '',
      withdrawalNote: withdrawn ? clean_(r[K.WD_NOTE - 1], 400) : '',
      withdrawalRecorded: r[K.WD_RECORDED - 1] instanceof Date
        ? fmt_(r[K.WD_RECORDED - 1], 'MMM d, yyyy') : '',
      ownWeek: ownWeek,
      addedOn: ownWeek ? fmt_(weekStart_(programStart_(), ownWeek), 'yyyy-MM-dd') : ''
    });
  });

  return fRows.filter(function (r) { return !!r[F.ID - 1]; }).map(function (r, i) {
    const fid = String(r[F.ID - 1]);
    const kids = kidsBy[fid] || [];
    const created = r[F.CREATED - 1] instanceof Date ? r[F.CREATED - 1] : new Date();
    const week = Number(r[F.ENROLL_WEEK - 1]) || 1;

    const rawFirst = r[F.FIRST_PAY - 1];
    const manualFirst = (rawFirst === '' || rawFirst === null || rawFirst === undefined ||
                         isNaN(Number(rawFirst))) ? null : Number(rawFirst);

    const quote = annotateSchedule_(computeFamily_(week, kids.map(function (c) {
      return { id: c.id, name: c.name, courseCode: c.course, weekday: c.weekday,
               week: c.ownWeek, addedOn: c.addedOn,
               withdrawnEffective: c.withdrawnEffective,
               withdrawalReason: c.withdrawalReason };
    }), created, manualFirst), paid[fid]);

    return {
      row: i + 2,
      id: fid,
      createdOn: fmt_(created, 'MMM d, yyyy'),
      p1: { first: String(r[F.P1_FIRST-1]||''), last: String(r[F.P1_LAST-1]||''),
            email: String(r[F.P1_EMAIL-1]||''), phone: String(r[F.P1_PHONE-1]||''),
            address: String(r[F.P1_ADDR-1]||'') },
      p2: { first: String(r[F.P2_FIRST-1]||''), last: String(r[F.P2_LAST-1]||''),
            email: String(r[F.P2_EMAIL-1]||''), phone: String(r[F.P2_PHONE-1]||''),
            address: String(r[F.P2_ADDR-1]||'') },
      pad: {
        status: String(r[F.PAD_STATUS-1]||'') || 'Not set up',
        setOn: r[F.PAD_SET_ON-1] instanceof Date ? fmt_(r[F.PAD_SET_ON-1], 'MMM d, yyyy') : '',
        hasMandate: !!String(r[F.PAD_METHOD-1]||'')
      },
      username: String(r[F.USERNAME-1]||''),
      initialPassword: String(r[F.INITIAL_PW-1]||''),
      passwordChanged: String(r[F.PW_CHANGED-1]||'No') === 'Yes',
      enrollWeek: week,
      manualFirstPayment: manualFirst,
      status: String(r[F.STATUS-1]||'Active'),
      notes: String(r[F.NOTES-1]||''),
      children: kids,
      quote: quote
    };
  });
}

/** PUBLIC — everything the dashboard needs. */
function adminGetData(token) {
  adminAuth_(token);
  const fams = familiesWithChildren_();

  let students = 0, revenueC = 0, collectedC = 0, actionC = 0, famAction = 0;
  fams.forEach(function (f) {
    students += f.children.filter(function (c) { return !c.withdrawn; }).length;
    revenueC += Math.round(f.quote.totals.grandTotal * 100);
    collectedC += Math.round(f.quote.payments.collected * 100);
    actionC += Math.round(f.quote.payments.actionAmount * 100);
    if (f.quote.payments.needsAttention > 0) famAction++;
  });

  const wd = withdrawalReport_(fams);

  return {
    ok: true,
    families: fams,
    courses: getCourses(),
    totalWeeks: CONFIG.TOTAL_WEEKS,
    currentWeek: weekForDate_(new Date()),
    withdrawalReasons: CONFIG.WITHDRAWAL_REASONS,
    grades: CONFIG.GRADES,
    withdrawalReport: wd,
    stripeReady: stripeReady_(),
    stripeLive: stripeLive_(),
    stats: {
      families: fams.length,
      students: students,
      withdrawn: wd.count,
      withdrawalRate: wd.rate,
      revenue: money_(revenueC),
      collected: money_(collectedC),
      outstanding: money_(revenueC - collectedC),
      overdue: money_(actionC),
      familiesOverdue: famAction
    }
  };
}

/** PUBLIC — detail for one course: who is in it and how many spots remain. */
function adminCourseDetail(token, code) {
  adminAuth_(token);
  const course = courseByCode_(code);
  if (!course) throw new Error('Unknown course.');

  const fams = familiesWithChildren_();
  const enrolled = [];
  fams.forEach(function (f) {
    f.children.forEach(function (c) {
      if (c.course === code) {
        enrolled.push({
          childName: c.name, grade: c.grade,
          parent: f.p1.first + ' ' + f.p1.last,
          email: f.p1.email, phone: f.p1.phone,
          familyId: f.id, enrollWeek: f.enrollWeek
        });
      }
    });
  });

  return {
    ok: true,
    course: {
      code: course.code, level: course.level, day: course.day, time: course.time,
      capacity: course.capacity, enrolled: enrolled.length,
      spotsLeft: Math.max(0, course.capacity - enrolled.length),
      full: enrolled.length >= course.capacity
    },
    students: enrolled
  };
}

/** PUBLIC — change a family's enrolment week; tuition recalculates. */
function adminSetWeek(token, familyId, week) {
  adminAuth_(token);
  const w = Math.max(1, Math.min(CONFIG.TOTAL_WEEKS, Number(week) || 1));
  const row = findFamilyRow_(familyId);
  if (row < 0) throw new Error('Family not found.');
  sheet_(SHEETS.FAMILIES).getRange(row, F.ENROLL_WEEK).setValue(w);
  SpreadsheetApp.flush();
  log_('owner', 'ENROLL_WEEK_SET', familyId + ' -> week ' + w);
  return { ok: true, week: w };
}

/**
 * PUBLIC — set the initial payment for a family by hand.
 *
 * Pass a dollar amount to switch that family onto the manual schedule: the
 * amount entered is collected at registration and every payment after it is a
 * flat monthly instalment on the 30th until the balance is cleared. Pass an
 * empty string to clear the override and go back to the automatic calculation.
 */
function adminSetFirstPayment(token, familyId, amount) {
  adminAuth_(token);
  const row = findFamilyRow_(familyId);
  if (row < 0) throw new Error('Family not found.');

  const raw = String(amount == null ? '' : amount).replace(/[$,\s]/g, '');
  let value = '';
  if (raw !== '') {
    const n = Number(raw);
    if (isNaN(n) || n < 0) throw new Error('Enter a dollar amount, for example 305.00');
    if (n > 20000) throw new Error('That amount looks too large. Please check it.');
    value = Math.round(n * 100) / 100;
  }

  sheet_(SHEETS.FAMILIES).getRange(row, F.FIRST_PAY).setValue(value);
  SpreadsheetApp.flush();
  log_('owner', 'FIRST_PAYMENT_SET', familyId + ' -> ' + (value === '' ? 'auto' : '$' + value));
  return { ok: true, amount: value === '' ? null : value };
}

/** PUBLIC — issue a fresh portal password and show it once. */
function adminResetPassword(token, familyId) {
  adminAuth_(token);
  const row = findFamilyRow_(familyId);
  if (row < 0) throw new Error('Family not found.');

  const pw = makePassword_();
  const salt = Utilities.getUuid();
  const sh = sheet_(SHEETS.FAMILIES);
  sh.getRange(row, F.INITIAL_PW).setValue(pw);
  sh.getRange(row, F.PW_HASH).setValue(hash_(pw, salt));
  sh.getRange(row, F.PW_SALT).setValue(salt);
  sh.getRange(row, F.PW_CHANGED).setValue('No');
  SpreadsheetApp.flush();
  log_('owner', 'PORTAL_PASSWORD_RESET', familyId);
  return { ok: true, password: pw };
}

/**
 * PUBLIC — record or undo a payment.
 *
 * Only received payments are stored. Removing one puts the payment back to
 * outstanding, where its due date decides whether it reads as overdue.
 */
function adminSetPaid(token, familyId, key, paid, dueISO, amount) {
  adminAuth_(token);
  if (findFamilyRow_(familyId) < 0) throw new Error('Family not found.');
  if (!key) throw new Error('Missing payment reference.');

  const sh = sheet_(SHEETS.PAYMENTS);
  const last = sh.getLastRow();
  const data = last > 1 ? sh.getRange(2, 1, last - 1, PY_HEADERS.length).getValues() : [];

  // Clear any existing record for this payment, so marking twice cannot double up
  for (let i = data.length - 1; i >= 0; i--) {
    if (String(data[i][PY.FAMILY_ID - 1]) === String(familyId) &&
        String(data[i][PY.KEY - 1]) === String(key)) {
      sh.deleteRow(i + 2);
    }
  }

  if (paid) {
    const row = [];
    row[PY.FAMILY_ID - 1] = String(familyId);
    row[PY.KEY - 1] = String(key);
    row[PY.DUE - 1] = dueISO ? parseISO_(dueISO) : '';
    row[PY.AMOUNT - 1] = Number(amount) || 0;
    row[PY.PAID_ON - 1] = new Date();
    row[PY.MARKED_BY - 1] = 'Dashboard';
    row[PY.STATE - 1] = 'paid';
    sh.appendRow(row);
  }

  SpreadsheetApp.flush();
  log_('owner', paid ? 'PAYMENT_RECEIVED' : 'PAYMENT_UNMARKED',
       familyId + ' — ' + key + (amount ? ' ($' + Number(amount).toFixed(2) + ')' : ''));
  return { ok: true, paid: !!paid,
           paidOn: paid ? fmt_(new Date(), 'MMM d, yyyy') : null };
}

/** PUBLIC — save a private note on a family. */
function adminSaveNote(token, familyId, note) {
  adminAuth_(token);
  const row = findFamilyRow_(familyId);
  if (row < 0) throw new Error('Family not found.');
  sheet_(SHEETS.FAMILIES).getRange(row, F.NOTES).setValue(clean_(note, 2000));
  SpreadsheetApp.flush();
  return { ok: true };
}

function adminSpreadsheetUrl(token) {
  adminAuth_(token);
  return { ok: true, url: ss_().getUrl() };
}

function findFamilyRow_(familyId) {
  const sh = sheet_(SHEETS.FAMILIES);
  const last = sh.getLastRow();
  if (last < 2) return -1;
  const ids = sh.getRange(2, F.ID, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(familyId)) return i + 2;
  return -1;
}

function findChildRow_(childId) {
  const sh = sheet_(SHEETS.CHILDREN);
  const last = sh.getLastRow();
  if (last < 2) return -1;
  const ids = sh.getRange(2, K.ID, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(childId)) return i + 2;
  return -1;
}


/* ----------------------------------------------------------------------------
 * WITHDRAWALS
 * -------------------------------------------------------------------------- */

/**
 * PUBLIC — withdraw a student from their class.
 *
 * The student keeps their record, their homework and their place in the
 * family's history; what changes is that they stop counting towards the class
 * size and their share comes off every billing date from the next period on.
 * Nothing already paid is touched, and nothing is refunded automatically —
 * that is a decision for the Academy under the refund policy.
 */
function adminWithdrawStudent(token, childId, effectiveISO, reason, note) {
  adminAuth_(token);

  const row = findChildRow_(childId);
  if (row < 0) throw new Error('Student not found.');

  const eff = clean_(effectiveISO, 12);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(eff)) {
    throw new Error('Please choose the date the withdrawal takes effect.');
  }
  const effDate = parseISO_(eff);
  if (isNaN(effDate.getTime())) throw new Error('That withdrawal date is not valid.');

  const why = clean_(reason, 120);
  if (!why) throw new Error('Please choose a reason for the withdrawal.');
  const extra = clean_(note, 400);
  if (why === 'Other' && !extra) {
    throw new Error('Please describe the reason in the notes when choosing “Other”.');
  }

  const sh = sheet_(SHEETS.CHILDREN);
  const name = String(sh.getRange(row, K.FIRST).getValue() || '') + ' ' +
               String(sh.getRange(row, K.LAST).getValue() || '');
  sh.getRange(row, K.STATUS).setValue('Withdrawn');
  sh.getRange(row, K.WD_EFFECTIVE).setValue(eff);
  sh.getRange(row, K.WD_REASON).setValue(why);
  sh.getRange(row, K.WD_NOTE).setValue(extra);
  sh.getRange(row, K.WD_RECORDED).setValue(new Date());
  sh.getRange(row, K.WD_BY).setValue('Dashboard');
  SpreadsheetApp.flush();

  log_('admin', 'STUDENT_WITHDRAWN',
       childId + ' (' + name.trim() + ') effective ' + eff + ' — ' + why +
       (extra ? ' — ' + extra : ''));

  return { ok: true, name: name.trim(), effective: fmt_(effDate, 'MMM d, yyyy') };
}

/** PUBLIC — undo a withdrawal, putting the student back in their class. */
function adminReinstateStudent(token, childId) {
  adminAuth_(token);

  const row = findChildRow_(childId);
  if (row < 0) throw new Error('Student not found.');

  const sh = sheet_(SHEETS.CHILDREN);
  const code = String(sh.getRange(row, K.COURSE).getValue() || '');
  const course = courseByCode_(code);
  // The class may have been filled by someone else in the meantime.
  if (course && (enrolmentCounts_()[code] || 0) >= course.capacity) {
    throw new Error(code + ' (' + course.day + ' ' + course.time + ') is now full. ' +
                    'Move this student to another class before reinstating them.');
  }

  const name = String(sh.getRange(row, K.FIRST).getValue() || '') + ' ' +
               String(sh.getRange(row, K.LAST).getValue() || '');
  sh.getRange(row, K.STATUS).setValue('Enrolled');
  sh.getRange(row, K.WD_EFFECTIVE).setValue('');
  sh.getRange(row, K.WD_REASON).setValue('');
  sh.getRange(row, K.WD_NOTE).setValue('');
  sh.getRange(row, K.WD_RECORDED).setValue('');
  sh.getRange(row, K.WD_BY).setValue('');
  SpreadsheetApp.flush();

  log_('admin', 'STUDENT_REINSTATED', childId + ' (' + name.trim() + ')');
  return { ok: true, name: name.trim() };
}

/**
 * Every withdrawal, with the numbers behind the rate.
 *
 * The rate is withdrawals as a share of everyone who has ever been enrolled —
 * withdrawn students included — because a rate measured against those who
 * stayed would fall as students left, which is exactly backwards.
 */
function withdrawalReport_(fams) {
  const list = [];
  let enrolled = 0;

  fams.forEach(function (f) {
    f.children.forEach(function (c) {
      if (!c.withdrawn) { enrolled++; return; }
      list.push({
        childId: c.id, name: c.name, grade: c.grade,
        course: c.course, courseLabel: c.courseLabel,
        familyId: f.id, family: f.p1.first + ' ' + f.p1.last,
        email: f.p1.email, phone: f.p1.phone,
        effective: c.withdrawnLabel, effectiveISO: c.withdrawnEffective,
        reason: c.withdrawalReason || 'Not recorded',
        note: c.withdrawalNote, recorded: c.withdrawalRecorded,
        weeksAttended: c.withdrawnEffective
          ? Math.max(0, weekForDate_(parseISO_(c.withdrawnEffective)) - f.enrollWeek)
          : 0
      });
    });
  });

  list.sort(function (a, b) {
    return String(b.effectiveISO).localeCompare(String(a.effectiveISO));
  });

  const byReason = {};
  list.forEach(function (w) { byReason[w.reason] = (byReason[w.reason] || 0) + 1; });
  const reasons = Object.keys(byReason).map(function (r) {
    return { reason: r, count: byReason[r],
             share: Math.round(byReason[r] / list.length * 1000) / 10 };
  }).sort(function (a, b) { return b.count - a.count; });

  const byCourse = {};
  list.forEach(function (w) { byCourse[w.course] = (byCourse[w.course] || 0) + 1; });

  const everEnrolled = enrolled + list.length;
  return {
    withdrawals: list,
    reasons: reasons,
    byCourse: byCourse,
    stillEnrolled: enrolled,
    everEnrolled: everEnrolled,
    count: list.length,
    rate: everEnrolled ? Math.round(list.length / everEnrolled * 1000) / 10 : 0
  };
}


/* ----------------------------------------------------------------------------
 * BACK-END REGISTRATION
 * -------------------------------------------------------------------------- */

/**
 * PUBLIC — register a family from the dashboard.
 *
 * Takes exactly what the public form takes, and returns the portal username and
 * password so the Academy can hand them over on the spot.
 */
function adminCreateFamily(token, form) {
  adminAuth_(token);
  form = form || {};
  const res = createFamily_(form, {
    actor: 'admin',
    enrollWeek: form.enrollWeek,
    sendEmail: form.sendEmail !== false
  });
  return {
    ok: true,
    familyId: res.familyId,
    username: res.username,
    password: res.password,
    emailed: form.sendEmail !== false,
    children: res.children
  };
}

/**
 * PUBLIC — add a student to a family that already has an account.
 *
 * A student joining part-way through the year is billed on the same terms as a
 * family registering that day: tuition prorated from the week they start, their
 * share added to the billing dates still ahead, and the difference plus their
 * registration fee collected as a one-off charge.
 */
function adminAddStudent(token, familyId, child) {
  adminAuth_(token);
  child = child || {};

  const famRow = findFamilyRow_(familyId);
  if (famRow < 0) throw new Error('Family not found.');

  const first = clean_(child.first, 80), last = clean_(child.last, 80);
  const grade = clean_(child.grade, 40), course = clean_(child.course, 30);
  if (!first || !last) throw new Error('Please enter the student’s first and last name.');
  if (!grade) throw new Error('Please select a grade.');
  const co = courseByCode_(course);
  if (!co) throw new Error('Please select a class.');

  const lock = LockService.getScriptLock();
  try { lock.waitLock(25000); }
  catch (e) { throw new Error('The system is busy. Please try again in a moment.'); }

  try {
    if ((enrolmentCounts_()[course] || 0) >= co.capacity) {
      throw new Error(course + ' (' + co.day + ' ' + co.time + ') is full.');
    }

    const now = new Date();
    const famWeek = Number(sheet_(SHEETS.FAMILIES)
                      .getRange(famRow, F.ENROLL_WEEK).getValue()) || 1;
    // Blank means "starts with the family". Anything later is the student's own
    // start week, which is what stops them paying for weeks already gone.
    let week = Number(child.week) || weekForDate_(now);
    week = Math.max(1, Math.min(FEES.TOTAL_WEEKS, week));
    const ownWeek = (week > famWeek) ? week : '';

    const sh = sheet_(SHEETS.CHILDREN);
    const existing = rows_(SHEETS.CHILDREN, K_HEADERS.length).filter(function (r) {
      return String(r[K.FAMILY_ID - 1]) === String(familyId);
    });
    let next = existing.length + 1;
    existing.forEach(function (r) {
      const m = String(r[K.ID - 1]).match(/-C(\d+)$/);
      if (m && Number(m[1]) >= next) next = Number(m[1]) + 1;
    });
    const childId = familyId + '-C' + next;

    const kRow = [];
    kRow[K.ID - 1] = childId;
    kRow[K.FAMILY_ID - 1] = familyId;
    kRow[K.FIRST - 1] = first;  kRow[K.LAST - 1] = last;
    kRow[K.GRADE - 1] = grade;  kRow[K.COURSE - 1] = course;
    kRow[K.CREATED - 1] = now;  kRow[K.STATUS - 1] = 'Enrolled';
    kRow[K.WEEK - 1] = ownWeek;
    sh.appendRow(kRow);
    SpreadsheetApp.flush();

    log_('admin', 'STUDENT_ADDED',
         childId + ' (' + first + ' ' + last + ') → ' + course +
         (ownWeek ? ' from week ' + ownWeek : ''));

    return { ok: true, childId: childId, name: first + ' ' + last,
             course: course, courseLabel: co.day + ' ' + co.time,
             startWeek: ownWeek || famWeek };
  } finally { lock.releaseLock(); }
}

/** PUBLIC — what the dashboard's registration and add-student forms need. */
function adminFormOptions(token) {
  adminAuth_(token);
  return {
    ok: true,
    courses: getCourses(),
    reasons: CONFIG.WITHDRAWAL_REASONS,
    currentWeek: weekForDate_(new Date()),
    totalWeeks: FEES.TOTAL_WEEKS
  };
}


/* ----------------------------------------------------------------------------
 * TEACHER PORTAL
 *
 * A teacher is not the owner of this script, so they cannot open a file in the
 * owner's Drive by following a link. The only way for the two sides to see each
 * other's work is for the file itself to carry link access, which is what
 * shareableUrl_ grants — on the one file, at the moment it is first needed.
 * A Drive id is 33 unguessable characters and the link is only ever shown to a
 * signed-in teacher or the student's own parent, but it is a link, and anyone
 * given it could open the file. Set CONFIG.LINK_SHARING to false to turn this
 * off; submissions then cannot be opened from the teacher portal at all.
 * -------------------------------------------------------------------------- */

function shareableUrl_(fileId) {
  if (!fileId) return '';
  let file;
  try { file = DriveApp.getFileById(String(fileId)); }
  catch (e) { return ''; }
  if (CONFIG.LINK_SHARING !== false) {
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (e) { /* a shared drive may forbid it; the link still works for staff */ }
  }
  return file.getUrl();
}

function teacherAuth_(t) {
  const v = t ? CacheService.getScriptCache().get('tea_' + String(t)) : null;
  if (!v) throw new Error('Your session has expired. Please sign in again.');
  CacheService.getScriptCache().put('tea_' + String(t), v, 5400);
  return v;
}

/** PUBLIC — teacher sign in. */
function teacherLogin(password) {
  const stored = PropertiesService.getScriptProperties().getProperty(PROP_TEACHER)
                 || 'Ar12122018!';
  Utilities.sleep(350);                       // a small brake on guessing
  if (String(password || '') !== stored) {
    log_('teacher', 'TEACHER_LOGIN_FAILED', '');
    throw new Error('That password is not correct.');
  }
  const token = Utilities.getUuid();
  CacheService.getScriptCache().put('tea_' + token, 'teacher', 5400);
  log_('teacher', 'TEACHER_LOGIN', '');
  return { ok: true, token: token, totalWeeks: CONFIG.TOTAL_WEEKS,
           academy: CONFIG.ACADEMY_NAME };
}

function teacherSignOut(t) {
  if (t) CacheService.getScriptCache().remove('tea_' + String(t));
  return { ok: true };
}

/** Every actively enrolled student, flattened, with their parent's details. */
/**
 * Every actively enrolled student, flattened, with their parent's details.
 *
 * Deliberately NOT built on familiesWithChildren_. That function computes the
 * whole billing engine for every family on the books — proration, payment
 * schedules, withdrawal credits, paid/overdue state — and the teacher portal
 * shows none of it. Every teacher click was paying for the Academy's entire
 * year of accounting to fetch a list of names and parent emails, which is what
 * made posting an announcement feel like a hang.
 *
 * Two sheet reads, no arithmetic.
 */
function activeRoster_() {
  const fams = {};
  rows_(SHEETS.FAMILIES, F_HEADERS.length).forEach(function (r) {
    const id = String(r[F.ID - 1] || '');
    if (!id) return;
    fams[id] = {
      parentName: (String(r[F.P1_FIRST - 1] || '') + ' ' +
                   String(r[F.P1_LAST - 1] || '')).trim(),
      email: String(r[F.P1_EMAIL - 1] || ''),
      phone: String(r[F.P1_PHONE - 1] || ''),
      week: Number(r[F.ENROLL_WEEK - 1]) || 1
    };
  });

  const out = [];
  rows_(SHEETS.CHILDREN, K_HEADERS.length).forEach(function (r) {
    if (!r[K.ID - 1]) return;
    if (String(r[K.STATUS - 1] || '').toLowerCase() === 'withdrawn') return;
    const fam = fams[String(r[K.FAMILY_ID - 1] || '')];
    if (!fam) return;                       // an orphaned child row

    const code = String(r[K.COURSE - 1] || '');
    const co = courseByCode_(code);
    const first = String(r[K.FIRST - 1] || ''), last = String(r[K.LAST - 1] || '');
    out.push({
      childId: String(r[K.ID - 1]),
      name: (first + ' ' + last).trim(), first: first, last: last,
      grade: String(r[K.GRADE - 1] || ''),
      course: code,
      courseLabel: co ? ('Level ' + co.level + ' — ' + co.day + ' ' + co.time) : '',
      familyId: String(r[K.FAMILY_ID - 1]),
      enrollWeek: Number(r[K.WEEK - 1]) || fam.week,
      parentName: fam.parentName, parentEmail: fam.email, parentPhone: fam.phone
    });
  });
  return out;
}

/**
 * PUBLIC — the classes a teacher can open.
 *
 * Only courses that actually have students in them: an empty class is not
 * something to click into, and a withdrawn student is not in a class.
 */
function teacherGetCourses(token) {
  teacherAuth_(token);
  const roster = activeRoster_();
  const att = attendanceMap_();
  const marks = markingCounts_();

  const byCode = {};
  roster.forEach(function (s) {
    if (!byCode[s.course]) byCode[s.course] = [];
    byCode[s.course].push(s);
  });

  const courses = [];
  CONFIG.COURSES.forEach(function (c) {
    const students = byCode[c.code] || [];
    if (!students.length) return;                 // nothing to teach, nothing to show

    // Which weeks have attendance taken for this class: a week counts once
    // every student in it has a mark, so a half-finished week still shows.
    let complete = 0, lastWeek = 0;
    for (let w = 1; w <= CONFIG.TOTAL_WEEKS; w++) {
      const taken = students.filter(function (s) {
        return (att[s.childId] || {})[w];
      }).length;
      if (taken === students.length) { complete++; lastWeek = Math.max(lastWeek, w); }
    }

    let submitted = 0, marked = 0;
    students.forEach(function (s) {
      submitted += (marks.submitted[s.childId] || 0);
      marked    += (marks.marked[s.childId] || 0);
    });

    courses.push({
      code: c.code, level: c.level, day: c.day, time: c.time,
      label: 'Level ' + c.level + ' — ' + c.day + ' ' + c.time,
      students: students.length,
      attendanceWeeks: complete, lastAttendanceWeek: lastWeek,
      submissions: submitted, marked: marked, awaitingMarking: submitted - marked
    });
  });

  // No calendar here: the teacher pages never draw one, and building it on
  // every call is work nobody sees.
  return { ok: true, courses: courses, totalWeeks: CONFIG.TOTAL_WEEKS };
}

/** { childId: { week: 'P' | 'A' | 'L' } } */
function attendanceMap_() {
  const out = {};
  rows_(SHEETS.ATTENDANCE, AT_HEADERS.length).forEach(function (r) {
    const id = String(r[AT.CHILD_ID - 1] || '');
    if (!id) return;
    const w = Number(r[AT.WEEK - 1]) || 0;
    const st = String(r[AT.STATUS - 1] || '').toUpperCase();
    if (!w || !ATTENDANCE_CODES[st]) return;
    if (!out[id]) out[id] = {};
    out[id][w] = st;
  });
  return out;
}

function markingCounts_() {
  const submitted = {}, marked = {};
  rows_(SHEETS.HOMEWORK, H_HEADERS.length).forEach(function (r) {
    if (!r[H.ID - 1]) return;
    const id = String(r[H.CHILD_ID - 1] || '');
    submitted[id] = (submitted[id] || 0) + 1;
    if (r[H.MARKED_ON - 1]) marked[id] = (marked[id] || 0) + 1;
  });
  return { submitted: submitted, marked: marked };
}

/** Every homework row for a set of students, keyed childId → week. */
function submissionsFor_(childIds) {
  const want = {};
  childIds.forEach(function (id) { want[id] = true; });
  const out = {};
  rows_(SHEETS.HOMEWORK, H_HEADERS.length).forEach(function (r) {
    if (!r[H.ID - 1]) return;
    const cid = String(r[H.CHILD_ID - 1] || '');
    if (!want[cid]) return;
    const w = Number(r[H.WEEK - 1]) || 0;
    if (!out[cid]) out[cid] = {};
    out[cid][w] = {
      id: String(r[H.ID - 1]),
      week: w,
      fileName: String(r[H.FILE_NAME - 1] || ''),
      size: Number(r[H.SIZE - 1]) || 0,
      uploadedOn: r[H.UPLOADED - 1] instanceof Date
        ? fmt_(r[H.UPLOADED - 1], 'MMM d, yyyy') : '',
      markedFileName: String(r[H.MARK_FILE_NAME - 1] || ''),
      hasMarkedFile: !!String(r[H.MARK_FILE_ID - 1] || ''),
      comments: String(r[H.COMMENTS - 1] || ''),
      markedOn: r[H.MARKED_ON - 1] instanceof Date
        ? fmt_(r[H.MARKED_ON - 1], 'MMM d, yyyy') : '',
      marked: !!r[H.MARKED_ON - 1]
    };
  });
  return out;
}

/** PUBLIC — one class: its students, their attendance and every submission. */
function teacherGetCourse(token, code) {
  teacherAuth_(token);
  const course = courseByCode_(code);
  if (!course) throw new Error('Unknown class.');

  const students = activeRoster_().filter(function (s) { return s.course === code; });
  students.sort(function (a, b) { return a.name.localeCompare(b.name); });

  const att = attendanceMap_();
  const subs = submissionsFor_(students.map(function (s) { return s.childId; }));
  const assignments = assignmentsFor_(code);
  const marks = marksFor_(assignments.map(function (a) { return a.id; }));

  return {
    ok: true,
    course: { code: course.code, level: course.level, day: course.day, time: course.time,
              label: 'Level ' + course.level + ' — ' + course.day + ' ' + course.time,
              capacity: course.capacity },
    students: students.map(function (s) {
      return { childId: s.childId, name: s.name, first: s.first, schoolGrade: s.grade,
               familyId: s.familyId, enrollWeek: s.enrollWeek,
               parentName: s.parentName, parentEmail: s.parentEmail,
               parentPhone: s.parentPhone,
               attendance: att[s.childId] || {},
               submissions: subs[s.childId] || {} };
    }),
    // The class's assignments and every mark against them. Sent together so the
    // gradebook is drawn from one consistent snapshot.
    assignments: assignments,
    marks: marks,
    announcements: announcementsFor_(code),
    totalWeeks: CONFIG.TOTAL_WEEKS,
    currentWeek: weekForDate_(new Date())
  };
}

/**
 * PUBLIC — record attendance for one class in one week.
 *
 * The whole week goes in a single call. Marking ten students one request at a
 * time would mean ten round trips for something a teacher does in ten seconds.
 * A blank status clears the mark rather than storing an empty one, so "not
 * taken" stays distinguishable from "taken, nobody flagged".
 */
function teacherSaveAttendance(token, code, week, marks) {
  teacherAuth_(token);
  const course = courseByCode_(code);
  if (!course) throw new Error('Unknown class.');
  // Checked before clamping, on purpose: clamping first would quietly turn a
  // missing week into week 1 and file a whole class's attendance in the wrong place.
  const w = Number(week);
  if (!w || w < 1 || w > CONFIG.TOTAL_WEEKS || w !== Math.floor(w)) {
    throw new Error('Choose a week between 1 and ' + CONFIG.TOTAL_WEEKS + '.');
  }

  const roster = {};
  activeRoster_().forEach(function (s) {
    if (s.course === code) roster[s.childId] = s;
  });

  const lock = LockService.getScriptLock();
  try { lock.waitLock(20000); }
  catch (e) { throw new Error('The system is busy. Please try again in a moment.'); }

  try {
    const sh = sheet_(SHEETS.ATTENDANCE);
    const last = sh.getLastRow();
    const data = last > 1 ? sh.getRange(2, 1, last - 1, AT_HEADERS.length).getValues() : [];

    // Where this class-week already lives, so a re-save overwrites rather than
    // piling a second mark on top of the first.
    const at = {};
    data.forEach(function (r, i) {
      if (Number(r[AT.WEEK - 1]) !== w) return;
      at[String(r[AT.CHILD_ID - 1] || '')] = i + 2;
    });

    const now = new Date();
    const fresh = [];
    let saved = 0, cleared = 0;

    (marks || []).forEach(function (m) {
      const cid = String(m.childId || '');
      const s = roster[cid];
      if (!s) return;                                  // not in this class
      const st = String(m.status || '').toUpperCase();
      if (st && !ATTENDANCE_CODES[st]) return;         // only P, A or L

      const row = at[cid];
      if (row) {
        if (st) {
          sh.getRange(row, AT.STATUS).setValue(st);
          sh.getRange(row, AT.RECORDED).setValue(now);
          sh.getRange(row, AT.BY).setValue('Teacher portal');
          saved++;
        } else {
          sh.getRange(row, AT.STATUS).setValue('');
          cleared++;
        }
        return;
      }
      if (!st) return;                                 // nothing to store
      const r = [];
      r[AT.CHILD_ID - 1] = cid;
      r[AT.FAMILY_ID - 1] = s.familyId;
      r[AT.COURSE - 1] = code;
      r[AT.WEEK - 1] = w;
      r[AT.STATUS - 1] = st;
      r[AT.RECORDED - 1] = now;
      r[AT.BY - 1] = 'Teacher portal';
      fresh.push(r);
      saved++;
    });

    if (fresh.length) {
      sh.getRange(sh.getLastRow() + 1, 1, fresh.length, AT_HEADERS.length)
        .setValues(fresh.map(function (r) {
          const p = [];
          for (let i = 0; i < AT_HEADERS.length; i++) p[i] = r[i] === undefined ? '' : r[i];
          return p;
        }));
    }
    SpreadsheetApp.flush();

    log_('teacher', 'ATTENDANCE_SAVED', code + ' week ' + w + ' — ' + saved + ' marked' +
         (cleared ? ', ' + cleared + ' cleared' : ''));
    return { ok: true, week: w, saved: saved, cleared: cleared };
  } finally { lock.releaseLock(); }
}

/**
 * The assignments recorded against one upload.
 *
 * Anything unreadable comes back as an empty list rather than throwing: a
 * corrupted cell must never take a teacher's whole class list down with it.
 */
/* ---- assignments: named once for a class in a week, marked per student ---- */

/** Every assignment set for a class, in week then creation order. */
function assignmentsFor_(code) {
  const out = [];
  rows_(SHEETS.ASSIGNMENTS, AS_HEADERS.length).forEach(function (r) {
    if (!r[AS.ID - 1]) return;
    if (String(r[AS.COURSE - 1]) !== String(code)) return;
    out.push({
      id: String(r[AS.ID - 1]),
      week: Number(r[AS.WEEK - 1]) || 0,
      name: clean_(r[AS.NAME - 1], 120),
      sort: Number(r[AS.SORT - 1]) || 0
    });
  });
  out.sort(function (a, b) { return (a.week - b.week) || (a.sort - b.sort); });
  return out;
}

/** { assignmentId: { childId: 'mark' } } for the assignments given. */
function marksFor_(assignmentIds) {
  const want = {};
  (assignmentIds || []).forEach(function (id) { want[id] = true; });
  const out = {};
  rows_(SHEETS.MARKS, MK_HEADERS.length).forEach(function (r) {
    const aid = String(r[MK.ASSIGNMENT_ID - 1] || '');
    if (!aid || !want[aid]) return;
    const cid = String(r[MK.CHILD_ID - 1] || '');
    if (!cid) return;
    const mark = clean_(r[MK.MARK - 1], 40);
    if (!mark) return;                       // a blank cell is no mark at all
    if (!out[aid]) out[aid] = {};
    out[aid][cid] = mark;
  });
  return out;
}

function findAssignmentRow_(id) {
  const sh = sheet_(SHEETS.ASSIGNMENTS);
  const last = sh.getLastRow();
  if (last < 2) return -1;
  const ids = sh.getRange(2, AS.ID, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return -1;
}

function assignmentById_(id) {
  const row = findAssignmentRow_(id);
  if (row < 0) return null;
  const sh = sheet_(SHEETS.ASSIGNMENTS);
  const r = sh.getRange(row, 1, 1, AS_HEADERS.length).getValues()[0];
  return { row: row, id: String(r[AS.ID - 1]), course: String(r[AS.COURSE - 1]),
           week: Number(r[AS.WEEK - 1]) || 0, name: clean_(r[AS.NAME - 1], 120) };
}

/**
 * Carry forward anything entered before assignments became class-level.
 *
 * Grades used to be typed against one student's file, so the same assignment
 * could exist under three slightly different spellings. Each distinct name in a
 * week becomes one class assignment, and every student's old grade becomes a
 * mark against it. Runs from setup(), and is safe to run again: it clears the
 * old cells as it goes, so a second pass finds nothing to do.
 */
function migrateAssignments_() {
  const sh = sheet_(SHEETS.HOMEWORK);
  const last = sh.getLastRow();
  if (last < 2) return 0;

  const data = sh.getRange(2, 1, last - 1, H_HEADERS.length).getValues();
  const pending = [];
  data.forEach(function (r, i) {
    const cell = r[H.LEGACY_ASSIGNMENTS - 1];
    if (!cell) return;
    let list;
    try { list = JSON.parse(String(cell)); } catch (e) { list = null; }
    if (!Array.isArray(list) || !list.length) return;
    pending.push({ row: i + 2, childId: String(r[H.CHILD_ID - 1] || ''),
                   week: Number(r[H.WEEK - 1]) || 0, list: list });
  });
  if (!pending.length) return 0;

  // which class each of those students is in
  const courseOf = {};
  rows_(SHEETS.CHILDREN, K_HEADERS.length).forEach(function (r) {
    if (r[K.ID - 1]) courseOf[String(r[K.ID - 1])] = String(r[K.COURSE - 1] || '');
  });

  const aSheet = sheet_(SHEETS.ASSIGNMENTS);
  const mSheet = sheet_(SHEETS.MARKS);
  const existing = {};
  rows_(SHEETS.ASSIGNMENTS, AS_HEADERS.length).forEach(function (r) {
    if (!r[AS.ID - 1]) return;
    existing[String(r[AS.COURSE - 1]) + '|' + Number(r[AS.WEEK - 1]) + '|' +
             clean_(r[AS.NAME - 1], 120).toLowerCase()] = String(r[AS.ID - 1]);
  });

  const now = new Date();
  const newAssignments = [], newMarks = [];
  let order = 0, moved = 0;

  pending.forEach(function (p) {
    const course = courseOf[p.childId];
    if (!course || !p.week) return;
    p.list.forEach(function (a) {
      const name = clean_(a && a.name, 120);
      if (!name) return;
      const key = course + '|' + p.week + '|' + name.toLowerCase();
      let id = existing[key];
      if (!id) {
        id = 'AS-' + Utilities.getUuid().slice(0, 8);
        existing[key] = id;
        const row = [];
        row[AS.ID - 1] = id;        row[AS.COURSE - 1] = course;
        row[AS.WEEK - 1] = p.week;  row[AS.NAME - 1] = name;
        row[AS.SORT - 1] = ++order; row[AS.CREATED - 1] = now;
        row[AS.BY - 1] = 'Migrated';
        newAssignments.push(padRow_(row, AS_HEADERS.length));
      }
      const mark = clean_(a && a.grade, 40);
      if (!mark) return;
      const m = [];
      m[MK.ASSIGNMENT_ID - 1] = id;  m[MK.CHILD_ID - 1] = p.childId;
      m[MK.MARK - 1] = mark;         m[MK.RECORDED - 1] = now;
      m[MK.BY - 1] = 'Migrated';
      newMarks.push(padRow_(m, MK_HEADERS.length));
      moved++;
    });
    sh.getRange(p.row, H.LEGACY_ASSIGNMENTS).setValue('');
    sh.getRange(p.row, H.LEGACY_GRADES).setValue('');
  });

  if (newAssignments.length) {
    aSheet.getRange(aSheet.getLastRow() + 1, 1, newAssignments.length, AS_HEADERS.length)
          .setValues(newAssignments);
  }
  if (newMarks.length) {
    mSheet.getRange(mSheet.getLastRow() + 1, 1, newMarks.length, MK_HEADERS.length)
          .setValues(newMarks);
  }
  SpreadsheetApp.flush();
  log_('system', 'ASSIGNMENTS_MIGRATED',
       newAssignments.length + ' assignment(s), ' + moved + ' mark(s)');
  return moved;
}

/** Fill a sparse row out to `width`, so setValues never sees an undefined. */
function padRow_(row, width) {
  const out = [];
  for (let i = 0; i < width; i++) out[i] = (row[i] === undefined) ? '' : row[i];
  return out;
}

function findHomeworkRow_(uploadId) {
  const sh = sheet_(SHEETS.HOMEWORK);
  const last = sh.getLastRow();
  if (last < 2) return -1;
  const ids = sh.getRange(2, H.ID, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(uploadId)) return i + 2;
  return -1;
}

/** PUBLIC — open a student's submission, or the marked copy of it. */
function teacherOpenFile(token, uploadId, which) {
  teacherAuth_(token);
  const row = findHomeworkRow_(uploadId);
  if (row < 0) throw new Error('That submission no longer exists.');
  const sh = sheet_(SHEETS.HOMEWORK);
  const col = (which === 'marked') ? H.MARK_FILE_ID : H.FILE_ID;
  const id = String(sh.getRange(row, col).getValue() || '');
  if (!id) throw new Error('There is no file to open.');
  const url = shareableUrl_(id);
  if (!url) throw new Error('That file could not be found in Drive.');
  return { ok: true, url: url };
}

/**
 * PUBLIC — save the teacher's comments on one student's submission, and mark it.
 *
 * Marks are not here. An assignment belongs to the class, so it is named once
 * in the Gradebook and marked per student there; this is only the feedback on
 * the file that one student handed in.
 */
function teacherSaveMark(token, uploadId, comments) {
  teacherAuth_(token);
  const row = findHomeworkRow_(uploadId);
  if (row < 0) throw new Error('That submission no longer exists.');

  const text = clean_(comments, 4000);
  const sh = sheet_(SHEETS.HOMEWORK);
  sh.getRange(row, H.COMMENTS).setValue(text);
  sh.getRange(row, H.MARKED_ON).setValue(new Date());
  sh.getRange(row, H.MARKED_BY).setValue('Teacher portal');
  SpreadsheetApp.flush();

  log_('teacher', 'SUBMISSION_MARKED', uploadId + (text ? ' — comments saved' : ''));
  return { ok: true, markedOn: fmt_(new Date(), 'MMM d, yyyy') };
}


/* ---- the gradebook ---- */

/**
 * PUBLIC — name an assignment for a class in a given week.
 *
 * Set once, it applies to every student in that class; the marks go in
 * afterwards, one per student.
 */
function teacherAddAssignment(token, code, week, name) {
  teacherAuth_(token);
  const course = courseByCode_(code);
  if (!course) throw new Error('Unknown class.');

  const w = Number(week);
  if (!w || w < 1 || w > CONFIG.TOTAL_WEEKS || w !== Math.floor(w)) {
    throw new Error('Choose a week between 1 and ' + CONFIG.TOTAL_WEEKS + '.');
  }
  const title = clean_(name, 120);
  if (!title) throw new Error('Give the assignment a name.');

  const lock = LockService.getScriptLock();
  try { lock.waitLock(20000); }
  catch (e) { throw new Error('The system is busy. Please try again in a moment.'); }

  try {
    const mine = assignmentsFor_(code).filter(function (a) { return a.week === w; });
    if (mine.length >= MAX_ASSIGNMENTS) {
      throw new Error(MAX_ASSIGNMENTS + ' assignments is the most for one week.');
    }
    const clash = mine.filter(function (a) {
      return a.name.toLowerCase() === title.toLowerCase();
    })[0];
    // Two columns with the same name in one week would be impossible to tell
    // apart in the gradebook.
    if (clash) throw new Error('Week ' + w + ' already has an assignment called "' +
                               clash.name + '".');

    const id = 'AS-' + Utilities.getUuid().slice(0, 8);
    const sort = mine.length ? Math.max.apply(null, mine.map(function (a) {
      return a.sort; })) + 1 : 1;

    const row = [];
    row[AS.ID - 1] = id;       row[AS.COURSE - 1] = code;
    row[AS.WEEK - 1] = w;      row[AS.NAME - 1] = title;
    row[AS.SORT - 1] = sort;   row[AS.CREATED - 1] = new Date();
    row[AS.BY - 1] = 'Teacher portal';
    sheet_(SHEETS.ASSIGNMENTS).appendRow(padRow_(row, AS_HEADERS.length));
    SpreadsheetApp.flush();

    log_('teacher', 'ASSIGNMENT_ADDED', code + ' week ' + w + ' — ' + title);
    return { ok: true, id: id, week: w, name: title };
  } finally { lock.releaseLock(); }
}

/** PUBLIC — rename an assignment. Every student's mark stays attached to it. */
function teacherRenameAssignment(token, id, name) {
  teacherAuth_(token);
  const a = assignmentById_(id);
  if (!a) throw new Error('That assignment no longer exists.');

  const title = clean_(name, 120);
  if (!title) throw new Error('Give the assignment a name.');

  const clash = assignmentsFor_(a.course).filter(function (x) {
    return x.week === a.week && x.id !== a.id &&
           x.name.toLowerCase() === title.toLowerCase();
  })[0];
  if (clash) throw new Error('Week ' + a.week + ' already has an assignment called "' +
                             clash.name + '".');

  sheet_(SHEETS.ASSIGNMENTS).getRange(a.row, AS.NAME).setValue(title);
  SpreadsheetApp.flush();
  log_('teacher', 'ASSIGNMENT_RENAMED', id + ' — ' + a.name + ' → ' + title);
  return { ok: true, id: id, name: title };
}

/** PUBLIC — remove an assignment, and every mark recorded against it. */
function teacherDeleteAssignment(token, id) {
  teacherAuth_(token);
  const a = assignmentById_(id);
  if (!a) throw new Error('That assignment no longer exists.');

  const lock = LockService.getScriptLock();
  try { lock.waitLock(20000); }
  catch (e) { throw new Error('The system is busy. Please try again in a moment.'); }

  try {
    const mSheet = sheet_(SHEETS.MARKS);
    const last = mSheet.getLastRow();
    let removed = 0;
    if (last > 1) {
      const data = mSheet.getRange(2, 1, last - 1, MK_HEADERS.length).getValues();
      // backwards, so deleting a row never shifts one still to be checked
      for (let i = data.length - 1; i >= 0; i--) {
        if (String(data[i][MK.ASSIGNMENT_ID - 1]) !== String(id)) continue;
        mSheet.deleteRow(i + 2);
        removed++;
      }
    }
    sheet_(SHEETS.ASSIGNMENTS).deleteRow(a.row);
    SpreadsheetApp.flush();

    log_('teacher', 'ASSIGNMENT_DELETED', id + ' (' + a.name + ') — ' +
         removed + ' mark(s) removed');
    return { ok: true, removed: removed, name: a.name };
  } finally { lock.releaseLock(); }
}

/* ---- class announcements ---- */

/** Every announcement posted for a class, newest week first. */
function announcementsFor_(code) {
  const out = [];
  rows_(SHEETS.ANNOUNCEMENTS, AN_HEADERS.length).forEach(function (r) {
    if (!r[AN.ID - 1]) return;
    if (String(r[AN.COURSE - 1]) !== String(code)) return;
    const msg = clean_(r[AN.MESSAGE - 1], MAX_ANNOUNCEMENT);
    if (!msg) return;                    // a cleared announcement is no announcement
    out.push({
      id: String(r[AN.ID - 1]),
      week: Number(r[AN.WEEK - 1]) || 0,
      message: msg,
      postedOn: r[AN.POSTED - 1] instanceof Date
        ? fmt_(r[AN.POSTED - 1], 'MMM d, yyyy') : ''
    });
  });
  out.sort(function (a, b) { return b.week - a.week; });
  return out;
}

function findAnnouncementRow_(code, week) {
  const sh = sheet_(SHEETS.ANNOUNCEMENTS);
  const last = sh.getLastRow();
  if (last < 2) return -1;
  const data = sh.getRange(2, 1, last - 1, AN_HEADERS.length).getValues();
  for (let i = 0; i < data.length; i++) {
    if (String(data[i][AN.COURSE - 1]) === String(code) &&
        Number(data[i][AN.WEEK - 1]) === Number(week)) return i + 2;
  }
  return -1;
}

/**
 * PUBLIC — post a class announcement for one week.
 *
 * It reaches every family with a student in that class, and only them. Posting
 * again for the same week replaces what was there; clearing the box takes the
 * announcement down, because a parent portal showing a stale notice is worse
 * than one showing none.
 */
function teacherSaveAnnouncement(token, code, week, message) {
  teacherAuth_(token);
  const course = courseByCode_(code);
  if (!course) throw new Error('Unknown class.');

  const w = Number(week);
  if (!w || w < 1 || w > CONFIG.TOTAL_WEEKS || w !== Math.floor(w)) {
    throw new Error('Choose a week between 1 and ' + CONFIG.TOTAL_WEEKS + '.');
  }
  const text = clean_(message, MAX_ANNOUNCEMENT);

  const lock = LockService.getScriptLock();
  try { lock.waitLock(20000); }
  catch (e) { throw new Error('The system is busy. Please try again in a moment.'); }

  try {
    const sh = sheet_(SHEETS.ANNOUNCEMENTS);
    const row = findAnnouncementRow_(code, w);

    if (!text) {
      if (row > 0) {
        sh.deleteRow(row);
        SpreadsheetApp.flush();
        log_('teacher', 'ANNOUNCEMENT_REMOVED', code + ' week ' + w);
        return { ok: true, week: w, message: '', removed: true };
      }
      return { ok: true, week: w, message: '', removed: false };
    }

    const now = new Date();
    if (row > 0) {
      sh.getRange(row, AN.MESSAGE).setValue(text);
      sh.getRange(row, AN.POSTED).setValue(now);
      sh.getRange(row, AN.BY).setValue('Teacher portal');
    } else {
      const r = [];
      r[AN.ID - 1] = 'AN-' + Utilities.getUuid().slice(0, 8);
      r[AN.COURSE - 1] = code;   r[AN.WEEK - 1] = w;
      r[AN.MESSAGE - 1] = text;  r[AN.POSTED - 1] = now;
      r[AN.BY - 1] = 'Teacher portal';
      sh.appendRow(padRow_(r, AN_HEADERS.length));
    }
    SpreadsheetApp.flush();

    log_('teacher', 'ANNOUNCEMENT_POSTED', code + ' week ' + w + ' — ' +
         text.slice(0, 80));
    return { ok: true, week: w, message: text,
             postedOn: fmt_(now, 'MMM d, yyyy'), removed: false };
  } finally { lock.releaseLock(); }
}

/**
 * PUBLIC — record the class's marks for one week.
 *
 * The whole week goes in a single call, for the same reason attendance does: a
 * teacher entering ten marks should not wait through ten round trips. A blank
 * mark clears the row rather than storing an empty one, so "not marked" stays
 * distinguishable from a mark of nothing.
 */
function teacherSaveMarks(token, code, week, marks) {
  teacherAuth_(token);
  const course = courseByCode_(code);
  if (!course) throw new Error('Unknown class.');

  const w = Number(week);
  if (!w || w < 1 || w > CONFIG.TOTAL_WEEKS || w !== Math.floor(w)) {
    throw new Error('Choose a week between 1 and ' + CONFIG.TOTAL_WEEKS + '.');
  }

  // only this class's assignments for this week, and only its students
  const mine = {};
  assignmentsFor_(code).forEach(function (a) { if (a.week === w) mine[a.id] = true; });
  const roster = {};
  activeRoster_().forEach(function (s) { if (s.course === code) roster[s.childId] = true; });

  const lock = LockService.getScriptLock();
  try { lock.waitLock(20000); }
  catch (e) { throw new Error('The system is busy. Please try again in a moment.'); }

  try {
    const sh = sheet_(SHEETS.MARKS);
    const last = sh.getLastRow();
    const data = last > 1 ? sh.getRange(2, 1, last - 1, MK_HEADERS.length).getValues() : [];

    // where each existing mark lives, so a re-save overwrites instead of stacking
    const at = {};
    data.forEach(function (r, i) {
      at[String(r[MK.ASSIGNMENT_ID - 1]) + '|' + String(r[MK.CHILD_ID - 1])] = i + 2;
    });

    const now = new Date();
    const fresh = [];
    const drop = [];
    let saved = 0, cleared = 0;

    (marks || []).forEach(function (m) {
      const aid = String(m.assignmentId || '');
      const cid = String(m.childId || '');
      if (!mine[aid] || !roster[cid]) return;          // not this class's to set
      const mark = clean_(m.mark, 40);
      const row = at[aid + '|' + cid];

      if (row) {
        if (mark) {
          sh.getRange(row, MK.MARK).setValue(mark);
          sh.getRange(row, MK.RECORDED).setValue(now);
          sh.getRange(row, MK.BY).setValue('Teacher portal');
          saved++;
        } else {
          drop.push(row);
          cleared++;
        }
        return;
      }
      if (!mark) return;
      const r = [];
      r[MK.ASSIGNMENT_ID - 1] = aid;  r[MK.CHILD_ID - 1] = cid;
      r[MK.MARK - 1] = mark;          r[MK.RECORDED - 1] = now;
      r[MK.BY - 1] = 'Teacher portal';
      fresh.push(padRow_(r, MK_HEADERS.length));
      saved++;
    });

    // cleared marks are deleted last and from the bottom up, so the row numbers
    // collected above stay valid while the edits above are being written
    drop.sort(function (a, b) { return b - a; })
        .forEach(function (row) { sh.deleteRow(row); });

    if (fresh.length) {
      sh.getRange(sh.getLastRow() + 1, 1, fresh.length, MK_HEADERS.length)
        .setValues(fresh);
    }
    SpreadsheetApp.flush();

    log_('teacher', 'MARKS_SAVED', code + ' week ' + w + ' — ' + saved + ' saved' +
         (cleared ? ', ' + cleared + ' cleared' : ''));
    return { ok: true, week: w, saved: saved, cleared: cleared };
  } finally { lock.releaseLock(); }
}

/** PUBLIC — take the marking back off a submission. */
function teacherUnmark(token, uploadId) {
  teacherAuth_(token);
  const row = findHomeworkRow_(uploadId);
  if (row < 0) throw new Error('That submission no longer exists.');
  const sh = sheet_(SHEETS.HOMEWORK);
  sh.getRange(row, H.MARKED_ON).setValue('');
  sh.getRange(row, H.MARKED_BY).setValue('');
  SpreadsheetApp.flush();
  log_('teacher', 'SUBMISSION_UNMARKED', uploadId);
  return { ok: true };
}

/**
 * PUBLIC — upload the marked-up copy of a submission.
 *
 * It lands beside the student's own file in their folder, named so the two are
 * never confused with each other in Drive.
 */
function teacherUploadMarked(token, uploadId, fileName, mimeType, base64) {
  teacherAuth_(token);
  const row = findHomeworkRow_(uploadId);
  if (row < 0) throw new Error('That submission no longer exists.');

  const bytes = Utilities.base64Decode(base64);
  const maxBytes = CONFIG.MAX_UPLOAD_MB * 1024 * 1024;
  if (bytes.length > maxBytes) {
    throw new Error('That file is larger than ' + CONFIG.MAX_UPLOAD_MB + ' MB.');
  }

  const sh = sheet_(SHEETS.HOMEWORK);
  const familyId = String(sh.getRange(row, H.FAMILY_ID).getValue() || '');
  const childId  = String(sh.getRange(row, H.CHILD_ID).getValue() || '');
  const week     = Number(sh.getRange(row, H.WEEK).getValue()) || 0;

  // Replace whatever marked copy was there before, so a folder never fills up
  // with three versions of the same marked worksheet.
  const old = String(sh.getRange(row, H.MARK_FILE_ID).getValue() || '');
  if (old) { try { DriveApp.getFileById(old).setTrashed(true); } catch (e) {} }

  const safeName = clean_(fileName, 140).replace(/[\\/:*?"<>|]/g, '-') || 'marked';
  const blob = Utilities.newBlob(bytes, mimeType || 'application/octet-stream',
                                 'Week ' + week + ' - MARKED - ' + safeName);
  const file = childFolder_(familyId, childId).createFile(blob);

  sh.getRange(row, H.MARK_FILE_ID).setValue(file.getId());
  sh.getRange(row, H.MARK_FILE_NAME).setValue(safeName);
  sh.getRange(row, H.MARKED_ON).setValue(new Date());
  sh.getRange(row, H.MARKED_BY).setValue('Teacher portal');
  SpreadsheetApp.flush();

  log_('teacher', 'MARKED_FILE_UPLOADED', uploadId + ' — ' + safeName);
  return { ok: true, fileName: safeName, markedOn: fmt_(new Date(), 'MMM d, yyyy') };
}

/** PUBLIC — remove the marked copy, leaving any comments in place. */
function teacherRemoveMarked(token, uploadId) {
  teacherAuth_(token);
  const row = findHomeworkRow_(uploadId);
  if (row < 0) throw new Error('That submission no longer exists.');
  const sh = sheet_(SHEETS.HOMEWORK);
  const id = String(sh.getRange(row, H.MARK_FILE_ID).getValue() || '');
  if (id) { try { DriveApp.getFileById(id).setTrashed(true); } catch (e) {} }
  sh.getRange(row, H.MARK_FILE_ID).setValue('');
  sh.getRange(row, H.MARK_FILE_NAME).setValue('');
  SpreadsheetApp.flush();
  log_('teacher', 'MARKED_FILE_REMOVED', uploadId);
  return { ok: true };
}


/* ---- email ---- */

function teacherMailShell_(heading, bodyHtml, footNote) {
  return shell_(
    '<h2 style="margin:0 0 12px;font-size:19px;color:' + CONFIG.COLOR_MAGENTA + '">' +
      esc_(heading) + '</h2>' + bodyHtml +
    '<p style="margin:22px 0 0;font-size:12.5px;color:#6E6E7A;border-top:1px solid #EAEAEF;' +
      'padding-top:12px">' + (footNote || '') +
      'Replies to this message come straight to ' + esc_(CONFIG.SUPPORT_EMAIL) + '.</p>');
}

function esc_(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Turn a teacher's plain typing into paragraphs, without letting HTML through. */
function teacherBodyHtml_(text) {
  return String(text).split(/\n{2,}/).map(function (p) {
    return '<p style="margin:0 0 12px;font-size:14.5px;line-height:1.6">' +
           esc_(p).replace(/\n/g, '<br>') + '</p>';
  }).join('');
}

/** PUBLIC — email one student's parent. */
function teacherEmailParent(token, childId, subject, body) {
  teacherAuth_(token);

  const student = activeRoster_().filter(function (s) {
    return s.childId === String(childId);
  })[0];
  if (!student) throw new Error('That student is not currently enrolled.');
  if (!isEmail_(student.parentEmail)) {
    throw new Error('No valid email address is on file for ' + student.name + '\'s parent.');
  }

  const subj = clean_(subject, 180);
  const text = clean_(body, 8000);
  if (!subj) throw new Error('Please enter a subject.');
  if (!text) throw new Error('Please write a message.');

  MailApp.sendEmail({
    to: student.parentEmail,
    replyTo: CONFIG.SUPPORT_EMAIL,
    subject: subj,
    htmlBody: teacherMailShell_('About ' + student.first,
      teacherBodyHtml_(text),
      'Sent about <strong>' + esc_(student.name) + '</strong> — ' +
      esc_(student.courseLabel) + '. ')
  });

  log_('teacher', 'PARENT_EMAILED', childId + ' → ' + student.parentEmail + ' — ' + subj);
  return { ok: true, to: student.parentEmail, name: student.name };
}

/**
 * PUBLIC — email every parent in a class.
 *
 * One message per family, not one to everybody: a parent should never be shown
 * the other families' email addresses. Two children in the same class share a
 * parent address, so it is sent once.
 */
function teacherEmailClass(token, code, subject, body) {
  teacherAuth_(token);
  const course = courseByCode_(code);
  if (!course) throw new Error('Unknown class.');

  const subj = clean_(subject, 180);
  const text = clean_(body, 8000);
  if (!subj) throw new Error('Please enter a subject.');
  if (!text) throw new Error('Please write a message.');

  const students = activeRoster_().filter(function (s) { return s.course === code; });
  if (!students.length) throw new Error('There are no students in that class.');

  const seen = {}, sent = [], skipped = [];
  students.forEach(function (s) {
    if (!isEmail_(s.parentEmail)) { skipped.push(s.name); return; }
    const key = s.parentEmail.toLowerCase();
    if (seen[key]) return;
    seen[key] = true;

    try {
      MailApp.sendEmail({
        to: s.parentEmail,
        replyTo: CONFIG.SUPPORT_EMAIL,
        subject: subj,
        htmlBody: teacherMailShell_(course.day + ' ' + course.time + ' class',
          teacherBodyHtml_(text),
          'Sent to every family in <strong>' + esc_(code) + '</strong> — ' +
          esc_(course.day) + ' ' + esc_(course.time) + '. ')
      });
      sent.push(s.parentEmail);
    } catch (e) { skipped.push(s.name); }
  });

  log_('teacher', 'CLASS_EMAILED', code + ' — ' + sent.length + ' sent' +
       (skipped.length ? ', ' + skipped.length + ' skipped' : ''));
  return { ok: true, sent: sent.length, skipped: skipped };
}


/* ----------------------------------------------------------------------------
 * PARENT PORTAL
 * -------------------------------------------------------------------------- */

function portalAuth_(t) {
  const v = t ? CacheService.getScriptCache().get('por_' + String(t)) : null;
  if (!v) throw new Error('Your session has expired. Please sign in again.');
  CacheService.getScriptCache().put('por_' + String(t), v, CONFIG.SESSION_MINUTES * 60);
  return v;   // familyId
}

/** PUBLIC — parent sign in. */
function portalLogin(username, password) {
  const cache = CacheService.getScriptCache();
  const key = 'por_try_' + Session.getTemporaryActiveUserKey();
  const tries = Number(cache.get(key) || 0);
  if (tries >= CONFIG.MAX_LOGIN_ATTEMPTS) {
    throw new Error('Too many failed attempts. Please wait ' + CONFIG.LOCKOUT_MINUTES + ' minutes.');
  }

  const u = String(username || '').trim().toLowerCase();
  const sh = sheet_(SHEETS.FAMILIES);
  const last = sh.getLastRow();
  if (last < 2) throw new Error('Incorrect username or password.');

  const data = sh.getRange(2, 1, last - 1, F_HEADERS.length).getValues();
  for (let i = 0; i < data.length; i++) {
    if (String(data[i][F.USERNAME - 1] || '').toLowerCase() !== u) continue;
    const salt = String(data[i][F.PW_SALT - 1] || '');
    const want = String(data[i][F.PW_HASH - 1] || '');
    if (hash_(String(password), salt) === want) {
      cache.remove(key);
      const token = Utilities.getUuid();
      cache.put('por_' + token, String(data[i][F.ID - 1]), CONFIG.SESSION_MINUTES * 60);
      log_(u, 'PORTAL_LOGIN_OK', String(data[i][F.ID - 1]));
      return { ok: true, token: token,
               mustChange: String(data[i][F.PW_CHANGED - 1] || 'No') !== 'Yes' };
    }
    break;
  }

  cache.put(key, String(tries + 1), CONFIG.LOCKOUT_MINUTES * 60);
  log_(u, 'PORTAL_LOGIN_FAILED', 'attempt ' + (tries + 1));
  throw new Error('Incorrect username or password.');
}

function portalSignOut(t) {
  if (t) CacheService.getScriptCache().remove('por_' + String(t));
  return { ok: true };
}

/** PUBLIC — everything the portal shows for the signed-in family. */
function portalGetData(token) {
  const familyId = portalAuth_(token);
  const fam = familiesWithChildren_().filter(function (f) { return f.id === familyId; })[0];
  if (!fam) throw new Error('Account not found. Please contact the Academy.');

  const uploads = {};
  rows_(SHEETS.HOMEWORK, H_HEADERS.length).forEach(function (r) {
    if (!r[H.ID - 1]) return;
    if (String(r[H.FAMILY_ID - 1]) !== familyId) return;
    const cid = String(r[H.CHILD_ID - 1]);
    if (!uploads[cid]) uploads[cid] = {};
    const markedFile = String(r[H.MARK_FILE_ID - 1] || '');
    uploads[cid][Number(r[H.WEEK - 1])] = {
      id: String(r[H.ID - 1]),
      fileName: String(r[H.FILE_NAME - 1] || ''),
      size: Number(r[H.SIZE - 1]) || 0,
      uploadedOn: r[H.UPLOADED - 1] instanceof Date ? fmt_(r[H.UPLOADED - 1], 'MMM d, yyyy') : '',
      // The teacher's marking. Only ever present once they have marked it.
      marked: !!r[H.MARKED_ON - 1],
      markedOn: r[H.MARKED_ON - 1] instanceof Date
        ? fmt_(r[H.MARKED_ON - 1], 'MMM d, yyyy') : '',
      comments: r[H.MARKED_ON - 1] ? String(r[H.COMMENTS - 1] || '') : '',
      // The link itself is fetched only when the parent clicks, so opening the
      // portal does not mean a Drive call for every week of every child.
      markedFileName: markedFile ? String(r[H.MARK_FILE_NAME - 1] || '') : ''
    };
  });

  return {
    ok: true,
    family: {
      id: fam.id, username: fam.username,
      parentName: fam.p1.first + ' ' + fam.p1.last,
      email: fam.p1.email,
      enrollWeek: fam.enrollWeek,
      // The Academy's own withdrawal note is staff-facing and is not sent to
      // the parent's browser. Everything else about the student is theirs.
      children: fam.children.map(function (c) {
        const copy = {};
        Object.keys(c).forEach(function (k) {
          if (k !== 'withdrawalNote') copy[k] = c[k];
        });
        return copy;
      }),
      quote: fam.quote
    },
    uploads: uploads,
    // Each child's marks, by week: the assignments their class was set, and what
    // they scored. Only the classes this family is in are looked up, and only
    // this family's marks are sent.
    grades: childGrades_(fam.children),
    // Announcements for the classes this family's children are in, keyed by
    // child so the portal can show each one against the right student.
    announcements: childAnnouncements_(fam.children),
    calendar: buildCalendar_(),
    pad: fam.pad,
    stripeReady: stripeReady_(),
    refundPolicy: CONFIG.REFUND_POLICY,
    totalWeeks: CONFIG.TOTAL_WEEKS,
    maxUploadMb: CONFIG.MAX_UPLOAD_MB
  };
}

/** PUBLIC — change the portal password. */
function portalChangePassword(token, current, next) {
  const familyId = portalAuth_(token);
  if (!next || String(next).length < 8) {
    throw new Error('Your new password must be at least 8 characters.');
  }
  const row = findFamilyRow_(familyId);
  if (row < 0) throw new Error('Account not found.');

  const sh = sheet_(SHEETS.FAMILIES);
  const salt = String(sh.getRange(row, F.PW_SALT).getValue() || '');
  const want = String(sh.getRange(row, F.PW_HASH).getValue() || '');
  if (hash_(String(current), salt) !== want) throw new Error('Your current password is incorrect.');

  const newSalt = Utilities.getUuid();
  sh.getRange(row, F.PW_HASH).setValue(hash_(String(next), newSalt));
  sh.getRange(row, F.PW_SALT).setValue(newSalt);
  sh.getRange(row, F.PW_CHANGED).setValue('Yes');
  sh.getRange(row, F.INITIAL_PW).setValue('(changed by parent)');
  SpreadsheetApp.flush();
  log_(familyId, 'PORTAL_PASSWORD_CHANGED', '');
  return { ok: true };
}

function uploadFolder_() {
  const id = PropertiesService.getScriptProperties().getProperty(PROP_FOLDER);
  if (!id) throw new Error('Upload folder missing. Re-run setup().');
  return DriveApp.getFolderById(id);
}

function childFolder_(familyId, childId) {
  const root = uploadFolder_();
  const name = familyId + ' / ' + childId;
  const it = root.getFoldersByName(name);
  return it.hasNext() ? it.next() : root.createFolder(name);
}

/** PUBLIC — upload one homework file for a given child and week. */
function portalUpload(token, childId, week, fileName, mimeType, base64) {
  const familyId = portalAuth_(token);
  const w = Math.max(1, Math.min(CONFIG.TOTAL_WEEKS, Number(week) || 1));

  const belongs = rows_(SHEETS.CHILDREN, K_HEADERS.length).some(function (r) {
    return String(r[K.ID - 1]) === String(childId) &&
           String(r[K.FAMILY_ID - 1]) === familyId;
  });
  if (!belongs) throw new Error('That student is not on your account.');

  const bytes = Utilities.base64Decode(base64);
  const maxBytes = CONFIG.MAX_UPLOAD_MB * 1024 * 1024;
  if (bytes.length > maxBytes) {
    throw new Error('That file is larger than ' + CONFIG.MAX_UPLOAD_MB + ' MB.');
  }

  // One file per week: replace anything already there
  portalRemoveUpload(token, childId, w, true);

  const safeName = clean_(fileName, 140).replace(/[\\/:*?"<>|]/g, '-') || 'homework';
  const blob = Utilities.newBlob(bytes, mimeType || 'application/octet-stream',
                                 'Week ' + w + ' - ' + safeName);
  const file = childFolder_(familyId, childId).createFile(blob);

  const id = 'UP-' + Utilities.getUuid().slice(0, 8);
  const row = [];
  row[H.ID - 1] = id;
  row[H.FAMILY_ID - 1] = familyId;
  row[H.CHILD_ID - 1] = String(childId);
  row[H.WEEK - 1] = w;
  row[H.FILE_ID - 1] = file.getId();
  row[H.FILE_NAME - 1] = safeName;
  row[H.SIZE - 1] = bytes.length;
  row[H.UPLOADED - 1] = new Date();
  sheet_(SHEETS.HOMEWORK).appendRow(row);
  SpreadsheetApp.flush();

  log_(familyId, 'HOMEWORK_UPLOADED', childId + ' week ' + w + ' — ' + safeName);
  return { ok: true, week: w, fileName: safeName,
           uploadedOn: fmt_(new Date(), 'MMM d, yyyy'), size: bytes.length, id: id };
}

/**
 * What each child has been set and what they scored, grouped by week.
 *
 * An assignment with no mark is reported as such rather than left out — a
 * parent should see the piece of work their child has not been marked for.
 */
function childGrades_(children) {
  const out = {};
  const byCourse = {};

  children.forEach(function (c) {
    if (!byCourse[c.course]) byCourse[c.course] = assignmentsFor_(c.course);
  });

  const allIds = [];
  Object.keys(byCourse).forEach(function (code) {
    byCourse[code].forEach(function (a) { allIds.push(a.id); });
  });
  const marks = marksFor_(allIds);

  children.forEach(function (c) {
    const weeks = {};
    (byCourse[c.course] || []).forEach(function (a) {
      if (!weeks[a.week]) weeks[a.week] = [];
      weeks[a.week].push({ name: a.name, mark: (marks[a.id] || {})[c.id] || '' });
    });
    out[c.id] = weeks;
  });
  return out;
}

/** { childId: [ announcement, … ] } — each child's class, newest week first. */
function childAnnouncements_(children) {
  const byCourse = {}, out = {};
  children.forEach(function (c) {
    if (!byCourse[c.course]) byCourse[c.course] = announcementsFor_(c.course);
    out[c.id] = byCourse[c.course];
  });
  return out;
}

/**
 * PUBLIC — open the marked copy of one of this family's submissions.
 *
 * Checked against the signed-in family, so a guessed upload id gets nowhere.
 */
function portalOpenMarked(token, uploadId) {
  const familyId = portalAuth_(token);
  const row = findHomeworkRow_(uploadId);
  if (row < 0) throw new Error('That file is no longer available.');
  const sh = sheet_(SHEETS.HOMEWORK);
  if (String(sh.getRange(row, H.FAMILY_ID).getValue() || '') !== familyId) {
    throw new Error('That file is not on your account.');
  }
  const id = String(sh.getRange(row, H.MARK_FILE_ID).getValue() || '');
  if (!id) throw new Error('There is no marked copy for that week yet.');
  const url = shareableUrl_(id);
  if (!url) throw new Error('That file could not be found.');
  return { ok: true, url: url };
}

/** PUBLIC — remove a homework upload. */
function portalRemoveUpload(token, childId, week, quiet) {
  const familyId = portalAuth_(token);
  const w = Number(week);
  const sh = sheet_(SHEETS.HOMEWORK);
  const last = sh.getLastRow();
  if (last < 2) return { ok: true, removed: 0 };

  const data = sh.getRange(2, 1, last - 1, H_HEADERS.length).getValues();
  let removed = 0;
  for (let i = data.length - 1; i >= 0; i--) {
    if (String(data[i][H.FAMILY_ID - 1]) !== familyId) continue;
    if (String(data[i][H.CHILD_ID - 1]) !== String(childId)) continue;
    if (Number(data[i][H.WEEK - 1]) !== w) continue;
    try { DriveApp.getFileById(String(data[i][H.FILE_ID - 1])).setTrashed(true); } catch (e) {}
    // The marked copy belongs to the work being replaced, so it goes too —
    // leaving it behind would show a parent marking for homework that is gone.
    const markId = String(data[i][H.MARK_FILE_ID - 1] || '');
    if (markId) { try { DriveApp.getFileById(markId).setTrashed(true); } catch (e) {} }
    sh.deleteRow(i + 2);
    removed++;
  }
  if (removed) {
    SpreadsheetApp.flush();
    if (!quiet) log_(familyId, 'HOMEWORK_REMOVED', childId + ' week ' + w);
  }
  return { ok: true, removed: removed };
}


/* ============================================================================
 * STRIPE — PRE-AUTHORIZED DEBIT (PAD / ACSS Debit, Canada)
 * ----------------------------------------------------------------------------
 * How this works, end to end:
 *
 *   1. A family finishes the registration form.
 *   2. They are sent to a Stripe-hosted page where they connect their bank
 *      account and agree to a mandate — the terms under which the Academy may
 *      debit them. Bank details never reach this script.
 *   3. Stripe returns them here; we store the customer, payment method and
 *      mandate against the family.
 *   4. A daily trigger debits whatever is due, and checks on debits already
 *      submitted. A payment appears as "Processing" until the funds settle,
 *      which takes about five business days, then becomes "Paid".
 *
 * The mandate wording in CONFIG.STRIPE must describe the real billing schedule.
 * Debiting outside the terms a parent agreed to is grounds for a dispute.
 * ========================================================================== */

const STRIPE_API = 'https://api.stripe.com/v1/';

function stripeKey_() {
  return PropertiesService.getScriptProperties().getProperty(PROP_STRIPE) || '';
}

/** PUBLIC — store the Stripe secret key. Never put the key in this file. */
function setStripeKey(key) {
  const k = String(key || '').trim();
  if (!/^sk_(test|live)_/.test(k)) {
    throw new Error('That does not look like a Stripe secret key (sk_test_… or sk_live_…).');
  }
  PropertiesService.getScriptProperties().setProperty(PROP_STRIPE, k);
  return k.indexOf('sk_live_') === 0
    ? 'LIVE key saved — real money will move.'
    : 'Test key saved — nothing real will be charged.';
}

function stripeReady_() { return !!stripeKey_() && CONFIG.STRIPE && CONFIG.STRIPE.ENABLED; }

/** True when the saved key is a live one, so the UI can warn appropriately. */
function stripeLive_() { return stripeKey_().indexOf('sk_live_') === 0; }

/**
 * Stripe takes form-encoded bodies with bracket notation for nested values,
 * e.g. payment_method_options[acss_debit][currency]=cad
 */
function stripeEncode_(obj, prefix) {
  const parts = [];
  Object.keys(obj).forEach(function (k) {
    const v = obj[k];
    if (v === null || v === undefined) return;
    const key = prefix ? prefix + '[' + k + ']' : k;
    if (typeof v === 'object' && !(v instanceof Date)) {
      const inner = stripeEncode_(v, key);
      if (inner) parts.push(inner);
    } else {
      parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(String(v)));
    }
  });
  return parts.join('&');
}

/**
 * One call to the Stripe API.
 *
 * idempotencyKey makes a retry safe: if the same key is reused, Stripe returns
 * the original result instead of charging twice. Every debit passes one.
 */
function stripeCall_(method, path, params, idempotencyKey) {
  const key = stripeKey_();
  if (!key) throw new Error('Stripe is not set up. Run setStripeKey() from the editor.');

  const headers = { Authorization: 'Basic ' + Utilities.base64Encode(key + ':') };
  if (idempotencyKey) headers['Idempotency-Key'] = String(idempotencyKey);

  const options = {
    method: method,
    headers: headers,
    muteHttpExceptions: true,
    contentType: 'application/x-www-form-urlencoded'
  };

  let url = STRIPE_API + path;
  const body = params ? stripeEncode_(params) : '';
  if (method === 'get') { if (body) url += '?' + body; }
  else if (body) options.payload = body;

  const res = UrlFetchApp.fetch(url, options);
  const code = res.getResponseCode();
  let json = {};
  try { json = JSON.parse(res.getContentText()); } catch (e) { json = {}; }

  if (code >= 400) {
    const err = json.error || {};
    const msg = err.message || ('Stripe returned ' + code);
    log_('stripe', 'STRIPE_ERROR', path + ' — ' + msg);
    const e = new Error(msg);
    e.stripeCode = err.code || '';
    e.declineCode = err.decline_code || '';
    throw e;
  }
  return json;
}


/* ----------------------------------------------------------------------------
 * SETTING UP A MANDATE
 * -------------------------------------------------------------------------- */

/** The Stripe customer for a family, created on first use. */
function padCustomer_(row, fam) {
  const sh = sheet_(SHEETS.FAMILIES);
  const existing = String(sh.getRange(row, F.PAD_CUSTOMER).getValue() || '');
  if (existing) return existing;

  const cus = stripeCall_('post', 'customers', {
    name: fam.parentName,
    email: fam.email,
    phone: fam.phone,
    description: CONFIG.ACADEMY_NAME + ' — ' + fam.id,
    metadata: { family_id: fam.id, academy: CONFIG.ACADEMY_NAME }
  }, 'cus-' + fam.id);

  sh.getRange(row, F.PAD_CUSTOMER).setValue(cus.id);
  SpreadsheetApp.flush();
  return cus.id;
}

/**
 * PUBLIC — begin bank authorisation for a family.
 *
 * Returns a Stripe-hosted URL. The family is identified by the one-time token
 * handed out at the end of registration, or by a signed-in portal session, so
 * a stranger cannot start a setup against someone else's account.
 */
function padStartSetup(kind, token, familyId) {
  if (!stripeReady_()) throw new Error('Pre-authorized debit is not switched on yet.');

  let fid = null;
  if (kind === 'portal')      fid = portalAuth_(token);
  else if (kind === 'admin')  { adminAuth_(token); fid = familyId; }
  else if (kind === 'signup') fid = padSignupToken_(token);
  if (!fid) throw new Error('We could not identify your account. Please sign in to the Parent Portal.');

  const row = findFamilyRow_(fid);
  if (row < 0) throw new Error('Account not found.');

  const sh = sheet_(SHEETS.FAMILIES);
  const fam = {
    id: fid,
    parentName: String(sh.getRange(row, F.P1_FIRST).getValue() || '') + ' ' +
                String(sh.getRange(row, F.P1_LAST).getValue() || ''),
    email: String(sh.getRange(row, F.P1_EMAIL).getValue() || ''),
    phone: String(sh.getRange(row, F.P1_PHONE).getValue() || '')
  };

  const customer = padCustomer_(row, fam);
  const base = ScriptApp.getService().getUrl();

  const session = stripeCall_('post', 'checkout/sessions', {
    mode: 'setup',
    customer: customer,
    currency: CONFIG.STRIPE.CURRENCY,
    payment_method_types: { 0: 'acss_debit' },
    payment_method_options: {
      acss_debit: {
        currency: CONFIG.STRIPE.CURRENCY,
        mandate_options: {
          payment_schedule: CONFIG.STRIPE.PAYMENT_SCHEDULE,
          transaction_type: CONFIG.STRIPE.TRANSACTION_TYPE,
          interval_description: CONFIG.STRIPE.MANDATE_DESCRIPTION
        }
      }
    },
    metadata: { family_id: fid },
    success_url: base + '?page=padreturn&fid=' + encodeURIComponent(fid) +
                 '&session_id={CHECKOUT_SESSION_ID}',
    cancel_url: base + '?page=padreturn&fid=' + encodeURIComponent(fid) + '&cancelled=1'
  });

  sh.getRange(row, F.PAD_STATUS).setValue('Setup started');
  SpreadsheetApp.flush();
  log_(fid, 'PAD_SETUP_STARTED', session.id);
  return { ok: true, url: session.url };
}

/**
 * A short-lived token tying the end of the registration form to one family, so
 * the bank-setup step can be reached before the parent has ever signed in.
 */
function padSignupTokenFor_(familyId) {
  const t = Utilities.getUuid();
  CacheService.getScriptCache().put('pad_' + t, String(familyId), 6 * 60 * 60);
  return t;
}
function padSignupToken_(t) {
  return t ? CacheService.getScriptCache().get('pad_' + String(t)) : null;
}

/**
 * Called when Stripe sends the parent back. Reads the completed session and
 * stores the payment method and mandate we will debit against.
 */
function padFinalize_(familyId, sessionId) {
  const row = findFamilyRow_(familyId);
  if (row < 0) throw new Error('Account not found.');

  const session = stripeCall_('get', 'checkout/sessions/' + encodeURIComponent(sessionId), {
    'expand[0]': 'setup_intent'
  });

  const si = session.setup_intent;
  if (!si || !si.payment_method) {
    throw new Error('That bank authorisation was not completed.');
  }

  const sh = sheet_(SHEETS.FAMILIES);
  sh.getRange(row, F.PAD_METHOD).setValue(si.payment_method);
  sh.getRange(row, F.PAD_MANDATE).setValue(si.mandate || '');
  // A bank verified by micro-deposits is not usable until the parent confirms
  // the two small amounts, which takes a day or two.
  sh.getRange(row, F.PAD_STATUS).setValue(si.status === 'succeeded' ? 'Active' : 'Pending verification');
  sh.getRange(row, F.PAD_SET_ON).setValue(new Date());
  SpreadsheetApp.flush();

  log_(familyId, 'PAD_MANDATE_SAVED', si.payment_method + ' / ' + (si.mandate || 'no mandate'));
  return { ok: true, status: si.status === 'succeeded' ? 'Active' : 'Pending verification' };
}


/* ----------------------------------------------------------------------------
 * COLLECTING PAYMENTS
 * -------------------------------------------------------------------------- */

/** Rows already recorded against a family, keyed by payment. */
function padPaymentRows_() {
  const out = {};
  rows_(SHEETS.PAYMENTS, PY_HEADERS.length).forEach(function (r, i) {
    const fid = String(r[PY.FAMILY_ID - 1] || '');
    const key = String(r[PY.KEY - 1] || '');
    if (!fid || !key) return;
    if (!out[fid]) out[fid] = {};
    out[fid][key] = {
      row: i + 2,
      state: String(r[PY.STATE - 1] || 'paid'),
      intent: String(r[PY.INTENT - 1] || ''),
      amount: Number(r[PY.AMOUNT - 1]) || 0
    };
  });
  return out;
}

function padWriteRow_(familyId, key, dueISO, amount, state, intent, detail, markedBy) {
  const sh = sheet_(SHEETS.PAYMENTS);
  const last = sh.getLastRow();
  const data = last > 1 ? sh.getRange(2, 1, last - 1, PY_HEADERS.length).getValues() : [];
  for (let i = data.length - 1; i >= 0; i--) {
    if (String(data[i][PY.FAMILY_ID - 1]) === String(familyId) &&
        String(data[i][PY.KEY - 1]) === String(key)) sh.deleteRow(i + 2);
  }
  const row = [];
  row[PY.FAMILY_ID - 1] = String(familyId);
  row[PY.KEY - 1] = String(key);
  row[PY.DUE - 1] = dueISO ? parseISO_(dueISO) : '';
  row[PY.AMOUNT - 1] = Number(amount) || 0;
  row[PY.PAID_ON - 1] = state === 'paid' ? new Date() : '';
  row[PY.MARKED_BY - 1] = markedBy || 'Stripe';
  row[PY.STATE - 1] = state;
  row[PY.INTENT - 1] = intent || '';
  row[PY.DETAIL - 1] = detail || '';
  sh.appendRow(row);
  SpreadsheetApp.flush();
}

/**
 * Debit one payment. Returns the PaymentIntent.
 *
 * The idempotency key is built from the family and the payment being settled,
 * so a retry after a timeout can never take the money twice.
 */
function padCharge_(fam, payment) {
  const cents = Math.round(payment.amount * 100);
  if (cents <= 0) throw new Error('Nothing to charge.');

  const pi = stripeCall_('post', 'payment_intents', {
    amount: cents,
    currency: CONFIG.STRIPE.CURRENCY,
    customer: fam.padCustomer,
    payment_method: fam.padMethod,
    mandate: fam.padMandate || null,
    confirm: true,
    off_session: true,
    payment_method_types: { 0: 'acss_debit' },
    description: CONFIG.ACADEMY_NAME + ' tuition — ' + payment.covers,
    statement_descriptor: CONFIG.STRIPE.STATEMENT_DESCRIPTOR,
    metadata: {
      family_id: fam.id,
      payment_key: payment.key,
      due_date: payment.dueISO,
      covers: payment.covers
    }
  }, 'pay-' + fam.id + '-' + payment.key);

  return pi;
}

/** Map a Stripe PaymentIntent status onto the state we record. */
function padStateFor_(status) {
  if (status === 'succeeded') return 'paid';
  if (status === 'processing' || status === 'requires_action' ||
      status === 'requires_confirmation') return 'processing';
  return 'failed';
}

/**
 * PUBLIC — the daily run: collect what is due and check on debits in flight.
 *
 * Safe to run more than once a day; nothing is charged twice.
 */
function dailyPadRun() {
  if (!stripeReady_()) { Logger.log('Stripe not configured — nothing to do.'); return; }

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) { Logger.log('Another run is in progress.'); return; }

  try {
    const fams = familiesWithChildren_();
    const existing = padPaymentRows_();
    const sh = sheet_(SHEETS.FAMILIES);
    let charged = 0, settled = 0, failed = 0, skipped = 0;
    const notes = [];

    fams.forEach(function (f) {
      const row = findFamilyRow_(f.id);
      if (row < 0) return;
      const padCustomer = String(sh.getRange(row, F.PAD_CUSTOMER).getValue() || '');
      const padMethod   = String(sh.getRange(row, F.PAD_METHOD).getValue() || '');
      const padMandate  = String(sh.getRange(row, F.PAD_MANDATE).getValue() || '');
      const padStatus   = String(sh.getRange(row, F.PAD_STATUS).getValue() || '');
      const mine = existing[f.id] || {};

      // ---- 1. follow up anything already submitted ----
      Object.keys(mine).forEach(function (key) {
        const rec = mine[key];
        if (rec.state !== 'processing' || !rec.intent) return;
        let pi;
        try { pi = stripeCall_('get', 'payment_intents/' + rec.intent); }
        catch (e) { return; }
        const state = padStateFor_(pi.status);
        if (state === rec.state) return;
        const detail = state === 'failed'
          ? (pi.last_payment_error ? pi.last_payment_error.message : 'Debit failed')
          : '';
        padWriteRow_(f.id, key, fmt_(new Date(), 'yyyy-MM-dd'),
                     rec.amount, state, rec.intent, detail, 'Stripe');
        if (state === 'paid') settled++;
        if (state === 'failed') {
          failed++;
          notes.push(f.p1.first + ' ' + f.p1.last + ' — ' + money_(rec.amount * 100) +
                     ' failed: ' + detail);
        }
      });

      // ---- 2. collect anything now due ----
      if (padStatus !== 'Active' || !padMethod) { skipped++; return; }

      f.quote.schedule.forEach(function (p) {
        if (p.status !== 'overdue' && p.status !== 'due') return;   // not yet due
        const rec = mine[p.key];
        if (rec && (rec.state === 'paid' || rec.state === 'processing')) return;
        if (rec && rec.state === 'failed') return;   // do not retry automatically

        try {
          const pi = padCharge_({
            id: f.id, padCustomer: padCustomer, padMethod: padMethod, padMandate: padMandate
          }, p);
          const state = padStateFor_(pi.status);
          padWriteRow_(f.id, p.key, p.dueISO, p.amount, state, pi.id,
                       state === 'failed' && pi.last_payment_error
                         ? pi.last_payment_error.message : '', 'Stripe');
          if (state === 'failed') { failed++; notes.push(f.p1.first + ' ' + f.p1.last +
            ' — debit declined'); }
          else charged++;
          log_(f.id, 'PAD_DEBIT_SUBMITTED', p.key + ' ' + money_(p.amount * 100));
        } catch (e) {
          failed++;
          notes.push(f.p1.first + ' ' + f.p1.last + ' — ' + e.message);
          padWriteRow_(f.id, p.key, p.dueISO, p.amount, 'failed', '', e.message, 'Stripe');
          log_(f.id, 'PAD_DEBIT_ERROR', p.key + ' — ' + e.message);
        }
      });
    });

    const summary = 'Debits submitted: ' + charged + ' · settled: ' + settled +
                    ' · failed: ' + failed + ' · families without a mandate: ' + skipped;
    Logger.log(summary);
    log_('system', 'PAD_RUN', summary);

    if (failed > 0) padNotifyOwner_(summary, notes);
    return summary;

  } finally { lock.releaseLock(); }
}

function padNotifyOwner_(summary, notes) {
  const to = PropertiesService.getScriptProperties().getProperty(PROP_NOTIFY);
  if (!to) return;
  try {
    MailApp.sendEmail({
      to: to, name: CONFIG.ACADEMY_NAME,
      subject: CONFIG.ACADEMY_NAME + ' — pre-authorized debit run needs attention',
      htmlBody: shell_('<p>' + summary + '</p><ul>' +
        notes.map(function (n) { return '<li>' + n + '</li>'; }).join('') + '</ul>' +
        '<p>Open the dashboard to review these families.</p>')
    });
  } catch (e) {}
}

/** PUBLIC — install the daily trigger. Run once from the editor. */
function installPadTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'dailyPadRun') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('dailyPadRun').timeBased().atHour(7).everyDays(1).create();
  return 'Daily debit run installed for about 7am ' + CONFIG.TIMEZONE + '.';
}

/** PUBLIC (admin) — charge one family now rather than waiting for the run. */
function adminChargeNow(token, familyId, key) {
  adminAuth_(token);
  if (!stripeReady_()) throw new Error('Pre-authorized debit is not switched on yet.');

  const row = findFamilyRow_(familyId);
  if (row < 0) throw new Error('Family not found.');
  const sh = sheet_(SHEETS.FAMILIES);
  if (String(sh.getRange(row, F.PAD_STATUS).getValue() || '') !== 'Active') {
    throw new Error('This family has not completed their bank authorisation.');
  }

  const fam = familiesWithChildren_().filter(function (f) { return f.id === familyId; })[0];
  if (!fam) throw new Error('Family not found.');
  const p = fam.quote.schedule.filter(function (x) { return x.key === key; })[0];
  if (!p) throw new Error('That payment is not on this family\'s schedule.');
  // The dashboard hides the button on a cancelled billing, but a stale page
  // could still send one. Debiting a family for a student who has withdrawn is
  // exactly the mistake this whole feature exists to prevent.
  if (p.cancelled) {
    throw new Error('That billing was cancelled when the student withdrew. ' +
                    'Reinstate them first if this should still be collected.');
  }

  const pi = padCharge_({
    id: familyId,
    padCustomer: String(sh.getRange(row, F.PAD_CUSTOMER).getValue() || ''),
    padMethod: String(sh.getRange(row, F.PAD_METHOD).getValue() || ''),
    padMandate: String(sh.getRange(row, F.PAD_MANDATE).getValue() || '')
  }, p);

  const state = padStateFor_(pi.status);
  padWriteRow_(familyId, key, p.dueISO, p.amount, state, pi.id,
               state === 'failed' && pi.last_payment_error
                 ? pi.last_payment_error.message : '', 'Stripe');
  log_('owner', 'PAD_DEBIT_MANUAL', familyId + ' ' + key);
  return { ok: true, state: state };
}

/** PUBLIC (admin) — email a family the link to set up or replace their mandate. */
function adminSendPadLink(token, familyId) {
  adminAuth_(token);
  const res = padStartSetup('admin', token, familyId);
  const row = findFamilyRow_(familyId);
  const sh = sheet_(SHEETS.FAMILIES);
  const first = String(sh.getRange(row, F.P1_FIRST).getValue() || '');
  const email = String(sh.getRange(row, F.P1_EMAIL).getValue() || '');
  if (!email) throw new Error('That family has no email address on file.');

  MailApp.sendEmail({
    to: email, name: CONFIG.ACADEMY_NAME,
    subject: CONFIG.ACADEMY_NAME + ' — set up your tuition payments',
    htmlBody: shell_(
      '<p>Hello ' + first + ',</p>' +
      '<p>Please set up your pre-authorized debit so tuition can be collected ' +
      'automatically on each billing date. It takes about a minute and your bank ' +
      'details go straight to our payment provider, Stripe — they are never stored ' +
      'by the Academy.</p>' +
      '<div style="margin:22px 0"><a href="' + res.url + '" style="display:inline-block;' +
      'background:' + CONFIG.COLOR_MAGENTA + ';color:#fff;padding:12px 26px;' +
      'border-radius:8px;text-decoration:none;font-weight:700">Set up my payments</a></div>' +
      '<p style="font-size:13px;color:#6b6b73">This link is personal to your family ' +
      'account. Please do not forward it.</p>' +
      '<p style="margin-top:22px">Warm regards,<br><strong>' + CONFIG.ACADEMY_NAME +
      '</strong></p>')
  });
  log_('owner', 'PAD_LINK_SENT', familyId);
  return { ok: true, email: email };
}

/** PUBLIC (admin) — forget a family's mandate, so they can set one up again. */
function adminClearPad(token, familyId) {
  adminAuth_(token);
  const row = findFamilyRow_(familyId);
  if (row < 0) throw new Error('Family not found.');
  const sh = sheet_(SHEETS.FAMILIES);
  sh.getRange(row, F.PAD_METHOD).setValue('');
  sh.getRange(row, F.PAD_MANDATE).setValue('');
  sh.getRange(row, F.PAD_STATUS).setValue('Not set up');
  SpreadsheetApp.flush();
  log_('owner', 'PAD_CLEARED', familyId);
  return { ok: true };
}