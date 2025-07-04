"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/app/axiosInstance";
import SheetForm from "@/app/components/SheetForm";

const Sheet = () => {
  const params = useParams<{ sheet_id: string }>();
  const { sheet_id } = params;
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  // Fields will never be null
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

  useEffect(() => {
    if (sheet_id) {
      axiosInstance.get(`/sheets/${sheet_id}`)
        .then(res => setSheet(res.data.sheet[0]))
        .catch(err => console.error(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleModeToggle = async () => {
    if (editMode) {
      if (sheet.name.trim() === "") {
        setError("Sheet name cannot just be spaces.");
        return;
      }
      try {
        const res = await axiosInstance.post(`/sheets/${sheet_id}/edit`, sheet);
        console.log(res);
        setSheet(res.data.sheet);
      }
      catch (error) {
        console.error(error);
      }
    }
    setEditMode(!editMode);
  }
  

  return (
    <div>
      {/* Save button acts as a submit button for the form */}
      <button onClick={handleModeToggle}>
        {editMode ?
          "Save"
          :
          "Edit"
        }
      </button>
      {editMode ?
        <form method="POST" onSubmit={(e) => { e.preventDefault(); handleModeToggle(); }}>
          <SheetForm sheet={sheet} setSheet={setSheet} error={error} />
        </form>
        :
        <div style={{ backgroundColor: sheet.color }}>
          <h1>{sheet.name}</h1>
          <p>{sheet.nickname}</p>
          <p>{sheet.pronouns}</p>
          <p>{sheet.birthday}</p>
          <p>{sheet.likes}</p>
          <p>{sheet.dislikes}</p>
          <p>{sheet.allergies}</p>
          <p>{sheet.notes}</p>
        </div>
      }
    </div>
  );
}
export default Sheet;