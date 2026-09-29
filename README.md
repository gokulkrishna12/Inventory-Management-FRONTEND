# Enterprise Inventory & POS System - Admin Dashboard

A modern, high-performance React frontend for managing enterprise inventory and Point of Sale (POS) transactions. Designed with a custom Glassmorphism UI, this application features real-time data visualization, dynamic Role-Based Access Control (RBAC), and robust state management.

## 🚀 Core Features
*   **Interactive Analytics Dashboard:** Built with Recharts to visualize critical business KPIs, including Total Inventory Value, Stock Distribution (Pie Chart), and Low Stock Alerts (Bar Chart).
*   **Dynamic RBAC UI:** JWT payload decoding on the client-side seamlessly hides administrative features (Dashboard, Edit, Delete, Audit Logs) from standard `staff` accounts.
*   **POS Sell Logic & Optimistic Updates:** Staff can execute sales with immediate UI state updates, automatically preventing negative stock operations.
*   **Admin Audit Logs:** A dedicated modal interfacing with the backend to view an immutable history of all stock transactions and employee actions.
*   **Data Export:** One-click CSV export functionality for reporting and external audits.
*   **Custom Glassmorphism UI:** Built from scratch using modern CSS, featuring responsive layouts, blur backdrops, and optimized Lucide-React iconography.

## 🛠️ Tech Stack
*   **Framework:** React.js (Vite)
*   **Routing:** React Router DOM
*   **HTTP Client:** Axios (with centralized interceptors)
*   **Data Visualization:** Recharts
*   **Icons:** Lucide-React
*   **Styling:** Custom CSS (Glassmorphism Design System)

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/gokulkrishna12/Inventory-Management-FRONTEND.git](https://github.com/gokulkrishna12/Inventory-Management-FRONTEND.git)
   cd Inventory-Management-FRONTEND
Install dependencies:

Bash
npm install
Environment Variables:
Create a .env file in the root directory to link to your backend API:

Code snippet
VITE_API_URL=http://localhost:5000/api
Start the Development Server:

Bash
npm run dev
📱 Application Structure
/dashboard - Admin analytics, KPI metrics, and Recharts data visualization.

/inventory - The core data table. Admins see full CRUD options; Staff see POS "Sell" interfaces.

/add-product & /edit-product - Protected routes exclusively for Admin inventory management.

⚡ Performance Optimizations
Debounced Search: Reduces API calls during rapid user keystrokes in the inventory search bar.

Lucide Icon Tree-Shaking: Ensures only used icons are bundled in the final build.

Optimistic State Rendering: UI arrays map and update instantly upon successful POS API calls before triggering a full component remount.

Developed by Gokul Krishna