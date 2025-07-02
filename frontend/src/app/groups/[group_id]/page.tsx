"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axiosInstance from "@/app/axiosInstance";

const GroupSheets = () => {
  const params = useParams<{ group_id: string; }>();
  const { group_id } = params;
  const [sheets, setSheets] = useState([]);
  const handleClickTemp = () => {
    console.log("sheets ", sheets);
  }

  useEffect(() => {
    if (group_id) {
      axiosInstance.get(`/groups/${group_id}`)
        .then(res => setSheets(res.data.sheets))
        .catch(err => console.error(err));
    }
  }, []);

  return (
    <div>
      <h1>Sheets for group</h1>
      <button
        onClick={handleClickTemp}
      >click me</button>
    </div>
  );
}
export default GroupSheets;