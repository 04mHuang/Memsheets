"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/axiosInstance";
import Card from '@/app/components/Card';

const Sheets = () => {
  const router = useRouter();
  const [sheets, setSheets] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get("/sheets");
        setSheets(response.data.sheets);
      }
      catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="text-2xl">Sheets</h1>
      <button onClick={() => {router.push("/sheets/edit")}}>Create sheets</button>
      {sheets.map((item) => (
        <Card key={item["name"]} item={item} type="sheets" />
      ))}
    </div>
  );
}

export default Sheets;