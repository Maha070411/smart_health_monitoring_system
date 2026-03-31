# 🏥 Smart Health Monitoring System

A modern, full-stack health monitoring and appointment booking platform. Designed for both patients and healthcare providers, it offers real-time health data visualization, AI-powered assistance, and streamlined medical interactions.

---

## ✨ Key Features

### 👤 Patient Experience
- **📊 Real-time Dashboard**: Interactive charts showing heart rate history and other vital health metrics.
- **📅 Appointment Management**: Easily book appointments with specialized doctors (Cardiologists, Neurologists, etc.) and view upcoming schedules.
- **🤖 AI-Powered Chatbot**: Integration with **Google Gemini AI** for immediate medical guidance and assistance.
- **📱 Responsive Design**: Fully mobile-friendly UI with modern aesthetics (Glassmorphism & Micro-animations).
- **🚨 Emergency SOS**: Quick-access trigger for immediate assistance.

### 🩺 Doctor Experience
- **📋 Patient Records**: Access to detailed patient overview and medical history.
- **👨‍⚕️ Specialization Profiles**: Specialized interfaces for different medical fields.
- **💬 Consultation Hub**: View and manage appointments and consultations.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Lucide Icons, Chart.js, Vanilla CSS |
| **Backend** | Spring Boot 3, Spring Security, JWT (JSON Web Tokens) |
| **Database** | MySQL (Local Instance) |
| **AI Assistant** | Google Gemini API integration |
| **Dev Tools** | Maven, Vite, Node.js |

---

## 📂 Project Structure

```bash
├── 📁 backend          # Spring Boot Source Code
│   ├── src/main/java   # Java Source Files
│   └── pom.xml         # Maven Dependencies
└── 📁 frontend         # React Source Code (Vite)
    ├── src/components  # Reusable UI Components
    ├── src/pages       # Dashboard, Login, Register Pages
    └── package.json    # Frontend Dependencies
```

---

## 🚀 Getting Started

### 1. 📂 Clone the Repository
```bash
git clone https://github.com/Maha070411/smart_health_monitoring_system.git
cd smart_health_monitoring_system
```

### 2. 🗄️ Database Setup (MySQL)
-   Create a database named `health_moni`.
-   Update `backend/src/main/resources/application.properties` with your MySQL credentials:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/health_moni
    spring.datasource.username=root
    spring.datasource.password=YOUR_PASSWORD
    ```

### 3. ⚙️ Running the Backend
```bash
cd backend
mvn spring-boot:run
```

### 4. 🌐 Running the Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Default Credentials (Seeded)

| Role | Username | Password |
| :--- | :--- | :--- |
| **Patient** | `patient1` | `patient123` |
| **Doctor** | `doctor1` | `doctor123` |
| **Doctor** | `doctor2` | `doctor123` |

---

## 🤝 Contributing
Feel free to fork this project and submit PRs if you'd like to improve the features or fix bugs.

## 📄 License
This project is licensed under the MIT License.
