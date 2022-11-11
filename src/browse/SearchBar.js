import React, { useState } from "react";
import { InputField } from "@dhis2/ui";

function SearchBar({ fullTable, setTableData }) {
    const [inputText, setInputText] = useState("");

    function onChange(input) {
        setInputText(input.value);
        setTableData(
            fullTable.filter(([k, _]) => k.toLowerCase().includes(input.value.toLowerCase()))
        );
    }

    return (
        <div>
            <InputField
                name="searchInput"
                placeholder="Search commodities"
                value={inputText}
                onChange={onChange}
            />
        </div>
    );
}

export default SearchBar;
