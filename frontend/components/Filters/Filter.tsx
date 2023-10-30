type FilterProps = {
  filterId: string;
  columnFilters: any[];
  setColumnFilters: any;
};

export default function Filter({
  filterId,
  columnFilters,
  setColumnFilters,
}: FilterProps) {
  const value = columnFilters.find((f) => f.id === filterId)?.value || "";

  const onFilterChange = (id: any, value: any) =>
    setColumnFilters((prev: any) =>
      prev.filter((f: any) => f.id !== id).concat({ id, value })
    );

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onFilterChange(filterId, e.target.value);
        }}
        placeholder={"Filter by " + filterId}
      />
    </div>
  );
}
