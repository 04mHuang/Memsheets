"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FiFilePlus } from "react-icons/fi";
import Card from "@/app/components/Card";
import SearchBar from "@/app/components/SearchBar";
import axiosInstance from "@/app/axiosInstance";

interface SheetType {
  id: number;
  name: string;
  color: string;
}

const GroupSheets = () => {
  const router = useRouter();
  const params = useParams<{ group_id: string; }>();
  const { group_id } = params;
  const [sheets, setSheets] = useState<SheetType[]>([]);
  // Copy of sheets data to be displayed if a user searches with only whitespace
  const [originalSheets, setOriginalSheets] = useState<SheetType[]>([]);
  const [pageTitle, setPageTitle] = useState("Sheets");

  useEffect(() => {
    if (!group_id) {
      return;
    }
    (async () => {
      try {
        const response = await axiosInstance.get(`/groups/${group_id}`);
        const result = response.data.sheets;
        setSheets(result);
        setOriginalSheets(result);
      }
      catch (error) {
        console.error(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If user is searching, change the page title
  useEffect(() => {
    setPageTitle(sheets === originalSheets ? "Sheets" : "Search Results");
  }, [sheets, originalSheets]);

  return (
    <main className="page-container">
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title mb-0">{pageTitle}</h1>
        <SearchBar<SheetType> type="sheets" setItems={setSheets} originalItems={originalSheets} />
      </div>
      <section className="card-grid">
        <button
          onClick={() => { router.push(`/groups/${group_id}/sheets/add`); }}
          className="create-button card"
        >
          <p>Create Sheet</p>
          <FiFilePlus className="create-icon hover-animation" />
        </button>
        {sheets.map((item, index) => (
          <Card key={index} item={item} type="sheets" />
        ))}
      </section>
    </main>
  );
}
export default GroupSheets;