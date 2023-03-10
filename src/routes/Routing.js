import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import configRouting from "./configRouting";

export default function Routing(props) {
  const { setRefreshCheckLogin } = props;

  return (
    <Router>
      <Routes>
        {configRouting.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={<route.page setRefreshCheckLogin={setRefreshCheckLogin} />}
            exact={route.exact}
          />
        ))}
      </Routes>
    </Router>
  );
}
