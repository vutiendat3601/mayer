import React, { useEffect, useState } from "react";

// components
import Preloader from "./Preloader";

function RouteWithLoader(props) {

  const { component: Component } = props;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {" "}
      <Preloader show={loaded ? false : true} /> <Component />{" "}
    </>
  );
}

export default RouteWithLoader;
