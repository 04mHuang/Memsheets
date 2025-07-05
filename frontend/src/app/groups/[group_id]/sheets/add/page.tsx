"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/app/axiosInstance";
import SheetForm from "@/app/components/SheetForm";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/new-sheet", { ...sheet, group_id: group_id });
      router.back();
    }
    catch (error) {
      console.error(error);
    }
  }
  return (
    <div>
      <form method="POST" onSubmit={handleSubmit}>
        <SheetForm sheet={sheet} setSheet={setSheet} />
        <button type="submit">
          Create Sheet
        </button>
      </form>
    </div>
  );
}
export default EditSheet;