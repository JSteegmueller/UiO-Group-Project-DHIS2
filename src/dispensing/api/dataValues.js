const getConsumptionQuery = {
    consumption: {
        resource: "dataValues",
        params: ({period, commodity}) => ({
            de: commodity,
            ou: process.env.REACT_APP_ORGUNIT,
            pe: period,
            co: process.env.REACT_APP_CAT_COMBO_CONSUMPTION
        })
    }
}

const getEndBalanceQuery = {
    endBalance: {
        resource: "dataValues",
        params: ({period, commodity}) => ({
            de: commodity,
            ou: process.env.REACT_APP_ORGUNIT,
            pe: period,
            co: process.env.REACT_APP_CAT_COMBO_END_BALANCE
        })
    }
}

const setConsumptionMutation = {
    dataSet: process.env.REACT_APP_LSCOMMODITIES_SET,
    resource: "dataValueSets",
    type: "create",
    data: ({period, commodity, value}) => ({
        orgUnit: process.env.REACT_APP_ORGUNIT,
        period: period,
        dataValues: [
            {
                dataElement: commodity,
                categoryOptionCombo: process.env.REACT_APP_CAT_COMBO_CONSUMPTION,
                value: value
            }
        ]
    })
}

const setEndBalanceMutation = {
    dataSet: process.env.REACT_APP_LSCOMMODITIES_SET,
    resource: "dataValueSets",
    type: "create",
    data: ({period, commodity, value}) => ({
        orgUnit: process.env.REACT_APP_ORGUNIT,
        period: period,
        dataValues: [
            {
                dataElement: commodity,
                categoryOptionCombo: process.env.REACT_APP_CAT_COMBO_END_BALANCE,
                value: value
            }
        ]
    })
}

export {getConsumptionQuery, getEndBalanceQuery, setEndBalanceMutation, setConsumptionMutation}