"use client";

import axiosInstance from "@/app/axiosInstance";

const Home = () => {
  const fetchEvents = async () => {
    try {
      const res = await axiosInstance.get("/cal/get-events")
      console.log(res);
      return res
    }
    catch (error) {
      console.error(error)
    }
  }
  return (
    <div className="container max-w-screen-xl px-4">
      <main className="flex flex-col justify-items-center">
        <button onClick={fetchEvents}>
          Fetch Google Calendar Events
        </button>
      </main>
    </div>
  );
}
export default Home;