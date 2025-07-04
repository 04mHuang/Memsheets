"use client";

import React, { useState } from "react";

interface SheetData {
  name: string;
  color: string;
  nickname: string;
  pronouns: string;
  birthday: string;
  likes: string;
  dislikes: string;
  allergies: string;
  notes: string;
}
interface SheetFormProps {
  sheet: SheetData;
  setSheet: (sheet: SheetData) => void;
  error: string | null;
}

const SheetForm = ({ sheet, setSheet, error }: SheetFormProps) => {
  const pronounsList = ["Unknown", "she/her", "he/him", "they/them"];
  // Set a recognized value for the select input
  const [pronouns, setPronouns] = useState(pronounsList.includes(sheet.pronouns) ? sheet.pronouns : "Custom");
  // Value for maximum date that can be selected
  const formattedDate = new Date().toISOString().slice(0, 10);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSheet({ ...sheet, [name]: value });
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setPronouns(value);
    setSheet({ ...sheet, pronouns: value });
  };
  
  return (
    <>
      <div>
        <input
          type="text"
          name="name"
          onChange={handleChange}
          value={sheet.name}
          placeholder="Name"
          aria-label="Name"
          required
        />
        {error && <p>{error}</p>}
        <input
          type="text"
          name="nickname"
          onChange={handleChange}
          value={sheet.nickname}
          placeholder="Nickname"
          aria-label="Nickname"
        />
        <select name="pronouns" value={pronouns} onChange={handleSelectChange}>
          <option value="Unknown">Unknown</option>
          <option value="she/her">she/her</option>
          <option value="he/him">he/him</option>
          <option value="they/them">they/them</option>
          <option value="Custom">Custom</option>
        </select>
        {pronouns === "Custom" &&
          <input
            type="text"
            name="pronouns"
            onChange={handleChange}
            value={sheet.pronouns}
            placeholder="Pronouns"
            aria-label="Pronouns"
            required
          />
        }
        <input
          type="date"
          name="birthday"
          onChange={handleChange}
          value={sheet.birthday}
          aria-label="Birthday"
          max={formattedDate}
        />
        <label>
          Sheet Color
          <input
            type="color"
            name="color"
            onChange={handleChange}
            value={sheet.color}
          />
        </label>
      </div>
      <div>
        <textarea
          name="likes"
          onChange={handleChange}
          value={sheet.likes}
          placeholder="Likes"
          aria-label="Likes"
        />
        <textarea
          name="dislikes"
          onChange={handleChange}
          value={sheet.dislikes}
          placeholder="Dislikes"
          aria-label="Dislikes"
        />
        <textarea
          name="allergies"
          onChange={handleChange}
          value={sheet.allergies}
          placeholder="Allergies"
          aria-label="Allergies"
        />
        <textarea
          name="notes"
          onChange={handleChange}
          value={sheet.notes}
          placeholder="Additional Notes"
          aria-label="Additional Notes"
        />
      </div>
    </>
  );
}
export default SheetForm;