"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/app/axiosInstance";

const Sheet = () => {
  const params = useParams<{ sheet_id: string }>();
  const { sheet_id } = params;
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

  const handleModeToggle = () => {
    setEditMode(!editMode);
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
      // TODO: change /sheets/edit to /sheets/add
        <form>
          <input
            type="text"
            defaultValue={sheet.name}
            placeholder="Sheet name"
            aria-label="Sheet name"
          />
        </form>
        :
        <h1>{sheet.name}</h1>
      }


    </div>
  );
}
export default Sheet;