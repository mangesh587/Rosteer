
import { useEffect, useState } from "react";
import {
  Users,
  CalendarDays,
  Building2,
  AlertTriangle,
  LayoutDashboard,
  ClipboardList,
  Settings,
  Plus,
  Search,
  Bell,
  CheckCircle2,
  Clock,
  Menu,
} from "lucide-react";

import { checkBackend, getEmployees, createEmployee } from "./api";
import "./App.css";

type Employee = {
  id: number;
  name: string;
  role: string;
  brand: string;
  pod: string;
  status: "Available" | "On Leave";
};

const initialEmployees: Employee[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "Support Executive",
    brand: "Brand A",
    pod: "Pod Alpha",
    status: "Available",
  },
  {
    id: 2,
    name: "Priya Patil",
    role: "Senior Executive",
    brand: "Brand B",
    pod: "Pod Beta",
    status: "Available",
  },
  {
    id: 3,
    name: "Rohan Desai",
    role: "Support Executive",
    brand: "Brand C",
    pod: "Pod Alpha",
    status: "On Leave",
  },
  {
    id: 4,
    name: "Sneha Joshi",
    role: "Team Lead",
    brand: "Brand B",
    pod: "Pod Gamma",
    status: "Available",
  },
  {
    id: 5,
    name: "Aditya Kulkarni",
    role: "Support Executive",
    brand: "Brand A",
    pod: "Pod Alpha",
    status: "Available",
  },
];

function App() {
  const [employees, setEmployees] =
    useState<Employee[]>(initialEmployees);

  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState("Dashboard");
  const [showForm, setShowForm] = useState(false);

  const [newName, setNewName] = useState("");
  const [newBrand, setNewBrand] = useState("Brand A");
  const [newPod, setNewPod] = useState("Pod Alpha");

  const [backendStatus, setBackendStatus] = useState<
    "loading" | "connected" | "offline"
  >("loading");

  // Load employee records from the backend on startup.
  useEffect(() => {
    async function loadEmployees() {
      try {
        const data: Employee[] = await getEmployees();
        setEmployees(data);
        setBackendStatus("connected");
      } catch (error) {
        console.error("Failed to load employees:", error);
        setBackendStatus("offline");
      }
    }

    void loadEmployees();
  }, []);

  // Test the FastAPI backend connection.
  async function testBackendConnection() {
    try {
      const result = await checkBackend();
      setBackendStatus("connected");
      alert(`Backend connected: ${result.status}`);
    } catch (error) {
      console.error("Backend connection error:", error);
      setBackendStatus("offline");
      alert(
        "Backend connection failed. Check that FastAPI is running."
      );
    }
  }

  // Search employees by name, brand, or pod.
  const filteredEmployees = employees.filter((employee) =>
    `${employee.name} ${employee.brand} ${employee.pod}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Add an employee through the backend API.
  async function addEmployee() {
    const employeeName = newName.trim();

    if (!employeeName) {
      alert("Please enter the employee name.");
      return;
    }

    try {
      await createEmployee({
        name: employeeName,
        role: "Support Executive",
        brand: newBrand,
        pod: newPod,
        status: "Available",
      });

      // Fetch the updated list from the backend.
      const updatedEmployees: Employee[] = await getEmployees();

      setEmployees(updatedEmployees);
      setBackendStatus("connected");

      // Reset the form and close the modal.
      setNewName("");
      setNewBrand("Brand A");
      setNewPod("Pod Alpha");
      setShowForm(false);

      alert("Employee added successfully.");
    } catch (error) {
      console.error("Error adding employee:", error);
      alert(
        "Could not add employee. Check the backend connection and API."
      );
    }
  }

  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Employees", icon: Users },
    { name: "Roster Calendar", icon: CalendarDays },
    { name: "Brands & Pods", icon: Building2 },
    { name: "Conflicts", icon: AlertTriangle },
  ];

  // Dashboard statistics.
  const availableCount = employees.filter(
    (employee) => employee.status === "Available"
  ).length;

  const brandCount = new Set(
    employees.map((employee) => employee.brand)
  ).size;

  const podCount = new Set(
    employees.map((employee) => employee.pod)
  ).size;

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand-logo">
          <div className="logo-mark">SR</div>
          <div>
            <h2>SmartRoster</h2>
            <p>Workforce Management</p>
          </div>
        </div>

        <p className="nav-label">WORKSPACE</p>

        <nav>
          {navigation.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`nav-item ${
                activePage === name ? "active" : ""
              }`}
              onClick={() => setActivePage(name)}
            >
              <Icon size={19} />
              <span>{name}</span>

              {name === "Conflicts" && (
                <span className="nav-count">2</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <Settings size={18} />
          <span>Settings</span>
        </div>

        <div className="profile">
          <div className="avatar">MK</div>
          <div>
            <strong>Roster Admin</strong>
            <p>Administrator</p>
          </div>
        </div>
      </aside>

      {/* Main application */}
      <main className="main-area">
        {/* Top navigation */}
        <header className="topbar">
          <div className="mobile-menu">
            <Menu size={22} />
          </div>

          <div className="breadcrumb">
            Workspace / <strong>{activePage}</strong>
          </div>

          <div className="topbar-right">
            <span className="month-label">October 2026</span>

            <button
              className="icon-button"
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span className="notification-dot" />
            </button>

            <div className="avatar">MK</div>
          </div>
        </header>

        <section className="page-content">
          {/* Page heading */}
          <div className="page-heading">
            <div>
              <p className="eyebrow">WORKFORCE OVERVIEW</p>
              <h1>{activePage}</h1>

              <p className="subheading">
                Manage workforce availability, schedules and coverage.
              </p>

              <p className="stat-note">
                Backend status:{" "}
                {backendStatus === "loading"
                  ? "Connecting..."
                  : backendStatus === "connected"
                    ? "Connected"
                    : "Offline — displaying available local data"}
              </p>
            </div>

            <div className="heading-actions">
              <button
                className="primary-button"
                onClick={testBackendConnection}
              >
                <CheckCircle2 size={18} />
                Test Backend Connection
              </button>

              <button
                className="primary-button"
                onClick={() => setShowForm(true)}
              >
                <Plus size={18} />
                Add Employee
              </button>
            </div>
          </div>

          {/* Dashboard statistics */}
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-icon blue">
                <Users size={21} />
              </div>
              <p>Total Employees</p>
              <h2>{employees.length}</h2>
              <span className="stat-note">
                Employees in current application state
              </span>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <CheckCircle2 size={21} />
              </div>
              <p>Available Today</p>
              <h2>{availableCount}</h2>
              <span className="stat-note">
                Based on employee status
              </span>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">
                <AlertTriangle size={21} />
              </div>
              <p>Coverage Gaps</p>
              <h2>2</h2>
              <span className="stat-note warning-text">
                Demo value — validation not implemented
              </span>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple">
                <Building2 size={21} />
              </div>
              <p>Brands / Pods</p>
              <h2>
                {brandCount} / {podCount}
              </h2>
              <span className="stat-note">
                Based on employee assignments
              </span>
            </div>
          </div>

          {/* Employee directory and roster health */}
          <div className="section-grid">
            <section className="panel roster-panel">
              <div className="panel-heading">
                <div>
                  <h3>Employee Directory</h3>
                  <p>
                    View employees and their current assignments.
                  </p>
                </div>

                <button
                  className="text-button"
                  onClick={() => setActivePage("Employees")}
                >
                  View all
                </button>
              </div>

              {/* Search */}
              <div className="table-toolbar">
                <div className="search-box">
                  <Search size={17} />
                  <input
                    placeholder="Search employees, brands..."
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                  />
                </div>

                <span className="result-count">
                  {filteredEmployees.length} employees
                </span>
              </div>

              {/* Employee table */}
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>EMPLOYEE</th>
                      <th>BRAND</th>
                      <th>POD</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <td>
                          <div className="employee-cell">
                            <div className="employee-avatar">
                              {employee.name
                                .split(" ")
                                .map((part) => part[0])
                                .join("")}
                            </div>

                            <div>
                              <strong>{employee.name}</strong>
                              <p>{employee.role}</p>
                            </div>
                          </div>
                        </td>

                        <td>{employee.brand}</td>
                        <td>{employee.pod}</td>

                        <td>
                          <span
                            className={`status ${
                              employee.status === "Available"
                                ? "status-available"
                                : "status-leave"
                            }`}
                          >
                            {employee.status}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {filteredEmployees.length === 0 && (
                      <tr>
                        <td colSpan={4} className="empty-state">
                          No employees found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Roster health */}
            <section className="panel activity-panel">
              <div className="panel-heading">
                <div>
                  <h3>Roster Health</h3>
                  <p>Sample operational alerts</p>
                </div>
                <ClipboardList size={20} />
              </div>

              <div className="health-score">
                <div className="health-circle">
                  <span>86%</span>
                </div>

                <div>
                  <strong>Schedule readiness</strong>
                  <p>Illustrative sample score</p>
                </div>
              </div>

              <div className="alert-item">
                <div className="alert-icon">
                  <AlertTriangle size={18} />
                </div>

                <div>
                  <strong>Coverage needs review</strong>
                  <p>
                    Brand C has fewer assigned employees than required.
                  </p>
                  <span>Needs attention</span>
                </div>
              </div>

              <div className="alert-item">
                <div className="alert-icon clock-icon">
                  <Clock size={18} />
                </div>

                <div>
                  <strong>Availability update</strong>
                  <p>
                    One sample employee is marked as on leave.
                  </p>
                  <span>Check assignments</span>
                </div>
              </div>
            </section>
          </div>

          {/* Roster shortcuts */}
          <section className="panel quick-panel">
            <div className="panel-heading">
              <div>
                <h3>Roster Management</h3>
                <p>
                  Generate and validate a monthly employee schedule.
                </p>
              </div>
              <CalendarDays size={23} />
            </div>

            <div className="quick-actions">
              <button
                onClick={() => setActivePage("Roster Calendar")}
              >
                <CalendarDays size={18} />
                Open roster calendar
              </button>

              <button
                onClick={() => setActivePage("Conflicts")}
              >
                <AlertTriangle size={18} />
                Review conflicts
              </button>
            </div>

            <p className="demo-note">
              Coverage counts and readiness scores are illustrative.
              Scheduling validation has not been implemented yet.
            </p>
          </section>
        </section>
      </main>

      {/* Add employee modal */}
      {showForm && (
        <div
          className="modal-backdrop"
          onClick={() => setShowForm(false)}
        >
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Add Employee</h2>
                <p>
                  Add an employee to the current application list.
                </p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowForm(false)}
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>

            <label>
              Employee name
              <input
                value={newName}
                onChange={(event) =>
                  setNewName(event.target.value)
                }
                placeholder="Enter full name"
                autoFocus
              />
            </label>

            <label>
              Brand
              <select
                value={newBrand}
                onChange={(event) =>
                  setNewBrand(event.target.value)
                }
              >
                <option>Brand A</option>
                <option>Brand B</option>
                <option>Brand C</option>
              </select>
            </label>

            <label>
              Pod
              <select
                value={newPod}
                onChange={(event) =>
                  setNewPod(event.target.value)
                }
              >
                <option>Pod Alpha</option>
                <option>Pod Beta</option>
                <option>Pod Gamma</option>
              </select>
            </label>

            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={addEmployee}
              >
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
