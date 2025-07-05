"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/axiosInstance";
import Card from '@/app/components/Card';

const Groups = () => {
  const router = useRouter();
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get("/groups");
        setGroups(response.data.groups);
      }
      catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="text-2xl">Sheets</h1>
      <button onClick={() => {router.push("/groups/edit")}}>Create group</button>
      {groups.map((item, index) => (
        <Card key={index} item={item} type="groups" />
      ))}
    </div>
  );
}

export default Groups;