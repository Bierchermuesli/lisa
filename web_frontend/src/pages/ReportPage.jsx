import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Layout, Tabs, Spin } from "antd";

import ReportOverview from "../components/ReportOverview";
import ReportOverviewNetwork from "../components/ReportOverviewNetwork";
import ReportStatic from "../components/ReportStatic";
import ReportDynamic from "../components/ReportDynamic";
import ReportNetwork from "../components/ReportNetwork";

const { Content, Header, Footer } = Layout;

const ResultPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState({});
  const [loaded, setLoaded] = useState(false);

  const loadReport = useCallback(() => {
    fetch("http://" + process.env.REACT_APP_HOST + "/api/report/" + id)
      .then(res => res.json())
      .then(reportData => {
        console.log(reportData);
        if (!reportData.hasOwnProperty("error")) {
          setReport(reportData);
          setLoaded(true);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [id]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  if (!loaded) {
    return (
      <div className="report-missing">
        <Spin size="large" />
        <p>
          Can't load your report? <br />
          Check pending and failed tasks..
        </p>
      </div>
    );
  }

  let items = [];

  if (report.type === "pcap") {
    items = [
      {
        key: "1",
        label: "Overview",
        children: (
          <div className="inner-pane">
            <ReportOverviewNetwork report={report} id={id} />
          </div>
        )
      },
      {
        key: "4",
        label: "Network Analysis",
        children: (
          <div className="inner-pane">
            <ReportNetwork report={report.network_analysis} />
          </div>
        )
      }
    ];
  } else if (report.type === "binary") {
    items = [
      {
        key: "1",
        label: "Overview",
        children: (
          <div className="inner-pane">
            <ReportOverview report={report} id={id} />
          </div>
        )
      },
      {
        key: "2",
        label: "Static Analysis",
        children: (
          <div className="inner-pane">
            <ReportStatic report={report.static_analysis} />
          </div>
        )
      },
      {
        key: "3",
        label: "Dynamic Analysis",
        children: (
          <div className="inner-pane">
            <ReportDynamic report={report.dynamic_analysis} />
          </div>
        )
      },
      {
        key: "4",
        label: "Network Analysis",
        children: (
          <div className="inner-pane">
            <ReportNetwork report={report.network_analysis} />
          </div>
        )
      }
    ];
  }

  return (
    <Layout style={{ marginLeft: 200 }}>
      <Header className="header">
        <h2 className="header-headline">Analysis report</h2>
      </Header>
      <Content className="page-content">
        <Tabs defaultActiveKey="1" className="tabs-report" items={items} />
      </Content>
      <Footer className="footer">
        LiSa © 2019 - Created by Daniel Uhricek
      </Footer>
    </Layout>
  );
};

export default ResultPage;