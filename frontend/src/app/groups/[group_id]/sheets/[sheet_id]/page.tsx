"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

import EditButtons from "@/app/components/EditButtons";
import SheetForm from "@/app/components/SheetForm";
import DeletionModal from "@/app/components/DeletionModal";
import GroupTags from "@/app/components/GroupTags";
import GroupTagsModal from "@/app/components/GroupTagsModal";

import axiosInstance from "@/app/axiosInstance";
import { isDarkColor } from "@/app/util/colorUtil";
import { GSInterface } from "@/app/types";

const Sheet = () => {
  const router = useRouter();
  const params = useParams<{ group_id: string, sheet_id: string }>();
  const { sheet_id, group_id } = params;
  // States to control modal visibility
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sheet, setSheet] = useState({
    "name": "",
    "color": "#999999",
    "avatar": "",
    "nickname": "",
    "pronouns": "",
    "birthday": new Date().toISOString().slice(0, 10),
    "likes": "",
    "dislikes": "",
    "allergies": "",
    "notes": "",
  });
  const [groupTags, setGroupTags] = useState<GSInterface[]>([]);

  // Save original data in case user cancels editing
  const [originalSheet, setOriginalSheet] = useState(sheet);

  useEffect(() => {
    if (sheet_id) {
      axiosInstance.get(`/sheets/${sheet_id}`)
        .then(res => {
          const sheetData = res.data.sheet[0];
          setSheet(sheetData);
          setOriginalSheet(sheetData);
          setGroupTags(res.data.groups);
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

  // deleteSheets is basically a boolean
  const handleDelete = async (deleteSheets: number) => {
    try {
      await axiosInstance.delete(`/sheets/delete/${group_id}/${sheet_id}/${deleteSheets}`);
    }
    catch (error) {
      console.error(error);
    }
    router.back();
  }

  // Save group list edit
  const handleGroupsEdit = async () => {
    try {
      await axiosInstance.post(`/sheets/${sheet_id}/edit/group-list`, groupTags);
    }
    catch (error) {
      console.error(error);
    }
    setGroupModalOpen(false);
  }

  // Avoid flicker of default data
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`page-container mt-4 ${isDarkColor(sheet.color) ? 'text-background' : 'text-foreground'}`}>
      <DeletionModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} subject={`${sheet.name} Sheet`} handleDelete={handleDelete} />
      <GroupTagsModal isOpen={groupModalOpen} onClose={handleGroupsEdit} groupTags={groupTags} setGroupTags={setGroupTags} />
      <EditButtons editMode={editMode} submit={handleModeToggle} exit={() => editMode ? handleCancel() : setDeleteModalOpen(true)} />
      {editMode ?
        <form
          method="POST"
          onSubmit={(e) => { e.preventDefault(); handleModeToggle(); }}
          className="sheet"
          style={{ backgroundColor: sheet.color }}
        >
          <SheetForm sheet={sheet} setSheet={setSheet} groupTags={groupTags} setGroupModalOpen={setGroupModalOpen} />
        </form>
        :
        <main className="sheet" style={{ backgroundColor: sheet.color }}>
          <h1 className="sheet-name">{sheet.name}</h1>
          <GroupTags groupTags={groupTags} sheetColor={sheet.color} setGroupModalOpen={setGroupModalOpen} />
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