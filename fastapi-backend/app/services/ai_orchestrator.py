import asyncio
import google.generativeai as genai
from app.core.config import settings

class AIAgentOrchestrator:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        # Using Gemini-1.5-pro for complex severity reasoning
        self.severity_model = genai.GenerativeModel('gemini-1.5-pro')
        
    async def triage_incident(self, text_payload: str, image_url: str = None) -> dict:
        """
        Coordinates the initial triage logic.
        Triggers the Severity Assessment Agent to parse unstructured reporting.
        """
        prompt = f"""
        [SEVERITY_ASSESSMENT_MOD]
        You are an ER Triage Clinician Agent.
        Analyze this emergency report and categorize the trauma level (Minor, Moderate, Severe, Critical).
        Report: {text_payload}
        
        Output strict JSON: {{"severity": "Critical", "confidence": 0.95, "suspected_injuries": [], "medical_justification": ""}}
        """
        # In a real async scenario, we'd wrap block IO in threadpools or use async AI API.
        response = await asyncio.to_thread(self.severity_model.generate_content, prompt)
        
        # Simulated parsing
        return {"raw": response.text, "status": "triaged"}
        
    async def dispatch_sequence(self, severity_data: dict, location_data: dict) -> dict:
        """
        Triggers 3 agents concurrently: Hospital Agent, Ambulance Agent, Police Agent.
        """
        results = await asyncio.gather(
            self._trigger_hospital_agent(severity_data, location_data),
            self._trigger_ambulance_agent(severity_data, location_data),
            self._trigger_police_agent(location_data)
        )
        
        return {
            "hospital": results[0],
            "ambulance": results[1],
            "police": results[2]
        }
        
    async def _trigger_hospital_agent(self, sev, loc):
        await asyncio.sleep(0.5) # Simulate PostGIS lookup + API ping
        return {"assigned_hospital_id": "hsp-123", "eta_mins": 4, "status": "OK"}
        
    async def _trigger_ambulance_agent(self, sev, loc):
        await asyncio.sleep(0.6) # Simulate Fleet IoT API ping
        return {"assigned_vehicle": "TN-01-AB-1234", "type": "ALS", "status": "DISPATCHED"}
        
    async def _trigger_police_agent(self, loc):
        await asyncio.sleep(0.1) # Fast Polygon lookup
        return {"jurisdiction": "Chengalpattu Highway Patrol", "alerted": True}

orchestrator = AIAgentOrchestrator()
