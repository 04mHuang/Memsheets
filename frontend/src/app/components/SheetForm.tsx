"use client";

import React, { useState } from "react";
import Image from "next/image";

import GroupTags from "@/app/components/GroupTags";

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

interface GroupTagType {
  id: number,
  name: string,
  color: string
}

interface SheetFormProps {
  sheet: SheetData;
  setSheet: (sheet: SheetData) => void;
  groupTags: GroupTagType[];
}

const SheetForm = ({ sheet, setSheet, groupTags }: SheetFormProps) => {
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
      <input
        type="text"
        name="name"
        onChange={handleChange}
        value={sheet.name}
        placeholder="Name"
        aria-label="Name"
        className="sheet-name sheet-input w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
      />
      <GroupTags groupTags={groupTags} sheetColor={sheet.color} />
      <div className="sheet-content">
        <section className="sheet-basic">
          <div className="sheet-photo">
            <Image src="/sheet-pic.png" alt="Sheet photo" width={200} height={200} />
          </div>
          <input
            type="text"
            name="nickname"
            onChange={handleChange}
            value={sheet.nickname === "N/A" ? "" : sheet.nickname}
            placeholder="Nickname"
            className="sheet-basic sheet-input"
          />
          <br />
          <select
            name="pronouns"
            value={pronouns}
            onChange={handleSelectChange}
            className="sheet-basic sheet-input w-29"
          >
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
              value={sheet.pronouns === "N/A" || sheet.pronouns === "Custom" ? "" : sheet.pronouns}
              placeholder="Pronouns"
              aria-label="Pronouns"
              className="sheet-input ml-1"
              size={6}
            />
          }
          <br />
          <input
            type="date"
            name="birthday"
            onChange={handleChange}
            value={sheet.birthday}
            aria-label="Birthday"
            max={formattedDate}
            className="sheet-basic sheet-input"
          />
          <br />
          <label className="sheet-basic sheet-input color-input">
            Sheet Color
            <input
              type="color"
              name="color"
              onChange={handleChange}
              value={sheet.color}
              className="rounded-xl"
            />
          </label>
        </section>
        <div className="sheet-details">
          <label>
            <h2 className="sheet-heading">Likes</h2>
            <textarea
              name="likes"
              onChange={handleChange}
              value={sheet.likes === "N/A" ? "" : sheet.likes}
              placeholder="Likes"
              aria-label="Likes"
              className="sheet-input sheet-detail"
            />
          </label>
          <label>
            <h2 className="sheet-heading">Dislikes</h2>
            <textarea
              name="dislikes"
              onChange={handleChange}
              value={sheet.dislikes === "N/A" ? "" : sheet.dislikes}
              placeholder="Dislikes"
              aria-label="Dislikes"
              className="sheet-input sheet-detail"
            />
          </label>
          <label>
            <h2 className="sheet-heading">Allergies</h2>
            <textarea
              name="allergies"
              onChange={handleChange}
              value={sheet.allergies === "N/A" ? "" : sheet.allergies}
              placeholder="Allergies"
              aria-label="Allergies"
              className="sheet-input sheet-detail"
            />
          </label>
          <label>
            <h2 className="sheet-heading">Additional notes</h2>
            <textarea
              name="notes"
              onChange={handleChange}
              value={sheet.notes === "N/A" ? "" : sheet.notes}
              placeholder="Additional notes"
              aria-label="Additional notes"
              className="sheet-input sheet-detail"
            />
          </label>
        </div>
      </div>
    </>
  );
}
export default SheetForm;