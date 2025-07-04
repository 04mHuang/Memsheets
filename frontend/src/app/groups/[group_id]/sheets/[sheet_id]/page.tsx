"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/app/axiosInstance";

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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSheet({ ...sheet, [name]: value });
  }

  return (
    <div>
      <button onClick={handleModeToggle}>
        {editMode ?
          "Save"
          :
          "Edit"
        }
      </button>
      {editMode ?
        // TODO: convert form into component to be used between here and /sheets/edit
        <form>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={sheet.name}
            placeholder="Sheet name"
            aria-label="Sheet name"
          />
          {error && <p>{error}</p>}
        </form>
        :
        <h1>{sheet.name}</h1>
      }


    </div>
  );
}
export default Sheet;