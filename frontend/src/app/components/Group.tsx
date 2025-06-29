const Group = ({ group }: { group: string }) => {
  return (
    <div className="container max-w-screen-xl px-4 bg-gray-400">
      <h1 className="text-xl font-bold mb-4">Group Component</h1>
      <p>{group}</p>
    </div>
  );
}

export default Group;