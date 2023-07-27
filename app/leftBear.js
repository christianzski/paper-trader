'use client'
import { useRef } from "react";
import { useInView } from "framer-motion";



function SectionLeft({ children }) {

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
  
    return (
      <section ref={ref}>
        <span
          style={{
            transform: isInView ? "none" : "translateX(-250px)",
            opacity: isInView ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
          }}
        >
          {children}
        </span>
      </section>
    );
  };


  export default function leftBear() {

    return(<div className = "flex flex-row">
            <SectionLeft>
                <img src="newBear.png" width={600} height={500}></img>
                
            </SectionLeft>
        </div>
    );
}

