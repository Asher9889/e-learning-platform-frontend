## Schedule Live Class:
- Payload sent to backend
```javascript
{
  "title": "Physics Revision",
  "description": "Chapter 5 and 6",
  "subject": "Physics",
  "teacherId": "teacher123",
  "scheduledAt": "2026-06-15T10:00:00.000Z",
  "durationMinutes": 60,
  "maxParticipants": 100,
  "isRecordingEnabled": true,
  "isChatEnabled": true,
  "isScreenShareAllowed": true
}
```
## Step 1: Teacher Clicks Start

Teacher
   ↓
Start Class
   ↓
Backend
   ↓
Create LiveKit Room
   ↓
Mongo Save
   ↓
Teacher Gets Token
   ↓
Teacher Joins Room
   ↓
Camera + Mic Publish
   ↓
Students Join
   ↓
LiveKit Relays Media
   ↓
Students Receive Video