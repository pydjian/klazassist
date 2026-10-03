// src/deped-calendar.ts
// ============================================================================
// DepEd School Calendar — bundled with KlazAssist
// ----------------------------------------------------------------------------
// This is the single source of truth for the universal DepEd calendar that
// ships with the app. Edit the string below and rebuild to push an update
// to every teacher on their next launch.
//
// Format: one event per line — "date,title"
//   • Single date:  2026-06-12,Independence Day
//   • Date range:   2026-07-01 to 2026-07-05,Exam Week
//   • Lines starting with # are comments and are ignored.
// ============================================================================

export const DEPED_CALENDAR_CSV = `# DepEd School Calendar
# School Year: 2026-2027
# Source: DepEd Order No. XXX, s. 2026
# Last updated: 2026-10-03
Date,Name of Event
4/1/2026,Start of 30-day Teachers’ EOSY Break
4/2/2026,Maundy Thursday (Regular Holiday)
4/3/2026,Good Friday (Regular Holiday)
4/4/2026,Black Saturday (Additional Special Non-Working Holiday)
4/9/2026,The Day of Valor (Regular Holiday)
2026-04-13 to 2026-04-17,2026 National Schools Press Conference (NSPC)
2026-04-18 to 2026-04-22,2026 National Festival of Talents (NFOT)
2026-04-25 to 2026-04-30,2026 Palarong Pambansa
5/1/2026,Labor Day (Regular Holiday)
5/1/2026,End of 30-day Teachers’ EOSY Break
2026-05-04 to 2026-05-22,EOSY Intervention Program
2026-05-04 to 2026-05-29,Training Window for Teachers, School Heads, and Teaching Related-Personnel
2026-05-04 to 2026-05-29,Oplan Balik Eskwela
2026-06-01 to 2026-06-05,Brigada Eskwela
2026-06-01 to 2026-06-05,Enrollment Period
2026-06-08 to 2026-06-11,Opening Block: Start of Term 1
2026-06-08 to 2026-06-11,Start of Mandatory Learners’ Health Assessment, Learners and Parents’ Orientation, and other activities
2026-06-08 to 2026-06-11,Start of Testing Window for BOSY Assessments (CRLA, RMA, Phil-IRI, etc.)
2026-06-08 to 2026-06-11,Gathering and Submission of Data needed for the New School Year (e.g. Class Program, School Forms, etc.)
6/12/2026,Independence Day (Regular Holiday)
2026-06-22 to 2026-06-26,Phil ECD Checklist for BOSY
6/23/2026,DepEd’s Founding Anniversary: Flag Raising Ceremony and Opening of Activity (Nationwide)
6/24/2026,DepEd’s Founding Anniversary: Anniversary Proper
7/3/2026,End of Mandatory Learners’ Health Assessment
7/6/2026,Term 1: First Teacher-made Summative Test
7/10/2026,End of Testing Window for BOSY Assessments (CRLA, RMA, Phil-IRI, etc.)
2026-07-13 to 2026-07-17,MFAT
2026-07-20 to 2026-07-24,National Federation SELG and SSLG Election
7/28/2026,Term 1: Second Teacher-made Summative Test
8/21/2026,Ninoy Aquino Day (Non-Working Holiday)
8/28/2026,Term 1 Examination
8/31/2026,National Heroes Day (Regular Holiday)
9/1/2026,Term 1 Examination
2026-09-02 to 2026-09-15,End-of-Term Block
2026-09-02 to 2026-09-08,ARAL Program, Computation of Grades, Accomplishment of School Forms, & Co-/Extra-Curricular Activities
9/5/2026,Start of National Teachers' Month
9/9/2026,PTA Meeting & Distribution of Report Cards
2026-09-10 to 2026-09-11,INSET
2026-09-10 to 2026-09-15,Wellness Break of Learners (Guided asynchronous learning experiences)
2026-09-14 to 2026-09-15,Wellness Break of Teachers
9/15/2026,End of Term 1
9/16/2026,Start of Term 2
9/16/2026,Start of Testing Window for NCAE (Grade 10 only)
2026-09-21 to 2026-09-25,Start of Testing Window for MOSY Assessments (CRLA, RMA, Phil-IRI, etc.)
10/5/2026,Culmination of National Teachers’ Month
10/5/2026,World Teachers' Day
2026-10-05 to 2026-10-09,NAT for Grade 10
10/7/2026,Term 2: First Teacher-made Summative Test
2026-10-19 to 2026-10-23,End of Testing Window for MOSY Assessments (CRLA, RMA, Phil-IRI, etc.)
10/29/2026,Term 2: Second Teacher-made Summative Test
11/1/2026,All Saints' Day (Special Non-Working Holiday)
11/2/2026,All Souls' Day (Additional Special Non-Working Holiday)
11/15/2026,PEPT (Luzon & VisMin Clusters)
11/27/2026,Araw ng Pagbasa
11/30/2026,Bonifacio Day (Regular Holiday)
2026-12-03 to 2026-12-04,Term 2 Examination
12/4/2026,End of Testing Window for NCAE (Grade 10 only)
2026-12-07 to 2026-12-18,End-of-Term Block
2026-12-07 to 2026-12-14,ARAL Program, Computation of Grades, Accomplishment of School Forms, & Co-/Extra-Curricular Activities
12/8/2026,Feast of the Immaculate Concepcion of Mary (Special Non-Working Holiday)
12/15/2026,PTA Meeting & Distribution of Progress/Performance Report
12/16/2026,Year-End Activity
2026-12-17 to 2026-12-18,INSET
2026-12-17 to 2026-12-18,Wellness Break of Learners (Guided asynchronous learning experiences)
12/18/2026,End of Term 2
2026-12-19 to 2026-12-31,Year-End Break (Wellness Break of Learners & Teachers)
12/24/2026,Christmas Eve (Special Non-Working Holiday)
12/25/2026,Christmas Day (Regular Holiday)
12/30/2026,Rizal Day (Regular Holiday)
12/31/2026,Last Day of the Year (Special Non-Working Holiday)
1/1/2027,New Year's Day (Regular Holiday)
1/4/2027,Start of Term 3
1/25/2027,Term 3: First Teacher-made Summative Test
1/30/2027,Start of Early Registration for Incoming Kinder, Grades 1, 7, 11, OSCYA, and Transferees
2027-02-01 to 2027-02-05,Start of Testing Window for EOSY Assessments (CRLA, RMA, Phil-IRI, etc.)
2/6/2027,Chinese New Year (Additional Special Non-Working Holiday)
2027-02-15 to 2027-02-19,NAT for Grade 12
2/16/2027,Term 3: Second Teacher-made Summative Test
2/26/2027,End of Early Registration for Incoming Kinder, Grades 1, 7, 11, OSCYA, and Transferees
2027-03-01 to 2027-03-05,ELLNA for Grade 3
2027-03-08 to 2027-03-12,NAT for Grade 6
2027-03-08 to 2027-03-12,End of Testing Window for EOSY Assessments (CRLA, RMA, Phil-IRI, etc.)
2027-03-15 to 2027-03-16,Term 3 Examination (Moving up/ Graduating Learners)
2027-03-15 to 2027-03-19,Phil ECD Checklist for EOSY
2027-03-17 to 2027-03-23,Computation of Grades, Accomplishment of School Forms, and Academic Deliberation (Moving Up/ Graduating Learners)
2027-03-22 to 2027-03-23,Term 3 Examination (Other Grade Levels)
2027-03-24, 2027-03-29 to 2027-03-30,End-of-Term Block
3/24/2027,Announcement of Academic Excellence Awardees (Moving up/ Graduating Learners)
2027-03-24, 2027-03-29 to 2027-03-30,Computation of Grades (Other Grade Levels), Accomplishment of School Forms, & Co-/Extra-Curricular Activities
3/25/2027,Maundy Thursday (Regular Holiday)
3/26/2027,Good Friday (Regular Holiday)
3/27/2027,Black Saturday (Additional Special Non-Working Holiday)
2027-04-01 to 2027-04-08,End-of-Term Block
4/1/2027,Accomplishment of School Forms & Co-/Extra-Curricular Activities
2027-04-02 to 2027-04-05,INSET
2027-04-06 to 2027-04-07,EOSY Rites
4/8/2027,PTA Meeting & Distribution of Report Cards
4/8/2027,End of Term 3
4/9/2027,The Day of Valor (Regular Holiday)
4/9/2027,Start of 30-day Teachers’ EOSY Break
2027-04-19 to 2027-04-23,2027 NSPC
2027-04-26 to 2027-04-30,2027 NFOT
5/1/2027,Labor Day (Regular Holiday)
2027-05-03 to 2027-05-07,2027 Palarong Pambansa
5/9/2027,End of 30-day Teachers’ EOSY Break
2027-05-10 to 2027-05-14,Start of EOSY Intervention Program
2027-05-10 to 2027-05-14,Start of Training Window for Teachers, School Heads, and Teaching Related-Personnel
5/17/2027,Start of Oplan Balik Eskwela
2027-06-01 to 2027-06-04,End of Training Window for Teachers, School Heads, and Teaching Related-Personnel
6/4/2027,End of Oplan Balik Eskwela
2027-06-07 to 2027-06-11,Brigada Eskwela
2027-06-07 to 2027-06-11,Enrollment Period

`;

// A simple version tag — bump this when you ship a new calendar, so anyone
// reading the release notes can tell at a glance which version of the
// calendar they're getting.
export const DEPED_CALENDAR_VERSION = '2026-10-03';