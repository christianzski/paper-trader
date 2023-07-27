'use client'
import { useRef } from "react";
import { useInView } from "framer-motion";

function Second({ children }) {

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
  
    return (<main>
      <section  className = "flex justify-between" ref={ref}>
      <img className = "justify-self-start" src="redBullLinesGood.png" width={350} height={800}></img>
        <span
          style={{
            transform: isInView ? "none" : "translateX(-250px)",
            opacity: isInView ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
          }}
        >
          {children}
        </span>
        <img className = "justify-self-end" src="greenBullLinesGood.png" width={350} height={800}></img>
      </section>
        
      </main>
      
    );
  };

  function Third({ children }) {

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
  
    return (
      <section ref={ref}>
        <span
          style={{
            transform: isInView ? "none" : "translateX(250px)",
            opacity: isInView ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
          }}
        >
          {children}
        </span>
        {/* <img src="moneygoingtobullfrombear.png" height={200} width={1210} ></img> */}
      </section>
    );
  };

function FirstParagraph() {
    return (

        <div className = "interBold">
            <ol>
                <li>Execute real time market trades with ease.</li>
                <li>Track your progress.</li>
                <li>Fractional Shares.</li>
                <li>Add your friends.</li>
                <li>Read the news.</li>
            </ol>
        </div>
    )
}


function SecondParagraph() {
    return (
        <div className = "interBold justify-items end">
            <ol>
                <li>Only your friends can see your portfolio.</li>
                <li>SHA-256 Password Encrypted.</li>
                <li>Email Verifcation.</li>
                <li>SSL Certified.</li>
            </ol>
        </div>
    )
}
export default function secondPage() {

    return(
    <div className = "secondPage">
        <Second>
            Stock Trading Made Easy
            <FirstParagraph></FirstParagraph>
        </Second>
        <Third>
            Trade in Comfort
            <SecondParagraph></SecondParagraph>
        </Third>

        </div>
    );
}


