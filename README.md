## **Nirogya: AI Healthcare Ecosystem**

Nirogya is an AI-powered healthcare platform that simplifies medical access through multilingual support, AI consultation, voice/video communication, and health analysis tools. It integrates multiple modules—web, mobile, and real-time services—for both patients and doctors.

---

## **Table of Contents**

- [Overview](#overview)
- [Project Components](#project-components)
- [Common Infrastructure](#common-infrastructure)
- [Integration Plan](#integration-plan)
- [Usage Guide](#usage-guide)
- [Deployment and Resources](#deployment-and-resources)
- [Tagline](#tagline)

---

## **Overview**

Nirogya delivers a unified healthcare ecosystem offering:

- AI-guided consultations in multiple languages  
- Real-time interaction between patients and doctors  
- OCR-based medicine recognition and AI health analytics  
- Voice/video-enabled consultations powered by AI and RTC stack  

---

## **Project Components**

- **Nirogya Mobile App** – Patient-side application for multilingual consultations, AI sessions, and OTP-based demo login  
- **Doctor Dashboard** – Web portal for viewing patient tickets, prescriptions, and consultation records  
- **Video Call Platform** – Real-time consultations between doctors and patients or AI agents  
- **MediScan Application** – OCR-powered medicine scanner linked to a health database  
- **ChatMate (Nirogya Chatbot)** – AI assistant for contextual health chats, scheduling, and recommendations  

---

## **Common Infrastructure**

- **Backend**: FastAPI or Node.js  
- **Database**: MongoDB and Redis  
- **Vector Database**: Pinecone, Weaviate, or FAISS  
- **Voice and Video Communication**: Ultravox, Agora, or WebRTC  
- **AI Engine**: LangChain, Gemini, TensorFlow Lite  
- **OCR Engine**: Tesseract OCR  
- **Frontend**: React Native for mobile and React.js for web  
- **Hosting and Deployment**: Render and Vercel  

---

## **Integration Plan**

1. **Phase 1 – Voice AI Call Setup**  
   Module: Mobile Voice System  

2. **Phase 2 – Mobile App Base + Authentication**  
   Module: Nirogya App  

3. **Phase 3 – Doctor Dashboard API Integration**  
   Module: Dashboard  

4. **Phase 4 – Real-Time Communication (RTC) Video Layer**  
   Module: Consultation Platform  

5. **Phase 5 – OCR + Medicine Database Integration**  
   Module: MediScan  

6. **Phase 6 – Vector DB + ChatMate Memory**  
   Module: ChatMate  

7. **Phase 7 – Kafka Stream Analytics for Epidemic Monitoring**  
   Module: Analytics  

---

## **Usage Guide**

### **📱 Nirogya Mobile App**

- [Download APK](https://drive.google.com/file/d/1GLc2GYhVkj7OmSwuCsK3_ubnBz8BTIod/view?usp=sharing)  
- **Demo Access:**  
  - Mobile: 9882182880  
  - OTP: any 6 digits  
- Explore multilingual options and AI capabilities.  

---

### **🩺 Doctor Dashboard**

- Access the [Doctor Dashboard](https://enchanting-dusk-5e7a31.netlify.app/doctor/dashboard)  
- Functions:  
  - View patient tickets and prescriptions  
  - Update consultation records and summaries  

---

### **🎥 Video Call Platform**

- Visit [Video Platform](https://nirogyaa.vercel.app/)  
- Choose to join as an AI Agent or Doctor  
- Generate meeting links and share to collaborate  
- Uses WebRTC and Ultravox for low-latency video calls  

---

### **💊 MediScan Application**

- Launch [MediScan Tool](https://medi-scan-six.vercel.app/)  
- Upload or capture a medicine label image  
- View details on composition, usage, and health precautions  
- Powered by Tesseract OCR and integrated Medicine DB  

---

### **🤖 ChatMate (Nirogya Chatbot)**

- Open [ChatMate Web App](https://chatmate-bay.vercel.app/home/nirogya_chat)  
- **Login Credentials:**  
  - Username: satyam  
  - Password: 1234567890  
- Functions include:  
  - Conversational health queries  
  - Appointment scheduling  
  - Real-time contextual advice from ChatMate memory  

---

## **Deployment and Resources**

- [Demo Video](https://www.youtube.com/watch?v=_v_x0OHuD6o) – Project youtube walkthrough  
- Backend hosted on Render (free tier), may cause minor cold-start delays  
- Modules are interlinked via REST APIs and Kafka streams for status updates  
- Repository includes:  
  - Environment setup guides  
  - API reference documentation  
  - Step-by-step web and APK deployment instructions  

---

## **Tagline**

Nirogya — Your AI Health Partner, Anytime, Anywhere.
