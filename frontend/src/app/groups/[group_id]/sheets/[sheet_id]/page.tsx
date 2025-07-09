"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import axiosInstance from "@/app/axiosInstance";
import EditButtons from "@/app/components/EditButtons";
import SheetForm from "@/app/components/SheetForm";
import { isDarkColor } from "@/app/util/colorUtil";

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
    <div className={`page-container mt-4 ${isDarkColor(sheet.color) ? 'text-background' : 'text-foreground'}`}>
      <EditButtons editMode={editMode} submit={handleModeToggle} cancel={handleCancel} />
      {editMode ?
        <form
          method="POST"
          onSubmit={(e) => { e.preventDefault(); handleModeToggle(); }}
          className="sheet"
          style={{ backgroundColor: sheet.color }}
        >
          <SheetForm sheet={sheet} setSheet={setSheet} />
        </form>
        :
        <main className="sheet" style={{ backgroundColor: sheet.color }}>
          <h1 className="sheet-name">{sheet.name}</h1>
          <div className="sheet-content">
            <section>
              <div className="sheet-photo">
                <Image src="/sheet-pic.png" alt="Sheet picture" width={200} height={200} />
              </div>
              <p className="sheet-basic"><strong>Nickname:</strong> {sheet.nickname}</p>
              <p className="sheet-basic"><strong>Pronouns:</strong> {sheet.pronouns}</p>
              <p className="sheet-basic"><strong>Birthday:</strong> {sheet.birthday}</p>
            </section>
            <section className="sheet-details">
              <h2 className="sheet-heading">Likes</h2>
              <hr className="border-dashed" />
              <p className="sheet-detail">{sheet.likes}</p>
              <h2 className="sheet-heading">Dislikes</h2>
              <hr className="border-dashed" />
              <p className="sheet-detail">{sheet.dislikes}</p>
              <h2 className="sheet-heading">Allergies</h2>
              <hr className="border-dashed" />
              <p className="sheet-detail">{sheet.allergies}</p>
              <h2 className="sheet-heading">Additional notes</h2>
              <hr className="border-dashed" />
              <p className="sheet-detail">{sheet.notes}</p>
            </section>
          </div>
        </main>
      }
    </div>
  );
}
export default Sheet;