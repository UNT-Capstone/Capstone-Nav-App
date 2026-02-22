"use client";

import React, { useEffect } from 'react';

const UNTEventsPage: React.FC = () => {
  useEffect(() => {
  const scriptId = 'localist-script-modern';
  const containerId = 'localist-widget-19530715';

  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://calendar.unt.edu/widget/view?schools=unt&days=7&num=100&experience=inperson&exclude_experience=virtual&container=${containerId}&template=modern`;
    script.async = true;
    document.body.appendChild(script);

    // Watch the widget for changes
    const observer = new MutationObserver(() => {
      const events = document.querySelectorAll('.lw_event');
      events.forEach((event) => {
        const locationText = event.querySelector('.lw_location')?.textContent || "";
        // Check if the location is NOT related to UNT
        // Adjust the keywords below based on what you want to exclude
        const isUntLocation = locationText.includes("UNT") || locationText.includes("Denton") || locationText.includes("Union");
        
        if (!isUntLocation) {
          (event as HTMLElement).style.display = 'none';
        }
      });
    });

    const target = document.getElementById(containerId);
    if (target) {
      observer.observe(target, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }
}, []);

  return (
    <main className="min-h-screen p-4 md:p-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#00853E]">UNT Events</h1>
        
        {/* The New Widget Container */}
        <div 
          id="localist-widget-19530715" 
          className="localist-widget w-full min-h-[500px]"
        ></div>

        {/* The Branded Footer */}
        <div id="lclst_widget_footer" className="mt-8">
          <a 
            href="https://www.localist.com?utm_source=widget&utm_campaign=widget_footer&utm_medium=branded%20link"
            title="Widget powered by Concept3D Event Calendar Software"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-[81px] mx-auto opacity-70 hover:opacity-100 transition-opacity"
          >
            <img 
              src="//d3e1o4bcbhmj8g.cloudfront.net/assets/platforms/default/about/widget_footer.png" 
              alt="Localist Online Calendar Software" 
              width={81} 
              height={23}
            />
          </a>
        </div>
      </div>
    </main>
  );
};

export default UNTEventsPage;