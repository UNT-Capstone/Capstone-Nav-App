"use client";

import { useEffect } from "react";

const UntEventsWidget: React.FC = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://calendar.unt.edu/widget/view?schools=unt&types=38308629587302%2C38953473135148%2C38953471579943%2C38308629595497&days=31&num=50&experience=inperson&container=localist-widget-5173765&template=modern";
    script.defer = true;
    script.type = "text/javascript";

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <div id="localist-widget-5173765" className="localist-widget"></div>
      <div id="lclst_widget_footer">
        <a
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            display: "block",
            width: "81px",
            marginTop: "10px",
          }}
          title="Widget powered by Concept3D Event Calendar Software"
          href="https://www.localist.com?utm_source=widget&utm_campaign=widget_footer&utm_medium=branded%20link"
        >
          <img
            src="//d3e1o4bcbhmj8g.cloudfront.net/assets/platforms/default/about/widget_footer.png"
            alt="Localist Online Calendar Software"
            width={81}
            height={23}
            style={{ verticalAlign: "middle" }}
          />
        </a>
      </div>
    </div>
  );
};

export default UntEventsWidget;
