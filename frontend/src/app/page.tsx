// "use client";

import Link from "next/link";
// import { useState, useEffect } from "react";

const Home = () => {
  // const [currentTime, setCurrentTime] = useState(0);

  // useEffect(() => {
  //   fetch('/api/time').then(res => res.json()).then(data => {
  //     console.log(data);
  //     setCurrentTime(data.time);
  //   });
  // }, []);
  return (
    // grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]
    <div className="container max-w-screen-xl px-4">
      {/* flex flex-col gap-[32px] row-start-2 items-center sm:items-start */}
      <main className="flex flex-col justify-items-center">
        <h1>What memories will you write today?</h1>
        {/* TODO: replace link with button */}
        <Link href="/login">Start writing</Link>
      </main>
    </div>
  );
}
export default Home;