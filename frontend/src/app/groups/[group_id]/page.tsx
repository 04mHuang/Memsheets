"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FiFilePlus } from "react-icons/fi";

import EditButtons from "@/app/components/EditButtons";
import Card from "@/app/components/Card";
import SearchBar from "@/app/components/SearchBar";
import DeletionModal from "@/app/components/DeletionModal";
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
  const [isModalOpen, setModalOpen] = useState(false);
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
        const result = response.data;
        setPageTitle(result.name);
        setSheets(result.sheets);
        setOriginalSheets(result.sheets);
      }
      catch (error) {
        console.error(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async () => {
    setModalOpen(true);
    // try {
    //   await axiosInstance.delete(`/groups/delete/${group_id}/${0}`)
    // }
    // catch (error) {
    //   console.error(error);
    // }
    // router.back();
  }

  return (
    <main className="page-container">
      <DeletionModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} subject={`${pageTitle} Group`} />
      <div className="flex justify-between items-center mb-4">
        {/* If user is searching, change the page title */}
        <h1 className="page-title mb-0">{sheets !== originalSheets ? "Search Results" : pageTitle}</h1>
        {/* Search through the sheets of a specific group by passing the group_id */}
        <div className="flex gap-2 items-center">
          <SearchBar<SheetType> groupId={group_id} setItems={setSheets} originalItems={originalSheets} />
          {/* Prevent editing and deletion of the group Miscellaneous */}
          {group_id !== "1" &&
            <EditButtons
              editMode={false}
              submit={() => router.push(`/groups/${group_id}/edit`)}
              cancel={handleDelete}
            />
          }
        </div>
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