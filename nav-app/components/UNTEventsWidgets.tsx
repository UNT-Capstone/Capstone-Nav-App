"use client";
import { useEffect } from "react";

const UntEventsWidget: React.FC = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://calendar.unt.edu/widget/view?schools=unt&types=38308629587302%2C38953473135148%2C38953471579943%2C38308629595497&days=31&num=50&experience=inperson&container=localist-widget-5173765&template=modern";
    script.defer = true;

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="events-wrapper">
      <div id="localist-widget-5173765" className="localist-widget"></div>
    </div>
  );
};

export default UntEventsWidget;
