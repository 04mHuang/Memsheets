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
      "color": "",
      "nickname": "",
      "pronouns": "",
      "birthday": "",
      "likes": "",
      "dislikes": "",
      "allergies": "",
      "notes": ""
    });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sheet.name.trim() === "") {
      setError("Sheet name cannot just be spaces.");
      return;
    }
    try {
      await axiosInstance.post("/new-sheet", { ...sheet, group_id: group_id });
      setError(null);
      router.back();
    }
    catch (error) {
      console.error(error);
    }
  }
  return (
    <div>
      <form method="POST" onSubmit={handleSubmit}>
        <SheetForm sheet={sheet} setSheet={setSheet} error={error} />
        <button type="submit">
          Create Sheet
        </button>
      </form>
    </div>
  );
}
export default EditSheet;