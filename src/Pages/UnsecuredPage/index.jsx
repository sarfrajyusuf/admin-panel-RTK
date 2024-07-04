import React, { useEffect, useMemo, useState } from "react";

function UnsecuredPage() {
  return (
    <div>
      <h1>If you see this page, Webb App link you have clicked on is under Clickjacking security attack.</h1>
      <h2>Please inform team with the reference of the application from where you clicked this link.</h2>
      <h2>Click <a href={window.self.location.href} title='Web Application' target='blank'>here</a> to access WebApp safely.</h2>
    </div>
  );
}

export default UnsecuredPage;
