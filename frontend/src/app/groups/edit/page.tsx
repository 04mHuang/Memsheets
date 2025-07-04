"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/axiosInstance";

const EditGroup = () => {
  const router = useRouter();
  const [groupForm, setGroupForm] = useState({
    "name": "",
    "color": "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGroupForm({ ...groupForm, [name]: value });
  };
  const createGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Disallow name of only whitespace
    if (groupForm.name.trim() === "") {
      setError("Group name cannot just be spaces.");
      return;
    }
    try {
      await axiosInstance.post("/new-group", groupForm);
      setError(null);
      router.push("/groups");
    }
    catch (error) {
      console.error(error);
    }
  }
  return (
    <div>
      <form method="POST" onSubmit={createGroup}>
        <input
          type="text"
          name="name"
          onChange={handleChange}
          placeholder="Group name"
          required 
        />
        {error && <p>{error}</p>}
        <label>
          Group color
        <input
          type="color"
          name="color"
          onChange={handleChange}
          defaultValue="#999999"
        />
        </label>
        <button type="submit">
          Create Group
        </button>
      </form>
    </div>
  );
}
export default EditGroup;