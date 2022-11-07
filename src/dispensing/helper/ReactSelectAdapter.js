import Select from "react-select";
import React from "react";

const ReactSelectAdapter = ({input, inputOnChange, ...rest}) => {
    const inputProps = {
        ...input,
        onChange: e => {
            input.onChange(e);
            inputOnChange && inputOnChange(e);
        }
    };
    return <div>
        <label>Commodity</label>
        <Select {...inputProps} {...rest} searchable/>
    </div>
}

export default ReactSelectAdapter
