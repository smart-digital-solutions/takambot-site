<div dir="rtl" align="right">

# 🤖 TakamBot (תכמבוט) — בוט חכם להוראות התכ"ם | משרד התקשורת

[![Live Demo](https://img.shields.io/badge/🔗_Live_Demo-TakamBot_Site-4F46E5?style=for-the-badge&labelColor=1e293b)](https://smart-digital-solutions.github.io/takambot-site/)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Deployed-10B981?style=for-the-badge&logo=github)](https://smart-digital-solutions.github.io/takambot-site/)

ברוכים הבאים למאגר הקוד של **אתר הנחיתה הציבורי** של פרויקט **תכמבוט (TakamBot)** — מאגר מידע חכם מבוסס בינה מלאכותית (RAG) להנגשת **הוראות התכ״ם של משרד האוצר** עבור **משרד התקשורת**, עובדי מדינה, עוסקים ברכש ומנהל ציבורי. פותח על ידי **גיתאי שרון (Gitai Sharon)**.

זהו פרויקט Frontend סטטי (HTML/CSS/JS) נקי ורספונסיבי, המאוחסן ומוגש ישירות דרך **[GitHub Pages](https://smart-digital-solutions.github.io/takambot-site/)**.

> **הערה חשובה:** מאגר זה מכיל **אך ורק קוד תצוגה ציבורי**. הלוגיקה, עיבוד הנתונים, סנכרון הקבצים והמפתחות הסודיים (Backend) מנוהלים במאגר אוטומציה נפרד וסגור.

🔗 **מעבר לאתר החי בבלעדיות:** [https://smart-digital-solutions.github.io/takambot-site/](https://smart-digital-solutions.github.io/takambot-site/)

---

## ✨ ארכיטקטורה ויכולות

האתר עוצב בסטנדרט חוויית משתמש (UI/UX) גבוה עם דגש על אנימציות, ביצועים, SEO ואינדוקס בגוגל:

- **100% סטטי וחינמי:** אין צורך בשרת. הכל רץ ישירות מהדפדפן ונתמך על ידי GitHub Pages.
- **אנימציות WOW Edition:** גליצ'ים דינמיים, כדורי אור מרחפים, הטיה ומעברי צבע, המיושמים נטו באמצעות CSS מודרני ללא תלויות כבדות.
- **SEO & Google Search Indexing:** כולל `sitemap.xml`, `robots.txt`, `.nojekyll`, Schema.org (JSON-LD), Open Graph, ו-Static Pre-render HTML לאינדוקס מהיר בגוגל.
- **Tailwind CSS מובנה:** משתמש ב-CDN של Tailwind כדי לאפשר עיצוב נקי ללא תהליך בילד (Build) מורכב.
- **ניהול תוכן דינמי (notebooks.json):** הוספה והסרה של מחברות לא דורשות ידע בקוד או HTML. כל המחברות נטענות באופן דינמי מקובץ הגדרות.

---

## 📝 איך מעדכנים או מוסיפים מחברת לאתר?

כדי להוסיף מחברת חדשה (NotebookLM) אין צורך לגעת בקוד ה-HTML! 
האתר קורא את הנתונים בזמן אמת מתוך הקובץ `notebooks.json`.

**שלבי עדכון:**
1. פתחו את הקובץ `notebooks.json` כאן בגיטהאב.
2. הוסיפו בלוק חדש למערך הנתונים (שימו לב לפסיקים). דוגמה:
   ```json
   {
      "id": "notebook-new",
      "label": "ד׳",
      "title": "מחברת ד׳",
      "subtitle": "מכרזים סגורים",
      "url": "https://notebooklm.google.com/notebook/YOUR-LINK",
      "accentClass": "pink"
   }
   ```
3. בצעו שמירה (Commit).
4. המתינו 1-2 דקות ורעננו את האתר (אם הדפדפן שומר עותק ישן - בצעו Ctrl + F5).

---

## 🗂️ מבנה הקבצים

| קובץ | תיאור |
|------|-------|
| `index.html` | השלד המרכזי של האתר, כולל SEO, תגיות מטא, Schema.org JSON-LD ופריסת התוכן. |
| `style.css` | כללי העיצוב (CSS טהור), כולל אפקטי תלת־ממד, גלו, אנימציות גליץ' והגדרות חוויית המשתמש. |
| `script.js` | קוד לוגיקה ללקוח: טעינת מחברות מ-JSON, עכבר מגנטי, ספירות זזות, טוסט העתקה וסרטון. |
| `notebooks.json` | מסד הנתונים הסטטי ממנו הדף שואב את רשימת המחברות הפעילות להצגה. |
| `sitemap.xml` | מפת האתר הרשמית לסריקת מנועי חיפוש. |
| `robots.txt` | קובץ הנחיות לזחלנים של גוגל ובינג. |
| `.nojekyll` | קובץ עקיפת מנוע Jekyll ב-GitHub Pages. |
| `guide.mp4` | סרטון ההדרכה המוטמע באתר. |

---

## 🔒 אבטחה

- הריפו הזה (takambot-site) מיועד להיות **ציבורי (Public)** לחלוטין.
- **אין לשמור כאן:** מפתחות API, סיסמאות, קבצי `.env`, אישורי Google Drive או קוד אוטומציה בפייתון.
- האתר אינו אוסף או שומר מידע על משתמשים.

---

**פותח ע"י גיתאי שרון (Gitai Sharon) | משרד התקשורת - רכש, נכסים ולוגיסטיקה · 2026**  
🔗 **[מעבר לאתר TakamBot](https://smart-digital-solutions.github.io/takambot-site/)**

</div>
