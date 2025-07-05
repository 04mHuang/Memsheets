"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/app/axiosInstance";
import SheetForm from "@/app/components/SheetForm";

const Sheet = () => {
  const params = useParams<{ sheet_id: string }>();
  const { sheet_id } = params;
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
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
  // Save original data in case user cancels editing
  const [originalSheet, setOriginalSheet] = useState(sheet);

  useEffect(() => {
    if (sheet_id) {
      axiosInstance.get(`/sheets/${sheet_id}`)
        .then(res => {
          const sheetData = res.data.sheet[0];
          setSheet(sheetData);
          setOriginalSheet(sheetData);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [sheet_id]);

  const handleModeToggle = async () => {
    if (editMode) {
      try {
        const res = await axiosInstance.post(`/sheets/${sheet_id}/edit`, sheet);
        const updatedSheet = res.data.sheet;
        setSheet(updatedSheet);
        setOriginalSheet(updatedSheet);
      }
      catch (error) {
        console.error(error);
      }
    }
    setEditMode(!editMode);
  }

  const handleCancel = () => {
    setSheet(originalSheet);
    setEditMode(false);
  }

  // Avoid flicker of default data
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={handleModeToggle}>
        {editMode ? "Save" : "Edit"}
      </button>
      {editMode ?
        <form method="POST" onSubmit={(e) => { e.preventDefault(); handleModeToggle(); }}>
          <SheetForm sheet={sheet} setSheet={setSheet} />
          <button onClick={(e) => {e.preventDefault(); handleCancel();}}>Cancel</button>
        </form>
        :
        <div className="sheet" style={{ backgroundColor: sheet.color }}>
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