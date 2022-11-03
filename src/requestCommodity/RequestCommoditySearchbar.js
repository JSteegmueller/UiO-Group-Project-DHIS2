import React, { useState } from "react";
import { InputField, Button } from "@dhis2/ui";

function RequestCommoditySearchbar(props) {
  // Usestate for search query
  const [inputText, setInputText] = useState("");

  function enterKeyHandler(e) {
    if (e.key === "Enter") searchHandler();
  }

  function deleteHandler() {
    setInputText("");
    setTableData(fullTable);
  }

  function searchHandler() {
    setTableData(
      fullTable.filter(([k, _]) =>
        k.toLowerCase().includes(inputText.toLowerCase())
      )
    );
  }

  return (
    <div onKeyUp={enterKeyHandler}>
      <InputField
        name="searchInput"
        placeholder="Search organisations"
        value={inputText}
        onChange={(input) => setInputText(input.value)}
      />
      <Button primary small onClick={searchHandler}>
        Search
      </Button>
      <Button destructive small onClick={deleteHandler}>
        Delete
      </Button>
    </div>
  );
}

export default RequestCommoditySearchbar;
