import { useState } from "react"
import { InputField, Button } from "@dhis2/ui"

function CreateSearchBar({ fullTable, setTableData }) {
  const [inputText, setInputText] = useState("")

  function enterKeyHandler(e) {
    if (e.key === "Enter") handleClick()
  }

  const handleClick = (event) => {
    setTableData(
        fullTable.filter(row => row.displayName.toLowerCase().includes(inputText.toLocaleLowerCase()))
    )
  }

  //console.log(inputText)
  return (
    <div onKeyUp={enterKeyHandler}>
      <InputField
        name="searchInput"
        placeholder="Search commodities"
        value={inputText}
        onChange={(input) => setInputText(input.value)}
      />
      <Button primary small onClick={handleClick}>Search</Button>
    </div>
  );
}

export default CreateSearchBar;