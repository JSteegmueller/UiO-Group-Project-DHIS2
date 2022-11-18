export function mergeData(data) {
    const categories = {
        J2Qf1jtZuj8: "Consumption",
        rQLFnNXXIL0: "Balance",
        KPP63zJPkOu: "Order",
    };

    const merged = data.values.dataValues.map((value) => {
        const match = data.commodities.dataSetElements.find((commodity) => {
            return commodity.dataElement.id == value.dataElement;
        });
        return {
            name: match.dataElement.name.split(" - ")[1],
            id: match.dataElement.id,
            value: value.value,
            category: categories[value.categoryOptionCombo],
        };
    });

    data.commodities.dataSetElements.map((commodity) => {
        let check = merged.find((i) => {
            return i.id === commodity.dataElement.id;
        });
        if (check === undefined) {
            merged.push({
                name: commodity.dataElement.name.split(" - ")[1],
                id: commodity.dataElement.id,
            });
        }
    });

    const object = merged.reduce(function (r, a) {
        r[a.name] = r[a.name] || {
            id: a.id,
            Consumption: 0,
            Balance: 0,
            Order: 0,
        };
        if (a.category) {
            r[a.name][a.category] = a.value;
        }
        return r;
    }, Object.create(null));

    return Object.entries(object);
}
