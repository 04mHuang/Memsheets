"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/app/axiosInstance";
import SheetForm from "@/app/components/SheetForm";
import EditButtons from "@/app/components/EditButtons";

const EditSheet = () => {
  const router = useRouter();
  const params = useParams();
  const { group_id } = params;
  const [sheet, setSheet] = useState({
    "name": "",
    "color": "#999999",
    "nickname": "",
    "pronouns": "",
    "birthday": new Date().toISOString().slice(0, 10),
    "likes": "",
    "dislikes": "",
    "allergies": "",
    "notes": ""
  });

  const handleSubmit = async () => {
    try {
      await axiosInstance.post("/sheets/create", { ...sheet, group_id: group_id });
      router.back();
    }
    catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="page-container mt-4">
      <EditButtons 
        editMode={true} 
        submit={handleSubmit}
        exit={() => router.back()}
      />
      <div className="sheet" style={{ backgroundColor: sheet.color }}>
        <form method="POST" onSubmit={(e) => {e.preventDefault(); handleSubmit();}}>
          <SheetForm sheet={sheet} setSheet={setSheet} />
        </form>
      </div>
    </div>
  );
}
export default EditSheet;