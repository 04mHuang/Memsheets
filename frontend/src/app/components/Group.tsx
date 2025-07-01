interface GroupInterface {
  name: string,
  color: string,
}

const Group = ({ group }: { group: GroupInterface }) => {
  const color = group.color;
  return (
    <div className="container max-w-screen-xl px-4" style={{ backgroundColor: color }}>
      <h1 className="text-xl font-bold mb-4">Group Component</h1>
      <p>{group.name}</p>
    </div>
  );
}

export default Group;