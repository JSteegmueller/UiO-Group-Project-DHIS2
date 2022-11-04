import { useState } from "react"
import { InputField, Button } from "@dhis2/ui"

function AmountToRestock({ setAmount }) {
  const [inputText, setInputText] = useState("")

  function enterKeyHandler(e) {
    if (e.key === "Enter") handleClick()
  }

  const handleClick = (event) => {
    setAmount(inputText)
  }

  //console.log(inputText)
  return (
    <div onKeyUp={enterKeyHandler}>
        <InputField
            name="AmountToRestock"
            placeholder="Amount"
            helpText="Number of packs to restock"
            value={inputText}
            onChange={(input) => setInputText(input.value)}
        />
        <Button primary small onClick={handleClick}>Confirm</Button>
    </div>
  );
}

export default AmountToRestock;