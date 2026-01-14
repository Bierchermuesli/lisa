import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Layout, Menu, ConfigProvider } from "antd";
import {
  AppstoreOutlined,
  UploadOutlined,
  WarningOutlined,
  HourglassOutlined,
  ApiOutlined
} from '@ant-design/icons';

import ReportPage from "./pages/ReportPage";
import ResultsPage from "./pages/ResultsPage";
import FailedTasksPage from "./pages/FailedTasksPage";
import PendingTasksPage from "./pages/PendingTasksPage";
import SubmitPage from "./pages/SubmitPage";
import APIPage from "./pages/APIPage";
import "./App.css";
import logo from "./logo-dark.png";

const { Sider } = Layout;

const App = () => {
  const menuItems = [
    {
      key: "1",
      icon: <AppstoreOutlined />,
      label: <Link to="/">Results</Link>
    },
    {
      key: "2",
      icon: <UploadOutlined />,
      label: <Link to="/submit">Submit file</Link>
    },
    {
      key: "3",
      icon: <WarningOutlined />,
      label: <Link to="/failed">Failed</Link>
    },
    {
      key: "4",
      icon: <HourglassOutlined />,
      label: <Link to="/pending">Pending</Link>
    },
    {
      key: "5",
      icon: <ApiOutlined />,
      label: <Link to="/api-doc">API</Link>
    }
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ea8731',
        },
      }}
    >
      <Router>
        <Sider id="sider">
          <img src={logo} className="logo" alt="LiSa" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]} items={menuItems} />
        </Sider>

        <div id="main-content">
          <Routes>
            <Route path="/" element={<ResultsPage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/failed" element={<FailedTasksPage />} />
            <Route path="/pending" element={<PendingTasksPage />} />
            <Route path="/result/:id" element={<ReportPage />} />
            <Route path="/api-doc" element={<APIPage />} />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
};

export default App;