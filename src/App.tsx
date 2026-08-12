import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  Brain,
  Radio,
  PlusCircle,
  Activity,
  CloudLightning,
  BookOpen,
  Accessibility,
  CheckCircle,
  Info,
  Layout,
  Server,
  Database,
  Bot,
  Settings,
  BarChart,
  Code2,
  Trophy,
  Mic,
  HeartPulse,
  Menu,
  PhoneCall,
  ChevronRight,
  Search,
  MapPin,
  ChevronDown,
  Moon,
  Sun,
  Bell,
  Cpu,
  ExternalLink,
} from "lucide-react";
import { INITIAL_INCIDENTS } from "./mockData";
import { Incident, IncidentStatus } from "./types";

// Importing Custom Component Modules
import EmergencyDashboard from "./components/EmergencyDashboard";
import AccidentReporting from "./components/AccidentReporting";
import MultiAgentConsole from "./components/MultiAgentConsole";
import OfflineEmergencyKit from "./components/OfflineEmergencyKit";
import PredictiveRisk from "./components/PredictiveRisk";
import PRDViewer from "./components/PRDViewer";
import DesignSpecViewer from "./components/DesignSpecViewer";
import AgentSystemViewer from "./components/AgentSystemViewer";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import SettingsPanel from "./components/SettingsPanel";
import BackendViewer from "./components/BackendViewer";
import DBSchemaViewer from "./components/DBSchemaViewer";
import BreakthroughFeaturesViewer from "./components/BreakthroughFeaturesViewer";
import ConsumerSOS from "./components/ConsumerSOS";
import FirstAidAgent from "./components/FirstAidAgent";
import LandingPage from "./components/LandingPage";
import { GuardianHUD } from "./guardian/GuardianHUD";
import { EmergencyVerifier } from "./guardian/EmergencyVerifier";

// Localization Dictionary
const LOCALIZATION = {
  en: {
    title: "ROADGUARDIAN AI",
    tagline: "Agentic AI Emergency Operating System",
    controlRoom: "Emergency Command Center",
    incidentReporter: "Accident Reporter",
    offlineSurvival: "Offline Emergency Kit",
    riskPredictor: "BlackSpot Predictor",
    analytics: "Global Analytics",
    settings: "RoadGuardian Settings",
    investorPitch: "Mission & Impact",
    uxDesignSpec: "UI/UX Architecture Spec",
    systemArchitecture: "System Architecture Spec",
    dbSchema: "Database Schema Spec",
    agentSystem: "Autonomous AI Network",
    backendSpec: "Backend Architecture",
    breakthroughFeatures: "Innovation Lab",
    assistant: "AI Voice Assistant",
    sos: "RoadGuardian Live emergency Command",
    firstAid: "First Aid Triage AI",
    accessibilityToggle: "Accessibility Support",
    accessibilityModeDesc:
      "High-contrast touch vectors activated for emergency responders.",
    connectedStatus: "CAD Link: Synchronized Client/Cloud",
    selectLang: "Select Language:",
  },
  hi: {
    title: "RoadGuardian AI",
    tagline: "Agentic AI Emergency Operating System",
    controlRoom: "नियंत्रण कक्ष संचालन",
    incidentReporter: "एसओएस दुर्घटना रिपोर्ट",
    offlineSurvival: "ऑफ़लाइन जीवन रक्षा नियमावली",
    riskPredictor: "जोखिम पूर्वानुमान रडार",
    analytics: "ग्लोबल एनालिटिक्स",
    settings: "प्लेटफार्म सेटिंग्स",
    investorPitch: "ज्ञापन और पीआरडी",
    uxDesignSpec: "UI/UX डिज़ाइन विशिष्टता",
    systemArchitecture: "सिस्टम आर्किटेक्चर विशिष्टता",
    dbSchema: "डेटाबेस स्कीमा विशिष्टता",
    agentSystem: "मल्टी-एजेंट सिस्टम विशिष्टता",
    backendSpec: "बैकएंड आर्किटेक्चर",
    breakthroughFeatures: "20 सफल विशेषताएं",
    assistant: "AI वॉयस असिस्टेंट",
    firstAid: "प्राथमिक चिकित्सा एजेंट",
    accessibilityToggle: "एक्सेसिबिलिटी सहायता",
    accessibilityModeDesc:
      "आपातकालीन प्रतिक्रियाकर्ताओं के लिए उच्च-विपरीत स्पर्श वैक्टर सक्रिय।",
    connectedStatus: "सीएडी लिंक: सिंक्रनाइज़ क्लाइंट/क्लाउड",
    selectLang: "भाषा चुनें:",
  },
  kn: {
    title: "RoadGuardian AI",
    tagline: "Agentic AI Emergency Operating System",
    controlRoom: "ನಿಯಂತ್ರಣ ಕೊಠಡಿ ಕಾರ್ಯಾಚರಣೆ",
    incidentReporter: "ಎಸ್‌ಒಎಸ್ ಅಪಘಾತ ವರದಿ",
    offlineSurvival: "ಆಫ್‌ಲೈನ್ ಬದುಕುಳಿಯುವ ಕೈಪಿಡಿ",
    riskPredictor: "ಅಪಘಾತ ಅಪಾಯದ ರಡಾರ್",
    analytics: "ಜಾಗತಿಕ ಅನಾಲಿಟಿಕ್ಸ್",
    settings: "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    investorPitch: "ಮೆಮೊರಾಂಡಮ್ ಮತ್ತು PRD",
    uxDesignSpec: "UI/UX ವಿನ್ಯಾಸ ನಿರ್ದಿಷ್ಟತೆ",
    systemArchitecture: "ಸಿಸ್ಟಮ್ ಆರ್ಕಿಟೆಕ್ಚರ್",
    dbSchema: "ಡೇಟಾಬೇಸ್ ಸ್ಕೀಮಾ",
    agentSystem: "ಮಲ್ಟಿ-ಏಜೆಂಟ್ ಸಿಸ್ಟಮ್",
    backendSpec: "ಬ್ಯಾಕೆಂಡ್ ಆರ್ಕಿಟೆಕ್ಚರ್",
    breakthroughFeatures: "20 ಮಹತ್ವದ ವೈಶಿಷ್ಟ್ಯಗಳು",
    assistant: "AI ಧ್ವನಿ ಸಹಾಯಕ",
    firstAid: "ಪ್ರಥಮ ಚಿಕಿತ್ಸಾ ಏಜೆಂಟ್",
    accessibilityToggle: "ಪ್ರವೇಶಸಾಧ್ಯತೆ ಬೆಂಬಲ",
    accessibilityModeDesc:
      "ತುರ್ತು ವರದಿಗಾರರಿಗೆ ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್ ನಿಯಂತ್ರಣಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ.",
    connectedStatus: "CAD ಲಿಂಕ್: ಕ್ಲೈಂಟ್/ಕ್ಲೌಡ್ ಸಿಂಕ್ರೊನೈಸ್ ಆಗಿದೆ",
    selectLang: "ಭಾಷೆ ಆರಿಸಿ:",
  },
  ta: {
    title: "RoadGuardian AI",
    tagline: "Agentic AI Emergency Operating System",
    controlRoom: "கட்டுப்பாட்டு அறை செயல்பாடுகள்",
    incidentReporter: "SOS விபத்து அறிக்கை",
    offlineSurvival: "ஆஃப்லைன் உயிர்வாழும் கையேடு",
    riskPredictor: "விபத்து அபாய ரேடார்",
    analytics: "உலகளாவிய பகுப்பாய்வு",
    settings: "இயங்குதள அமைப்புகள்",
    investorPitch: "மெமோராண்டம் & PRD",
    uxDesignSpec: "UI/UX வடிவமைப்பு விவரக்குறிப்பு",
    systemArchitecture: "கணினி கட்டமைப்பு",
    dbSchema: "தரவுத்தள திட்டமைப்பு",
    agentSystem: "பல-ஏஜென்ட் அமைப்பு",
    backendSpec: "பின்தள அமைப்பு",
    breakthroughFeatures: "20 திருப்புமுனை அம்சங்கள்",
    assistant: "AI குரல் உதவியாளர்",
    firstAid: "முதலுதவி ஏஜென்ட்",
    accessibilityToggle: "அணுகல்தன்மை ஆதரவு",
    accessibilityModeDesc:
      "பணியாளர்களுக்கு கூடுதல் பாதுகாப்புடன் கூடிய இடைமுகம் செயலில் உள்ளது.",
    connectedStatus: "CAD இணைப்பு: கிளையண்ட்/கிளௌட் ஒருங்கிணைக்கப்பட்டுள்ளது",
    selectLang: "மொழியைத் தேர்வுசெய்:",
  },
  te: {
    title: "RoadGuardian AI",
    tagline: "Agentic AI Emergency Operating System",
    controlRoom: "నియంత్రణ గది కార్యకలాపాలు",
    incidentReporter: "SOS ప్రమాద నివేదిక",
    offlineSurvival: "ఆఫ్లైన్ జీవన గైడ్",
    riskPredictor: "అంచనా ప్రమాద రడార్",
    analytics: "గ్లోబల్ అనలిటిక్స్",
    settings: "ప్లాట్‌ఫారమ్ సెట్టింగ్‌లు",
    investorPitch: "మెమోరాండం & PRD",
    uxDesignSpec: "UI/UX డిజైన్ స్పెసిఫికేషన్",
    systemArchitecture: "సిస్టమ్ ఆర్కిటెక్చర్",
    dbSchema: "డేటాబేస్ స్కీమా",
    agentSystem: "మల్టీ-ఏజెంట్ సిస్టమ్",
    backendSpec: "బ్యాకెండ్ ఆర్కిటెక్చర్",
    breakthroughFeatures: "20 మైలురాయి ఫీచర్లు",
    assistant: "AI వాయిస్ అసిస్టెంట్",
    firstAid: "ప్రథమ చికిత్స ఏజెంట్",
    accessibilityToggle: "యాక్సెసిబిలిటీ మద్దతు",
    accessibilityModeDesc:
      "అత్యవసర సిబ్బంది కోసం హై-కాంట్రాస్ట్ నియంత్రణలు ప్రారంభించబడ్డాయి.",
    connectedStatus: "CAD లింక్: సమకాలీకరించబడిన క్లయింట్/క్లౌడ్",
    selectLang: "భాషను ఎంచుకోండి:",
  },
  ml: {
    title: "RoadGuardian AI",
    tagline: "Agentic AI Emergency Operating System",
    controlRoom: "കൺട്രോൾ റൂം പ്രവർത്തനങ്ങൾ",
    incidentReporter: "SOS അപകട റിപ്പോർട്ട്",
    offlineSurvival: "ഓഫ്‌ലൈൻ അതിജീവന മാനുവൽ",
    riskPredictor: "അപകടസാധ്യതാ റഡാർ",
    analytics: "ഗ്ലോബൽ അനലിറ്റിക്സ്",
    settings: "പ്ലാറ്റ്ഫോം ക്രമീകരണങ്ങൾ",
    investorPitch: "മെമ്മോറാണ്ടം & PRD",
    uxDesignSpec: "UI/UX ഡിസൈൻ സ്പെസിഫിക്കേഷൻ",
    systemArchitecture: "സിസ്റ്റം ആർക്കിടെക്ചർ",
    dbSchema: "ഡാറ്റാബേസ് സ്കീമ",
    agentSystem: "മൾട്ടി-ഏജന്റ് സിസ്റ്റം",
    backendSpec: "ബാക്കെൻഡ് ആർക്കിടെക്ചർ",
    breakthroughFeatures: "20 പ്രധാന സവിശേഷതകൾ",
    assistant: "AI വോയ്സ് അസിസ്റ്റന്റ്",
    sos: "എമർജൻസി SOS",
    firstAid: "പ്രഥമശുശ്രൂഷ ഏജന്റ്",
    accessibilityToggle: "ആക്സസിബിലിറ്റി പിന്തുണ",
    accessibilityModeDesc:
      "എമർജൻസി റെസ്‌പോണ്ടർമാർക്കായി ഉയർന്ന കോൺട്രാസ്റ്റ് നിയന്ത്രണങ്ങൾ സജീവമാക്കി.",
    connectedStatus: "CAD ലിങ്ക്: ക്ലയന്റ്/ക്ലൗഡ് സമന്വയിപ്പിച്ചിരിക്കുന്നു",
    selectLang: "ഭാഷ തിരഞ്ഞെടുക്കുക:",
  },
  mr: {
    title: "RoadGuardian AI",
    tagline: "Agentic AI Emergency Operating System",
    controlRoom: "नियंत्रण कक्ष ऑपरेशन्स",
    incidentReporter: "एसओएस अपघात रिपोर्टर",
    offlineSurvival: "ऑफलाइन जीवन जगण्याचे नियम",
    riskPredictor: "धोका अंदाज रडार",
    analytics: "ग्लोबल ॲनालिटिक्स",
    settings: "प्लॅटफॉर्म सेटिंग्ज",
    investorPitch: "ज्ञापन आणि पीआरडी",
    uxDesignSpec: "UI/UX डिझाईन वैशिष्ट्य",
    systemArchitecture: "सिस्टम आर्किटेक्चर",
    dbSchema: "डेटाबेस स्कीमा",
    agentSystem: "मल्टी-एजंट सिस्टम",
    backendSpec: "बॅकएंड आर्किटेक्चर",
    breakthroughFeatures: "२० महत्वपूर्ण वैशिष्ट्ये",
    assistant: "AI व्हॉइस असिस्टंट",
    sos: "आपत्कालीन SOS",
    firstAid: "प्रथमोपचार एजंट",
    accessibilityToggle: "ऍक्सेसिबिलिटी सपोर्ट",
    accessibilityModeDesc:
      "आपत्कालीन प्रतिसादकर्त्यांसाठी उच्च-कॉन्ट्रास्ट टच वेक्टर्स सक्रिय.",
    connectedStatus: "CAD लिंक: समक्रमित क्लायंट/क्लाउड",
    selectLang: "भाषा निवडा:",
  },
  bn: {
    title: "RoadGuardian AI",
    tagline: "Agentic AI Emergency Operating System",
    controlRoom: "নিয়ন্ত্রণ কক্ষ অপারেশন",
    incidentReporter: "এসওএস দুর্ঘটনা রিপোর্টার",
    offlineSurvival: "অফলাইন সারভাইভাল ম্যানুয়াল",
    riskPredictor: "ঝুঁকি পূর্বাভাস রাডার",
    analytics: "গ্লোবাল অ্যানালিটিক্স",
    settings: "প্ল্যাটফর্ম সেটিংস",
    investorPitch: "মেমোরেন্ডাম ও পিআরডি",
    uxDesignSpec: "UI/UX ডিজাইন স্পেক",
    systemArchitecture: "সিস্টেম আর্কিটেকচার",
    dbSchema: "ডাটাবেস স্কিমা",
    agentSystem: "মাল্টি-এজেন্ট সিস্টেম",
    backendSpec: "ব্যাকএন্ড আর্কিটেকচার",
    breakthroughFeatures: "২০টি যুগান্তকারী বৈশিষ্ট্য",
    assistant: "AI ভয়েস অ্যাসিস্ট্যান্ট",
    sos: "জরুরি SOS",
    firstAid: "প্রাথমিক চিকিৎসা এজেন্ট",
    accessibilityToggle: "অ্যাক্সেসিবিলিটি সহায়তা",
    accessibilityModeDesc:
      "জরুরী উদ্ধারকারীদের জন্য উচ্চ-বৈপরীত্য স্পর্শ প্যানেল সক্রিয় করা হয়েছে।",
    connectedStatus: "CAD লিঙ্ক: সিঙ্ক্রোনাইজড ক্লায়েন্ট/ক্লাউড",
    selectLang: "ভাষা নির্বাচন করুন:",
  },
};

type SupportedLanguage = "en" | "hi" | "kn" | "ta" | "te" | "ml" | "mr" | "bn";

const ParticleNetwork = React.memo(() => {
  // Generate random particles once
  const particles = React.useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${Math.random() * 4 + 1}px`,
        height: `${Math.random() * 4 + 1}px`,
        animationDuration: `${Math.random() * 10 + 10}s`,
        animationDelay: `${Math.random() * 5}s`,
      })),
    [],
  );

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.width,
            height: p.height,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
          }}
        />
      ))}
    </div>
  );
});

const INDIA_PLACES = [
  "Ahmedabad, Gujarat",
  "Bengaluru, Karnataka",
  "Bhopal, Madhya Pradesh",
  "Chennai, Tamil Nadu",
  "Coimbatore, Tamil Nadu",
  "Dehradun, Uttarakhand",
  "Delhi, New Delhi",
  "Guwahati, Assam",
  "Hyderabad, Telangana",
  "Indore, Madhya Pradesh",
  "Jaipur, Rajasthan",
  "Kanpur, Uttar Pradesh",
  "Kochi, Kerala",
  "Kolkata, West Bengal",
  "Lucknow, Uttar Pradesh",
  "Ludhiana, Punjab",
  "Madurai, Tamil Nadu",
  "Mumbai, Maharashtra",
  "Mysuru, Karnataka",
  "Panaji, Goa",
  "Patna, Bihar",
  "Pune, Maharashtra",
  "Raipur, Chhattisgarh",
  "Ranchi, Jharkhand",
  "Shimla, Himachal Pradesh",
  "Surat, Gujarat",
  "Thiruvananthapuram, Kerala",
  "Tiruchirappalli, Tamil Nadu",
  "Visakhapatnam, Andhra Pradesh",
];

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [activeIncidentId, setActiveIncidentId] = useState<string>(
    INITIAL_INCIDENTS[0].id,
  );
  const [activeTab, setActiveTab] = useState<string>("sos");
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");
  const [selectedLocation, setSelectedLocation] =
    useState<string>("New Delhi, Delhi");
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] =
    useState<boolean>(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState<string>("");
  const [accessibilityScales, setAccessibilityScales] =
    useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Start passive background monitoring for Guardian Engine
  useEffect(() => {
    import('./guardian/ImpactDetector').then(({ ImpactDetector }) => {
      ImpactDetector.start();
    });

    const handleAutoSOS = () => {
       setActiveTab("agents");
    };

    const handleGuardianTrigger = () => {
       // Simulate creating an incident exactly where they are based on selectedLocation
       const autoIncident: Incident = {
         id: "auto-" + Date.now(),
         description: "Autonomous Crash Detected",
         status: "dispatched" as any,
         location: { lat: 28.6139, lng: 77.2090, address: "Autonomous SOS Location" }, // New Delhi default fallback
         severity: "Critical",
         timestamp: new Date().toISOString(),
         victimsCount: 1,
         vehicleInfo: "Unknown Vehicle",
         injuryTypes: ["Blunt Force Trauma (Autonomous)"]
       };
       
       setIncidents(prev => [autoIncident, ...prev]);
       setActiveIncidentId(autoIncident.id);
       setActiveTab("agents");
    };

    window.addEventListener('guardian_trigger_sos', handleGuardianTrigger);

    import('./agents/DecisionEngine').then(({ DecisionEngine }) => {
      DecisionEngine.on('agent_awake', handleAutoSOS);
    });

    return () => {
      window.removeEventListener('guardian_trigger_sos', handleGuardianTrigger);
    };
  }, []);

  // Selector for currently highlighted incident
  const activeIncident =
    incidents.find((i) => i.id === activeIncidentId) ||
    (incidents.length > 0 ? incidents[0] : null);

  const t = LOCALIZATION[currentLang];

  // Callbacks for updating incident states and reporting new incidents
  const handleIncidentReported = (newIncident: Incident) => {
    // Add new incident to active list state
    setIncidents((prev) => [newIncident, ...prev]);
    // Set active highlight directly to new incident for instant dispatcher tracking
    setActiveIncidentId(newIncident.id);
    // Pivot screen viewport directly to dashboard Control Centre
    setActiveTab("dashboard");
  };

  const handleStatusUpdate = (id: string, newStatus: IncidentStatus) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === id) {
          // Find matching status transition logging and update timeline message contextually
          let updatedLogs = [...(inc.agentsLog || [])];
          updatedLogs.push({
            agentName: "emergency Intake Coordinator",
            status: "success",
            message: `Dispatcher manually toggled CAD session status to [${newStatus.toUpperCase()}]. Re-evaluating vehicle coordinates and signaling downstream units.`,
            timestamp: "00:10",
          });

          return {
            ...inc,
            status: newStatus,
            agentsLog: updatedLogs,
          };
        }
        return inc;
      }),
    );
  };

  const menuSections = [
    {
      title: "Command Intelligence",
      items: [
        {
          id: "dashboard",
          icon: Radio,
          label: t.controlRoom || "Emergency Command Center",
        },
        {
          id: "firstaid",
          icon: HeartPulse,
          label: t.firstAid || "First Aid Triage AI",
        },
        {
          id: "report",
          icon: PlusCircle,
          label: t.incidentReporter || "Accident Reporter",
        },
        {
          id: "risk",
          icon: CloudLightning,
          label: t.riskPredictor || "BlackSpot Predictor",
        },
        {
          id: "offline",
          icon: Activity,
          label: t.offlineSurvival || "Offline Emergency Kit",
        },
        {
          id: "analytics",
          icon: BarChart,
          label: t.analytics || "Global Analytics",
        },
      ],
    },
    {
      title: "Architecture & Specs",
      items: [
        /*
        {
          id: "prd",
          icon: BookOpen,
          label: t.investorPitch || "Mission & Impact",
        },
        {
          id: "design",
          icon: Layout,
          label: t.uxDesignSpec || "UI/UX Architecture Spec",
        },
        {
          id: "backend",
          icon: Server,
          label: t.backendSpec || "System Architecture Spec",
        },
        {
          id: "db",
          icon: Database,
          label: t.dbSchema || "Database Schema Spec",
        },
        */
        {
          id: "agents",
          icon: Bot,
          label: t.agentSystem || "Autonomous AI Network",
        },
        {
          id: "breakthrough",
          icon: Trophy,
          label: t.breakthroughFeatures || "Innovation Lab",
        },
      ],
    },
    /*
    {
      title: "External Partners",
      items: [
        {
          id: "smart-response-pro",
          icon: ExternalLink,
          label: "Smart Response Pro",
          isExternal: true,
          url: "https://smart-response-pro.lovable.app",
        },
      ],
    },
    */
    {
      title: "Preferences",
      items: [
        {
          id: "settings",
          icon: Settings,
          label: t.settings || "RoadGuardian Settings",
        },
      ],
    },
  ];

  if (showLanding) {
    return <LandingPage onLaunch={() => setShowLanding(false)} />;
  }

  return (
    <div
      className={`min-h-screen text-slate-100 font-sans flex transition-all duration-300 ${accessibilityScales ? "text-[13px] scale-102 contrast-125" : "text-xs"}`}
    >
      <ParticleNetwork />
      {/* Dynamic ambient background glows - subtle */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed top-[20%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`sidebar transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Sidebar Header */}
        <div className="p-6 pb-4 flex flex-col gap-6">
          <div className="flex gap-4 items-center">
            <div className="p-2.5 rounded-xl bg-black/50 border border-blue-500/30 text-blue-400 shadow-sm flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-white font-black text-sm tracking-widest leading-none drop-shadow-sm uppercase">
                {t.title || "ROADGUARDIAN AI"}
              </h1>
              <span className="text-blue-200/50 text-[8px] font-black uppercase tracking-wider mt-1 block">
                {t.tagline || "AGENTIC AI Highway/Police PLATFORM"}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveTab("sos");
              setIsSidebarOpen(false);
            }}
            className="w-full sos-btn-premium rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 overflow-hidden group"
          >
            <div className="flex items-center gap-2 relative z-10">
              <PhoneCall className="w-5 h-5 text-white" />
              <span className="font-black tracking-widest text-[13px] uppercase text-white">
                {(t as any).sos || "LIVE emergency COMMAND"}
              </span>
            </div>
            <span className="text-[10px] text-white/70 font-medium relative z-10">
              One tap. We respond.
            </span>
            <div className="ambient-glow ambient-glow-red transition-opacity"></div>
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="sidebar-scroll custom-scrollbar px-4 space-y-5">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="px-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                {section.title}
              </h3>
              {section.items.map((item: any) => {
                const isActive = activeTab === item.id;

                if (item.isExternal && item.url) {
                  return (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`sidebar-item w-full flex items-center justify-between p-3 text-left cursor-pointer group`}
                    >
                      <div className="flex items-center gap-3 relative">
                        <item.icon className="w-4 h-4 transition-colors text-slate-400 group-hover:text-slate-200" />
                        <span className="text-xs font-bold transition-colors text-slate-400 group-hover:text-slate-200">
                          {item.label}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-white opacity-50" />
                    </a>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`sidebar-item w-full flex items-center justify-between p-3 text-left cursor-pointer group ${
                      isActive ? "active" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 relative">
                      <item.icon
                        className={`w-4 h-4 transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`}
                      />
                      <span
                        className={`text-xs font-bold transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`}
                      >
                        {item.label}
                      </span>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-white opacity-50" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* System Status Card */}
        <div className="system-status-card">
          <div>
            <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              SYSTEM STATUS
            </h4>
            <p className="text-xs text-white">All Systems Operational</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-[8px] text-cyan-400 font-black uppercase tracking-wider leading-none">
                Local Intelligence Mode Active
              </span>
            </div>
          </div>
          <div className="w-full flex justify-center py-2 relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
            <img
              src="/agentic-network.svg"
              alt="Network"
              className="h-10 relative z-10"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div className="flex items-center justify-center gap-2 relative z-10">
              <div className="status-dot status-dot-cyan"></div>
              <div className="status-dot status-dot-blue"></div>
              <div className="status-dot status-dot-purple"></div>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block mb-0.5">
              Agentic AI Network
            </span>
            <span className="text-xs text-emerald-400 font-bold">
              100% Active
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        {/* Top Header */}
        <header className="top-command-bar relative z-20">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 glass-card rounded-lg hover:brightness-110 shrink-0"
              onClick={() => setIsSidebarOpen(true)}
            >
              <div className="glass-reflection"></div>
              <Menu className="w-5 h-5 text-slate-300 transition-colors" />
            </button>

            {/* Search Bar Removed */}
          </div>

          <div className="flex items-center gap-6">
            <div className="top-actions flex items-center gap-2">
              {/* Multilingual Selector - Support all 8 Indian Languages */}
              <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 p-1 rounded-xl flex-wrap max-w-[340px] justify-center md:max-w-none">
                {(
                  [
                    "en",
                    "hi",
                    "kn",
                    "ta",
                    "te",
                    "ml",
                    "mr",
                    "bn",
                  ] as SupportedLanguage[]
                ).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setCurrentLang(lang)}
                    className={`px-2 py-1 text-[10px] rounded-lg font-bold uppercase cursor-pointer transition-all ${
                      currentLang === lang
                        ? "bg-[var(--accent)] text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                    title={LOCALIZATION[lang]?.title || lang.toUpperCase()}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* View Layout Renderer */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 relative z-10 w-full font-sans transition-all">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={
                activeTab === "agents"
                  ? "w-full px-2 md:px-4"
                  : "max-w-[1400px] mx-auto"
              }
            >
              {/* Accessibility Notice Banner */}
              {accessibilityScales && (
                <div className="p-3 bg-cyan-900/20 border border-cyan-500/30 text-[11px] text-cyan-50/90 rounded-xl flex gap-2 items-center mb-6 shadow-sm">
                  <Info className="w-4 h-4 shrink-0 text-cyan-400" />
                  <p className="font-medium">{t.accessibilityModeDesc}</p>
                </div>
              )}

              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  {/* RoadGuardian System */}
                  <EmergencyDashboard
                    incidents={incidents}
                    selectedIncident={activeIncident}
                    onSelectIncident={(id) => setActiveIncidentId(id)}
                    onStatusUpdate={handleStatusUpdate}
                    onNavigate={(tab) => setActiveTab(tab)}
                    selectedLocation={selectedLocation}
                  />

                  {/* Live Multi-Agent coordination logger panel below the dashboard */}
                  <MultiAgentConsole activeIncident={activeIncident} />

                  {/* Bottom Feature Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mt-8">
                    <div className="premium-panel voice-card p-4 flex items-center gap-4 hover:border-white/10 transition-colors shadow-sm">
                      <div className="glass-reflection"></div>
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20 relative z-10">
                        <Mic className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div className="relative z-10">
                        <h4 className="text-white font-bold text-[11px] uppercase tracking-wide">
                          Voice Enabled
                        </h4>
                        <p className="text-[10px] text-blue-200/50 mt-0.5">
                          Multi-language Support
                        </p>
                      </div>
                    </div>

                    <div className="premium-panel ai-card p-4 flex items-center gap-4 hover:border-white/10 transition-colors shadow-sm">
                      <div className="glass-reflection"></div>
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20 relative z-10">
                        <Brain className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="relative z-10">
                        <h4 className="text-white font-bold text-[11px] uppercase tracking-wide">
                          AI Severity Analysis
                        </h4>
                        <p className="text-[10px] text-blue-200/50 mt-0.5">
                          Real-time Risk Scoring
                        </p>
                      </div>
                    </div>

                    <div className="premium-panel offline-card p-4 flex items-center gap-4 hover:border-white/10 transition-colors shadow-sm">
                      <div className="glass-reflection"></div>
                      <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center shrink-0 border border-pink-500/20 relative z-10">
                        <CloudLightning className="w-5 h-5 text-pink-400" />
                      </div>
                      <div className="relative z-10">
                        <h4 className="text-white font-bold text-[11px] uppercase tracking-wide">
                          Offline Mode
                        </h4>
                        <p className="text-[10px] text-blue-200/50 mt-0.5">
                          Works without Internet
                        </p>
                      </div>
                    </div>

                    <div className="premium-panel secure-card p-4 flex items-center gap-4 hover:border-white/10 transition-colors shadow-sm">
                      <div className="glass-reflection"></div>
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 relative z-10">
                        <Shield className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="relative z-10">
                        <h4 className="text-white font-bold text-[11px] uppercase tracking-wide">
                          Secure & Encrypted
                        </h4>
                        <p className="text-[10px] text-blue-200/50 mt-0.5">
                          End-to-End Protection
                        </p>
                      </div>
                    </div>

                    <div className="premium-panel gov-card p-4 flex items-center gap-4 hover:border-white/10 transition-colors shadow-sm md:col-span-3 xl:col-span-1">
                      <div className="glass-reflection"></div>
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 relative z-10">
                        <CheckCircle className="w-5 h-5 text-amber-400" />
                      </div>
                      <div className="relative z-10">
                        <h4 className="text-white font-bold text-[11px] uppercase tracking-wide">
                          Government Ready
                        </h4>
                        <p className="text-[10px] text-blue-200/50 mt-0.5">
                          NHAI & MoRTH Compliant
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "report" && (
                <AccidentReporting
                  onIncidentReported={handleIncidentReported}
                  currentLang={currentLang}
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                />
              )}

              {activeTab === "offline" && (
                <OfflineEmergencyKit activeIncident={activeIncident} />
              )}
              {activeTab === "sos" && (
                <ConsumerSOS
                  currentLang={currentLang}
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                  activeIncident={activeIncident}
                  onIncidentReported={(newInc) => {
                    handleIncidentReported(newInc);
                    // Trigger the neural fabric simulation
                    import('./agents/DecisionEngine').then(({ DecisionEngine }) => {
                       DecisionEngine.runSOSScenario();
                    });
                    // Auto-navigate to command center dashboard map
                    setActiveTab("dashboard");
                  }}
                  onResetIncident={() => {
                    setActiveIncidentId(null);
                  }}
                />
              )}
              {activeTab === "firstaid" && (
                <FirstAidAgent
                  currentLang={currentLang}
                  activeIncident={activeIncident}
                />
              )}
              {activeTab === "risk" && (
                <PredictiveRisk activeIncident={activeIncident} />
              )}
              {activeTab === "prd" && <PRDViewer />}
              {activeTab === "design" && <DesignSpecViewer />}
              {activeTab === "backend" && <BackendViewer />}
              {activeTab === "db" && <DBSchemaViewer />}
              {activeTab === "agents" && (
                <AgentSystemViewer
                  currentLang={currentLang}
                  activeIncident={activeIncident}
                />
              )}
              {activeTab === "analytics" && (
                <AnalyticsDashboard incidents={incidents} />
              )}
              {activeTab === "settings" && <SettingsPanel />}
              {activeTab === "breakthrough" && <BreakthroughFeaturesViewer />}
            </motion.div>
          </AnimatePresence>

          <GuardianHUD />
          <EmergencyVerifier />

          <footer className="pt-8 mt-12 mb-4 border-t border-white/5 text-center text-[10px] text-blue-200/30 font-mono max-w-[1400px] mx-auto">
            <p>
              © 2026 ROADGUARDIAN AI. Built secure with Server-Side Gemini API
              and offline-first GPS vectors.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
