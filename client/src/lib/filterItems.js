export const filterItems = (items, query) => {
  const filteredItems = items?.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );
  console.log(filteredItems);
  return filteredItems;
};
