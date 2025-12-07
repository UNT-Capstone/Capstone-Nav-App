"use client"

import dynamic from "next/dynamic";

const UNTLiveMapInner = dynamic(() => import("./UNTLiveMapInner"), {
  ssr: false,
});

export default function UNTLiveMap() {
  return <UNTLiveMapInner />;
}
