import { useState, useRef } from "react";
import { X, ChevronDown, ChevronUp, Save, Edit, Plus, Trash, MapPin, Building, Home, Briefcase, Phone, Mail, Calendar, Clock, AlertTriangle, Star, FileText, History } from "lucide-react";

const P = {
  blue:"bg-blue-100 text-blue-800 border-blue-200", green:"bg-green-100 text-green-800 border-green-200",
  yellow:"bg-yellow-100 text-yellow-800 border-yellow-200", red:"bg-red-100 text-red-800 border-red-200",
  purple:"bg-purple-100 text-purple-800 border-purple-200", gray:"bg-gray-100 text-gray-700 border-gray-200",
  orange:"bg-orange-100 text-orange-800 border-orange-200", indigo:"bg-indigo-100 text-indigo-800 border-indigo-200",
};
const Badge = ({color="gray",children,dot})=>(
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${P[color]}`}>
    {dot&&<span className={`w-1.5 h-1.5 rounded-full ${dot}`}/>}{children}
  </span>
);
const CardComp=({title,icon,children,action,color="blue",fixedH})=>(
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col${fixedH?` ${fixedH}`:""}`}>
    <div className={`px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-${color}-50 shrink-0`}>
      <h4 className={`text-sm font-semibold text-${color}-800 flex items-center gap-2`}>{icon}{title}</h4>
      {action}
    </div>
    <div className="p-4 overflow-y-auto flex-1">{children}</div>
  </div>
);
const KV=({label,val,bold})=>(
  <div className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
    <span className="text-xs text-gray-500">{label}</span>
    <span className={`text-xs ${bold?"font-semibold text-gray-900":"text-gray-700"}`}>{val}</span>
  </div>
);
const Stat=({label,val,sub,color="blue"})=>(
  <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-4`}>
    <p className={`text-2xl font-bold text-${color}-900`}>{val}</p>
    <p className={`text-xs font-medium text-${color}-700`}>{label}</p>
    {sub&&<p className={`text-xs text-${color}-500 mt-0.5`}>{sub}</p>}
  </div>
);
const F=({label,req,hint,children})=>(
  <div>
    <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}{req&&<span className="text-red-500 mr-0.5"> *</span>}</label>
    {children}
    {hint&&<p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);
const Inp=(props)=><input {...props} className={`border rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none ${props.className||"border-gray-300"}`}/>;
const Sel=({options,placeholder,...props})=>(
  <select {...props} className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-300 outline-none">
    {placeholder&&<option value="">{placeholder}</option>}
    {options.map(o=><option key={o}>{o}</option>)}
  </select>
);
const Txt=(props)=><textarea {...props} className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm resize-none focus:ring-2 focus:ring-blue-300 outline-none"/>;

const COUNTRIES=["ישראל","ארצות הברית","בריטניה","גרמניה","צרפת","הולנד","איטליה","ספרד","שוויץ","סין","יפן","הודו","ברזיל","קנדה","אוסטרליה","אחר"];
const CREDIT_DAYS=["30","45","60","75","90","120","150","180"];
const CURRENCIES=["USD","EUR","GBP","ILS","CHF","JPY","CNY"];
const CHANNELS=["טלפון","מייל","פגישה","פורטל לקוחות","אחר"];
const REQUEST_REASONS={
  coverage_change:["כניסה לשוק/מוצר חדש","גידול במחזור העסקי","הרחבה גיאוגרפית","דרישת לקוח/בנק","עדכון תנאי חוזה","שינוי מבנה עסקי","אחר"],
  credit_limit:["לקוח/ספק חדש","הגדלת היקף עסקאות","חידוש תקרה שנתית","שיפור בדירוג האשראי","דרישת ועדת אשראי","אחר"],
  claim:["אי-תשלום חשבוניות","פשיטת רגל מוכרזת","הליך חדלות פירעון","סכסוך מסחרי","הונאה חשודה","סיכון פוליטי","אחר"],
  document:["דרישת בנק/מממן","דרישת לקוח","חידוש חוזה","ביקורת פנימית","דרישה רגולטורית","אחר"],
  payment:["חיוב שגוי","פריסת תשלומים","בקשת זיכוי","עדכון פרטי בנק","אחר"],
  complaint:["זמן תגובה ארוך","טיפול לקוי בתביעה","מידע שגוי שנמסר","שגיאה בחיוב","חוסר תקשורת","אחר"],
  info:["הבנת תנאי פוליסה","בירור כיסוי","ייעוץ לפני החלטה","שאלה כללית","אחר"],
  other:["פנייה שוטפת","בקשה פנימית","אחר"],
};
const CONTACTS_LIST=[{name:"John Smith",role:"CEO",phone:"123-456-7890"},{name:"Sarah Johnson",role:"CFO",phone:"123-555-7777"}];
const POLICIES_LIST=["POL-2023-001 (פעיל)","POL-2022-001","POL-2021-001"];
const DEBTORS_LIST=["Tech Solutions Ltd.","Global Manufacturing Inc.","Retail Partners Co.","European Trade GmbH","Pacific Imports LLC"];
const TEAM_MEMBERS=["נועה לוי (קשרי לקוחות)","אבי כהן (חיתום)","רון כץ (חיתום)","דנה מור (אשראי)","יעל גל (כספים)","רוברט בראון (תביעות)"];
const PRIORITIES=[
  {value:"critical",label:"קריטי",color:"bg-red-100 border-red-400 text-red-800",dot:"bg-red-500"},
  {value:"high",label:"גבוהה",color:"bg-orange-100 border-orange-400 text-orange-800",dot:"bg-orange-500"},
  {value:"medium",label:"בינונית",color:"bg-yellow-100 border-yellow-400 text-yellow-800",dot:"bg-yellow-500"},
  {value:"low",label:"נמוכה",color:"bg-gray-100 border-gray-300 text-gray-700",dot:"bg-gray-400"},
];
const REQ_TYPES=[
  {value:"coverage_change",label:"שינוי / הרחבת כיסוי",icon:"🛡️",desc:"שינוי תנאי פוליסה, הרחבת כיסוי"},
  {value:"credit_limit",label:"תקרת אשראי",icon:"💳",desc:"אישור, הגדלה או חידוש תקרת אשראי"},
  {value:"claim",label:"פתיחת תביעה",icon:"📢",desc:"דיווח על אירוע נזק"},
  {value:"document",label:"בקשת מסמך / אישור",icon:"📄",desc:"אישור פוליסה, מכתב כיסוי"},
  {value:"payment",label:"פנייה בנושא תשלומים",icon:"💰",desc:"חיוב פרמיה, הסדר תשלומים"},
  {value:"info",label:"בקשת מידע / ייעוץ",icon:"💬",desc:"שאלה כללית, הבהרה"},
  {value:"complaint",label:"תלונה / פנייה בשירות",icon:"⚠️",desc:"חוסר שביעות רצון מהשירות"},
  {value:"other",label:"אחר",icon:"📋",desc:"פנייה שאינה משתייכת לקטגוריה אחרת"},
];
const TASK_TYPES_BY_REQ={
  coverage_change:[{value:"underwriting_review",label:"בחינת חיתום",icon:"🔍",cat:"Policy"},{value:"docs_collection",label:"איסוף מסמכים",icon:"📎",cat:"Policy"},{value:"client_approval",label:"אישור לקוח",icon:"✅",cat:"Policy"},{value:"policy_update",label:"עדכון פוליסה",icon:"🖊️",cat:"Policy"},{value:"notification",label:"הודעה ללקוח",icon:"📬",cat:"General"}],
  credit_limit:[{value:"credit_check",label:"בדיקת אשראי",icon:"📊",cat:"Credit"},{value:"financial_docs",label:"דוחות כספיים",icon:"📄",cat:"Credit"},{value:"risk_assessment",label:"הערכת סיכון",icon:"⚖️",cat:"Credit"},{value:"approval_committee",label:"ועדת אשראי",icon:"🏛️",cat:"Credit"},{value:"credit_update",label:"עדכון תקרה",icon:"🖊️",cat:"Credit"}],
  claim:[{value:"claim_reg",label:"רישום תביעה",icon:"📋",cat:"Claims"},{value:"docs_col",label:"איסוף מסמכים",icon:"📎",cat:"Claims"},{value:"investigation",label:"חקירת התביעה",icon:"🔎",cat:"Claims"},{value:"cov_check",label:"בדיקת כיסוי",icon:"🛡️",cat:"Claims"},{value:"pay_approval",label:"אישור תשלום",icon:"💳",cat:"Claims"},{value:"client_upd",label:"עדכון לקוח",icon:"📬",cat:"Claims"}],
  document:[{value:"doc_prep",label:"הכנת המסמך",icon:"✏️",cat:"General"},{value:"legal_rev",label:"בדיקה משפטית",icon:"⚖️",cat:"General"},{value:"doc_delivery",label:"שליחה ללקוח",icon:"📬",cat:"General"}],
  payment:[{value:"bill_check",label:"בדיקת חיוב",icon:"🔍",cat:"Finance"},{value:"fin_approval",label:"אישור כספים",icon:"✅",cat:"Finance"},{value:"pay_proc",label:"עיבוד תשלום",icon:"💰",cat:"Finance"},{value:"receipt",label:"הפקת קבלה",icon:"🧾",cat:"Finance"}],
  info:[{value:"research",label:"בדיקת מידע",icon:"🔍",cat:"General"},{value:"response",label:"מענה ללקוח",icon:"📬",cat:"General"}],
  complaint:[{value:"comp_rev",label:"בדיקת התלונה",icon:"🔎",cat:"General"},{value:"escalation",label:"העברה למנהל",icon:"⬆️",cat:"General"},{value:"resolution",label:"גיבוש פתרון",icon:"🤝",cat:"General"},{value:"feedback",label:"עדכון לקוח",icon:"📬",cat:"General"}],
  other:[{value:"gen_task",label:"משימה כללית",icon:"📋",cat:"General"},{value:"followup",label:"מעקב",icon:"🔄",cat:"General"},{value:"notif",label:"הודעה ללקוח",icon:"📬",cat:"General"}],
};

function fileIcon(type){if(!type)return"📎";if(type.includes("pdf"))return"📄";if(type.includes("image"))return"🖼️";if(type.includes("sheet")||type.includes("excel"))return"📊";return"📎";}
function fmtSize(b){return b<1024*1024?`${(b/1024).toFixed(0)} KB`:`${(b/1024/1024).toFixed(1)} MB`;}

function CreditTermsPicker(){
  const OPTIONS=["30 ימים","45 ימים","60 ימים","75 ימים","90 ימים","120 ימים","150 ימים","180 ימים","210 ימים","240 ימים","270 ימים","360 ימים","שוטף+30","שוטף+60","שוטף+90","שוטף+120","לפי הזמנה","לפי חוזה","מיידי","אחר"];
  const [selected,setSelected]=useState([]);
  const [open,setOpen]=useState(false);
  const toggle=v=>setSelected(prev=>prev.includes(v)?prev.filter(x=>x!==v):[...prev,v]);
  return(
    <F label="תנאי אשראי" req>
      <div className="relative">
        <div onClick={()=>setOpen(o=>!o)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm min-h-[38px] flex flex-wrap gap-1 items-center cursor-pointer hover:border-blue-400 bg-white focus:ring-2 focus:ring-blue-300">
          {selected.length===0
            ? <span className="text-gray-400">-- בחר תנאי אשראי --</span>
            : selected.map(v=>(
                <span key={v} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200">
                  {v}
                  <button type="button" onClick={e=>{e.stopPropagation();toggle(v);}} className="hover:text-red-600 font-bold leading-none">×</button>
                </span>
              ))
          }
          <span className="mr-auto text-gray-400 text-xs">{open?"▲":"▼"}</span>
        </div>
        {open&&(
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-y-auto" style={{maxHeight:"180px"}}>
            {OPTIONS.map(v=>(
              <div key={v} onClick={()=>toggle(v)}
                className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 ${selected.includes(v)?"bg-blue-50 text-blue-800 font-medium":"text-gray-700"}`}>
                <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 text-xs ${selected.includes(v)?"bg-blue-600 border-blue-600 text-white":"border-gray-300"}`}>
                  {selected.includes(v)&&"✓"}
                </span>
                {v}
              </div>
            ))}
          </div>
        )}
      </div>
    </F>
  );
}

function DynamicFields({reqType}){
  if(reqType==="coverage_change") return(
    <div className="space-y-3">
      <F label="פוליסה לשינוי" req><Sel options={POLICIES_LIST} placeholder="-- בחר פוליסה --"/></F>
      <F label="סוג כיסוי" req><Sel options={["ביטוח אשראי סחר מקומי","ביטוח אשראי סחר חוץ","ביטוח אשראי יצוא","כיסוי סיכון פוליטי","כיסוי חדלות פירעון","כיסוי תביעות מסחריות","אחר"]} placeholder="-- בחר סוג כיסוי --"/></F>
      <F label="סוג השינוי" req><Sel options={["הגדלת תקרת כיסוי","הוספת ענף פעילות","שינוי השתתפות עצמית","הרחבה גיאוגרפית","הוספת חייב חדש","שינוי תנאי פוליסה","אחר"]} placeholder="-- בחר --"/></F>
      <F label="פרטי השינוי" req><Txt rows={4} placeholder="פרט את פרטי השינוי המבוקש..."/></F>
    </div>
  );
  if(reqType==="credit_limit"){
    const DEBTOR_META={
      "Tech Solutions Ltd.":{country:"ארצות הברית",industry:"טכנולוגיה"},
      "Global Manufacturing Inc.":{country:"סין",industry:"ייצור תעשייתי"},
      "Retail Partners Co.":{country:"בריטניה",industry:"קמעונאות"},
      "European Trade GmbH":{country:"גרמניה",industry:"סחר / ייבוא-יצוא"},
      "Pacific Imports LLC":{country:"ארצות הברית",industry:"ייבוא / יצוא"},
    };
    const ReadOnly=({val})=>(
      <div className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm bg-gray-50 flex items-center justify-between gap-2">
        <span className={val?"text-gray-700 font-medium":"text-gray-400 italic"}>{val||"— ימולא אוטומטית"}</span>
        <span className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-500 rounded font-medium shrink-0">אוטו׳</span>
      </div>
    );
    const [selDebtor,setSelDebtor]=useState("");
    const meta=DEBTOR_META[selDebtor]||{country:"",industry:""};
    return(
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <F label="שם החייב" req>
              <div className="flex gap-2">
                <Inp value={selDebtor} onChange={e=>setSelDebtor(e.target.value)} placeholder="הזן שם חייב..." className="flex-1"/>
                <button type="button" className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 border border-blue-300 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 shrink-0 whitespace-nowrap">
                  🔍 חפש חייב
                </button>
              </div>
            </F>
          </div>
          <F label="מדינת החייב"><ReadOnly val={meta.country}/></F>
          <F label="ענף פעילות"><ReadOnly val={meta.industry}/></F>
          <F label="סוג הבקשה" req><Sel options={["פתיחת תקרה חדשה","הגדלת תקרה קיימת","חידוש תקרה","הקטנת תקרה"]} placeholder="-- בחר --"/></F>
          <F label="פוליסה קשורה" req><Sel options={POLICIES_LIST} placeholder="-- בחר פוליסה --"/></F>
          <F label="סוג כיסוי" req><Sel options={["ביטוח אשראי סחר מקומי","ביטוח אשראי סחר חוץ","ביטוח אשראי יצוא","כיסוי סיכון פוליטי","כיסוי חדלות פירעון","כיסוי תביעות מסחריות","אחר"]} placeholder="-- בחר סוג כיסוי --"/></F>
          <div/>
          <F label="סכום מבוקש" req>
            <div className="flex gap-2"><Inp type="number" placeholder="0" className="flex-1"/><select className="border border-gray-300 rounded-lg px-2 py-2 text-sm outline-none w-20 shrink-0">{CURRENCIES.map(c=><option key={c}>{c}</option>)}</select></div>
          </F>
          <div className="col-span-2">
            <CreditTermsPicker/>
          </div>
        </div>
      </div>
    );
  }
  if(reqType==="claim") return(
    <div className="space-y-3">
      <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 font-medium">⚠️ מלא את פרטי האירוע בהקדם – עמידה בזמני הדיווח חיונית</div>
      <div className="grid grid-cols-2 gap-3">
        <F label="שם החייב" req><Sel options={DEBTORS_LIST} placeholder="-- בחר חייב --"/></F>
        <F label="פוליסה רלוונטית" req><Sel options={POLICIES_LIST} placeholder="-- בחר פוליסה --"/></F>
        <F label="סוג האירוע" req><Sel options={["אי-תשלום","חדלות פירעון","פשיטת רגל","סכסוך מסחרי","הונאה","סיכון פוליטי","אחר"]} placeholder="-- בחר סוג --"/></F>
        <F label="שלב התביעה" req><Sel options={["חוב שטרם הגיע לפירעון","חוב פגום","הליך משפטי","כינוס נכסים / פירוק","אחר"]} placeholder="-- בחר שלב --"/></F>
        <F label="תאריך האירוע" req><Inp type="date"/></F>
        <F label="תאריך הגילוי" req hint="מתי הפכת מודע לאירוע?"><Inp type="date"/></F>
        <F label="סכום החוב הנתבע" req>
          <div className="flex gap-2"><Inp type="number" placeholder="0" className="flex-1"/><select className="border border-gray-300 rounded-lg px-2 py-2 text-sm outline-none w-20 shrink-0">{CURRENCIES.map(c=><option key={c}>{c}</option>)}</select></div>
        </F>
        <F label="סכום מוכר בספרים"><Inp type="number" placeholder="0"/></F>
      </div>
      <F label="תיאור האירוע" req><Txt rows={3} placeholder="תאר את נסיבות האירוע..."/></F>
    </div>
  );
  if(reqType==="document") return(
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <F label="סוג המסמך" req><Sel options={["אישור פוליסה","מכתב כיסוי","תעודת ביטוח","גיליון פוליסה מלא","אישור לבנק","אחר"]} placeholder="-- בחר --"/></F>
        <F label="פוליסה קשורה"><Sel options={POLICIES_LIST} placeholder="-- לא רלוונטי --"/></F>
        <F label="מוען המסמך" hint="שם הגוף שהמסמך מיועד אליו"><Inp placeholder="למשל: Bank Leumi"/></F>
        <F label="נדרש עד תאריך"><Inp type="date"/></F>
      </div>
      <F label="פרטים נוספים"><Txt rows={2} placeholder="הבהרות לגבי תוכן המסמך..."/></F>
    </div>
  );
  if(reqType==="payment") return(
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <F label="נושא הפנייה" req><Sel options={["שאלה על חיוב","הסדר תשלומים","בקשת קבלה / חשבונית","עדכון פרטי בנק","החזר / זיכוי","אחר"]} placeholder="-- בחר --"/></F>
        <F label="פוליסה קשורה"><Sel options={POLICIES_LIST} placeholder="-- לא רלוונטי --"/></F>
        <F label="סכום בשאלה"><Inp type="number" placeholder="0"/></F>
        <F label="תאריך חיוב"><Inp type="date"/></F>
      </div>
      <F label="פרטי הפנייה" req><Txt rows={3} placeholder="פרט את השאלה או הבקשה..."/></F>
    </div>
  );
  if(reqType==="complaint") return(
    <div className="space-y-3">
      <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">⚠️ פנייה זו תועבר לטיפול מיידי של הממונה</div>
      <div className="grid grid-cols-2 gap-3">
        <F label="נושא התלונה" req><Sel options={["זמן תגובה","טיפול בתביעה","שירות לקוחות","שגיאה בחיוב","מידע שגוי","אחר"]} placeholder="-- בחר --"/></F>
        <F label="אירוע / מסמך קשור"><Inp placeholder="מספר תביעה, SR..."/></F>
      </div>
      <F label="תיאור התלונה" req><Txt rows={3} placeholder="פרט את מהות התלונה..."/></F>
      <F label="פתרון מצופה"><Txt rows={2} placeholder="מה הלקוח מבקש?"/></F>
    </div>
  );
  return(
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <F label="פוליסה קשורה"><Sel options={POLICIES_LIST} placeholder="-- לא רלוונטי --"/></F>
        <F label="חייב קשור"><Sel options={DEBTORS_LIST} placeholder="-- לא רלוונטי --"/></F>
      </div>
      <F label="תיאור הבקשה / השאלה" req><Txt rows={4} placeholder="פרט את הבקשה..."/></F>
    </div>
  );
}

const srSpecificFields={
  "SR-2025-042":{fields:[["פוליסה לשינוי","POL-2023-001 (פעיל)"],["סוג השינוי","הגדלת תקרת כיסוי"],["כיסוי נוכחי","$2,500,000"],["כיסוי מבוקש","$3,500,000"],["השתתפות עצמית","ללא שינוי"],["תאריך כניסה לתוקף","2025-03-01"],["נימוק","כניסה לקו מוצרים חדש – SaaS"]]},
  "SR-2025-038":{fields:[["סוג הבקשה","פתיחת תקרה חדשה"],["שם החייב","Pacific Imports LLC"],["מדינת החייב","United States"],["ענף פעילות","ייבוא / יצוא"],["סכום מבוקש","USD 400,000"],["ימי אשראי","60 ימים"],["מסמכים שצורפו","דוחות כספיים, חוזה"]]},
  "SR-2025-031":{fields:[["נושא","עדכון פרטי בנק"],["IBAN חדש","IL76-0108-0000-0000-9999-123"],["SWIFT","POALILIT"],["שם הבנק","Bank Hapoalim"],["סניף","תל אביב – 600"]]},
  "SR-2025-055":{fields:[["נושא הפנייה","הסדר תשלומים"],["פוליסה קשורה","POL-2023-001"],["סכום פרמיה","$38,000"],["מספר תשלומים","4 תשלומים רבעוניים"],["תשלום ראשון","2025-04-01"],["סיבה","לחץ תזרימי זמני"]]},
};
const srTimeline={
  "SR-2025-042":[{date:"2025-02-10",time:"09:15",actor:"נועה לוי",action:"בקשה נפתחה",type:"open"},{date:"2025-02-10",time:"09:20",actor:"מערכת",action:"הועברה לחיתום",type:"assign"},{date:"2025-02-12",time:"11:00",actor:"רון כץ",action:"נפתחה לבחינה",type:"progress"},{date:"2025-02-18",time:"14:30",actor:"רון כץ",action:"נדרשים מסמכים נוספים",type:"note"},{date:"2025-02-19",time:"10:00",actor:"נועה לוי",action:"הלקוח הועבר לבקשת מסמכים",type:"note"}],
  "SR-2025-038":[{date:"2025-02-05",time:"10:00",actor:"נועה לוי",action:"בקשה נפתחה",type:"open"},{date:"2025-02-05",time:"10:05",actor:"מערכת",action:"הועברה לאשראי",type:"assign"},{date:"2025-02-08",time:"09:00",actor:"דנה מור",action:"בחינה החלה",type:"progress"},{date:"2025-02-15",time:"13:00",actor:"דנה מור",action:"תקרה אושרה – $400,000",type:"approve"},{date:"2025-02-19",time:"08:30",actor:"מערכת",action:"הבקשה הושלמה ונסגרה",type:"close"}],
  "SR-2025-031":[{date:"2025-01-28",time:"14:00",actor:"Sarah Johnson",action:"בקשה נפתחה",type:"open"},{date:"2025-01-28",time:"14:10",actor:"מערכת",action:"הועברה לכספים",type:"assign"},{date:"2025-02-03",time:"11:00",actor:"יעל גל",action:"פרטים אומתו ועודכנו",type:"close"}],
  "SR-2025-055":[{date:"2025-02-19",time:"16:20",actor:"John Smith",action:"בקשה נפתחה",type:"open"},{date:"2025-02-19",time:"16:25",actor:"מערכת",action:"הוקצתה לנועה לוי",type:"assign"}],
};
const tlColor={open:"bg-blue-500",assign:"bg-gray-400",progress:"bg-yellow-500",note:"bg-orange-400",approve:"bg-green-500",close:"bg-green-600"};
const srTypeColor={"Coverage Change":"orange","Credit Limit":"green","Finance":"purple","Administrative":"gray"};
const srTypeIcon={"Coverage Change":"🛡️","Credit Limit":"💳","Finance":"💰","Administrative":"📄"};
const priColor={High:"red",Medium:"yellow",Normal:"gray",Low:"gray"};
const typeCol={Call:"blue",Email:"purple",Meeting:"yellow"};
const stCol={Open:"blue","In Progress":"yellow",Closed:"gray",Sent:"purple",Completed:"green",Pending:"yellow","Closed – Rejected":"red",Settled:"green"};

function SRDetailsModal({sr,onClose}){
  const tl=srTimeline[sr.srNum]||[];
  const typeColor=srTypeColor[sr.type]||"gray";
  const typeIcon=srTypeIcon[sr.type]||"📋";
  return(
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col" style={{width:"780px",maxWidth:"95vw",height:"82vh"}}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50 rounded-t-xl shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-lg shrink-0">{typeIcon}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-bold text-gray-900 truncate">{sr.subject}</h2>
                <Badge color={typeColor}>{sr.type}</Badge>
                <Badge color={sr.status==="Completed"?"green":sr.status==="In Progress"?"yellow":"blue"}>{sr.status==="Completed"?"הושלמה":sr.status==="In Progress"?"בטיפול":"פתוחה"}</Badge>
              </div>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                <span className="font-mono font-semibold text-blue-700">{sr.srNum}</span><span>·</span>
                <span>נפתח: {sr.opened}</span><span>·</span>
                <span className={new Date(sr.sla)<new Date()&&sr.status!=="Completed"?"text-red-600 font-semibold":""}>SLA: {sr.sla}{new Date(sr.sla)<new Date()&&sr.status!=="Completed"?" ⚠️":""}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-200 shrink-0 mr-2"><X size={16}/></button>
        </div>
        <div className="flex flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 border-l border-gray-100">
            {sr.status!=="Completed"&&<div className="flex gap-2"><button className="flex-1 py-1.5 bg-white border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50">עדכן סטטוס</button><button className="flex-1 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700">✓ סמן כהושלם</button></div>}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">כללי</p>
              {[["סוג",<Badge color={typeColor}>{typeIcon} {sr.type}</Badge>],["עדיפות",<Badge color={priColor[sr.priority]||"gray"} dot={sr.priority==="High"?"bg-red-500":sr.priority==="Medium"?"bg-yellow-500":"bg-gray-400"}>{sr.priority}</Badge>],["תאריך פתיחה",sr.opened],["נפתח ע״י",sr.createdBy||"נועה לוי"],["מקור הבקשה",sr.origin==="client"?<Badge color="blue">📥 בקשת לקוח</Badge>:<Badge color="indigo">🏢 יוזמת ביטוח אשראי</Badge>],["גורם פונה","John Smith – CEO"],["ערוץ פנייה","מייל"]].map(([l,v],i)=>(
                <div key={i} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0 gap-2"><span className="text-xs text-gray-500 shrink-0">{l}</span><span className="text-xs font-medium text-gray-900">{v}</span></div>
              ))}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs font-bold text-blue-500 uppercase tracking-wide mb-2">גורם מטפל</p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">{(sr.createdBy||"נועה לוי").slice(0,2)}</div>
                <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-gray-900">{sr.createdBy||"נועה לוי"}</p><p className="text-xs text-gray-500">קשרי לקוחות</p></div>
                <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${sr.status==="Completed"?"bg-green-100 text-green-700 border-green-200":sr.status==="In Progress"?"bg-yellow-100 text-yellow-700 border-yellow-200":"bg-blue-100 text-blue-700 border-blue-200"}`}>{sr.status==="Completed"?"הושלם":sr.status==="In Progress"?"בטיפול":"ממתין"}</span>
              </div>
            </div>
            {srSpecificFields[sr.srNum]&&(
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{typeIcon} פרטים – {sr.type}</p>
                {srSpecificFields[sr.srNum].fields.map(([l,v],i)=>(
                  <div key={i} className="flex justify-between items-start py-1 border-b border-gray-100 last:border-0 gap-2"><span className="text-xs text-gray-500 shrink-0">{l}</span><span className="text-xs font-medium text-gray-900 text-left break-all">{v}</span></div>
                ))}
              </div>
            )}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs font-bold text-yellow-600 uppercase tracking-wide mb-1.5">📎 הוסף הערה</p>
              <Txt rows={2} placeholder="הערה פנימית לצוות – לא תועבר ללקוח..."/>
              <button className="mt-1.5 px-3 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600">שמור הערה</button>
            </div>
          </div>
          <div className="overflow-y-auto px-4 py-3 bg-gray-50" style={{width:"240px",minWidth:"240px"}}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">היסטוריית טיפול</p>
            <div className="relative">
              <div className="absolute right-2 top-0 bottom-0 w-px bg-gray-200"/>
              <div className="space-y-3.5">
                {tl.map((ev,i)=>(
                  <div key={i} className="pr-6 relative">
                    <div className={`absolute right-0 w-4 h-4 rounded-full flex items-center justify-center ${tlColor[ev.type]||"bg-gray-400"}`}>
                      <span className="text-white" style={{fontSize:"8px"}}>{ev.type==="open"?"⊕":ev.type==="close"||ev.type==="approve"?"✓":ev.type==="note"?"✎":"→"}</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 leading-snug">{ev.action}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{ev.actor}</p>
                    <p className="text-xs text-gray-300">{ev.date} · {ev.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="px-5 py-2.5 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-between items-center shrink-0">
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-gray-300 bg-white text-gray-700 rounded text-xs hover:bg-gray-50 flex items-center gap-1"><Edit size={11}/> ערוך</button>
            <button className="px-3 py-1.5 border border-red-200 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100">בטל בקשה</button>
          </div>
          <button onClick={onClose} className="px-4 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-900">סגור</button>
        </div>
      </div>
    </div>
  );
}

function TaskDetailsModal({task,onClose,onComplete}){
  const isLate=task.status!=="Completed"&&new Date(task.due)<new Date();
  return(
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col" style={{width:"620px",maxWidth:"95vw",maxHeight:"88vh"}}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50 rounded-t-xl shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-3 h-3 rounded-full shrink-0 ${task.status==="Completed"?"bg-green-500":isLate?"bg-red-500":"bg-blue-500"}`}/>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-gray-900 truncate">{task.title}</h2>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                <span className="font-semibold text-blue-700">{task.source==="sr"?task.srNum:task.dept}</span><span>·</span>
                <span>יעד: {task.due}</span>
                {isLate&&<span className="text-red-600 font-semibold">⚠️ באיחור</span>}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-200 shrink-0 mr-2"><X size={16}/></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {task.status!=="Completed"&&(
            <div className="flex gap-2">
              <button className="flex-1 py-1.5 bg-white border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50">עדכן סטטוס</button>
              <button onClick={()=>{onComplete(task.id);onClose();}} className="flex-1 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700">✓ סמן כהושלם</button>
            </div>
          )}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">פרטי משימה</p>
            {[
              ["סטטוס",<span className={`px-2 py-0.5 text-xs rounded-full font-medium ${task.status==="Completed"?"bg-green-100 text-green-800":isLate?"bg-red-100 text-red-800":"bg-blue-100 text-blue-800"}`}>{task.status==="Completed"?"הושלם":isLate?"באיחור":"פתוח"}</span>],
              ["קטגוריה",<Badge color={task.cat==="Policy"?"blue":task.cat==="Finance"?"purple":task.cat==="Credit"?"green":task.cat==="Claims"?"red":task.cat==="Compliance"?"orange":"gray"}>{task.cat}</Badge>],
              ["עדיפות",<Badge color={task.priority==="High"?"red":task.priority==="Medium"?"yellow":"gray"} dot={task.priority==="High"?"bg-red-500":task.priority==="Medium"?"bg-yellow-500":"bg-gray-400"}>{task.priority}</Badge>],
              ["תאריך יעד",<span className={isLate?"text-red-700 font-bold":""}>{task.due}{isLate?" ⚠️":""}</span>],
              ["מוקצה ל",task.assignee],
            ].map(([l,v],i)=>(
              <div key={i} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0 gap-2">
                <span className="text-xs text-gray-500 shrink-0">{l}</span><span className="text-xs font-medium text-gray-900">{v}</span>
              </div>
            ))}
          </div>
          <div className={`border rounded-lg p-3 ${task.source==="sr"?"bg-orange-50 border-orange-200":"bg-indigo-50 border-indigo-200"}`}>
            <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${task.source==="sr"?"text-orange-500":"text-indigo-500"}`}>מקור המשימה</p>
            {task.source==="sr"?(
              <div className="space-y-1">
                <div className="flex justify-between"><span className="text-xs text-gray-500">מספר בקשה</span><span className="text-xs font-bold text-orange-700">{task.srNum}</span></div>
                <div className="flex justify-between"><span className="text-xs text-gray-500">נושא הבקשה</span><span className="text-xs font-medium text-gray-800">{task.srSubject}</span></div>
              </div>
            ):(
              <div className="space-y-1">
                <div className="flex justify-between"><span className="text-xs text-gray-500">מחלקה יוזמת</span><span className="text-xs font-bold text-indigo-700">{task.dept}</span></div>
              </div>
            )}
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs font-bold text-yellow-600 uppercase tracking-wide mb-1.5">📎 הוסף הערה</p>
            <Txt rows={2} placeholder="הערה פנימית למבצע המשימה..."/>
            <button className="mt-1.5 px-3 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600">שמור הערה</button>
          </div>
        </div>
        <div className="px-5 py-2.5 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-between items-center shrink-0">
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-gray-300 bg-white text-gray-700 rounded text-xs hover:bg-gray-50 flex items-center gap-1"><Edit size={11}/> ערוך</button>
            <button className="px-3 py-1.5 border border-red-200 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100">בטל משימה</button>
          </div>
          <button onClick={onClose} className="px-4 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-900">סגור</button>
        </div>
      </div>
    </div>
  );
}

function NewClientRequestModal({onClose}){
  const [step,setStep]=useState(1);
  const [reqType,setReqType]=useState(null);
  const [priority,setPriority]=useState("high");
  const [channel,setChannel]=useState("טלפון");
  const [contact,setContact]=useState(CONTACTS_LIST[0].name);
  const [assignee,setAssignee]=useState(TEAM_MEMBERS[0]);
  const [dueDate,setDueDate]=useState("");
  const [origin,setOrigin]=useState("client");
  const [reqReason,setReqReason]=useState("");
  const [attachments,setAttachments]=useState([]);
  const [tasks,setTasks]=useState([]);
  const [submitted,setSubmitted]=useState(false);
  const [srNum]=useState("SR-2025-0"+(60+Math.floor(Math.random()*10)));
  const fileRef=useRef();

  const handleFileAdd=e=>{
    const files=Array.from(e.target.files||[]);
    setAttachments(prev=>[...prev,...files.map(f=>({id:Date.now()+Math.random(),name:f.name,size:f.size,type:f.type,objectUrl:URL.createObjectURL(f),description:""}))]);
    e.target.value="";
  };
  const updateAttDesc=(id,val)=>setAttachments(prev=>prev.map(a=>a.id===id?{...a,description:val}:a));
  const removeAtt=id=>setAttachments(prev=>prev.filter(a=>a.id!==id));

  const selectedType=REQ_TYPES.find(r=>r.value===reqType);
  const selectedPri=PRIORITIES.find(p=>p.value===priority);
  const availableTasks=reqType?TASK_TYPES_BY_REQ[reqType]||[]:[];

  const toggleTask=(tv)=>{
    setTasks(prev=>{
      const exists=prev.find(t=>t.type===tv);
      if(exists) return prev.filter(t=>t.type!==tv);
      const tmpl=availableTasks.find(t=>t.value===tv);
      return [...prev,{type:tv,label:tmpl.label,icon:tmpl.icon,cat:tmpl.cat,assignee:TEAM_MEMBERS[0],priority:"medium",dueDate:"",notes:""}];
    });
  };
  const updateTask=(tv,field,val)=>setTasks(prev=>prev.map(t=>t.type===tv?{...t,[field]:val}:t));
  const canNext=()=>{if(step===1)return!!reqType;if(step===4)return tasks.length>0;return true;};
  const STEPS=["סוג בקשה","פרטי הבקשה","פרטי בקשה מורחב","משימות","סיכום ואישור"];

  if(submitted) return(
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md text-center p-10">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-3xl">✅</span></div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">הבקשה נפתחה בהצלחה</h3>
        <p className="text-sm text-gray-500 mb-2">מספר בקשה: <span className="font-bold text-blue-700">{srNum}</span></p>
        <p className="text-xs text-gray-400 mb-6">{tasks.length} משימות נוצרו · {attachments.length} מסמכים צורפו</p>
        <button onClick={onClose} className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">סגור</button>
      </div>
    </div>
  );

  return(
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col w-full max-w-5xl" style={{maxHeight:"92vh"}}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl shrink-0">
          <div><h2 className="text-base font-bold text-gray-900">פתיחת בקשת לקוח חדשה</h2><p className="text-xs text-gray-500 mt-0.5">אקמה גלובל סולושנס · REG-123456 · נועה לוי</p></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-200"><X size={18}/></button>
        </div>
        <div className="px-6 py-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center">
            {[1,2,3,4,5].map((s,i)=>(
              <div key={s} className="flex items-center flex-1">
                <div className="flex items-center gap-2 shrink-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${step>s?"bg-green-500 border-green-500 text-white":step===s?"bg-blue-600 border-blue-600 text-white":"bg-white border-gray-300 text-gray-400"}`}>{step>s?"✓":s}</div>
                  <span className={`text-xs font-medium whitespace-nowrap ${step===s?"text-blue-700":step>s?"text-green-600":"text-gray-400"}`}>{STEPS[i]}</span>
                </div>
                {i<4&&<div className={`flex-1 h-px mx-2 ${step>s?"bg-green-400":"bg-gray-200"}`}/>}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
          {step===1&&(
            <div>
              <p className="text-sm text-gray-600 mb-4 font-medium">בחר את סוג הבקשה:</p>
              <div className="grid grid-cols-4 gap-3">
                {REQ_TYPES.map(r=>(
                  <button key={r.value} onClick={()=>setReqType(r.value)}
                    className={`text-right p-3.5 rounded-xl border-2 transition-all hover:shadow-sm ${reqType===r.value?"border-blue-500 bg-blue-50":"border-gray-200 bg-white hover:border-blue-300"}`}>
                    <span className="text-2xl block mb-2">{r.icon}</span>
                    <p className={`text-xs font-bold ${reqType===r.value?"text-blue-800":"text-gray-800"}`}>{r.label}</p>
                    <p className="text-xs text-gray-400 mt-1 leading-snug">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          {step===2&&(
            <div className="space-y-3 max-w-2xl mx-auto" dir="rtl">
              {/* type badge */}
              <div className="flex items-center gap-2.5 p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-lg shrink-0">{selectedType?.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-blue-800">{selectedType?.label}</p>
                  <p className="text-xs text-blue-500">{selectedType?.desc}</p>
                </div>
              </div>
              {/* origin */}
              <F label="מקור הבקשה" req>
                <div className="flex gap-2 mt-0.5">
                  {[{val:"client",icon:"📥",label:"בקשת לקוח",desc:"פנייה של הלקוח"},{val:"internal",icon:"🏢",label:"יוזמת ביטוח אשראי",desc:"יוזמה פנימית"}].map(o=>(
                    <button key={o.val} onClick={()=>setOrigin(o.val)}
                      className={`flex-1 flex items-center gap-2 p-2.5 rounded-lg border-2 text-right transition-all ${origin===o.val?"border-blue-500 bg-blue-50":"border-gray-200 bg-white hover:border-blue-300"}`}>
                      <span className="text-base shrink-0">{o.icon}</span>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${origin===o.val?"text-blue-800":"text-gray-700"}`}>{o.label}</p>
                        <p className="text-xs text-gray-400 truncate">{o.desc}</p>
                      </div>
                      {origin===o.val&&<span className="mr-auto text-blue-600 font-bold text-xs shrink-0">✓</span>}
                    </button>
                  ))}
                </div>
              </F>
              {/* contact + channel */}
              <div className="grid grid-cols-2 gap-3">
                <F label="גורם פונה" req={origin==="client"}>
                  <select value={contact} onChange={e=>setContact(e.target.value)}
                    className={`border rounded-lg px-3 py-2 w-full text-sm outline-none transition-colors ${origin==="internal"?"border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed":"border-gray-300 focus:ring-2 focus:ring-blue-300"}`}
                    disabled={origin==="internal"}>
                    {CONTACTS_LIST.map(c=><option key={c.name} value={c.name}>{c.name} – {c.role}</option>)}
                  </select>
                  {origin==="internal"&&<p className="text-xs text-gray-400 mt-1">— לא רלוונטי ליוזמה פנימית</p>}
                </F>
                <div className={`transition-opacity duration-200 ${origin==="internal"?"opacity-40 pointer-events-none":""}`}>
                  <F label="ערוץ פנייה">
                    <div className="flex flex-wrap gap-1.5 mt-0.5">
                      {CHANNELS.map(ch=>(
                        <button key={ch} onClick={()=>setChannel(ch)}
                          className={`px-2 py-1 rounded-full text-xs border transition-colors ${channel===ch?"bg-blue-600 text-white border-blue-600":"bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}>
                          {ch}
                        </button>
                      ))}
                    </div>
                  </F>
                </div>
              </div>
              {/* assignee + due */}
              <div className="grid grid-cols-2 gap-3">
                <F label="הקצאה" req>
                  <select value={assignee} onChange={e=>setAssignee(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-blue-300">
                    {TEAM_MEMBERS.map(m=><option key={m}>{m}</option>)}
                  </select>
                </F>
                <F label="תאריך יעד">
                  <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-blue-300"/>
                </F>
              </div>
              {/* priority */}
              <F label="עדיפות">
                <div className="flex gap-1.5 mt-0.5">
                  {PRIORITIES.map(p=>(
                    <button key={p.value} onClick={()=>setPriority(p.value)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium flex-1 justify-center transition-all ${priority===p.value?p.color+" border-2 shadow-sm":"bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${priority===p.value?p.dot:"bg-gray-300"}`}/>{p.label}
                    </button>
                  ))}
                </div>
              </F>
              {/* reason */}
              <F label="סיבת הבקשה" req>
                <select value={reqReason} onChange={e=>setReqReason(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-blue-300">
                  <option value="">-- בחר סיבה --</option>
                  {(REQUEST_REASONS[reqType]||REQUEST_REASONS.other).map(r=><option key={r} value={r}>{r}</option>)}
                </select>
              </F>
              {/* description */}
              <F label="פרטי הבקשה">
                <Txt rows={3} placeholder="פרט את הבקשה..."/>
              </F>
            </div>
          )}
          {step===3&&(
            <div className="max-w-2xl mx-auto" dir="rtl">
              <div className="flex items-center gap-2.5 p-2.5 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <span className="text-lg shrink-0">{selectedType?.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-blue-800">{selectedType?.label} – פרטים מורחבים</p>
                  <p className="text-xs text-blue-500">מלא את הפרטים הספציפיים לסוג הבקשה</p>
                </div>
              </div>
              {reqType==="coverage_change"
                ? <div className="space-y-3">
                    <F label="פוליסה" req><Sel options={POLICIES_LIST} placeholder="-- בחר פוליסה --"/></F>
                    <F label="פרטי השינוי" req><Txt rows={5} placeholder="פרט את פרטי השינוי המבוקש..."/></F>
                  </div>
                : <DynamicFields reqType={reqType}/>
              }
            </div>
          )}
          {step===4&&(
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-xl">{selectedType?.icon}</span>
                <div><p className="text-xs font-bold text-blue-900">{selectedType?.label}</p><p className="text-xs text-blue-600">בחר את המשימות לביצוע</p></div>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {availableTasks.map(tt=>{
                  const sel=tasks.find(t=>t.type===tt.value);
                  return(
                    <button key={tt.value} onClick={()=>toggleTask(tt.value)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border-2 transition-all ${sel?"border-blue-500 bg-blue-50":"border-gray-200 bg-white hover:border-blue-300"}`}>
                      <span className="text-sm shrink-0">{tt.icon}</span>
                      <span className={`text-xs font-semibold whitespace-nowrap ${sel?"text-blue-800":"text-gray-700"}`}>{tt.label}</span>
                      {sel&&<span className="text-blue-600 text-xs font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>
              {tasks.length===0&&<div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center text-xs text-yellow-700 font-medium">יש לבחור לפחות משימה אחת להמשך</div>}
              {tasks.length>0&&(
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">הגדר פרמטרים ({tasks.length} משימות)</p>
                  {tasks.map(t=>(
                    <div key={t.type} className="border border-blue-200 rounded-xl p-3 bg-blue-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2"><span className="text-base">{t.icon}</span><span className="text-xs font-bold text-blue-900">{t.label}</span><Badge color="blue">{t.cat}</Badge></div>
                        <button onClick={()=>toggleTask(t.type)} className="text-xs text-red-500 hover:text-red-700 px-2 py-0.5 bg-red-50 rounded border border-red-200">הסר ✕</button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <F label="הקצה ל" req>
                          <select value={t.assignee} onChange={e=>updateTask(t.type,"assignee",e.target.value)} className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white outline-none w-full">
                            {TEAM_MEMBERS.map(m=><option key={m}>{m}</option>)}
                          </select>
                        </F>
                        <F label="עדיפות">
                          <select value={t.priority} onChange={e=>updateTask(t.type,"priority",e.target.value)} className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white outline-none w-full">
                            {["critical","high","medium","low"].map(p=><option key={p} value={p}>{p==="critical"?"קריטי":p==="high"?"גבוהה":p==="medium"?"בינונית":"נמוכה"}</option>)}
                          </select>
                        </F>
                        <F label="תאריך יעד">
                          <input type="date" value={t.dueDate} onChange={e=>updateTask(t.type,"dueDate",e.target.value)} className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white outline-none w-full"/>
                        </F>
                        <div className="col-span-3">
                          <F label="הערות"><input type="text" value={t.notes} onChange={e=>updateTask(t.type,"notes",e.target.value)} placeholder="הוראות מיוחדות..." className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white outline-none w-full"/></F>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {step===5&&(
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center"><p className="text-sm font-semibold text-green-800">✅ סקור ואשר את הבקשה</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">פרטי הבקשה</p>
                  {[["סוג",selectedType?.label],["לקוח","אקמה גלובל סולושנס"],["גורם פונה",contact],["ערוץ",channel],["סיבת הבקשה",reqReason||"–"],["עדיפות",selectedPri?.label],["הקצאה",assignee],["מקור",origin==="client"?"📥 בקשת לקוח":"🏢 יוזמת ביטוח אשראי"],["תאריך פתיחה",new Date().toLocaleDateString("he-IL")]].map(([l,v],i)=>(
                    <div key={i} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0"><span className="text-xs text-gray-500">{l}</span><span className="text-xs font-medium text-gray-900">{v}</span></div>
                  ))}
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">משימות ({tasks.length})</p>
                  <div className="space-y-1.5">
                    {tasks.map(t=>(
                      <div key={t.type} className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                        <span className="text-sm shrink-0">{t.icon}</span>
                        <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-gray-800">{t.label}</p><p className="text-xs text-gray-500">{t.assignee.split("(")[0].trim()} · {t.priority}{t.dueDate&&` · ${t.dueDate}`}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-between items-center shrink-0">
          <div>{step>1&&<button onClick={()=>setStep(step-1)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100">← חזור</button>}</div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">ביטול</button>
            {step<5
              ?<button onClick={()=>canNext()&&setStep(step+1)} className={`px-5 py-2 rounded-lg text-sm font-medium shadow-sm ${canNext()?"bg-blue-600 text-white hover:bg-blue-700":"bg-gray-200 text-gray-400 cursor-not-allowed"}`}>המשך →</button>
              :<button onClick={()=>setSubmitted(true)} className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 flex items-center gap-2">✅ פתח בקשה ומשימות</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

function PolicyCard(){
  const [view,setView]=useState("policies");
  const summaryPolicies=[{id:1,polNum:"POL-2023-001",coverage:"$2,500,000",premium:"$38,000",status:"Active"},{id:2,polNum:"POL-2022-001",coverage:"$2,200,000",premium:"$32,000",status:"Expired"},{id:3,polNum:"POL-2021-001",coverage:"$1,980,000",premium:"$28,000",status:"Expired"}];
  const policyChangelog=[{date:"2024-01-10",pol:"POL-2023-001",field:"כיסוי מקסימלי",before:"$2,200,000",after:"$2,500,000",user:"נועה לוי",reason:"עדכון שנתי"},{date:"2024-01-10",pol:"POL-2023-001",field:"השתתפות עצמית",before:"$45,000",after:"$50,000",user:"נועה לוי",reason:"התאמה לפרופיל סיכון"},{date:"2023-03-01",pol:"POL-2022-001",field:"פרמיה שנתית",before:"$28,000",after:"$32,000",user:"אבי כהן",reason:"עדכון תמחור"}];
  return(
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-purple-50">
        <h4 className="text-sm font-semibold text-purple-800">📋 פוליסות</h4>
        <div className="flex items-center gap-1">
          <button onClick={()=>setView("policies")} className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${view==="policies"?"bg-purple-600 text-white":"text-purple-600 hover:bg-purple-100"}`}>פוליסות</button>
          <button onClick={()=>setView("changes")} className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${view==="changes"?"bg-purple-600 text-white":"text-purple-600 hover:bg-purple-100"}`}><History size={11}/> שינויים</button>
        </div>
      </div>
      <div className="p-4">
        {view==="policies"&&summaryPolicies.map(p=>(
          <div key={p.id} className={`mb-2 p-2.5 rounded-lg border ${p.status==="Active"?"bg-green-50 border-green-200":"bg-gray-50 border-gray-200"}`}>
            <div className="flex justify-between items-center"><span className="text-xs font-semibold text-gray-800">{p.polNum}</span><Badge color={p.status==="Active"?"green":"gray"}>{p.status==="Active"?"פעיל":"פג תוקף"}</Badge></div>
            <div className="grid grid-cols-2 gap-x-4 mt-1"><span className="text-xs text-gray-500">כיסוי: <span className="font-medium text-gray-800">{p.coverage}</span></span><span className="text-xs text-gray-500">פרמיה: <span className="font-medium text-gray-800">{p.premium}</span></span></div>
          </div>
        ))}
        {view==="changes"&&policyChangelog.map((c,i)=>(
          <div key={i} className="flex gap-2.5 pb-2 border-b border-gray-100 last:border-0">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0"/>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5"><span className="text-xs font-semibold text-gray-800">{c.field}</span><span className="text-xs text-gray-400">{c.date}</span></div>
              <div className="flex items-center gap-1.5 text-xs mb-0.5"><span className="px-1.5 py-0.5 bg-red-50 text-red-700 rounded line-through">{c.before}</span><span className="text-gray-400">→</span><span className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded font-medium">{c.after}</span></div>
              <div className="flex items-center gap-2 text-xs text-gray-400"><span>{c.pol}</span><span>·</span><span>{c.user}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MeetingsSummaryCard({setActiveTab}){
  const [mView,setMView]=useState("upcoming");
  const meetingsSummary=[{id:1,title:"פגישת סקירת פוליסה",date:"2025-05-20",time:"10:00",type:"In Person",location:"משרד לקוח",participants:"John Smith, נועה לוי",status:"Upcoming",notes:"סקירה שנתית"},{id:2,title:"דיון הרחבת כיסוי",date:"2025-06-10",time:"11:00",type:"Hybrid",location:"משרדנו",participants:"John Smith, אבי כהן",status:"Scheduled",notes:"הצגת אפשרויות כיסוי"},{id:3,title:"סקירת סיכונים שנתית",date:"2025-02-05",time:"14:30",type:"Virtual",location:"Zoom",participants:"Sarah Johnson, נועה לוי",status:"Completed",notes:"עדכון המלצות בוצע"},{id:4,title:"פגישת הכרות – CFO חדש",date:"2025-01-30",time:"10:00",type:"In Person",location:"משרד לקוח",participants:"Sarah Johnson, נועה לוי",status:"Completed",notes:"הועברו מסמכים"}];
  const upcoming=meetingsSummary.filter(m=>m.status==="Upcoming"||m.status==="Scheduled");
  const past=meetingsSummary.filter(m=>m.status==="Completed");
  const displayed=mView==="upcoming"?upcoming:past;
  const typeIcon={"In Person":"🤝","Virtual":"💻","Hybrid":"🔀"};
  const statusCol={Upcoming:"blue",Scheduled:"yellow",Completed:"green"};
  const statusLabel={Upcoming:"קרוב",Scheduled:"מתוכנן",Completed:"הושלם"};
  return(
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col h-60">
      <div className="px-3 py-2.5 border-b border-gray-100 flex justify-between items-center bg-indigo-50 shrink-0">
        <h4 className="text-sm font-semibold text-indigo-800 flex items-center gap-1.5"><Calendar size={14} className="text-indigo-600"/> פגישות</h4>
        <div className="flex items-center gap-1.5">
          {setActiveTab&&<button onClick={()=>setActiveTab("meetings")} className="text-xs text-indigo-600 hover:underline">פרטים ›</button>}
          <div className="flex rounded overflow-hidden border border-indigo-200">
            <button onClick={()=>setMView("upcoming")} className={`px-2 py-0.5 text-xs font-medium ${mView==="upcoming"?"bg-indigo-600 text-white":"bg-white text-indigo-600"}`}>עתידיות</button>
            <button onClick={()=>setMView("past")} className={`px-2 py-0.5 text-xs font-medium ${mView==="past"?"bg-indigo-600 text-white":"bg-white text-indigo-600"}`}>עברו</button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {displayed.length===0&&<p className="text-xs text-gray-400 text-center py-4">אין פגישות להצגה</p>}
        <div className="space-y-1.5">
          {displayed.map(m=>(
            <div key={m.id} className={`flex items-start gap-2.5 rounded-lg border p-2.5 ${m.status==="Upcoming"?"bg-blue-50 border-blue-200":m.status==="Scheduled"?"bg-yellow-50 border-yellow-200":"bg-gray-50 border-gray-200"}`}>
              <div className="text-lg shrink-0">{typeIcon[m.type]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-xs font-semibold text-gray-900 truncate flex-1">{m.title}</p>
                  <Badge color={statusCol[m.status]}>{statusLabel[m.status]}</Badge>
                </div>
                <p className="text-xs text-gray-500 truncate">{m.date} · {m.time} · {m.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const DEPT_VIEWS=[{id:"all",label:"כללי",icon:"🏢",color:"gray"}];
const DEPT_ALERTS={
  all:[{sev:"high",icon:"🔴",title:"Loss Ratio 198.9% – חריג משמעותי",desc:"סה\"כ תביעות ששולמו עולות פי 2 על הפרמיה.",action:"בחינה",tab:"claims"},{sev:"high",icon:"🔴",title:"תביעה CLM-2024-002 – ₪450,000 ללא טיפול",desc:"פשיטת רגל ריטייל פרטנרס. ₪0 שולמו.",action:"עדכן",tab:"claims"},{sev:"high",icon:"🔴",title:"SLA חרג – SR-2025-042",desc:"בקשת הרחבת כיסוי. SLA עבר 24.02.25.",action:"פתח",tab:"crm"},{sev:"med",icon:"🟡",title:"2 תקרות אשראי יפגו תוך 30 יום",desc:"DBT-001 ו-DBT-003 דורשות חידוש.",action:"חדש",tab:"credit-limits"},{sev:"med",icon:"🟡",title:"4 משימות באיחור",desc:"כולל KYC ומסמכי CLM-001.",action:"ראה",tab:"crm"}],
  risk:[{sev:"high",icon:"🔴",title:"Loss Ratio 198.9% – דורש בחינת חיתום מחדש",desc:"יחס תביעות/פרמיה חריג.",action:"בחינת סיכון",tab:"claims"},{sev:"high",icon:"🔴",title:"ריכוזיות חשיפה – גלובל מניופקטורינג 24%",desc:"חייב יחיד מהווה 24% מסך החשיפה.",action:"בדוק",tab:"credit-limits"},{sev:"med",icon:"🟡",title:"יורופיאן טרייד GmbH – ממתין לאישור",desc:"תקרת אשראי EUR 600,000 תלויה ועומדת.",action:"הערך",tab:"credit-limits"}],
  crm:[{sev:"high",icon:"🔴",title:"SLA חרג – SR-2025-042",desc:"נפתח 10.02.25, SLA 24.02.25. הלקוח ממתין.",action:"טפל עכשיו",tab:"crm"},{sev:"med",icon:"🟡",title:"SR-2025-055 – בקשת תוכנית תשלומים",desc:"הלקוח ביקש פריסת פרמיה ל-4 תשלומים.",action:"עדכן לקוח",tab:"crm"},{sev:"med",icon:"🟡",title:"פגישת סקירה ב-20.05 – דורשת הכנה",desc:"יש להכין מצגת עם נתוני תביעות וכיסוי.",action:"הכן",tab:"meetings"}],
  finance:[{sev:"high",icon:"🔴",title:"Loss Ratio 198.9% – חשיפה פיננסית גבוהה",desc:"יתרה נטו שלילית -₪350,950.",action:"דוח פיננסי",tab:"claims"},{sev:"high",icon:"🔴",title:"פרמיה 2024 – ₪140,000 – לאמת תשלום",desc:"בקשת פריסה תלויה ועומדת.",action:"אמת",tab:"crm"},{sev:"med",icon:"🟡",title:"SR-2025-055 – בקשת פריסת תשלומים",desc:"הלקוח ביקש 4 תשלומים רבעוניים.",action:"אשר",tab:"crm"}],
  claims:[{sev:"high",icon:"🔴",title:"CLM-2024-002 – ₪450,000 פשיטת רגל",desc:"ריטייל פרטנרס. 0% שולם.",action:"עדכן סטטוס",tab:"claims"},{sev:"high",icon:"🔴",title:"CLM-2024-004 – ₪185,000 חשד להונאה",desc:"גלובל מניופקטורינג. נדרש דוח חקירה.",action:"פתח חקירה",tab:"claims"},{sev:"high",icon:"🔴",title:"CLM-2024-003 – ₪275,000 ממתין לאישור",desc:"פסיפיק אימפורטס – חדלות פירעון.",action:"אשר תשלום",tab:"claims"}],
};
const DEPT_KPIS={
  all:[
    {label:"פעילות אחרונה",val:"בקשת פריסת תשלומים",sub:"19.02.25",color:"gray",icon:"🕐",alert:false,trend:null},
    {label:"בקשות פתוחות",val:"2",sub:"1 SLA חרג",color:"orange",icon:"📋",alert:true,trend:null},
    {label:"תקרות תקפות",val:"3",sub:"",color:"green",icon:"✅",alert:false,trend:"+20%",trendUp:true},
    {label:"אובליגו כולל",val:"$3.1M",sub:"",color:"purple",icon:"💳",alert:false,trend:"+8%",trendUp:true},
    {label:"פרמיות",val:"$38,000",sub:"צפי שנה: $42,000",color:"blue",icon:"💵",alert:false,trend:"+12%",trendUp:true},
    {label:"תביעות תלויות",val:"4 · $910K",sub:"",color:"red",icon:"⚖️",alert:true,trend:"+2",trendUp:false},
    {label:"פגישות",val:"",sub:"",color:"teal",icon:"📅",alert:false,trend:null,lastMeeting:"26.01.25",nextMeeting:"20.05.25"},
  ],
  risk:[
    {label:"דירוג סיכון",val:"A+",sub:"ציון 82/100",color:"green",icon:"⭐",alert:false,trend:"+3נק׳",trendUp:true},
    {label:"Loss Ratio",val:"198.9%",sub:"חריג",color:"red",icon:"📊",alert:true,trend:"+12%",trendUp:false},
    {label:"ריכוזיות מקס׳",val:"24%",sub:"Global Mfg.",color:"orange",icon:"⚠️",alert:true,trend:null},
    {label:"תקרות ממתינות",val:"1",sub:"",color:"yellow",icon:"⏳",alert:false,trend:null},
    {label:"חשיפה גיאוגרפית",val:"3 מדינות",sub:"",color:"blue",icon:"🌍",alert:false,trend:null},
    {label:"תביעות תלויות",val:"4 · $910K",sub:"",color:"red",icon:"⚖️",alert:true,trend:"+2",trendUp:false},
    {label:"עסקאות בסיכון",val:"1",sub:"חדלות פירעון",color:"orange",icon:"🔴",alert:true,trend:null},
    {label:"פגישות",val:"",sub:"",color:"teal",icon:"📅",alert:false,trend:null,lastMeeting:"26.01.25",nextMeeting:"20.05.25"},
  ],
  crm:[
    {label:"פעילות אחרונה",val:"בקשת פריסת תשלומים",sub:"19.02.25",color:"gray",icon:"🕐",alert:false,trend:null},
    {label:"בקשות פתוחות",val:"2",sub:"1 SLA חרג",color:"orange",icon:"📋",alert:true,trend:null},
    {label:"תקרות תקפות",val:"3",sub:"",color:"green",icon:"✅",alert:false,trend:"+20%",trendUp:true},
    {label:"אובליגו כולל",val:"$3.1M",sub:"",color:"purple",icon:"💳",alert:false,trend:"+8%",trendUp:true},
    {label:"פרמיות",val:"$38,000",sub:"צפי שנה: $42,000",color:"blue",icon:"💵",alert:false,trend:"+12%",trendUp:true},
    {label:"תביעות תלויות",val:"4 · $910K",sub:"",color:"red",icon:"⚖️",alert:true,trend:"+2",trendUp:false},
    {label:"ותק לקוח",val:"7 שנים",sub:"לקוח מאז 2018",color:"indigo",icon:"🏆",alert:false,trend:null},
    {label:"פגישות",val:"",sub:"",color:"teal",icon:"📅",alert:false,trend:null,lastMeeting:"26.01.25",nextMeeting:"20.05.25"},
  ],
  finance:[
    {label:"פרמיה שנתית",val:"₪140,000",sub:"",color:"green",icon:"💵",alert:false,trend:"+5%",trendUp:true},
    {label:"Loss Ratio",val:"198.9%",sub:"חריג",color:"red",icon:"📊",alert:true,trend:"+12%",trendUp:false},
    {label:"רזרבה פתוחה",val:"₪910,000",sub:"3 תביעות",color:"orange",icon:"🏦",alert:true,trend:null},
    {label:"יתרה נטו",val:"-₪350,950",sub:"חריג",color:"red",icon:"📉",alert:true,trend:null},
    {label:"תשלומי תביעות",val:"₪705,950",sub:"",color:"blue",icon:"💸",alert:false,trend:null},
    {label:"אובליגו כולל",val:"$3.1M",sub:"",color:"purple",icon:"💳",alert:false,trend:"+8%",trendUp:true},
    {label:"פעילות אחרונה",val:"עדכון פרמיה",sub:"12.03.25",color:"gray",icon:"🕐",alert:false,trend:null},
    {label:"פגישות",val:"",sub:"",color:"teal",icon:"📅",alert:false,trend:null,lastMeeting:"26.01.25",nextMeeting:"20.05.25"},
  ],
  claims:[
    {label:"תביעות פתוחות",val:"4",sub:"₪910,000",color:"red",icon:"🔴",alert:true,trend:"+2",trendUp:false},
    {label:"Loss Ratio",val:"198.9%",sub:"חריג",color:"orange",icon:"📊",alert:true,trend:"+12%",trendUp:false},
    {label:"ממוצע ימי טיפול",val:"45 יום",sub:"סף: 60",color:"blue",icon:"⏱️",alert:false,trend:null},
    {label:"תביעות ששולמו",val:"₪705,950",sub:"41.9%",color:"green",icon:"✅",alert:false,trend:null},
    {label:"תביעות חדשות (30י)",val:"1",sub:"",color:"yellow",icon:"🆕",alert:false,trend:null},
    {label:"רזרבה פתוחה",val:"₪910,000",sub:"",color:"orange",icon:"🏦",alert:true,trend:null},
    {label:"תביעה גבוהה ביותר",val:"₪500,000",sub:"CLM-2024-004",color:"red",icon:"📌",alert:true,trend:null},
    {label:"פגישות",val:"",sub:"",color:"teal",icon:"📅",alert:false,trend:null,lastMeeting:"26.01.25",nextMeeting:"20.05.25"},
  ],
};

function SummaryDeptTab({setActiveTab}){
  const [dept,setDept]=useState("crm");
  const alerts=DEPT_ALERTS[dept]||[];
  const kpis=DEPT_KPIS[dept]||[];
  const summaryCreditLimits=[{id:1,debtor:"Tech Solutions Ltd.",amount:"$450,000",expiry:"2025-01-15",status:"Active",grade:"A"},{id:2,debtor:"Global Manufacturing",amount:"$750,000",expiry:"2025-02-20",status:"Active",grade:"A+"},{id:3,debtor:"Retail Partners Co.",amount:"$250,000",expiry:"2024-06-10",status:"Expired",grade:"B+"},{id:4,debtor:"European Trade GmbH",amount:"–",expiry:"–",status:"Pending",grade:"Under Review"},{id:5,debtor:"Pacific Imports LLC",amount:"$400,000",expiry:"2025-03-01",status:"Active",grade:"A-"}];

  return(
    <div dir="rtl" className="space-y-4">

      {/* ── compact KPI strip ── */}
      <div className={`grid gap-2 ${kpis.length>=8?"grid-cols-8":kpis.length>=7?"grid-cols-7":kpis.length>=5?"grid-cols-5":"grid-cols-4"}`}>
        {kpis.map((k,i)=>{
          const COLORS={blue:{bg:"bg-blue-50",border:"border-blue-200",text:"text-blue-800",sub:"text-blue-600"},green:{bg:"bg-green-50",border:"border-green-200",text:"text-green-800",sub:"text-green-600"},red:{bg:"bg-red-50",border:"border-red-200",text:"text-red-800",sub:"text-red-600"},orange:{bg:"bg-orange-50",border:"border-orange-200",text:"text-orange-800",sub:"text-orange-600"},purple:{bg:"bg-purple-50",border:"border-purple-200",text:"text-purple-800",sub:"text-purple-600"},indigo:{bg:"bg-indigo-50",border:"border-indigo-200",text:"text-indigo-800",sub:"text-indigo-600"},teal:{bg:"bg-teal-50",border:"border-teal-200",text:"text-teal-800",sub:"text-teal-600"},yellow:{bg:"bg-yellow-50",border:"border-yellow-200",text:"text-yellow-800",sub:"text-yellow-600"},gray:{bg:"bg-gray-50",border:"border-gray-200",text:"text-gray-800",sub:"text-gray-500"}};
          const C=COLORS[k.color]||COLORS.gray;
          const TrendBadge=k.trend?(
            <span title="ב- 12 החודשים האחרונים" className={`cursor-help text-xs font-semibold px-1 py-0.5 rounded-full border ${k.trendUp?"bg-green-50 text-green-700 border-green-200":"bg-red-50 text-red-700 border-red-200"}`}>{k.trendUp?"↑":"↓"}{k.trend}</span>
          ):null;
          return(
            <div key={i} className={`${C.bg} border ${C.border} rounded-lg px-2.5 py-2 relative flex flex-col`}>
              {k.alert&&<div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse"/>}
              {/* title row – all content right-aligned */}
              <div className="flex items-center gap-1 mb-1">
                <span className="text-sm shrink-0">{k.icon}</span>
                <p className={`text-xs font-medium ${C.sub} leading-tight`}>{k.label}</p>
                {TrendBadge}
              </div>
              {/* value – centered */}
              {k.lastMeeting?(
                <div className="flex flex-col items-center gap-0.5 mt-0.5">
                  <p className={`text-xs font-bold ${C.text} text-center`}><span className={`${C.sub} font-normal`}>אחרונה: </span>{k.lastMeeting}</p>
                  <p className={`text-xs font-bold ${C.text} text-center`}><span className={`${C.sub} font-normal`}>הבאה: </span>{k.nextMeeting}</p>
                </div>
              ):(
                <div className="flex flex-col items-center">
                  <p className={`text-sm font-bold ${C.text} text-center leading-tight`}>{k.val}</p>
                  {k.sub&&<p className={`text-xs ${C.sub} text-center leading-tight mt-0.5`}>{k.sub}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── row 1: פרופיל חברה | גודל מבוטח | סיכום מסחרי | נושאים ── */}
      <div className="grid grid-cols-4 gap-4">
        <CardComp title="פרופיל חברה" color="blue" icon={<span>🏢</span>} fixedH="h-60">
          <div className="flex items-center justify-between py-1 border-b border-red-100">
            <span className="text-xs font-semibold text-red-600">צד קשור</span>
            <span className="text-xs font-bold text-red-600">60% בעלות</span>
          </div>
          <div className="space-y-0.5">{[["סגמנט לקוח","Premium – Tier 1"],["מנהל תיק","נועה לוי"],["לקוח מאז","2018 (7 שנים)"],["שפה","אנגלית"]].map(([l,v])=><KV key={l} label={l} val={v}/>)}</div>
        </CardComp>
        <CardComp title="גודל מבוטח" color="indigo" icon={<span>📊</span>} fixedH="h-60">
          <div className="flex items-center gap-2 mb-1"><div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">T1</div><div><p className="text-xs font-bold text-indigo-900">Tier 1 – Large</p><p className="text-xs text-indigo-500">Top 10% בפורטפוליו</p></div></div>
          <div>{[["אובליגו כולל","$3,100,000"],["פרמיה שנתית","$38,000"],["תקרות אשראי","5"],["שנות ותק","7"]].map(([l,v])=><KV key={l} label={l} val={v} bold/>)}</div>
        </CardComp>
        <CardComp title="סיכום מסחרי" color="green" icon={<span>💼</span>} fixedH="h-60">
          <div className="space-y-0.5">{[["פרמיה שנתית","$38,000"],["אובליגו כולל","$3,100,000"],["יחס תביעות","2.3%"],["דירוג סיכון","A+ – Low Risk"],["הסתברות חידוש","85%"]].map(([l,v])=><KV key={l} label={l} val={v} bold/>)}</div>
        </CardComp>
        {/* ── alerts ── */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-60">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 bg-gray-50 shrink-0">
            <AlertTriangle size={13} className="text-red-500"/>
            <h4 className="text-xs font-bold text-gray-800">נושאים לטיפול</h4>
            <span className="mr-auto px-1.5 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">{alerts.filter(a=>a.sev==="high").length}🔴 {alerts.filter(a=>a.sev==="med").length}🟡</span>
          </div>
          <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
            {alerts.map((a,i)=>(
              <div key={i} className={`flex items-start gap-2 px-3 py-2 ${a.sev==="high"?"bg-red-50/60":a.sev==="med"?"bg-yellow-50/40":"bg-green-50/30"}`}>
                <span className="text-sm shrink-0 mt-0.5">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold leading-tight ${a.sev==="high"?"text-red-800":a.sev==="med"?"text-yellow-800":"text-green-800"}`}>{a.title}</p>
                  <p className={`text-xs mt-0.5 leading-tight ${a.sev==="high"?"text-red-600":a.sev==="med"?"text-yellow-700":"text-green-700"}`}>{a.desc}</p>
                  <button onClick={()=>setActiveTab(a.tab)} className={`mt-1 text-xs px-2 py-0.5 rounded font-semibold ${a.sev==="high"?"bg-red-600 text-white":a.sev==="med"?"bg-yellow-500 text-white":"bg-green-600 text-white"}`}>{a.action} →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── row 2: פוליסה | תקרות | אנשי קשר | פגישות ── */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-60">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-blue-50 shrink-0"><span>🛡️</span><h4 className="text-sm font-bold text-gray-800">פוליסה פעילה</h4><button onClick={()=>setActiveTab("policies")} className="mr-auto text-xs text-blue-600 hover:underline">פרטים ›</button></div>
          <div className="p-4 overflow-y-auto flex-1">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2"><span className="text-xs font-bold text-blue-900">POL-2023-001</span><span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full font-medium">פעיל</span></div>
              {[["כיסוי","₪9,000,000"],["פרמיה","₪140,000"],["השתתפות עצמית","₪180,000"],["חידוש","15.03.2024"]].map(([l,v])=>(
                <div key={l} className="flex justify-between py-1 border-b border-blue-100 last:border-0"><span className="text-xs text-blue-600">{l}</span><span className="text-xs font-semibold text-blue-900">{v}</span></div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-60">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-blue-50 shrink-0"><span>💳</span><h4 className="text-sm font-bold text-gray-800">תקרות אשראי</h4><button onClick={()=>setActiveTab("credit-limits")} className="mr-auto text-xs text-blue-600 hover:underline">פרטים ›</button></div>
          <div className="p-2 overflow-y-auto flex-1">
            <div className="grid grid-cols-3 gap-1 mb-1.5">
              {[{l:"פעילות",v:"3",c:"green"},{l:"ממתינות",v:"1",c:"yellow"},{l:"פגו",v:"1",c:"red"}].map(s=>(
                <div key={s.l} className={`bg-${s.c}-50 border border-${s.c}-200 rounded p-1 text-center`}><p className={`text-sm font-bold text-${s.c}-800`}>{s.v}</p><p className={`text-xs text-${s.c}-600`}>{s.l}</p></div>
              ))}
            </div>
            <div className="space-y-1">
              {summaryCreditLimits.slice(0,2).map((cl,i)=>(
                <div key={i} className="flex items-center justify-between py-0.5 px-1.5 bg-gray-50 rounded border border-gray-100">
                  <div><p className="text-xs font-medium text-gray-800 truncate max-w-[100px]">{cl.debtor}</p><p className="text-xs text-gray-400">{cl.amount}</p></div>
                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${cl.status==="Active"?"bg-green-100 text-green-800":cl.status==="Pending"?"bg-yellow-100 text-yellow-800":"bg-gray-100 text-gray-800"} font-medium shrink-0`}>{cl.grade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-60">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-indigo-50 shrink-0"><span>👥</span><h4 className="text-sm font-bold text-gray-800">אנשי קשר</h4><button onClick={()=>setActiveTab("contacts")} className="mr-auto text-xs text-blue-600 hover:underline">פרטים ›</button></div>
          <div className="p-4 overflow-y-auto flex-1">
            {[{n:"יוחנן שמיט",r:'מנכ"ל'},{n:"שרה לוי",r:'סמנכ"ל כספים'}].map((c,i)=>(
              <div key={i} className="flex items-center gap-2.5 py-2 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0">{c.n[0]}</div>
                <div><p className="text-xs font-semibold text-gray-900">{c.n}</p><p className="text-xs text-gray-500">{c.r}</p></div>
              </div>
            ))}
          </div>
        </div>
        <MeetingsSummaryCard setActiveTab={setActiveTab}/>
      </div>
    </div>
  );
}

const serviceRequests=[
  {id:1,srNum:"SR-2025-042",subject:"Coverage expansion for new product line",type:"Coverage Change",opened:"2025-02-10",sla:"2025-02-24",status:"In Progress",priority:"High",createdBy:"נועה לוי",origin:"client"},
  {id:2,srNum:"SR-2025-038",subject:"Add new debtor – Pacific Imports LLC",type:"Credit Limit",opened:"2025-02-05",sla:"2025-02-19",status:"Completed",priority:"Normal",createdBy:"נועה לוי",origin:"client"},
  {id:3,srNum:"SR-2025-031",subject:"Update banking details",type:"Administrative",opened:"2025-01-28",sla:"2025-02-07",status:"Completed",priority:"Normal",createdBy:"אבי כהן",origin:"internal"},
  {id:4,srNum:"SR-2025-055",subject:"Premium payment plan request",type:"Finance",opened:"2025-02-19",sla:"2025-03-05",status:"Open",priority:"Medium",createdBy:"נועה לוי",origin:"client"},
];
const TASKS_INIT=[
  {id:1,title:"בחינת בקשת הרחבת כיסוי – SaaS",due:"2025-03-01",priority:"High",status:"Open",assignee:"נועה לוי",cat:"Policy",source:"sr",srNum:"SR-2025-042",srSubject:"הרחבת כיסוי – קו מוצרים חדש",dept:null},
  {id:2,title:"קבלת אישור חיתום להרחבת כיסוי",due:"2025-03-08",priority:"High",status:"Open",assignee:"רון כץ",cat:"Policy",source:"sr",srNum:"SR-2025-042",srSubject:"הרחבת כיסוי – קו מוצרים חדש",dept:null},
  {id:3,title:"בדיקת בקשת פריסת תשלומים",due:"2025-03-05",priority:"Medium",status:"Open",assignee:"יעל גל",cat:"Finance",source:"sr",srNum:"SR-2025-055",srSubject:"בקשת תוכנית תשלומים",dept:null},
  {id:4,title:"אישור תקרת אשראי – Pacific Imports",due:"2025-02-19",priority:"Medium",status:"Completed",assignee:"דנה מור",cat:"Credit",source:"sr",srNum:"SR-2025-038",srSubject:"תקרת אשראי – Pacific Imports",dept:null},
  {id:5,title:"עדכון תיעוד KYC",due:"2025-03-15",priority:"Medium",status:"Open",assignee:"אבי כהן",cat:"Compliance",source:"dept",srNum:null,srSubject:null,dept:"ציות"},
  {id:6,title:"הכנת מצגת סקירה שנתית",due:"2025-04-01",priority:"Low",status:"Open",assignee:"נועה לוי",cat:"General",source:"dept",srNum:null,srSubject:null,dept:"קשרי לקוחות"},
  {id:7,title:"מעקב מסמכים חסרים – CLM-001",due:"2025-02-22",priority:"High",status:"Open",assignee:"אבי כהן",cat:"Claims",source:"dept",srNum:null,srSubject:null,dept:"תביעות"},
];
const interactions=[
  {id:1,type:"Call",dir:"Inbound",subject:"Policy renewal inquiry",contact:"John Smith",date:"2025-02-20",time:"11:15",duration:"12 min",handler:"נועה לוי",priority:"Normal",status:"Closed",summary:"Client asked about renewal terms and premium adjustment."},
  {id:2,type:"Email",dir:"Outbound",subject:"Credit limit expiry reminder",contact:"Sarah Johnson",date:"2025-02-18",time:"09:00",duration:null,handler:"System",priority:"Normal",status:"Sent",summary:"Automated reminder for 2 expiring credit limits.",next:"Await response"},
  {id:3,type:"Call",dir:"Outbound",subject:"Claim status follow-up – CLM-001",contact:"John Smith",date:"2025-02-15",time:"14:30",duration:"8 min",handler:"אבי כהן",priority:"High",status:"Closed",summary:"Informed client on claim progress. Requested additional documents.",next:"Receive docs by Feb 22"},
  {id:4,type:"Meeting",dir:null,subject:"Policy Review Meeting",contact:"John Smith, David Wilson",date:"2025-01-30",time:"10:00",duration:"60 min",handler:"נועה לוי",priority:"Normal",status:"Completed",summary:"Annual policy review. Coverage adjustment discussed."},
  {id:5,type:"Email",dir:"Inbound",subject:"Credit limit increase – DBT-004",contact:"Sarah Johnson",date:"2025-01-25",time:"16:20",duration:null,handler:"אבי כהן",priority:"High",status:"In Progress",summary:"Client requests EUR 600,000 for European Trade GmbH.",next:"Underwriting decision pending"},
];

function TasksTab({setShowNewClientReq}){
  const [localTasks,setLocalTasks]=useState(TASKS_INIT);
  const [selectedTask,setSelectedTask]=useState(null);
  const overdue=d=>new Date(d)<new Date();
  const completeTask=id=>setLocalTasks(prev=>prev.map(t=>t.id===id?{...t,status:"Completed"}:t));
  return(
    <div dir="rtl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-gray-800">משימות לביצוע</h3>
        <button onClick={()=>setShowNewClientReq(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"><Plus size={14}/> משימה חדשה</button>
      </div>
      <div className="mb-4 grid grid-cols-4 gap-4">
        <Stat label="סה״כ משימות" val={localTasks.length} color="blue"/>
        <Stat label="מבקשות לקוח" val={localTasks.filter(t=>t.source==="sr").length} color="orange"/>
        <Stat label="יוזמה פנימית" val={localTasks.filter(t=>t.source==="dept").length} color="indigo"/>
        <Stat label="באיחור" val={localTasks.filter(t=>t.status!=="Completed"&&overdue(t.due)).length} color="red"/>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>{["משימה","מקור","קטגוריה","תאריך יעד","מוקצה ל","עדיפות","סטטוס","",""].map(h=>(
              <th key={h} className="py-3 px-3 text-right text-xs font-medium text-gray-500 uppercase border-b">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {localTasks.map(t=>{
              const late=t.status!=="Completed"&&overdue(t.due);
              return(
                <tr key={t.id} className={`${late?"bg-red-50":t.status==="Completed"?"bg-gray-50":"hover:bg-gray-50"}`}>
                  <td className="py-3 px-3 max-w-xs">
                    <div className="flex items-center gap-2">
                      {late&&<AlertTriangle size={12} className="text-red-500 shrink-0"/>}
                      <span className={`text-xs font-medium ${t.status==="Completed"?"text-gray-400 line-through":"text-gray-900"}`}>{t.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    {t.source==="sr"?<span className="text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 rounded px-1.5 py-0.5">📋 {t.srNum}</span>
                      :<span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded px-1.5 py-0.5">🏢 {t.dept}</span>}
                  </td>
                  <td className="py-3 px-3"><Badge color={t.cat==="Policy"?"blue":t.cat==="Finance"?"purple":t.cat==="Credit"?"green":t.cat==="Claims"?"red":t.cat==="Compliance"?"orange":"gray"}>{t.cat}</Badge></td>
                  <td className={`py-3 px-3 text-xs ${late?"text-red-700 font-bold":"text-gray-600"}`}>{t.due}{late&&" ⚠"}</td>
                  <td className="py-3 px-3 text-xs text-gray-700">{t.assignee}</td>
                  <td className="py-3 px-3"><Badge color={priColor[t.priority]||"gray"} dot={t.priority==="High"?"bg-red-500":t.priority==="Medium"?"bg-yellow-500":"bg-gray-400"}>{t.priority}</Badge></td>
                  <td className="py-3 px-3"><Badge color={t.status==="Completed"?"green":late?"red":"blue"}>{t.status==="Completed"?"הושלם":late?"באיחור":"פתוח"}</Badge></td>
                  <td className="py-3 px-3">{t.status!=="Completed"&&<button onClick={()=>completeTask(t.id)} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">✓ סיים</button>}</td>
                  <td className="py-3 px-3"><button onClick={()=>setSelectedTask(t)} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">פרטים</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selectedTask&&<TaskDetailsModal task={selectedTask} onClose={()=>setSelectedTask(null)} onComplete={completeTask}/>}
    </div>
  );
}

function CRMTab({setShowNewClientReq,setSelectedSR}){
  const [localTasks]=useState(TASKS_INIT);
  const [expandedSRs,setExpandedSRs]=useState({});
  const [srFilters,setSrFilters]=useState([]);
  const overdue=d=>new Date(d)<new Date();
  const toggleSR=srNum=>setExpandedSRs(p=>({...p,[srNum]:!p[srNum]}));
  const srTasks=srNum=>localTasks.filter(t=>t.source==="sr"&&t.srNum===srNum);

  return(
    <div dir="rtl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-gray-800">בקשות לקוח</h3>
        <button onClick={()=>setShowNewClientReq(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 shadow-sm"><Plus size={14}/> פתח בקשה חדשה</button>
      </div>
          <div className="mb-4 grid grid-cols-4 gap-4">
            {[{label:"סה״כ בקשות",val:serviceRequests.length,color:"blue",filter:null},{label:"פתוח",val:serviceRequests.filter(s=>s.status==="Open").length,color:"yellow",filter:"Open"},{label:"בטיפול",val:serviceRequests.filter(s=>s.status==="In Progress").length,color:"orange",filter:"In Progress"},{label:"הושלמו",val:serviceRequests.filter(s=>s.status==="Completed").length,color:"green",filter:"Completed"}].map((tile,i)=>{
              const isActive=tile.filter===null?srFilters.length===0:srFilters.includes(tile.filter);
              const toggle=()=>{
                if(tile.filter===null){setSrFilters([]);return;}
                setSrFilters(prev=>prev.includes(tile.filter)?prev.filter(f=>f!==tile.filter):[...prev,tile.filter]);
              };
              return(
              <button key={i} onClick={toggle}
                className={`bg-${tile.color}-50 border-2 rounded-lg p-4 text-right transition-all hover:shadow-md ${isActive?`border-${tile.color}-500 shadow-md ring-2 ring-${tile.color}-300`:`border-${tile.color}-200`}`}>
                <p className={`text-2xl font-bold text-${tile.color}-900`}>{tile.val}</p>
                <p className={`text-xs font-medium text-${tile.color}-700 flex items-center gap-1`}>{tile.label}{isActive&&tile.filter!==null&&<span className="text-xs">✓</span>}</p>
              </button>
              );
            })}
          </div>
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"><AlertTriangle size={15} className="text-red-600 shrink-0"/><span className="text-sm text-red-800">SLA עבר ל-SR-2025-042 – נדרשת פעולה מיידית.</span></div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-3 w-8 border-b"/>
                  {["SR #","נושא","סוג","נפתח","נוצר ע״י","מועד SLA","עדיפות","סטטוס","פעולות"].map(h=>(
                    <th key={h} className="py-3 px-3 text-right text-xs font-medium text-gray-500 uppercase border-b">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {serviceRequests.filter(sr=>srFilters.length===0||srFilters.includes(sr.status)).map(sr=>{
                  const breach=sr.status!=="Completed"&&overdue(sr.sla);
                  const expanded=!!expandedSRs[sr.srNum];
                  const relTasks=srTasks(sr.srNum);
                  const typeColor=sr.type==="Coverage Change"?"orange":sr.type==="Credit Limit"?"green":sr.type==="Finance"?"purple":"gray";
                  return(
                    <React.Fragment key={sr.srNum}>
                      <tr className={`border-b border-gray-100 ${breach?"bg-red-50":expanded?"bg-blue-50":"hover:bg-gray-50"} transition-colors`}>
                        <td className="py-3 px-3 w-8">
                          <button onClick={()=>toggleSR(sr.srNum)} className={`w-6 h-6 rounded flex items-center justify-center ${expanded?"bg-blue-200 text-blue-700":"bg-gray-100 text-gray-500"}`}>
                            {expanded?<ChevronUp size={13}/>:<ChevronDown size={13}/>}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-xs font-bold text-blue-700">{sr.srNum}</td>
                        <td className="py-3 px-3 text-xs text-gray-900 font-medium">{sr.subject}</td>
                        <td className="py-3 px-3"><Badge color={typeColor}>{sr.type}</Badge></td>
                        <td className="py-3 px-3 text-xs text-gray-500">{sr.opened}</td>
                        <td className="py-3 px-3 text-xs text-gray-700">{sr.createdBy}</td>
                        <td className={`py-3 px-3 text-xs ${breach?"text-red-700 font-bold":"text-gray-600"}`}>{sr.sla}{breach?" ⚠️":""}</td>
                        <td className="py-3 px-3"><Badge color={priColor[sr.priority]||"gray"}>{sr.priority}</Badge></td>
                        <td className="py-3 px-3"><Badge color={stCol[sr.status]||"gray"}>{sr.status==="Completed"?"הושלמה":sr.status==="In Progress"?"בטיפול":"פתוחה"}</Badge></td>
                        <td className="py-3 px-3">
                          <div className="flex gap-1">
                            <button onClick={()=>setSelectedSR(sr)} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200">פרטים</button>
                            <button className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"><Edit size={12}/></button>
                          </div>
                        </td>
                      </tr>
                      {expanded&&(
                        <tr className="border-b border-blue-200">
                          <td colSpan={10} className="p-0">
                            <div className="bg-blue-50 border-t border-blue-200 px-6 py-3">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-bold text-blue-700">📋 משימות הקשורות ל-{sr.srNum}</span>
                                {relTasks.length===0?<span className="text-xs text-gray-400">– אין משימות קשורות</span>:<span className="text-xs text-blue-500 bg-blue-100 border border-blue-200 rounded-full px-2 py-0.5">{relTasks.length} משימות</span>}
                              </div>
                              {relTasks.length===0?<p className="text-xs text-gray-400 italic py-1">לא נוצרו משימות עבור בקשה זו</p>:(
                                <div className="space-y-2">
                                  {relTasks.map(t=>{
                                    const late=t.status!=="Completed"&&overdue(t.due);
                                    return(
                                      <div key={t.id} className={`grid grid-cols-12 gap-2 items-center px-3 py-2 rounded-lg border ${t.status==="Completed"?"bg-white border-gray-200":late?"bg-red-50 border-red-200":"bg-white border-blue-100"}`}>
                                        <div className="col-span-4 flex items-center gap-2">
                                          {late&&<AlertTriangle size={11} className="text-red-500 shrink-0"/>}
                                          <span className={`text-xs font-medium truncate ${t.status==="Completed"?"text-gray-400 line-through":"text-gray-800"}`}>{t.title}</span>
                                        </div>
                                        <div className="col-span-2"><Badge color={t.cat==="Policy"?"blue":t.cat==="Finance"?"purple":t.cat==="Credit"?"green":"gray"}>{t.cat}</Badge></div>
                                        <div className={`col-span-2 text-xs ${late?"text-red-700 font-bold":"text-gray-500"}`}>{t.due}</div>
                                        <div className="col-span-2 text-xs text-gray-600">{t.assignee}</div>
                                        <div className="col-span-2 flex items-center justify-between gap-1">
                                          <Badge color={t.status==="Completed"?"green":late?"red":"blue"}>{t.status==="Completed"?"הושלם":late?"באיחור":"פתוח"}</Badge>
                                          <button onClick={()=>setSelectedSR(sr)} className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">פרטים</button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
    </div>
  );
}

function MeetingFormModal({onClose}){
  const [tab,setTab]=useState("meeting");
  const [topic,setTopic]=useState("");
  const [topicOpen,setTopicOpen]=useState(false);
  const [date,setDate]=useState("25/03/2026");
  const [timeStart,setTimeStart]=useState("");
  const [timeEnd,setTimeEnd]=useState("");
  const [format,setFormat]=useState("");
  const [location,setLocation]=useState("");
  const [template,setTemplate]=useState("");
  const [selectedContacts,setSelectedContacts]=useState([]);
  const [contactsOpen,setContactsOpen]=useState(false);
  const [selectedInsuredContacts,setSelectedInsuredContacts]=useState([]);
  const [insuredOpen,setInsuredOpen]=useState(false);
  const [deptsOpen,setDeptsOpen]=useState(false);
  const [selectedDepts,setSelectedDepts]=useState([]);
  const [deptTexts,setDeptTexts]=useState({});
  const [deptSaved,setDeptSaved]=useState({});
  const [generalNotes,setGeneralNotes]=useState("");

  const CONTACTS=[{id:1,name:"דוד לוי",role:'מנכ"ל',initials:"דל"},{id:2,name:"רחל כהן",role:'סמנכ"ל כספים',initials:"רכ"},{id:3,name:"יוסי מזרחי",role:"מנהל תפעול",initials:"ימ"},{id:4,name:"שרה אברהם",role:"מנהלת רכש",initials:"שא"},{id:5,name:"אמיר שפירא",role:"יועץ משפטי",initials:"אש"},{id:6,name:"נועה גולן",role:"מנהלת שיווק",initials:"נג"}];
  const INSURED_CONTACTS=CONTACTS_LIST.map((n,i)=>({id:100+i,name:n,role:CONTACTS_LIST[i]}));
  const DEPTS=["מחלקת קשרי לקוחות","מחלקת סיכונים","מחלקת בקרה","מחלקת תביעות","מחלקת כספים","מאקרו סקטורים / ענפים / מדינות","מחלקת מכירות","תפעול / טכני"];
  const TOPICS=["העתקת נתונים כספיים","עדכון מצב חברה","הכרות","לבקשת המבוטח","מידע שלילי","פגישה תקופתית","דיון על תנאי הפוליסה","דיון בנושא תביעות","דיון על חייבים","הכרות איש קשר חדש","פגישת תפעול / הדרכה","מבוטח חדש","מתחרים","הרחבת פעילות"];

  const toggleContact=(id,list,setList)=>setList(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const addDept=idx=>{
    if(selectedDepts.includes(idx))return;
    setSelectedDepts(p=>[...p,idx]);
    setDeptsOpen(false);
  };

  const Fi=({label,req,children})=>(
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-700 text-right">{label}{req&&<span className="text-red-500 mr-1 font-semibold">חובה</span>}</label>
      {children}
    </div>
  );
  const inputCls="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-right bg-white outline-none focus:ring-2 focus:ring-blue-300";
  const selCls=inputCls+" flex items-center justify-between cursor-pointer";

  const ContactPicker=({list,open,setOpen,selected,setSelected,placeholder})=>(
    <div className="relative">
      <div className={`${inputCls} flex flex-wrap gap-1.5 min-h-[38px] cursor-pointer`} onClick={e=>{e.stopPropagation();setOpen(o=>!o);}}>
        {selected.length===0?<span className="text-gray-400 text-sm">{placeholder}</span>
          :selected.map(id=>{const c=list.find(x=>x.id===id);return c?(<span key={id} className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5 text-xs text-blue-800"><button onClick={e=>{e.stopPropagation();toggleContact(id,selected,setSelected);}} className="text-gray-400 hover:text-red-500 font-bold leading-none">×</button><span className="text-gray-500">{c.role}</span><span className="text-gray-300 mx-0.5">|</span><span>{c.name}</span></span>):null;})}
        <span className="mr-auto text-gray-400 text-xs shrink-0">{open?"▲":"▼"}</span>
      </div>
      {open&&<div className="absolute top-full right-0 left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-52 overflow-y-auto" onClick={e=>e.stopPropagation()}>
        <div className="px-3 py-2 border-b text-xs text-gray-500">בחר אנשי קשר</div>
        {list.map(c=>(
          <div key={c.id} onClick={()=>toggleContact(c.id,selected,setSelected)} className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-blue-50 ${selected.includes(c.id)?"bg-blue-50":""}`}>
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">{c.initials||c.name[0]}</div>
            <div className="flex-1 text-right"><p className="text-xs font-medium text-gray-900">{c.name}</p><p className="text-xs text-gray-500">{c.role}</p></div>
            <div className={`w-4 h-4 rounded border flex items-center justify-center text-xs shrink-0 ${selected.includes(c.id)?"bg-blue-600 border-blue-600 text-white":"border-gray-300"}`}>{selected.includes(c.id)&&"✓"}</div>
          </div>
        ))}
      </div>}
    </div>
  );

  return(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={e=>{if(e.target===e.currentTarget)onClose();setContactsOpen(false);setInsuredOpen(false);setTopicOpen(false);setDeptsOpen(false);}}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col" style={{maxHeight:"90vh"}} dir="rtl">

        {/* header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 shrink-0">
          <h3 className="text-sm font-semibold text-gray-900">תיעוד פגישה – אקמה גלובל סולושנס</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 rounded"><X size={16}/></button>
        </div>

        {/* tabs */}
        <div className="flex border-b border-gray-200 px-5 shrink-0">
          {[{id:"meeting",label:"פרטי פגישה"},{id:"financial",label:"סקירה פיננסית"},{id:"tasks",label:"משימות למעקב"}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors whitespace-nowrap -mb-px ${tab===t.id?"border-blue-600 text-blue-600":"border-transparent text-gray-500 hover:text-gray-700"}`}>{t.label}</button>
          ))}
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">

          {/* ── פרטי פגישה ── */}
          {tab==="meeting"&&<div className="space-y-3">
            <div className="border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2 bg-gray-50">
              <span className="text-xs text-gray-500">סוג ישות</span>
              <span className="text-xs font-semibold text-gray-800">חברה</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Fi label="תבנית שאלון">
                <select value={template} onChange={e=>setTemplate(e.target.value)} className={inputCls}><option value="">-- בחר --</option><option>תבנית סטנדרטית</option><option>תבנית מורחבת</option></select>
              </Fi>
              <Fi label="נושא פגישה" req>
                <div className="relative">
                  <div className={selCls} onClick={e=>{e.stopPropagation();setTopicOpen(o=>!o);}}>
                    <span className={topic?"text-gray-900":"text-gray-400"}>{topic||"בחר נושא..."}</span>
                    <span className="text-gray-400 text-xs">{topicOpen?"▲":"▼"}</span>
                  </div>
                  {topicOpen&&<div className="absolute top-full right-0 left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto" onClick={e=>e.stopPropagation()}>
                    {TOPICS.map(t=><div key={t} onClick={()=>{setTopic(t);setTopicOpen(false);}} className="px-3 py-2 text-xs text-gray-800 cursor-pointer hover:bg-blue-50 text-right">{t}</div>)}
                  </div>}
                </div>
              </Fi>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Fi label="תאריך הפגישה" req>
                <input type="date" className={inputCls} defaultValue="2026-03-25"/>
              </Fi>
              <Fi label="שעת התחלה">
                <input type="time" value={timeStart} onChange={e=>setTimeStart(e.target.value)} className={inputCls+" text-center"}/>
              </Fi>
              <Fi label="שעת סיום">
                <input type="time" value={timeEnd} onChange={e=>setTimeEnd(e.target.value)} className={inputCls+" text-center"}/>
              </Fi>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Fi label="פורמט פגישה" req>
                <select value={format} onChange={e=>setFormat(e.target.value)} className={inputCls}><option value="">-- בחר --</option><option>פרונטלית</option><option>וירטואלית</option><option>היברידית</option></select>
              </Fi>
              <Fi label="מיקום הפגישה">
                <input type="text" value={location} onChange={e=>setLocation(e.target.value)} className={inputCls} placeholder="הזן מיקום..."/>
              </Fi>
            </div>

            <Fi label="משתתפים מטעם כלל ביטוח אשראי">
              <ContactPicker list={CONTACTS} open={contactsOpen} setOpen={setContactsOpen} selected={selectedContacts} setSelected={setSelectedContacts} placeholder="בחר אנשי קשר..."/>
            </Fi>

            <Fi label="משתתפים מטעם המבוטח">
              <div className="relative">
                <div className={selCls} onClick={e=>{e.stopPropagation();setInsuredOpen(o=>!o);}}>
                  <span className={selectedInsuredContacts.length?"text-gray-900":"text-gray-400"}>{selectedInsuredContacts.length?`${selectedInsuredContacts.length} נבחרו`:"בחר..."}</span>
                  <span className="text-gray-400 text-xs">{insuredOpen?"▲":"▼"}</span>
                </div>
                {insuredOpen&&<div className="absolute top-full right-0 left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-44 overflow-y-auto" onClick={e=>e.stopPropagation()}>
                  {CONTACTS_LIST.map((n,i)=>(
                    <div key={i} onClick={()=>setSelectedInsuredContacts(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i])} className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-blue-50 ${selectedInsuredContacts.includes(i)?"bg-blue-50":""}`}>
                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">{n[0]}</div>
                      <span className="text-xs text-gray-800 flex-1 text-right">{n}</span>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center text-xs shrink-0 ${selectedInsuredContacts.includes(i)?"bg-blue-600 border-blue-600 text-white":"border-gray-300"}`}>{selectedInsuredContacts.includes(i)&&"✓"}</div>
                    </div>
                  ))}
                </div>}
              </div>
            </Fi>

            <hr className="border-gray-200"/>

            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-xs text-gray-500 italic font-semibold shrink-0">i</span>
              <span className="text-xs font-medium text-gray-700">מהלך הדיון</span>
            </div>

            {/* dept picker */}
            <div className="relative">
              <div className="flex items-center justify-between border border-blue-200 rounded-lg px-3 py-2 bg-blue-50 cursor-pointer" onClick={e=>{e.stopPropagation();setDeptsOpen(o=>!o);}}>
                <span className="text-xs text-blue-600 font-medium">+ הוסף מחלקה</span>
                <span className="text-blue-400 text-xs">{deptsOpen?"▲":"▼"}</span>
              </div>
              {deptsOpen&&<div className="absolute top-full right-0 left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto" onClick={e=>e.stopPropagation()}>
                <div className="px-3 py-2 border-b text-xs text-gray-500">בחר מחלקות לדיון</div>
                {DEPTS.map((d,i)=>{
                  const added=selectedDepts.includes(i);
                  return(
                    <div key={i} onClick={()=>!added&&addDept(i)} className={`flex items-center justify-between px-3 py-2 text-xs ${added?"cursor-not-allowed text-gray-400 bg-gray-50":"cursor-pointer hover:bg-blue-50 text-gray-800"}`}>
                      <span>{d}</span>
                      {added&&<span className="text-xs text-blue-400 border border-blue-200 rounded px-1 bg-blue-50">נוסף ✓</span>}
                    </div>
                  );
                })}
              </div>}
            </div>

            {/* dept sections */}
            {selectedDepts.map(idx=>(
              <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    {deptSaved[idx]
                      ?<><button onClick={()=>setDeptSaved(p=>({...p,[idx]:false}))} className="text-xs text-blue-600 hover:underline">ערוך</button><button onClick={()=>{setSelectedDepts(p=>p.filter(x=>x!==idx));}} className="text-xs text-red-500 hover:underline">מחק</button></>
                      :<><button onClick={()=>setDeptSaved(p=>({...p,[idx]:true}))} className="px-2.5 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">שמור</button><button onClick={()=>setSelectedDepts(p=>p.filter(x=>x!==idx))} className="px-2.5 py-1 border border-gray-300 text-xs text-gray-600 rounded">בטל</button></>
                    }
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-800">{DEPTS[idx]}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{deptSaved[idx]?"נושאים שהועלו":"נושאים שהועלו בפגישה"}</span>
                  </div>
                </div>
                {!deptSaved[idx]
                  ?<textarea rows={3} value={deptTexts[idx]||""} onChange={e=>setDeptTexts(p=>({...p,[idx]:e.target.value}))} placeholder="הזן נושאים שהועלו בפגישה..." className="w-full px-3 py-2 text-xs text-right outline-none resize-none border-0"/>
                  :<div className="px-3 py-2 text-xs text-gray-700 whitespace-pre-wrap">{deptTexts[idx]}</div>
                }
                {deptSaved[idx]&&<div className="flex gap-4 px-3 py-1.5 border-t border-gray-100 text-xs text-gray-400">
                  <span>📅 {new Date().toLocaleDateString("he-IL")}</span>
                  <span>נוצר ע"י: עמית שלי</span>
                  <span>סטטוס: פתוח</span>
                </div>}
              </div>
            ))}

            <Fi label="התרשמות כללית / דגשים נוספים">
              <textarea rows={3} value={generalNotes} onChange={e=>setGeneralNotes(e.target.value)} placeholder="הזן התרשמות כללית מהפגישה..." className={`${inputCls} resize-none`}/>
            </Fi>
          </div>}

          {/* ── סקירה פיננסית ── */}
          {tab==="financial"&&<div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[["ענף החברה",""],["תאריך כניסה לביטוח",""],["מחזור מכירות בפועל מדוחות כספיים לשנת 2025",""],["מחזור מכירות מדווח לשנה 2026",""],["החרגות",""]].map(([l])=>(
                <div key={l} className="flex flex-col gap-1">
                  <label className="text-xs text-gray-700 text-right">{l}</label>
                  <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 bg-gray-50 min-h-[36px]">—</div>
                </div>
              ))}
            </div>
            <hr className="border-gray-200"/>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-700 text-right">הפערים בין המחזורים הינם עקב</label>
              <textarea rows={3} placeholder="הזן הסבר לפערים..." className={`${inputCls} resize-none`}/>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-700 text-right">האם נבחנה מול המבוטח הרחבת פעילות או הוספת חברות קשורות</label>
              <textarea rows={3} placeholder="הזן תשובה..." className={`${inputCls} resize-none`}/>
            </div>
            <hr className="border-gray-200"/>
            <p className="text-xs font-semibold text-gray-700 mb-2">נתוני פוליסה</p>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full text-xs text-right">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2.5 border-b border-gray-200 font-medium text-gray-600"></th>
                    <th className="px-3 py-2.5 border-b border-gray-200 font-medium text-gray-600 text-center">נתונים לתאריך הפגישה<br/><span className="text-gray-400 font-normal">DD/MM/YYYY</span></th>
                    <th className="px-3 py-2.5 border-b border-gray-200 font-medium text-gray-600 text-center">נתונים עדכניים להיום</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {["אובליגו שוק מקומי","אובליגו שוק יצוא","שיעור פרמיה כולל דמים","פרמיה ודמים 12 חודשים","תביעות מסולקות 12 חודשים אחרונה"].map((r,i)=>(
                    <tr key={r} className={i%2===1?"bg-gray-50":""}>
                      <td className="px-3 py-2 text-gray-700 whitespace-nowrap">{r}</td>
                      <td className="px-3 py-2 text-gray-400 text-center">—</td>
                      <td className="px-3 py-2 text-gray-400 text-center">—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>}

          {/* ── משימות למעקב ── */}
          {tab==="tasks"&&<div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-2xl">✓</div>
            <p className="text-sm font-medium text-gray-700">אין משימות למעקב</p>
            <p className="text-xs text-gray-400">משימות שיוגדרו בפגישה יופיעו כאן</p>
          </div>}
        </div>

        {/* footer */}
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-200 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">ביטול</button>
          {tab==="tasks"
            ?<button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">+ הוסף משימה</button>
            :tab==="financial"
              ?<button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">✓ שמור</button>
              :<button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">✓ צור פגישה</button>
          }
        </div>
      </div>
    </div>
  );
}

function OwnershipTab(){
  const [companies,setCompanies]=useState([
    {id:1,name:"אלבטק בע\"מ",regNum:"511611667",linkType:"חברת אם ראשית",holding:null,startDate:"05/05/2026",endDate:"05/05/2026",extras:"-"},
    {id:2,name:"אלבטק בע\"מ",regNum:"511611667",linkType:"חברת אם",holding:"15%",startDate:"01/05/2026",endDate:"10/05/2026",extras:"-"},
  ]);
  const [individuals,setIndividuals]=useState([
    {id:1,name:"יאיר",idNum:"18",linkType:"בעל עניין",holding:"15%",startDate:"02/05/2026",endDate:"07/05/2026",extras:"-"},
  ]);
  const [showAddCo,setShowAddCo]=useState(false);
  const [showAddInd,setShowAddInd]=useState(false);

  const linkColors={"חברת אם ראשית":"bg-red-500 text-white","חברת אם":"bg-red-500 text-white","חברת בת":"bg-blue-500 text-white","שותפות":"bg-purple-500 text-white","בעל עניין":"bg-purple-400 text-white","בעלים":"bg-orange-500 text-white","נציג":"bg-gray-400 text-white"};
  const Badge2=({t})=><span className={`px-2.5 py-1 rounded text-xs font-semibold ${linkColors[t]||"bg-gray-200 text-gray-700"}`}>{t}</span>;

  const TH=({children})=><th className="py-2.5 px-3 text-right text-xs font-semibold text-gray-500 uppercase border-b border-gray-200 bg-gray-50">{children}</th>;
  const TD=({children,cls=""})=><td className={`py-2.5 px-3 text-sm text-gray-800 border-b border-gray-100 ${cls}`}>{children}</td>;

  return(
    <div dir="rtl" className="space-y-8">
      {/* ── header buttons ── */}
      <div className="flex justify-end gap-2">
        <button onClick={()=>setShowAddInd(true)} className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"><Plus size={14}/> הוספת קשר</button>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">⚙️ ניהול קבוצות</button>
      </div>

      {/* ── חברות קשורות ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🏢</span>
          <h3 className="text-sm font-bold text-gray-800">חברות קשורות</h3>
          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">({companies.length})</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr>
                <TH>שם חברה</TH><TH>מספר רישום</TH><TH>סוג קשר</TH><TH>% אחוזי החזקה</TH>
                <TH>תאריך תוקף</TH><TH>תאריך תחילת הקשר</TH><TH>פרטים נוספים</TH><TH>פעולות</TH>
              </tr>
            </thead>
            <tbody>
              {companies.map(c=>(
                <tr key={c.id} className="hover:bg-gray-50">
                  <TD><span className="text-blue-600 font-medium cursor-pointer hover:underline">{c.name}</span></TD>
                  <TD>{c.regNum}</TD>
                  <TD><Badge2 t={c.linkType}/></TD>
                  <TD>{c.holding||"–"}</TD>
                  <TD>{c.endDate}</TD>
                  <TD>{c.startDate}</TD>
                  <TD cls="text-gray-400">{c.extras}</TD>
                  <TD>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit size={13}/></button>
                      <button onClick={()=>setCompanies(prev=>prev.filter(x=>x.id!==c.id))} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash size={13}/></button>
                    </div>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── בעלי עניין קשורים ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">👤</span>
          <h3 className="text-sm font-bold text-gray-800">בעלי עניין קשורים</h3>
          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">({individuals.length})</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr>
                <TH>שם מלא</TH><TH>מספר זיהוי</TH><TH>סוג קשר</TH><TH>% אחוזי החזקה</TH>
                <TH>תאריך תוקף</TH><TH>תאריך תחילת הקשר</TH><TH>פרטים נוספים</TH><TH>פעולות</TH>
              </tr>
            </thead>
            <tbody>
              {individuals.map(p=>(
                <tr key={p.id} className="hover:bg-gray-50">
                  <TD><span className="text-blue-600 font-medium cursor-pointer hover:underline">{p.name}</span></TD>
                  <TD>{p.idNum}</TD>
                  <TD><Badge2 t={p.linkType}/></TD>
                  <TD>{p.holding||"–"}</TD>
                  <TD>{p.endDate}</TD>
                  <TD>{p.startDate}</TD>
                  <TD cls="text-gray-400">{p.extras}</TD>
                  <TD>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit size={13}/></button>
                      <button onClick={()=>setIndividuals(prev=>prev.filter(x=>x.id!==p.id))} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash size={13}/></button>
                    </div>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CreditLimitsTab({creditLimits}){
  const [clF,setClF]=useState({debtor:"",status:"",grade:"",dateFrom:"",dateTo:"",country:"",industry:"",amountMin:"",amountMax:"",currency:""});
  const [advOpen,setAdvOpen]=useState(false);
  const inp="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-blue-300";
  const FI=({label,children})=><div className="flex flex-col gap-1"><label className="text-xs font-medium text-gray-600">{label}</label>{children}</div>;
  const filtered=creditLimits.filter(l=>{
    if(clF.debtor&&!l.debtorName.toLowerCase().includes(clF.debtor.toLowerCase()))return false;
    if(clF.status&&l.status!==clF.status)return false;
    if(clF.grade&&l.riskGrade!==clF.grade)return false;
    return true;
  });
  return(
    <div>
      <div className="flex justify-between mb-4"><h3 className="text-base font-medium">תקרות אשראי</h3><button className="bg-blue-600 text-white px-3 py-1.5 rounded flex items-center gap-1 text-sm hover:bg-blue-700"><Plus size={14}/>בקש תקרת אשראי</button></div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
        <div className="grid grid-cols-5 gap-3 mb-3">
          <FI label="שם חייב"><input className={inp} placeholder="חפש חייב..." value={clF.debtor} onChange={e=>setClF(p=>({...p,debtor:e.target.value}))}/></FI>
          <FI label="סטטוס"><select className={inp} value={clF.status} onChange={e=>setClF(p=>({...p,status:e.target.value}))}><option value="">הכל</option><option>פעיל</option><option>ממתין</option><option>פג תוקף</option></select></FI>
          <FI label="דירוג סיכון"><select className={inp} value={clF.grade} onChange={e=>setClF(p=>({...p,grade:e.target.value}))}><option value="">הכל</option><option>A+</option><option>A</option><option>A-</option><option>B+</option><option>בבדיקה</option></select></FI>
          <FI label="תאריך פקיעה מ-"><input type="date" className={inp} value={clF.dateFrom} onChange={e=>setClF(p=>({...p,dateFrom:e.target.value}))}/></FI>
          <FI label="תאריך פקיעה עד"><input type="date" className={inp} value={clF.dateTo} onChange={e=>setClF(p=>({...p,dateTo:e.target.value}))}/></FI>
        </div>
        <div>
          <button onClick={()=>setAdvOpen(o=>!o)} className="flex items-center gap-1.5 text-xs text-blue-600 font-medium hover:underline mb-2">
            {advOpen?"▲ הסתר חיפוש מורחב":"▼ חיפוש מורחב"}
          </button>
          {advOpen&&<div className="grid grid-cols-5 gap-3 pt-3 border-t border-gray-100">
            <FI label="מדינה"><input className={inp} placeholder="מדינת החייב..." value={clF.country} onChange={e=>setClF(p=>({...p,country:e.target.value}))}/></FI>
            <FI label="ענף פעילות"><input className={inp} placeholder="ענף..." value={clF.industry} onChange={e=>setClF(p=>({...p,industry:e.target.value}))}/></FI>
            <FI label="סכום מינימלי"><input type="number" className={inp} placeholder="0" value={clF.amountMin} onChange={e=>setClF(p=>({...p,amountMin:e.target.value}))}/></FI>
            <FI label="סכום מקסימלי"><input type="number" className={inp} placeholder="ללא הגבלה" value={clF.amountMax} onChange={e=>setClF(p=>({...p,amountMax:e.target.value}))}/></FI>
            <FI label="מטבע"><select className={inp} value={clF.currency} onChange={e=>setClF(p=>({...p,currency:e.target.value}))}><option value="">הכל</option><option>USD</option><option>EUR</option><option>ILS</option><option>GBP</option></select></FI>
          </div>}
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">{filtered.length} תוצאות מתוך {creditLimits.length}</span>
          <button onClick={()=>setClF({debtor:"",status:"",grade:"",dateFrom:"",dateTo:"",country:"",industry:"",amountMin:"",amountMax:"",currency:""})} className="text-xs text-gray-500 hover:text-red-500">✕ נקה סינון</button>
        </div>
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50"><tr>{["שם חייב","מזהה","סכום מבוקש","סכום מאושר","דירוג סיכון","פקיעה","סטטוס","פעולות"].map(h=><th key={h} className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase border-b">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-gray-200">
          {filtered.map(l=>(
            <tr key={l.id} className="hover:bg-gray-50">
              <td className="py-3 px-4 text-sm font-medium">{l.debtorName}</td><td className="py-3 px-4 text-sm text-gray-500">{l.debtorId}</td><td className="py-3 px-4 text-sm">{l.requestedAmount}</td><td className="py-3 px-4 text-sm font-medium">{l.approvedAmount}</td>
              <td className="py-3 px-4"><span className={`px-2 py-1 text-xs rounded-full font-medium ${l.riskGrade==="A+"||l.riskGrade==="A"?"bg-green-100 text-green-800":l.riskGrade==="בבדיקה"?"bg-yellow-100 text-yellow-800":"bg-blue-100 text-blue-800"}`}>{l.riskGrade}</span></td>
              <td className="py-3 px-4 text-sm text-gray-500">{l.expiryDate}</td>
              <td className="py-3 px-4"><span className={`px-2 py-1 text-xs rounded-full ${l.status==="פעיל"?"bg-green-100 text-green-800":l.status==="ממתין"?"bg-yellow-100 text-yellow-800":"bg-gray-100 text-gray-800"}`}>{l.status}</span></td>
              <td className="py-3 px-4"><div className="flex gap-1"><button className="p-1.5 bg-blue-100 text-blue-600 rounded"><Edit size={14}/></button><button className="p-1.5 bg-red-100 text-red-600 rounded"><Trash size={14}/></button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const InsuredManagementScreen = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [expandedSection, setExpandedSection] = useState("companyInfo");
  const [showContactModal, setShowContactModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("ארצות הברית");
  const [showNewClientReq, setShowNewClientReq] = useState(false);
  const [selectedSR, setSelectedSR] = useState(null);

  const [policyReports]= useState([
    {id:1,year:2023,policyNumber:"POL-2023-001",coverageAmount:"₪9,000,000",premium:"₪140,000",deductible:"₪180,000",status:"פעיל",renewalDate:"2024-03-15"},
    {id:2,year:2022,policyNumber:"POL-2022-001",coverageAmount:"₪8,000,000",premium:"₪115,000",deductible:"₪160,000",status:"פג תוקף",renewalDate:"2023-04-10"},
    {id:3,year:2021,policyNumber:"POL-2021-001",coverageAmount:"₪7,200,000",premium:"₪100,000",deductible:"₪145,000",status:"פג תוקף",renewalDate:"2022-03-28"},
  ]);
  const [creditLimits]=useState([
    {id:1,debtorName:'טק סולושנס בע"מ',debtorId:"DBT-001",requestedAmount:"₪1,800,000",approvedAmount:"₪1,620,000",approvalDate:"2024-01-15",expiryDate:"2025-01-15",status:"פעיל",riskGrade:"A"},
    {id:2,debtorName:'גלובל מניופקטורינג בע"מ',debtorId:"DBT-002",requestedAmount:"₪2,700,000",approvedAmount:"₪2,700,000",approvalDate:"2024-02-20",expiryDate:"2025-02-20",status:"פעיל",riskGrade:"A+"},
    {id:3,debtorName:'ריטייל פרטנרס בע"מ',debtorId:"DBT-003",requestedAmount:"₪1,080,000",approvedAmount:"₪900,000",approvalDate:"2023-06-10",expiryDate:"2024-06-10",status:"פג תוקף",riskGrade:"B+"},
    {id:4,debtorName:"יורופיאן טרייד GmbH",debtorId:"DBT-004",requestedAmount:"₪2,160,000",approvedAmount:"₪0",approvalDate:"-",expiryDate:"-",status:"ממתין",riskGrade:"בבדיקה"},
    {id:5,debtorName:'פסיפיק אימפורטס בע"מ',debtorId:"DBT-005",requestedAmount:"₪1,440,000",approvedAmount:"₪1,440,000",approvalDate:"2024-03-01",expiryDate:"2025-03-01",status:"פעיל",riskGrade:"A-"},
  ]);
  const [claims]=useState([
    {id:1,claimNumber:"CLM-2024-001",claimType:"אי פירעון",debtorName:'טק סולושנס בע"מ',claimAmount:"₪162,000",paidAmount:"₪145,800",filingDate:"2024-03-05",status:"שולם",handler:"ליסה חן"},
    {id:2,claimNumber:"CLM-2024-002",claimType:"פשיטת רגל",debtorName:'ריטייל פרטנרס בע"מ',claimAmount:"₪450,000",paidAmount:"₪0",filingDate:"2024-04-20",status:"בטיפול",handler:"דוד כהן"},
    {id:3,claimNumber:"CLM-2023-015",claimType:"אי פירעון",debtorName:'גלובל מניופקטורינג בע"מ',claimAmount:"₪89,000",paidAmount:"₪89,000",filingDate:"2023-11-10",status:"שולם",handler:"שרה לוי"},
    {id:4,claimNumber:"CLM-2023-012",claimType:"סיכון פוליטי",debtorName:"יורופיאן טרייד GmbH",claimAmount:"₪320,000",paidAmount:"₪288,000",filingDate:"2023-08-15",status:"שולם",handler:"רוברט בראון"},
    {id:5,claimNumber:"CLM-2024-003",claimType:"חדלות פירעון",debtorName:'פסיפיק אימפורטס בע"מ',claimAmount:"₪275,000",paidAmount:"₪0",filingDate:"2024-05-01",status:"ממתין לאישור",handler:"ליסה חן"},
    {id:6,claimNumber:"CLM-2024-004",claimType:"הונאה",debtorName:'גלובל מניופקטורינג בע"מ',claimAmount:"₪185,000",paidAmount:"₪0",filingDate:"2024-05-10",status:"בבדיקה",handler:"רוברט בראון"},
  ]);
  const [claimFilter,setClaimFilter]=useState("all");
  const [documents]=useState([
    {id:1,name:"פוליסת ביטוח 2024",category:"פוליסה",fileType:"PDF",size:"2.4 MB",uploadDate:"2024-01-15",uploadedBy:"שרה לוי",description:"מסמך פוליסת ביטוח שנתית"},
    {id:2,name:"דוח כספי רבעון 4 2023",category:"פיננסי",fileType:"PDF",size:"1.8 MB",uploadDate:"2024-02-01",uploadedBy:"דוד כהן",description:"דוחות כספיים רבעוניים"},
    {id:3,name:"דוח הערכת סיכונים",category:"סיכון",fileType:"PDF",size:"3.2 MB",uploadDate:"2024-01-20",uploadedBy:"רוברט בראון",description:"הערכת סיכונים מקיפה"},
    {id:4,name:"תעודת רישום חברה",category:"משפטי",fileType:"PDF",size:"0.5 MB",uploadDate:"2023-06-10",uploadedBy:"שרה לוי",description:"מסמכי רישום רשמיים"},
    {id:5,name:"דוח היסטוריית תביעות",category:"תביעות",fileType:"XLSX",size:"1.2 MB",uploadDate:"2024-03-01",uploadedBy:"ליסה חן",description:"נתוני תביעות היסטוריים"},
  ]);
  const [documentFilter,setDocumentFilter]=useState("all");
  const [activities]=useState([
    {id:1,type:"עדכון פוליסה",description:"תקרת כיסוי הפוליסה הועלתה ל-₪9,000,000",user:"שרה לוי",date:"2024-03-15",time:"14:30",status:"הושלם",relatedTo:"POL-2023-001"},
    {id:2,type:"בקשת תקרת אשראי",description:'בקשת תקרת אשראי חדשה הוגשה עבור טק סולושנס בע"מ',user:"דוד כהן",date:"2024-03-14",time:"10:15",status:"ממתין",relatedTo:"DBT-001"},
    {id:3,type:"העלאת מסמך",description:"דוח כספי רבעון 4 2023 הועלה",user:"דוד כהן",date:"2024-03-13",time:"16:45",status:"הושלם",relatedTo:"DOC-002"},
    {id:4,type:"פגישה נקבעה",description:"פגישת סקירת פוליסה נקבעה ל-20 במאי 2025",user:"יוחנן שמיט",date:"2024-03-12",time:"09:00",status:"מתוכנן",relatedTo:"MTG-001"},
    {id:5,type:"תביעה הוגשה",description:"תביעה חדשה הוגשה - סכום: ₪162,000",user:"ליסה חן",date:"2024-03-05",time:"15:00",status:"בטיפול",relatedTo:"CLM-001"},
  ]);
  const [activityFilter,setActivityFilter]=useState("all");
  const [expandedNoteDrawers,setExpandedNoteDrawers]=useState({company:true,lead:true,debtor:true,meeting:true});
  const [notes]=useState([
    {id:1,title:"פגישת עבודה",category:"חברה",description:"אחלה מבוטח",createdBy:"עמית שלו",createdDate:"Feb 17, 2026"},
    {id:2,title:"עדכון פוליסה שנתית",category:"חברה",description:"יש לעדכן את תנאי הפוליסה לפני החידוש",createdBy:"שרה לוי",createdDate:"Feb 15, 2026"},
    {id:3,title:"ליד חדש מכנס",category:"ליד",description:"פגישה ראשונית עם נציג חברת טק סולושנס",createdBy:"דוד כהן",createdDate:"Feb 14, 2026"},
    {id:4,title:"בדיקת אשראי",category:"חייב",description:"נדרש לבצע בדיקת אשראי מחודשת",createdBy:"ליסה חן",createdDate:"Feb 12, 2026"},
    {id:5,title:"הכנה לפגישת סקירה",category:"פגישה",description:"להכין מצגת עם נתוני תביעות אחרונים",createdBy:"עמית שלו",createdDate:"Feb 8, 2026"},
  ]);
  const selectedCompany={name:"אקמה גלובל סולושנס",primaryId:"REG-123456",entityRoles:["מבוטח","חייב"]};
  const [addresses,setAddresses]=useState([
    {id:1,type:"headquarters",label:"משרד ראשי",isPrimary:true,addressLine1:"רחוב הברזל 38, קומה 5",addressLine2:"תל אביב-יפו",postalArea:"6971054",country:"ישראל",state:"תל אביב",notes:"משרד ראשי"},
    {id:2,type:"billing",label:"כתובת לחיוב",isPrimary:false,addressLine1:"רחוב ז'בוטינסקי 7, קומה 3",addressLine2:"רמת גן",postalArea:"5252007",country:"ישראל",state:"תל אביב",notes:"מחלקת חשבונות"},
  ]);
  const addressTypes=[{value:"headquarters",label:"משרד ראשי",icon:Building},{value:"billing",label:"כתובת לחיוב",icon:Briefcase},{value:"shipping",label:"משלוחים/מחסן",icon:MapPin},{value:"branch",label:"סניף",icon:Building},{value:"other",label:"אחר",icon:Home}];
  const [meetings]=useState([
    {id:1,title:"פגישת סקירת פוליסה",category:"מבוטח",date:"2025-05-20",time:"10:00",meetingType:"פרונטלית",location:"משרד הלקוח",participants:"יוחנן שמיט, דוד כהן",status:"קרובה"},
    {id:2,title:"דיון הערכת סיכונים",category:"מבוטח",date:"2025-05-05",time:"14:30",meetingType:"וירטואלית",location:"שיחת וידאו",participants:"שרה לוי, ליסה חן",status:"הושלם"},
    {id:3,title:"דיון הרחבת כיסוי",category:"ליד",date:"2025-06-10",time:"11:00",meetingType:"היברידית",location:"המשרד שלנו",participants:"יוחנן שמיט, רוברט ג'ונסון",status:"מתוכננת"},
  ]);
  const contacts=[
    {id:1,firstName:"יוחנן",lastName:"שמיט",idNumber:"012345678",role:'מנכ"ל',telephone:"03-1234567",mobile:"050-1234567",email:"john.smith@company.co.il"},
    {id:2,firstName:"שרה",lastName:"לוי",idNumber:"987654321",role:'סמנכ"ל כספים',telephone:"03-7654321",mobile:"052-7654321",email:"sarah.l@company.co.il"},
  ];

  const toggleSection=s=>setExpandedSection(expandedSection===s?null:s);
  const handleDeleteAddress=id=>{if(addresses.find(a=>a.id===id)?.isPrimary){alert("לא ניתן למחוק את הכתובת הראשית.");return;}setAddresses(addresses.filter(a=>a.id!==id));};
  const handleSetPrimary=id=>setAddresses(addresses.map(a=>({...a,isPrimary:a.id===id})));
  const getAddressTypeLabel=type=>addressTypes.find(t=>t.value===type)?.label||"אחר";
  const activityColorMap={"עדכון פוליסה":"blue","בקשת תקרת אשראי":"green","העלאת מסמך":"purple","פגישה נקבעה":"yellow","הערכת סיכון":"orange","תביעה הוגשה":"red"};

  // v17
  const TABS=[
    {id:"summary",label:"פרופיל מבוטח"},{id:"general",label:"מידע כללי"},{id:"contacts",label:`אנשי קשר (${contacts.length})`},
    {id:"crm",label:"בקשות לקוח"},{id:"policies",label:"פוליסות"},{id:"credit-limits",label:"תקרות אשראי"},
    {id:"claims",label:"תביעות"},{id:"meetings",label:`פגישות (${meetings.length})`},
    {id:"ownership",label:"קשרי בעלות"},
    {id:"notes",label:`הערות (${notes.length})`},{id:"documents",label:"מסמכים"},{id:"activities",label:"פעילויות"},
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white shadow-sm px-6 py-3 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-800">ניהול מבוטחים</h1>
      </header>
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-md">
          {/* Company Bar */}
          <div className="bg-gray-100 px-6 py-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-800">{selectedCompany.name}</span>
              <span className="text-gray-400">|</span>
              <span className="text-sm text-gray-600">{selectedCompany.primaryId}</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300 flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-green-500"/>פעיל</span>
              <div className="h-6 w-px bg-gray-400"/>
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">🛡️ מבוטח</span>
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-300">💳 חייב</span>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 text-sm"><Save size={14}/> שמור</button>
          </div>

          {/* Main Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex px-4 -mb-px overflow-x-auto">
              {TABS.map(tab=>(
                <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
                  className={`py-3 px-4 font-medium transition-colors whitespace-nowrap text-sm ${activeTab===tab.id?"border-b-2 border-blue-600 text-blue-600":"text-gray-500 hover:text-gray-700"}`}>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-5">
            {activeTab==="summary"&&<SummaryDeptTab setActiveTab={setActiveTab}/>}
            {activeTab==="crm"&&<CRMTab setShowNewClientReq={setShowNewClientReq} setSelectedSR={setSelectedSR}/>}

            {activeTab==="general"&&(
              <div className="space-y-4">
                {[{key:"companyInfo",title:"פרטי חברה",content:(
                  <div className="grid grid-cols-3 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">שם חברה</label><input type="text" defaultValue={selectedCompany.name} className="border border-gray-300 rounded px-3 py-2 w-full text-sm"/></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">שם מסחרי</label><input type="text" defaultValue="אקמה סולושנס" className="border border-gray-300 rounded px-3 py-2 w-full text-sm"/></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">תחום עסקי</label><select className="border border-gray-300 rounded px-3 py-2 w-full text-sm"><option>טכנולוגיה</option><option>קמעונאות</option><option>ייצור</option><option>פיננסים</option></select></div>
                  </div>
                )},{key:"communication",title:"תקשורת",content:(
                  <div className="grid grid-cols-3 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">טלפון</label><input type="text" defaultValue="03-1234567" className="border border-gray-300 rounded px-3 py-2 w-full text-sm"/></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">דוא"ל</label><input type="email" defaultValue="info@acmeglobal.co.il" className="border border-gray-300 rounded px-3 py-2 w-full text-sm"/></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">אתר אינטרנט</label><input type="url" defaultValue="https://www.acmeglobal.co.il" className="border border-gray-300 rounded px-3 py-2 w-full text-sm"/></div>
                  </div>
                )},{key:"addresses",title:"כתובות",content:(
                  <div>
                    <div className="flex justify-end mb-3"><button className="bg-blue-600 text-white px-3 py-1.5 rounded flex items-center gap-1 text-sm" onClick={()=>setShowAddressModal(true)}><Plus size={14}/>הוסף כתובת</button></div>
                    <div className="space-y-3">
                      {addresses.map(a=>(
                        <div key={a.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div><h4 className="font-semibold text-gray-900">{getAddressTypeLabel(a.type)}</h4><p className="text-xs text-gray-500">{a.label}{a.isPrimary&&<span className="mr-2 text-green-600 font-semibold">★ ראשית</span>}</p></div>
                            <div className="flex gap-2">
                              {!a.isPrimary&&<button className="px-2 py-1 text-xs border border-blue-600 text-blue-600 rounded" onClick={()=>handleSetPrimary(a.id)}>קבע כראשית</button>}
                              <button className="p-1.5 bg-blue-100 text-blue-600 rounded" onClick={()=>{setEditingAddressId(a.id);setShowAddressModal(true);}}><Edit size={14}/></button>
                              <button className="p-1.5 bg-red-100 text-red-600 rounded" onClick={()=>handleDeleteAddress(a.id)}><Trash size={14}/></button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700">{a.addressLine1}, {a.addressLine2} · {a.postalArea} · {a.country}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}].map(sec=>(
                  <div key={sec.key} className="border border-gray-200 rounded-md overflow-hidden">
                    <div className="flex justify-between items-center p-4 cursor-pointer bg-gray-50" onClick={()=>toggleSection(sec.key)}>
                      <h3 className="font-medium text-gray-700">{sec.title}</h3>
                      {expandedSection===sec.key?<ChevronUp size={18}/>:<ChevronDown size={18}/>}
                    </div>
                    {expandedSection===sec.key&&<div className="p-4">{sec.content}</div>}
                  </div>
                ))}
              </div>
            )}

            {activeTab==="contacts"&&(
              <div>
                <div className="flex justify-between mb-4"><h3 className="text-base font-medium text-gray-700">אנשי קשר</h3><button className="bg-blue-600 text-white px-3 py-1.5 rounded flex items-center gap-1 text-sm hover:bg-blue-700" onClick={()=>setShowContactModal(true)}><Plus size={14}/>הוסף איש קשר</button></div>
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-50"><tr>{["שם פרטי","שם משפחה","תפקיד","טלפון",'דוא"ל',"פעולות"].map(h=><th key={h} className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase border-b">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-200">
                    {contacts.map(c=>(
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">{c.firstName}</td><td className="py-3 px-4 text-sm">{c.lastName}</td><td className="py-3 px-4 text-sm">{c.role}</td><td className="py-3 px-4 text-sm">{c.telephone}</td><td className="py-3 px-4 text-sm">{c.email}</td>
                        <td className="py-3 px-4"><div className="flex gap-1"><button className="p-1.5 bg-blue-100 text-blue-600 rounded"><Edit size={14}/></button><button className="p-1.5 bg-red-100 text-red-600 rounded"><Trash size={14}/></button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab==="policies"&&(()=>{
              const COL_HEADERS=["מספר פוליסה","גרסה","מוצר","תת מוצר","סוג כיסוי","סטטוס","תאריך תחילה","תאריך סיום","סוכן","פעולות"];

              const quotes=[
                {id:1,polNum:"QUO-2025-001",ver:"v1",product:"ביטוח אשראי",sub:"אשראי מקומי",coverage:"כיסוי מלא",status:"הצעה פעילה",start:"2025-04-01",end:"2026-03-31",agent:"אבי כהן"},
                {id:2,polNum:"QUO-2025-002",ver:"v2",product:"ביטוח אשראי",sub:"אשראי יצוא",coverage:"כיסוי חלקי",status:"הצעה בבדיקה",start:"2025-05-01",end:"2026-04-30",agent:"רון כץ"},
              ];
              const active=[
                {id:1,polNum:"POL-2023-001",ver:"v3",product:"ביטוח אשראי",sub:"אשראי מקומי",coverage:"כיסוי מלא",status:"פעיל",start:"2023-04-01",end:"2026-03-31",agent:"אבי כהן"},
                {id:2,polNum:"POL-2023-002",ver:"v2",product:"ביטוח אשראי",sub:"אשראי יצוא",coverage:"כיסוי חלקי",status:"בסבב חיתום לביטול",start:"2023-06-01",end:"2026-05-31",agent:"רון כץ"},
                {id:3,polNum:"POL-2024-001",ver:"v1",product:"ביטוח אשראי",sub:"אשראי מקומי",coverage:"כיסוי מורחב",status:"בסבב חיתום שינוי תנאים",start:"2024-01-01",end:"2026-12-31",agent:"נועה לוי"},
              ];
              const inactive=[
                {id:1,polNum:"POL-2022-001",ver:"v2",product:"ביטוח אשראי",sub:"אשראי מקומי",coverage:"כיסוי מלא",status:"פג תוקף",start:"2022-04-01",end:"2023-03-31",agent:"אבי כהן"},
                {id:2,polNum:"POL-2021-001",ver:"v1",product:"ביטוח אשראי",sub:"אשראי יצוא",coverage:"כיסוי חלקי",status:"בוטל",start:"2021-04-01",end:"2022-03-31",agent:"רון כץ"},
              ];

              const statusBadge=s=>{
                const map={"פעיל":"bg-green-100 text-green-800","הצעה פעילה":"bg-blue-100 text-blue-800","הצעה בבדיקה":"bg-yellow-100 text-yellow-800","בסבב חיתום לביטול":"bg-red-100 text-red-800","בסבב חיתום שינוי תנאים":"bg-orange-100 text-orange-800","פג תוקף":"bg-gray-100 text-gray-600","בוטל":"bg-red-50 text-red-400"};
                return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[s]||"bg-gray-100 text-gray-600"}`}>{s}</span>;
              };

              const Btn=({label,disabled,danger})=>(
                <button disabled={disabled}
                  className={`px-2 py-1 rounded text-xs font-medium border transition-colors
                    ${disabled?"opacity-30 cursor-not-allowed border-gray-200 text-gray-400 bg-white":
                      danger?"border-red-200 text-red-600 bg-red-50 hover:bg-red-100":
                      "border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100"}`}>
                  {label}
                </button>
              );

              const PolicyTable=({title,rows,color,actionsFn})=>(
                <div className="mb-8">
                  <div className={`flex items-center gap-2 mb-2 px-1`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${color}`}/>
                    <h4 className="text-sm font-bold text-gray-800">{title}</h4>
                    <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">{rows.length}</span>
                  </div>
                  <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <table className="min-w-full bg-white">
                      <thead className="bg-gray-50">
                        <tr>{COL_HEADERS.map(h=><th key={h} className="py-2.5 px-3 text-right text-xs font-medium text-gray-500 border-b whitespace-nowrap">{h}</th>)}</tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {rows.map(r=>(
                          <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-2.5 px-3 text-xs font-semibold text-blue-700 whitespace-nowrap">{r.polNum}</td>
                            <td className="py-2.5 px-3 text-xs text-gray-500">{r.ver}</td>
                            <td className="py-2.5 px-3 text-xs text-gray-800 whitespace-nowrap">{r.product}</td>
                            <td className="py-2.5 px-3 text-xs text-gray-600 whitespace-nowrap">{r.sub}</td>
                            <td className="py-2.5 px-3 text-xs text-gray-600 whitespace-nowrap">{r.coverage}</td>
                            <td className="py-2.5 px-3">{statusBadge(r.status)}</td>
                            <td className="py-2.5 px-3 text-xs text-gray-500 whitespace-nowrap">{r.start}</td>
                            <td className="py-2.5 px-3 text-xs text-gray-500 whitespace-nowrap">{r.end}</td>
                            <td className="py-2.5 px-3 text-xs text-gray-600 whitespace-nowrap">{r.agent}</td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1 flex-wrap">{actionsFn(r)}</div>
                            </td>
                          </tr>
                        ))}
                        {rows.length===0&&<tr><td colSpan={10} className="py-6 text-center text-xs text-gray-400">אין רשומות להצגה</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              );

              return(
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-base font-semibold text-gray-800">פוליסות</h3>
                    <button className="bg-blue-600 text-white px-3 py-1.5 rounded flex items-center gap-1 text-sm hover:bg-blue-700"><Plus size={14}/>הצעה חדשה</button>
                  </div>

                  <PolicyTable title="הצעות חדשות" rows={quotes} color="bg-blue-500"
                    actionsFn={r=>[
                      <Btn key="v" label="צפה"/>,
                      <Btn key="e" label="ביצוע שינוי"/>,
                    ]}/>

                  <PolicyTable title="פוליסות פעילות" rows={active} color="bg-green-500"
                    actionsFn={r=>{
                      const isCancelRound = r.status==="בסבב חיתום לביטול";
                      const isChangeRound = r.status==="בסבב חיתום שינוי תנאים";
                      return[
                        <Btn key="v" label="צפה"/>,
                        <Btn key="e" label="ביצוע שינוי" disabled={isCancelRound}/>,
                        <Btn key="x" label="הארכת תוקף" disabled={isCancelRound||isChangeRound}/>,
                        <Btn key="c" label="בטל פוליסה" danger disabled={isChangeRound}/>,
                      ];
                    }}/>

                  <PolicyTable title="פוליסות לא פעילות" rows={inactive} color="bg-gray-400"
                    actionsFn={r=>[
                      <Btn key="v" label="צפה"/>,
                    ]}/>
                </div>
              );
            })()}

            {activeTab==="credit-limits"&&<CreditLimitsTab creditLimits={creditLimits}/>}

            {activeTab==="claims"&&(
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-medium">תביעות</h3>
                  <div className="flex items-center gap-2">
                    <select className="border border-gray-300 rounded px-3 py-2 text-sm" value={claimFilter} onChange={e=>setClaimFilter(e.target.value)}><option value="all">כל התביעות</option><option value="שולם">שולם</option><option value="בטיפול">בטיפול</option><option value="ממתין לאישור">ממתין לאישור</option><option value="בבדיקה">בבדיקה</option></select>
                    <button className="bg-blue-600 text-white px-3 py-1.5 rounded flex items-center gap-1 text-sm hover:bg-blue-700"><Plus size={14}/>הגש תביעה</button>
                  </div>
                </div>
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-50"><tr>{["מספר תביעה","סוג","שם חייב","סכום","שולם","תאריך הגשה","סטטוס","מטפל"].map(h=><th key={h} className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase border-b">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-200">
                    {claims.filter(c=>claimFilter==="all"||c.status===claimFilter).map(c=>(
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-blue-600">{c.claimNumber}</td>
                        <td className="py-3 px-4"><span className={`px-2 py-0.5 text-xs rounded-full ${c.claimType==="אי פירעון"?"bg-blue-100 text-blue-800":c.claimType==="פשיטת רגל"?"bg-red-100 text-red-800":"bg-gray-100 text-gray-800"}`}>{c.claimType}</span></td>
                        <td className="py-3 px-4 text-sm">{c.debtorName}</td><td className="py-3 px-4 text-sm font-medium">{c.claimAmount}</td><td className="py-3 px-4 text-sm text-green-600">{c.paidAmount}</td><td className="py-3 px-4 text-sm text-gray-500">{c.filingDate}</td>
                        <td className="py-3 px-4"><span className={`px-2 py-0.5 text-xs rounded-full ${c.status==="שולם"?"bg-green-100 text-green-800":c.status==="בטיפול"?"bg-blue-100 text-blue-800":c.status==="ממתין לאישור"?"bg-yellow-100 text-yellow-800":"bg-orange-100 text-orange-800"}`}>{c.status}</span></td>
                        <td className="py-3 px-4 text-sm text-gray-500">{c.handler}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab==="meetings"&&(
              <div className="space-y-8">
                <div className="flex justify-end"><button className="bg-blue-600 text-white px-3 py-1.5 rounded flex items-center gap-1 text-sm hover:bg-blue-700" onClick={()=>setShowMeetingModal(true)}><Plus size={14}/>קבע פגישה</button></div>

                {/* ── טבלה 1: פגישות ── */}
                {(()=>{
                  const MeetingTable=({title,rows,emptyMsg})=>(
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2"><Calendar size={15} className="text-blue-500"/>{title}<span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full font-medium">{rows.length}</span></h3>
                      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <table className="min-w-full">
                          <thead className="bg-gray-50"><tr>{["כותרת","קטגוריה","תאריך ושעה","סוג","משתתפים","סטטוס","פעולות"].map(h=><th key={h} className="py-2.5 px-4 text-right text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">{h}</th>)}</tr></thead>
                          <tbody className="divide-y divide-gray-100">
                            {rows.length===0
                              ?<tr><td colSpan={7} className="py-6 text-center text-xs text-gray-400">{emptyMsg}</td></tr>
                              :rows.map(m=>(
                                <tr key={m.id} className="hover:bg-gray-50">
                                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{m.title}</td>
                                  <td className="py-3 px-4"><span className={`px-2 py-0.5 text-xs rounded font-medium ${m.category==="מבוטח"?"bg-blue-100 text-blue-800":m.category==="ליד"?"bg-green-100 text-green-800":"bg-purple-100 text-purple-800"}`}>{m.category}</span></td>
                                  <td className="py-3 px-4 text-sm text-gray-500">{m.date} · {m.time}</td>
                                  <td className="py-3 px-4 text-sm text-gray-500">{m.meetingType} · {m.location}</td>
                                  <td className="py-3 px-4 text-sm text-gray-500">{m.participants}</td>
                                  <td className="py-3 px-4"><span className={`px-2 py-0.5 text-xs rounded font-medium ${m.status==="קרובה"?"bg-blue-100 text-blue-800":m.status==="הושלם"?"bg-green-100 text-green-800":"bg-yellow-100 text-yellow-800"}`}>{m.status}</span></td>
                                  <td className="py-3 px-4"><div className="flex gap-1"><button className="p-1 text-blue-500 hover:bg-blue-50 rounded" onClick={()=>setShowMeetingModal(true)}><Edit size={13}/></button><button className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash size={13}/></button></div></td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                  const direct=meetings.filter(m=>m.category==="מבוטח");
                  const linked=meetings.filter(m=>m.category!=="מבוטח");
                  return(
                    <>
                      <MeetingTable title="פגישות" rows={direct} emptyMsg="אין פגישות ישירות"/>
                      <MeetingTable title="פגישות מקושרות" rows={linked} emptyMsg="אין פגישות מקושרות"/>
                    </>
                  );
                })()}
              </div>
            )}

            {activeTab==="ownership"&&<OwnershipTab/>}

            {activeTab==="notes"&&(
              <div>
                <div className="flex justify-between items-center mb-4"><h3 className="text-base font-medium">הערות</h3><button className="bg-blue-600 text-white px-3 py-1.5 rounded flex items-center gap-1 text-sm hover:bg-blue-700"><Plus size={14}/>הוסף הערה</button></div>
                <div className="space-y-3">
                  {[{key:"company",label:"חברה",cat:"חברה"},{key:"lead",label:"ליד",cat:"ליד"},{key:"debtor",label:"חייב",cat:"חייב"},{key:"meeting",label:"פגישה",cat:"פגישה"}].map(drawer=>{
                    const dn=notes.filter(n=>n.category===drawer.cat);
                    return(
                      <div key={drawer.key} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="flex justify-between items-center px-5 py-3 cursor-pointer hover:bg-gray-50" onClick={()=>setExpandedNoteDrawers(prev=>({...prev,[drawer.key]:!prev[drawer.key]}))}>
                          <h4 className="text-sm font-semibold text-gray-700">{drawer.label} ({dn.length})</h4>
                          {expandedNoteDrawers[drawer.key]?<ChevronUp size={16}/>:<ChevronDown size={16}/>}
                        </div>
                        {expandedNoteDrawers[drawer.key]&&(
                          <div className="px-5 pb-4 space-y-2">
                            {dn.length===0?<p className="text-xs text-gray-400 text-center py-3">אין הערות</p>:dn.map(note=>(
                              <div key={note.id} className="bg-blue-50 rounded-lg p-3 flex justify-between items-start">
                                <div><p className="text-sm font-bold text-gray-900 mb-1">{note.title}</p><p className="text-xs text-gray-600">{note.description}</p><p className="text-xs text-gray-400 mt-1">{note.createdDate} · {note.createdBy}</p></div>
                                <div className="flex gap-1 shrink-0"><button className="p-1.5 bg-red-100 text-red-600 rounded"><Trash size={14}/></button><button className="p-1.5 bg-blue-100 text-blue-600 rounded"><Edit size={14}/></button></div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab==="documents"&&(
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-medium">ארכיון מסמכים</h3>
                  <div className="flex gap-2">
                    <select className="border border-gray-300 rounded px-3 py-2 text-sm" value={documentFilter} onChange={e=>setDocumentFilter(e.target.value)}><option value="all">כל הקטגוריות</option><option value="פוליסה">פוליסה</option><option value="פיננסי">פיננסי</option><option value="סיכון">סיכון</option><option value="משפטי">משפטי</option><option value="תביעות">תביעות</option></select>
                    <button className="bg-blue-600 text-white px-3 py-1.5 rounded flex items-center gap-1 text-sm hover:bg-blue-700"><Plus size={14}/>העלה מסמך</button>
                  </div>
                </div>
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-50"><tr>{["שם מסמך","קטגוריה","סוג","גודל","תאריך","הועלה ע״י","תיאור","פעולות"].map(h=><th key={h} className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase border-b">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-200">
                    {documents.filter(d=>documentFilter==="all"||d.category===documentFilter).map(d=>(
                      <tr key={d.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{d.name}</td>
                        <td className="py-3 px-4"><span className={`px-2 py-0.5 text-xs rounded-full ${d.category==="פוליסה"?"bg-blue-100 text-blue-800":d.category==="פיננסי"?"bg-green-100 text-green-800":d.category==="סיכון"?"bg-orange-100 text-orange-800":d.category==="משפטי"?"bg-purple-100 text-purple-800":"bg-red-100 text-red-800"}`}>{d.category}</span></td>
                        <td className="py-3 px-4 text-sm text-gray-600">{d.fileType}</td><td className="py-3 px-4 text-sm text-gray-600">{d.size}</td><td className="py-3 px-4 text-sm text-gray-500">{d.uploadDate}</td><td className="py-3 px-4 text-sm text-gray-500">{d.uploadedBy}</td>
                        <td className="py-3 px-4 text-sm text-gray-500 max-w-xs truncate">{d.description}</td>
                        <td className="py-3 px-4"><button className="p-1.5 bg-red-100 text-red-600 rounded"><Trash size={14}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab==="activities"&&(
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-medium">פעילויות</h3>
                  <select className="border border-gray-300 rounded px-3 py-2 text-sm" value={activityFilter} onChange={e=>setActivityFilter(e.target.value)}><option value="all">כל הפעילויות</option><option value="עדכון פוליסה">עדכוני פוליסה</option><option value="תביעה הוגשה">תביעות</option><option value="פגישה נקבעה">פגישות</option></select>
                </div>
                <div className="space-y-3">
                  {activities.filter(a=>activityFilter==="all"||a.type===activityFilter).map(a=>{
                    const color=activityColorMap[a.type]||"gray";
                    return(
                      <div key={a.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full bg-${color}-100 text-${color}-600 shrink-0`}><FileText size={16}/></div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 text-xs rounded-full font-medium bg-${color}-100 text-${color}-800`}>{a.type}</span>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${a.status==="הושלם"?"bg-green-100 text-green-800":a.status==="ממתין"?"bg-yellow-100 text-yellow-800":"bg-blue-100 text-blue-800"}`}>{a.status}</span>
                            </div>
                            <p className="text-sm text-gray-900 font-medium">{a.description}</p>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400"><span>{a.user}</span><span>{a.date} · {a.time}</span><span className="text-blue-600">{a.relatedTo}</span></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showContactModal&&(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center px-6 py-4 border-b"><h3 className="text-base font-semibold">הוספת איש קשר</h3><button onClick={()=>setShowContactModal(false)}><X size={18}/></button></div>
            <div className="p-5 grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-medium text-gray-700 mb-1">שם פרטי</label><input type="text" className="border border-gray-300 rounded px-3 py-2 w-full text-sm"/></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">שם משפחה</label><input type="text" className="border border-gray-300 rounded px-3 py-2 w-full text-sm"/></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">תפקיד</label><input type="text" className="border border-gray-300 rounded px-3 py-2 w-full text-sm"/></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">טלפון</label><input type="tel" className="border border-gray-300 rounded px-3 py-2 w-full text-sm"/></div>
              <div className="col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">דוא"ל</label><input type="email" className="border border-gray-300 rounded px-3 py-2 w-full text-sm"/></div>
            </div>
            <div className="px-5 pb-5 flex justify-end gap-2"><button className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700" onClick={()=>setShowContactModal(false)}>ביטול</button><button className="px-4 py-2 bg-blue-600 text-white rounded text-sm" onClick={()=>setShowContactModal(false)}>שמור</button></div>
          </div>
        </div>
      )}
      {showMeetingModal&&(
        <MeetingFormModal onClose={()=>setShowMeetingModal(false)}/>
      )}
      {showAddressModal&&(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center px-6 py-4 border-b"><h3 className="text-base font-semibold">{editingAddressId?"עריכת כתובת":"הוספת כתובת"}</h3><button onClick={()=>{setShowAddressModal(false);setEditingAddressId(null);}}><X size={18}/></button></div>
            <div className="p-5 space-y-3">
              <div><label className="block text-xs font-medium text-gray-700 mb-1">סוג כתובת *</label><select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">{addressTypes.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">שורה 1 *</label><input type="text" placeholder="רחוב, מספר בניין..." className="border border-gray-300 rounded px-3 py-2 w-full text-sm"/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-700 mb-1">עיר</label><input type="text" className="border border-gray-300 rounded px-3 py-2 w-full text-sm"/></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">מיקוד</label><input type="text" className="border border-gray-300 rounded px-3 py-2 w-full text-sm"/></div>
              </div>
            </div>
            <div className="px-5 pb-5 flex justify-end gap-2"><button className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700" onClick={()=>{setShowAddressModal(false);setEditingAddressId(null);}}>ביטול</button><button className="px-4 py-2 bg-blue-600 text-white rounded text-sm" onClick={()=>{setShowAddressModal(false);setEditingAddressId(null);}}>שמור</button></div>
          </div>
        </div>
      )}
      {showNewClientReq&&<NewClientRequestModal onClose={()=>setShowNewClientReq(false)}/>}
      {selectedSR&&<SRDetailsModal sr={selectedSR} onClose={()=>setSelectedSR(null)}/>}
    </div>
  );
};

export default InsuredManagementScreen;
