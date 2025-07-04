"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Card from "@/app/components/Card";
import axiosInstance from "@/app/axiosInstance";

const GroupSheets = () => {
  const router = useRouter();
  const params = useParams<{ group_id: string; }>();
  const { group_id } = params;
  const [sheets, setSheets] = useState([]);
  const handleAdd = () => {
    router.push(`/groups/${group_id}/sheets/add`);
  }

  useEffect(() => {
    if (group_id) {
      axiosInstance.get(`/groups/${group_id}`)
        .then(res => setSheets(res.data.sheets))
        .catch(err => console.error(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Sheets for group</h1>
      <button onClick={handleAdd}>Add Sheet</button>
      {sheets.map((item) => (
        <Card key={item["name"]} item={item} type="sheets" />
      ))}
    </div>
  );
}
export default GroupSheets;