"use client";

import { useEffect } from "react";
import axiosInstance from "@/app/axiosInstance";
import Group from '@/app/components/Group';

const Groups = () => {
  // useEffect(() => {
  //   axiosInstance.get("/groups")
  //     .then(res => console.log(res.data))
  //     .catch(err => console.error(err));
  // }, []);
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
      {arr.map((item, index) => (
        <Group key={index} group={item} />
      ))}
    </div>
  );
}

export default Groups;