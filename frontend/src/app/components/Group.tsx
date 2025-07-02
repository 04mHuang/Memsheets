import { useRouter } from "next/navigation";

interface GroupInterface {
  id: string,
  name: string,
  color: string,
}

const Group = ({ group }: { group: GroupInterface }) => {
  const router = useRouter();
  const group_id = group.id;
  const color = group.color;

  const handleClick = () => {
    router.push(`/groups/${group_id}`);
  }
  return (
    <div
      onClick={handleClick}
      className="container max-w-screen-xl px-4"
      style={{ backgroundColor: color }}
    >
      <h1 className="text-xl font-bold mb-4">Group Component</h1>
      <p>{group.name}</p>
    </div>
  );
}

export default Group;