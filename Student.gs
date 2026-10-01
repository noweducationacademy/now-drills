/**
 * ============================================================================
 * NOW EDUCATION ACADEMY — STUDENT PORTAL  (and the Teacher Portal's Lessons,
 * Resources and Practice Progress tabs)
 * ----------------------------------------------------------------------------
 *   Student Portal  ->  /exec?page=student   (same family login as the Parent Portal)
 *
 * Students sign in with their family's Portal Username and password. Because it
 * is the very same login as the Parent Portal (portalLogin / portalAuth_), a
 * password a parent changes is the password the student uses — there is only
 * one copy of it, in the Families tab.
 *
 * New tabs, created automatically the first time they are needed:
 *   Lessons    — one row per lesson a teacher posts for a class and week
 *   Resources  — links and files a teacher shares with a class (or all classes)
 *   Progress   — one row per drill / worksheet a student finishes
 *
 * Students never receive payment, billing or parent contact details.
 * ============================================================================
 */

const DRILLS_URL = 'https://noweducationacademy.github.io/now-drills/';

const SP_SHEETS = { LESSONS: 'Lessons', RESOURCES: 'Resources', PROGRESS: 'Progress' };

const LS = { ID: 1, COURSE: 2, WEEK: 3, TITLE: 4, DESC: 5, LINK: 6, CREATED: 7, BY: 8 };
const LS_HEADERS = ['Lesson ID', 'Course Code', 'Week', 'Title', 'Description', 'Link',
                    'Created On', 'Created By'];

// COURSE is a course code, or ALL for every class. WEEK is blank for "any week".
const RS = { ID: 1, COURSE: 2, WEEK: 3, TITLE: 4, TYPE: 5, LINK: 6, FILE_ID: 7, CREATED: 8, BY: 9 };
const RS_HEADERS = ['Resource ID', 'Course Code', 'Week', 'Title', 'Type', 'Link',
                    'Drive File ID', 'Created On', 'Created By'];
const RESOURCE_TYPES = ['Worksheet', 'Video', 'Website', 'Game', 'Notes', 'Other'];

const PG = { WHEN: 1, FAMILY_ID: 2, CHILD_ID: 3, ACTIVITY: 4, DETAIL: 5, SCORE: 6,
             OUT_OF: 7, PERCENT: 8, SECONDS: 9 };
const PG_HEADERS = ['Completed On', 'Family ID', 'Child ID', 'Activity', 'Detail', 'Score',
                    'Out Of', 'Percent', 'Seconds'];

const MAX_LESSONS_PER_WEEK = 6;
const MAX_PROGRESS_PER_DAY = 150;   // per student — a brake on anything runaway


/* ----------------------------------------------------------------------------
 * SHEETS
 * -------------------------------------------------------------------------- */

/** Run once from the editor if you like; otherwise the tabs appear on first use. */
function studentSetup() {
  spSheet_(SP_SHEETS.LESSONS); spSheet_(SP_SHEETS.RESOURCES); spSheet_(SP_SHEETS.PROGRESS);
  Logger.log('Lessons, Resources and Progress tabs are ready.\nStudent Portal: ' +
             ScriptApp.getService().getUrl() + '?page=student');
}

function spSheet_(name) {
  const ss = ss_();
  const sh = ss.getSheetByName(name);
  if (sh) return sh;
  if (name === SP_SHEETS.LESSONS)   return makeSheet_(ss, name, LS_HEADERS, '#7A3F5C');
  if (name === SP_SHEETS.RESOURCES) return makeSheet_(ss, name, RS_HEADERS, '#3F7A6E');
  return makeSheet_(ss, name, PG_HEADERS, '#5C3F7A');
}
function spRows_(name, width) {
  const sh = spSheet_(name);
  const last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, width).getValues();
}
function spFindRow_(name, id) {
  const sh = spSheet_(name);
  const last = sh.getLastRow();
  if (last < 2) return -1;
  const ids = sh.getRange(2, 1, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return -1;
}
function spLink_(v) {
  const s = clean_(v, 600);
  if (!s) return '';
  if (!/^https:\/\/[^\s]+$/i.test(s)) throw new Error('Links must start with https:// — copy the full address from your browser.');
  return s;
}


/* ----------------------------------------------------------------------------
 * READING LESSONS, RESOURCES, PROGRESS
 * -------------------------------------------------------------------------- */

function lessonsFor_(code) {
  const out = [];
  spRows_(SP_SHEETS.LESSONS, LS_HEADERS.length).forEach(function (r) {
    if (!r[LS.ID - 1] || String(r[LS.COURSE - 1]) !== String(code)) return;
    out.push({
      id: String(r[LS.ID - 1]), week: Number(r[LS.WEEK - 1]) || 0,
      title: clean_(r[LS.TITLE - 1], 140), description: clean_(r[LS.DESC - 1], 3000),
      link: clean_(r[LS.LINK - 1], 600),
      postedOn: r[LS.CREATED - 1] instanceof Date ? fmt_(r[LS.CREATED - 1], 'MMM d, yyyy') : ''
    });
  });
  out.sort(function (a, b) { return a.week - b.week; });
  return out;
}

function resourcesFor_(code) {
  const out = [];
  spRows_(SP_SHEETS.RESOURCES, RS_HEADERS.length).forEach(function (r) {
    if (!r[RS.ID - 1]) return;
    const c = String(r[RS.COURSE - 1] || '');
    if (c !== String(code) && c.toUpperCase() !== 'ALL') return;
    out.push({
      id: String(r[RS.ID - 1]), course: c, allClasses: c.toUpperCase() === 'ALL',
      week: Number(r[RS.WEEK - 1]) || 0,
      title: clean_(r[RS.TITLE - 1], 140), type: clean_(r[RS.TYPE - 1], 30) || 'Other',
      link: clean_(r[RS.LINK - 1], 600), isFile: !!String(r[RS.FILE_ID - 1] || ''),
      postedOn: r[RS.CREATED - 1] instanceof Date ? fmt_(r[RS.CREATED - 1], 'MMM d, yyyy') : ''
    });
  });
  out.sort(function (a, b) { return (b.week - a.week) || (a.title < b.title ? -1 : 1); });
  return out;
}

/** { childId: [ {when, activity, detail, score, outOf, percent, seconds}, … newest first ] } */
function progressFor_(childIds, limit) {
  const want = {}; childIds.forEach(function (id) { want[String(id)] = true; });
  const out = {};
  spRows_(SP_SHEETS.PROGRESS, PG_HEADERS.length).forEach(function (r) {
    const cid = String(r[PG.CHILD_ID - 1] || '');
    if (!want[cid]) return;
    if (!out[cid]) out[cid] = [];
    const when = r[PG.WHEN - 1] instanceof Date ? r[PG.WHEN - 1] : null;
    out[cid].push({
      t: when ? when.getTime() : 0,
      when: when ? fmt_(when, 'MMM d, yyyy h:mm a') : '',
      day: when ? fmt_(when, 'MMM d') : '',
      activity: clean_(r[PG.ACTIVITY - 1], 60), detail: clean_(r[PG.DETAIL - 1], 80),
      score: Number(r[PG.SCORE - 1]) || 0, outOf: Number(r[PG.OUT_OF - 1]) || 0,
      percent: Number(r[PG.PERCENT - 1]) || 0, seconds: Number(r[PG.SECONDS - 1]) || 0
    });
  });
  Object.keys(out).forEach(function (cid) {
    out[cid].sort(function (a, b) { return b.t - a.t; });
    if (limit) out[cid] = out[cid].slice(0, limit);
  });
  return out;
}

/** The family's enrolled students, read straight from the sheet (no billing engine). */
function familyStudents_(familyId) {
  const out = [];
  rows_(SHEETS.CHILDREN, K_HEADERS.length).forEach(function (r) {
    if (!r[K.ID - 1] || String(r[K.FAMILY_ID - 1]) !== String(familyId)) return;
    if (String(r[K.STATUS - 1] || '').toLowerCase() === 'withdrawn') return;
    const code = String(r[K.COURSE - 1] || '');
    const co = courseByCode_(code);
    out.push({
      id: String(r[K.ID - 1]),
      first: String(r[K.FIRST - 1] || ''), last: String(r[K.LAST - 1] || ''),
      grade: String(r[K.GRADE - 1] || ''), course: code,
      level: co ? co.level : '', day: co ? co.day : '', time: co ? co.time : '',
      weekday: co ? co.weekday : 0,
      courseLabel: co ? ('Level ' + co.level + ' — ' + co.day + ' ' + co.time) : code
    });
  });
  return out;
}

/** The teaching week we are in, read from CONFIG.CALENDAR so breaks are skipped. */
function spWeekNow_() {
  const mondays = weekMondays_(), now = new Date();
  let best = 0;
  Object.keys(mondays).forEach(function (w) {
    if (mondays[w].getTime() <= now.getTime() && Number(w) > best) best = Number(w);
  });
  return best ? Math.min(CONFIG.TOTAL_WEEKS, best) : 1;
}

/** Every teaching week with the date of this class in it, plus the breaks. */
function classSchedule_(weekday) {
  const start = programStart_();
  const out = [];
  (CONFIG.CALENDAR || []).forEach(function (r) {
    if (r.break) { out.push({ type: 'break', name: r.break, label: r.label || '' }); return; }
    const d = sessionDate_(start, r.week, weekday || 0);
    out.push({ type: 'week', week: r.week, iso: fmt_(d, 'yyyy-MM-dd'),
               date: fmt_(d, 'EEE, MMM d'), month: fmt_(d, 'MMMM yyyy'), notes: r.notes || [] });
  });
  return out;
}

function homeworkFor_(familyId, childIds) {
  const want = {}; childIds.forEach(function (id) { want[String(id)] = true; });
  const out = {};
  rows_(SHEETS.HOMEWORK, H_HEADERS.length).forEach(function (r) {
    if (!r[H.ID - 1] || String(r[H.FAMILY_ID - 1]) !== String(familyId)) return;
    const cid = String(r[H.CHILD_ID - 1]);
    if (!want[cid]) return;
    if (!out[cid]) out[cid] = {};
    out[cid][Number(r[H.WEEK - 1])] = {
      id: String(r[H.ID - 1]), fileName: String(r[H.FILE_NAME - 1] || ''),
      uploadedOn: r[H.UPLOADED - 1] instanceof Date ? fmt_(r[H.UPLOADED - 1], 'MMM d, yyyy') : '',
      marked: !!r[H.MARKED_ON - 1],
      markedOn: r[H.MARKED_ON - 1] instanceof Date ? fmt_(r[H.MARKED_ON - 1], 'MMM d, yyyy') : '',
      comments: r[H.MARKED_ON - 1] ? String(r[H.COMMENTS - 1] || '') : '',
      hasMarkedFile: !!String(r[H.MARK_FILE_ID - 1] || '')
    };
  });
  return out;
}


/* ----------------------------------------------------------------------------
 * STUDENT PORTAL — PUBLIC
 * -------------------------------------------------------------------------- */

/** PUBLIC — everything the Student Portal shows, for every student in the family. */
function studentGetData(token) {
  const familyId = portalAuth_(token);
  const kids = familyStudents_(familyId);
  if (!kids.length) throw new Error('There are no enrolled students on this account. Please contact the Academy.');

  const ids = kids.map(function (k) { return k.id; });
  const grades = childGrades_(kids);
  const news = childAnnouncements_(kids);
  const att = attendanceMap_();
  const hw = homeworkFor_(familyId, ids);
  const prog = progressFor_(ids, 300);

  const byCourse = {};
  kids.forEach(function (k) {
    if (byCourse[k.course]) return;
    byCourse[k.course] = { lessons: lessonsFor_(k.course), resources: resourcesFor_(k.course),
                           schedule: classSchedule_(k.weekday) };
  });

  return {
    ok: true,
    currentWeek: spWeekNow_(),
    today: fmt_(new Date(), 'yyyy-MM-dd'),
    totalWeeks: CONFIG.TOTAL_WEEKS,
    maxUploadMb: CONFIG.MAX_UPLOAD_MB,
    drillsUrl: DRILLS_URL,
    students: kids.map(function (k) {
      const c = byCourse[k.course] || {};
      return {
        id: k.id, first: k.first, last: k.last, grade: k.grade,
        course: k.course, courseLabel: k.courseLabel, day: k.day, time: k.time, level: k.level,
        lessons: c.lessons || [], resources: c.resources || [], schedule: c.schedule || [],
        assignments: grades[k.id] || {},
        announcements: news[k.id] || [],
        attendance: att[k.id] || {},
        homework: hw[k.id] || {},
        progress: prog[k.id] || []
      };
    })
  };
}

/** PUBLIC — save one finished drill or worksheet. Called by the Practice tab. */
function studentSaveProgress(token, childId, r) {
  const familyId = portalAuth_(token);
  const kid = familyStudents_(familyId).filter(function (k) { return k.id === String(childId); })[0];
  if (!kid) throw new Error('That student is not on your account.');
  r = r || {};
  const score = Math.max(0, Math.min(1000, Number(r.score) || 0));
  const outOf = Math.max(1, Math.min(1000, Number(r.outOf) || 1));
  const secs = Math.max(0, Math.min(36000, Math.round(Number(r.seconds) || 0)));
  const activity = clean_(r.activity, 60) || 'Practice';
  const detail = clean_(r.detail, 80);

  const cache = CacheService.getScriptCache();
  const key = 'prog_' + kid.id + '_' + fmt_(new Date(), 'yyyyMMdd');
  const n = Number(cache.get(key) || 0);
  if (n >= MAX_PROGRESS_PER_DAY) return { ok: false, message: 'Daily limit reached.' };
  cache.put(key, String(n + 1), 21600);

  const pct = Math.round(Math.min(score, outOf) / outOf * 100);
  spSheet_(SP_SHEETS.PROGRESS).appendRow([new Date(), familyId, kid.id, activity, detail,
                                          score, outOf, pct, secs]);
  return { ok: true, saved: { when: fmt_(new Date(), 'MMM d, yyyy h:mm a'), day: fmt_(new Date(), 'MMM d'),
    t: Date.now(), activity: activity, detail: detail, score: score, outOf: outOf, percent: pct, seconds: secs } };
}


/* ----------------------------------------------------------------------------
 * TEACHER PORTAL — Lessons, Resources, Practice Progress
 * -------------------------------------------------------------------------- */

/** PUBLIC — this class's lessons and resources, and its students' practice. */
function teacherGetLessons(token, code) {
  teacherAuth_(token);
  if (!courseByCode_(code)) throw new Error('Unknown class.');
  const roster = activeRoster_().filter(function (s) { return s.course === code; });
  const prog = progressFor_(roster.map(function (s) { return s.childId; }), 0);
  const students = roster.map(function (s) {
    const list = prog[s.childId] || [];
    const by = {};
    list.forEach(function (p) {
      if (!by[p.activity]) by[p.activity] = { activity: p.activity, attempts: 0, total: 0, best: 0, last: '' };
      const a = by[p.activity];
      a.attempts++; a.total += p.percent; a.best = Math.max(a.best, p.percent);
      if (!a.last) a.last = p.day;
    });
    return {
      childId: s.childId, name: s.name, attempts: list.length,
      lastActive: list.length ? list[0].day : '',
      activities: Object.keys(by).map(function (k) {
        const a = by[k];
        return { activity: a.activity, attempts: a.attempts, best: a.best,
                 average: Math.round(a.total / a.attempts), last: a.last };
      }),
      recent: list.slice(0, 8)
    };
  });
  return { ok: true, lessons: lessonsFor_(code), resources: resourcesFor_(code),
           students: students, currentWeek: spWeekNow_(), types: RESOURCE_TYPES, maxUploadMb: CONFIG.MAX_UPLOAD_MB };
}

/** PUBLIC — add a lesson, or update one (when lesson.id is given). */
function teacherSaveLesson(token, code, week, lesson) {
  teacherAuth_(token);
  if (!courseByCode_(code)) throw new Error('Unknown class.');
  const w = Math.max(1, Math.min(CONFIG.TOTAL_WEEKS, Number(week) || 1));
  lesson = lesson || {};
  const title = clean_(lesson.title, 140);
  if (!title) throw new Error('Give the lesson a title.');
  const desc = clean_(lesson.description, 3000);
  const link = spLink_(lesson.link);

  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh = spSheet_(SP_SHEETS.LESSONS);
    if (lesson.id) {
      const row = spFindRow_(SP_SHEETS.LESSONS, lesson.id);
      if (row < 0) throw new Error('That lesson no longer exists.');
      sh.getRange(row, LS.TITLE, 1, 3).setValues([[title, desc, link]]);
      log_('teacher', 'LESSON_UPDATED', code + ' week ' + w + ' — ' + title);
    } else {
      const count = lessonsFor_(code).filter(function (l) { return l.week === w; }).length;
      if (count >= MAX_LESSONS_PER_WEEK) throw new Error('A week can hold up to ' + MAX_LESSONS_PER_WEEK + ' lessons.');
      sh.appendRow(['LS-' + Utilities.getUuid().slice(0, 8), code, w, title, desc, link,
                    new Date(), 'Teacher portal']);
      log_('teacher', 'LESSON_ADDED', code + ' week ' + w + ' — ' + title);
    }
    SpreadsheetApp.flush();
  } finally { lock.releaseLock(); }
  return { ok: true, lessons: lessonsFor_(code) };
}

/** PUBLIC — remove a lesson. */
function teacherDeleteLesson(token, code, id) {
  teacherAuth_(token);
  const row = spFindRow_(SP_SHEETS.LESSONS, id);
  if (row > 0) { spSheet_(SP_SHEETS.LESSONS).deleteRow(row); SpreadsheetApp.flush();
                 log_('teacher', 'LESSON_DELETED', id); }
  return { ok: true, lessons: lessonsFor_(code) };
}

/**
 * PUBLIC — add or update a resource. Either a link, or a file (base64) which is
 * saved to Drive in a "Class Resources" folder beside the homework uploads.
 */
function teacherSaveResource(token, code, res, fileName, mimeType, base64) {
  teacherAuth_(token);
  if (!courseByCode_(code)) throw new Error('Unknown class.');
  res = res || {};
  const title = clean_(res.title, 140);
  if (!title) throw new Error('Give the resource a title.');
  const type = RESOURCE_TYPES.indexOf(res.type) >= 0 ? res.type : 'Other';
  const week = res.week ? Math.max(1, Math.min(CONFIG.TOTAL_WEEKS, Number(res.week) || 0)) : '';
  const courseVal = res.allClasses ? 'ALL' : code;

  let link = spLink_(res.link), fileId = '';
  if (base64) {
    const bytes = Utilities.base64Decode(base64);
    if (bytes.length > CONFIG.MAX_UPLOAD_MB * 1024 * 1024) {
      throw new Error('That file is larger than ' + CONFIG.MAX_UPLOAD_MB + ' MB.');
    }
    const root = uploadFolder_();
    const it = root.getFoldersByName('Class Resources');
    const folder = it.hasNext() ? it.next() : root.createFolder('Class Resources');
    const safe = clean_(fileName, 140).replace(/[\\/:*?"<>|]/g, '-') || title;
    const file = folder.createFile(Utilities.newBlob(bytes, mimeType || 'application/octet-stream', safe));
    fileId = file.getId();
    link = shareableUrl_(fileId);
  }
  if (!link && !res.id) throw new Error('Add a link, or choose a file to upload.');

  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh = spSheet_(SP_SHEETS.RESOURCES);
    if (res.id) {
      const row = spFindRow_(SP_SHEETS.RESOURCES, res.id);
      if (row < 0) throw new Error('That resource no longer exists.');
      sh.getRange(row, RS.COURSE, 1, 3).setValues([[courseVal, week, title]]);
      sh.getRange(row, RS.TYPE).setValue(type);
      if (link) sh.getRange(row, RS.LINK).setValue(link);
      if (fileId) {
        const old = String(sh.getRange(row, RS.FILE_ID).getValue() || '');
        if (old) { try { DriveApp.getFileById(old).setTrashed(true); } catch (e) {} }
        sh.getRange(row, RS.FILE_ID).setValue(fileId);
      }
    } else {
      sh.appendRow(['RS-' + Utilities.getUuid().slice(0, 8), courseVal, week, title, type, link,
                    fileId, new Date(), 'Teacher portal']);
    }
    SpreadsheetApp.flush();
  } finally { lock.releaseLock(); }
  log_('teacher', 'RESOURCE_SAVED', courseVal + ' — ' + title);
  return { ok: true, resources: resourcesFor_(code) };
}

/** PUBLIC — remove a resource (and its uploaded file, if it has one). */
function teacherDeleteResource(token, code, id) {
  teacherAuth_(token);
  const row = spFindRow_(SP_SHEETS.RESOURCES, id);
  if (row > 0) {
    const sh = spSheet_(SP_SHEETS.RESOURCES);
    const fid = String(sh.getRange(row, RS.FILE_ID).getValue() || '');
    if (fid) { try { DriveApp.getFileById(fid).setTrashed(true); } catch (e) {} }
    sh.deleteRow(row); SpreadsheetApp.flush();
    log_('teacher', 'RESOURCE_DELETED', id);
  }
  return { ok: true, resources: resourcesFor_(code) };
}
