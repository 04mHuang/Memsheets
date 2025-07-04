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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSheet({ ...sheet, [name]: value });
  }
  return (
    <>
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
      {/* <select name="pronouns" defaultValue={sheet.pronouns} onChange={handleChange}>
        <option value="do not know">Do not know</option>
        <option value="she/her">she/her</option>
        <option value="he/him">he/him</option>
        <option value="they/them">they/them</option>
        <option value="custom">Custom</option>
      </select>
      {sheet.pronouns === "custom" &&
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
      /> */}
    </>
  );
}
export default SheetForm;