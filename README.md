# 🎓 Academic ERP - Question Paper Management System

<div align="center">

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4.21-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5.22.6-0170FE?style=for-the-badge&logo=antdesign&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5.0.2-brown?style=for-the-badge)

**A professional, enterprise-grade Academic ERP frontend for managing courses, faculty, and automated question paper generation.**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Architecture](#-architecture) • [Tech Stack](#-tech-stack)

</div>

---

## 📋 Overview

Academic ERP is a comprehensive academic management system designed for educational institutions. It streamlines the management of academic programs, courses, faculty, and automates the question paper generation process with intelligent rule-based selection.

### Key Highlights

- 🔐 **Role-Based Access Control** - Separate dashboards for Admin and Faculty
- 📝 **Automated Question Paper Generation** - Rule-based selection ensuring balanced coverage
- 📊 **Bloom's Taxonomy Integration** - Questions tagged with cognitive levels
- 📦 **Bulk Upload Support** - Import faculty and questions via Excel
- 🌙 **Dark Mode Support** - Eye-friendly theme switching
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile

---

## ✨ Features

### Admin Module

| Feature                   | Description                                                |
| ------------------------- | ---------------------------------------------------------- |
| **Program Management**    | Create and manage academic programs (B.Tech, M.Tech, etc.) |
| **Branch Management**     | Define specializations with program associations           |
| **Regulation Management** | Handle curriculum versions and academic regulations        |
| **Course Master**         | Centralized course catalog with credits and types          |
| **Faculty Management**    | Faculty profiles with bulk upload capability               |
| **Mapping Systems**       | Program-Branch, Branch-Course, and Faculty-Course mappings |

### Faculty Module

| Feature                   | Description                                       |
| ------------------------- | ------------------------------------------------- |
| **Course Outcomes (COs)** | Define learning outcomes with Bloom level mapping |
| **Bloom Levels**          | Customize taxonomy levels with action verbs       |
| **Difficulty Levels**     | Set Easy, Medium, Hard with weightage             |
| **Unit Management**       | Define course units with topics                   |
| **Question Bank**         | Advanced filtering, bulk upload, CO/Bloom tagging |

### Question Paper Module

| Feature                | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| **Auto Generator**     | 3-step wizard with rule-based question selection     |
| **Paper History**      | View, download, print past generated papers          |
| **Distribution Rules** | Unit-wise, Bloom-wise, and difficulty-wise balancing |

---

## 🚀 Installation

### Prerequisites

- Node.js 18+
- npm 9+

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/academicerp.git

# Navigate to project directory
cd academicerp

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Available Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Create production build                  |
| `npm run preview` | Preview production build locally         |
| `npm run lint`    | Run ESLint for code quality              |

---

## 🔑 Usage

### Demo Credentials

| Role        | Email                   | Password   |
| ----------- | ----------------------- | ---------- |
| **Admin**   | admin@academicerp.com   | admin123   |
| **Faculty** | faculty@academicerp.com | faculty123 |

### User Workflows

**Admin Workflow:**

1. Login with admin credentials
2. Set up Programs → Branches → Regulations
3. Add Courses and map to Branches
4. Add Faculty and assign courses

**Faculty Workflow:**

1. Login with faculty credentials
2. Define Course Outcomes for assigned courses
3. Add questions to Question Bank with CO/Bloom tagging
4. Generate question papers using the auto-generator

---

## 🏗 Architecture

### Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components (DataTable, FormModal, etc.)
│   └── layout/          # App shell (Sidebar, Header, MainLayout)
├── hooks/               # Custom hooks (useAuth, useCrud, useTableFilters)
├── pages/
│   ├── admin/           # Admin module pages
│   ├── auth/            # Login page
│   ├── common/          # Profile, Password pages
│   ├── error/           # 403, 404, 500 pages
│   ├── faculty/         # Faculty module pages
│   └── questionpaper/   # Generator and History
├── routes/              # Route configuration and guards
├── services/            # API layer and mock data
├── store/               # Zustand state stores
├── theme/               # Ant Design theme config
└── utils/               # Utilities and constants
```

### State Management

The application uses **Zustand** with three separate stores:

| Store           | Purpose                                  |
| --------------- | ---------------------------------------- |
| `useUserStore`  | Authentication state (user, token, role) |
| `useThemeStore` | UI preferences (dark mode, sidebar)      |
| `useAppStore`   | Global UI state (loading, notifications) |

### Route Protection

Three-layer security system:

```
ProtectedRoute → Checks authentication
    └── AdminRoute → Checks role === 'admin'
    └── FacultyRoute → Checks role === 'faculty'
```

### API Architecture

- Centralized Axios instance with interceptors
- Automatic JWT token attachment
- Global error handling with 401 auto-logout
- Mock services for development

---

## 🛠 Tech Stack

### Core

| Technology   | Version | Purpose    |
| ------------ | ------- | ---------- |
| React        | 18.3.1  | UI Library |
| Vite         | 5.4.21  | Build Tool |
| React Router | 6.28.0  | Routing    |

### UI & Styling

| Technology            | Version | Purpose           |
| --------------------- | ------- | ----------------- |
| Ant Design            | 5.22.6  | Component Library |
| @ant-design/icons     | 5.5.2   | Icon Library      |
| CSS Custom Properties | -       | Design Tokens     |

### State & Data

| Technology | Version | Purpose          |
| ---------- | ------- | ---------------- |
| Zustand    | 5.0.2   | State Management |
| Axios      | 1.7.9   | HTTP Client      |
| Day.js     | 1.11.13 | Date Handling    |

### Development

| Technology | Version | Purpose      |
| ---------- | ------- | ------------ |
| ESLint     | 9.17.0  | Code Linting |

---

## 🎨 Theme Customization

The application uses a centralized theme configuration:

| Token          | Value     | Usage            |
| -------------- | --------- | ---------------- |
| Primary        | `#1F3C88` | Main brand color |
| Secondary      | `#4E73DF` | Accent color     |
| Success/Accent | `#00B894` | Success states   |
| Background     | `#F8FAFF` | Page background  |

Modify `src/theme/themeConfig.js` to customize colors and component styling.

---

## 📁 Key Files

| File                       | Description                   |
| -------------------------- | ----------------------------- |
| `src/App.jsx`              | Root component with providers |
| `src/routes/index.jsx`     | Complete route configuration  |
| `src/services/mockData.js` | Mock data for development     |
| `src/theme/themeConfig.js` | Ant Design theme tokens       |
| `src/store/*.js`           | Zustand state stores          |

---

## 🔧 Configuration

### Environment Variables

Create `.env` file for configuration:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Academic ERP
```

### Path Aliases

The `@` alias points to `src/` directory:

```javascript
import PageHeader from "@/components/common/PageHeader";
import useAuth from "@/hooks/useAuth";
```

---

## 📸 Screenshots

### Login Page

Professional login interface with demo credentials display and role-based redirection.

### Admin Dashboard

Overview with stats cards, recent activity, quick actions, and resource lists.

### Question Bank

Advanced filtering by course, unit, Bloom level, difficulty with bulk upload support.

### Paper Generator

3-step wizard for automated question paper generation with distribution rules.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - _Initial work_

---

<div align="center">

**Built with ❤️ using React + Ant Design**

</div>
