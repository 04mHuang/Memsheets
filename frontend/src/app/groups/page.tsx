"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/axiosInstance";
import Group from '@/app/components/Group';

const Groups = () => {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get("/groups");
        console.log("=========", response);
      }
      catch (error) {
        console.error(error);
      }
    })();
  }, []);
  const arr = ["a", "b", "c"];

  return (
    <div>
      <h1 className="text-2xl">Sheets</h1>
      <button onClick={() => {router.push("/groups/edit")}}>Create group</button>
      {arr.map((item, index) => (
        <Group key={index} group={item} />
      ))}
    </div>
  );
}

export default Groups;