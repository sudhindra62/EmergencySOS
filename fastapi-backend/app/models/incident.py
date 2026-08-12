from sqlalchemy import Column, String, Float, DateTime, Enum, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base
import uuid
import datetime
import enum

Base = declarative_base()

class SeverityLevel(enum.Enum):
    MINOR = "Minor"
    MODERATE = "Moderate"
    SEVERE = "Severe"
    CRITICAL = "Critical"

class IncidentStatus(enum.Enum):
    REPORTED = "Reported"
    TRIAGED = "Triaged"
    DISPATCHED = "Dispatched"
    RESOLVED = "Resolved"

class IncidentLocation(Base):
    __tablename__ = "incident_locations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("incidents.id"))
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String)

class Incident(Base):
    __tablename__ = "incidents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    reporter_id = Column(String, index=True)
    severity = Column(Enum(SeverityLevel), default=SeverityLevel.MODERATE)
    status = Column(Enum(IncidentStatus), default=IncidentStatus.REPORTED)
    ai_trauma_score = Column(Float)
    extracted_tags = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
