import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

if (import.meta.env.DEV) Object.assign(window, { gsap, ScrollTrigger });

export { gsap, ScrollTrigger, useGSAP };
