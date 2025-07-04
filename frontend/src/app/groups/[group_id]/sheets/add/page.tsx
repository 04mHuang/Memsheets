"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/axiosInstance";

const EditSheet = () => {
  const router = useRouter();
  const [sheetForm, setSheetForm] = useState({
    "name": "",
    "color": "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSheetForm({ ...sheetForm, [name]: value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sheetForm.name.trim() === "") {
      setError("Sheet name cannot just be spaces.");
      return;
    }
    try {
      await axiosInstance.post("/new-sheet", sheetForm);
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
        <input
          type="text"
          name="name"
          onChange={handleChange}
          placeholder="Sheet name"
          aria-label="Sheet name"
          required
        />
        {error && <p>{error}</p>}
        <label>
          Sheet Color
          <input
            type="color"
            name="color"
            onChange={handleChange}
            defaultValue="#999999"
          />
        </label>
        <button type="submit">
          Create Sheet
        </button>
      </form>
    </div>
  );
}
export default EditSheet;